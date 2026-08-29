import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "RayhanAfrin";

function getDb() {
  if (!MONGODB_URI) throw new Error("MONGODB_URI is not set");
  const client = new MongoClient(MONGODB_URI);
  return { client, db: client.db(DB_NAME) };
}

function checkPrivileges(user) {
  if (!user) return { isPrivileged: false, isRayhan: false, isAfrin: false };

  const rawRole = (user.role || "").toString().trim().toLowerCase();

  const isRayhan = rawRole === "rayhan" || rawRole === "admin";
  const isAfrin = rawRole === "afrin";

  return {
    isPrivileged: isRayhan || isAfrin,
    isRayhan,
    isAfrin,
  };
}

// ──────────────────────────────────────────────
// POST /api/notes — Logged in users send a note to RayHan & Afrin
// ──────────────────────────────────────────────
export async function POST(req) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to send a sweet note." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, message, tag, emoji } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Note message cannot be empty." },
        { status: 400 }
      );
    }

    const newNote = {
      senderName: session.user.name || "A Special Friend",
      senderEmail: session.user.email,
      senderImage: session.user.image || session.user.avatarUrl || "/default-avatar.png",
      senderRole: session.user.role || "User",
      recipient: "RayHan & Afrin",
      title: (title && title.trim()) || "A Sweet Note For You Both",
      message: message.trim(),
      tag: tag || "Sweet Wish",
      emoji: emoji || "💌",
      isFavorite: false,
      isRead: false,
      createdAt: new Date(),
    };

    const { client, db } = getDb();
    await client.connect();

    const result = await db.collection("notes").insertOne(newNote);
    await client.close();

    return NextResponse.json({
      success: true,
      note: {
        ...newNote,
        _id: result.insertedId.toString(),
        id: result.insertedId.toString(),
      },
    });
  } catch (error) {
    console.error("POST /api/notes error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// GET /api/notes — Only RayHan and Afrin can view the notes
// ──────────────────────────────────────────────
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isPrivileged, isRayhan } = checkPrivileges(session.user);
    if (!isPrivileged) {
      return NextResponse.json(
        { error: "Only RayHan and Afrin have access to view sweet notes." },
        { status: 403 }
      );
    }

    const { client, db } = getDb();
    await client.connect();

    const notes = await db
      .collection("notes")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    await client.close();

    return NextResponse.json({
      success: true,
      isRayhan,
      notes: notes.map((n) => ({
        ...n,
        _id: n._id.toString(),
        id: n._id.toString(),
      })),
    });
  } catch (error) {
    console.error("GET /api/notes error:", error);
    return NextResponse.json(
      { success: false, error: error.message, notes: [] },
      { status: 500 }
    );
  }
}

// ──────────────────────────────────────────────
// PATCH /api/notes — Toggle isFavorite / isRead
// ──────────────────────────────────────────────
export async function PATCH(req) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isPrivileged, isRayhan } = checkPrivileges(session.user);
    if (!isPrivileged) {
      return NextResponse.json(
        { error: "Only RayHan and Afrin can update sweet notes." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, isFavorite, isRead } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const updateFields = {};
    if (typeof isFavorite === "boolean") {
      // Favorite can be toggled by RayHan or Afrin (specifically requested for RayHan)
      updateFields.isFavorite = isFavorite;
    }
    if (typeof isRead === "boolean") {
      updateFields.isRead = isRead;
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const { client, db } = getDb();
    await client.connect();

    await db
      .collection("notes")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

    await client.close();

    return NextResponse.json({
      success: true,
      message: "Note updated successfully",
    });
  } catch (error) {
    console.error("PATCH /api/notes error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ──────────────────────────────────────────────
// DELETE /api/notes — RayHan can delete notes
// ──────────────────────────────────────────────
export async function DELETE(req) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isRayhan } = checkPrivileges(session.user);
    if (!isRayhan) {
      return NextResponse.json(
        { error: "Only RayHan has permission to delete notes." },
        { status: 403 }
      );
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const { client, db } = getDb();
    await client.connect();

    await db.collection("notes").deleteOne({ _id: new ObjectId(id) });
    await client.close();

    return NextResponse.json({ success: true, message: "Note deleted successfully." });
  } catch (error) {
    console.error("DELETE /api/notes error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
