import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "RayhanAfrin";

// Roles allowed to add / delete memories
const PRIVILEGED_ROLES = ["Rayhan", "Afrin"];

function getDb() {
  if (!MONGODB_URI) throw new Error("MONGODB_URI is not set");
  const client = new MongoClient(MONGODB_URI);
  return { client, db: client.db(DB_NAME) };
}

// ──────────────────────────────────────────────
// GET  /api/memories  — returns all dynamic memories
// ──────────────────────────────────────────────
export async function GET() {
  try {
    const { client, db } = getDb();
    await client.connect();

    const memories = await db
      .collection("memories")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    await client.close();

    return NextResponse.json({
      success: true,
      memories: memories.map((m) => ({
        ...m,
        _id: m._id.toString(),
        id: m._id.toString(),
      })),
    });
  } catch (error) {
    console.error("GET /api/memories error:", error);
    return NextResponse.json(
      { success: false, error: error.message, memories: [] },
      { status: 500 }
    );
  }
}

// ──────────────────────────────────────────────
// POST /api/memories  — add a new memory
// Only Rayhan and Afrin may add memories
// ──────────────────────────────────────────────
export async function POST(req) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = session.user.role || "User";
    if (!PRIVILEGED_ROLES.includes(role)) {
      return NextResponse.json(
        { error: "Only Rayhan and Afrin can add memories." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, date, location, category, desc, imageUrl, isBanner } = body;

    if (!title) {
      return NextResponse.json(
        { error: "title is required" },
        { status: 400 }
      );
    }

    const newMemory = {
      title,
      date: date || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      location: location || "Somewhere Special",
      category: category || "dates",
      desc: desc || "A precious moment etched in our story forever.",
      imageUrl:
        imageUrl?.trim() ||
        "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&w=800&q=80",
      isBanner: isBanner === true,
      addedBy: session.user.name || session.user.email,
      addedByRole: role,
      createdAt: new Date(),
    };

    const { client, db } = getDb();
    await client.connect();

    const result = await db.collection("memories").insertOne(newMemory);
    await client.close();

    return NextResponse.json({
      success: true,
      memory: {
        ...newMemory,
        _id: result.insertedId.toString(),
        id: result.insertedId.toString(),
      },
    });
  } catch (error) {
    console.error("POST /api/memories error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// DELETE /api/memories  — delete a memory by id
// Only Rayhan and Afrin may delete
// ──────────────────────────────────────────────
export async function DELETE(req) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = session.user.role || "User";
    if (!PRIVILEGED_ROLES.includes(role)) {
      return NextResponse.json(
        { error: "Only Rayhan and Afrin can delete memories." },
        { status: 403 }
      );
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const { client, db } = getDb();
    await client.connect();

    await db.collection("memories").deleteOne({ _id: new ObjectId(id) });
    await client.close();

    return NextResponse.json({ success: true, message: "Memory deleted" });
  } catch (error) {
    console.error("DELETE /api/memories error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
