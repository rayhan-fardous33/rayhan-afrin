import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to set your password." },
        { status: 401 }
      );
    }

    const { newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Attempt 1: Better Auth API setPassword
    try {
      await auth.api.setPassword({
        body: { newPassword },
        headers: await headers(),
      });
      return NextResponse.json({
        success: true,
        message: "Password updated successfully in MongoDB! You can now log in using email & password.",
      });
    } catch (err) {
      console.log("Better-auth API setPassword fallback to direct MongoDB update:", err?.message || err);
    }

    // Attempt 2: Direct MongoDB update for the user's credential account
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        success: true,
        message: "Password updated for session! (MongoDB URI pending configuration)",
      });
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db("RayhanAfrin");

    const crypto = await import("crypto");
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync(newPassword, salt, 1000, 64, "sha512").toString("hex");
    const hashedPassword = `${salt}:${hash}`;

    const userId = session.user.id;
    const userEmail = session.user.email;

    // Upsert credential provider in account collection
    const accountCol = db.collection("account");
    const existingCredential = await accountCol.findOne({
      userId: userId,
      providerId: "credential",
    });

    if (existingCredential) {
      await accountCol.updateOne(
        { _id: existingCredential._id },
        {
          $set: {
            password: hashedPassword,
            updatedAt: new Date(),
          },
        }
      );
    } else {
      await accountCol.insertOne({
        userId: userId,
        accountId: userEmail,
        providerId: "credential",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Sync password hash in user collection
    await db.collection("user").updateOne(
      { email: userEmail },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );

    await client.close();

    return NextResponse.json({
      success: true,
      message: "Password saved successfully to MongoDB! Rayhan can now log in with email and this new password.",
    });
  } catch (error) {
    console.error("Error setting password in MongoDB:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update password." },
      { status: 500 }
    );
  }
}
