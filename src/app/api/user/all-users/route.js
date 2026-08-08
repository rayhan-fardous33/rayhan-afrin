import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "RayhanAfrin";

// 3 Allowed Roles strictly: Rayhan, Afrin, User
const ALLOWED_ROLES = ["Rayhan", "Afrin", "User"];

// Sample fallback users matching the 3 strict roles
const FALLBACK_USERS = [
  {
    id: "fb_1",
    name: "Rayhan Fardous",
    email: "rayhan@orbit.com",
    role: "Rayhan",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    phone: "+880 1700 000000",
    createdAt: "2024-01-10",
  },
  {
    id: "fb_2",
    name: "Afrin Yesmin",
    email: "afrin@orbit.com",
    role: "Afrin",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    phone: "+880 1800 000000",
    createdAt: "2024-01-12",
  },
  {
    id: "fb_3",
    name: "John Doe",
    email: "john@example.com",
    role: "User",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    phone: "+880 1600 000000",
    createdAt: "2024-05-20",
  },
];

// Helper to normalize any role string into one of the 3 allowed roles
function normalizeRole(roleStr) {
  if (!roleStr) return "User";
  const lower = roleStr.toString().toLowerCase();
  if (lower === "rayhan" || lower === "admin") return "Rayhan";
  if (lower === "afrin") return "Afrin";
  return "User";
}

export async function GET(req) {
  try {
    if (!MONGODB_URI) {
      return NextResponse.json({
        success: true,
        users: FALLBACK_USERS,
        count: FALLBACK_USERS.length,
        source: "fallback",
      });
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);

    const rawUsers = await db.collection("user").find({}).sort({ createdAt: -1 }).toArray();

    await client.close();

    if (!rawUsers || rawUsers.length === 0) {
      return NextResponse.json({
        success: true,
        users: FALLBACK_USERS,
        count: FALLBACK_USERS.length,
        source: "fallback_empty_db",
      });
    }

    const users = rawUsers.map((u) => ({
      id: u._id.toString(),
      name: u.name || "Unnamed User",
      email: u.email || "No Email",
      role: normalizeRole(u.role),
      status: u.status || "Active",
      avatar: u.image || u.avatarUrl || u.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      phone: u.phone || "N/A",
      createdAt: u.createdAt
        ? new Date(u.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        : "N/A",
    }));

    return NextResponse.json({
      success: true,
      users,
      count: users.length,
      source: "mongodb",
    });
  } catch (error) {
    console.error("Error fetching users from MongoDB:", error);
    return NextResponse.json({
      success: true,
      users: FALLBACK_USERS,
      count: FALLBACK_USERS.length,
      source: "error_fallback",
      error: error.message,
    });
  }
}

// Update User Role (Rayhan, Afrin, User) or Status (Active, Blocked)
export async function PATCH(req) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, role, status } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const updateFields = {};
    if (role) {
      updateFields.role = normalizeRole(role);
    }
    if (status) {
      updateFields.status = status === "Blocked" ? "Blocked" : "Active";
    }
    updateFields.updatedAt = new Date();

    if (!MONGODB_URI) {
      return NextResponse.json({
        success: true,
        message: `User ${status ? status.toLowerCase() : "updated"} successfully (demo mode)`,
      });
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);

    let query;
    try {
      query = { _id: new ObjectId(userId) };
    } catch (e) {
      query = { email: userId };
    }

    await db.collection("user").updateOne(query, { $set: updateFields });

    await client.close();

    return NextResponse.json({
      success: true,
      message: `User ${status ? status.toLowerCase() : "updated"} successfully in MongoDB`,
    });
  } catch (error) {
    console.error("Error updating user status/role:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Delete User
export async function DELETE(req) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    if (!MONGODB_URI) {
      return NextResponse.json({ success: true, message: "User deleted (demo mode)" });
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);

    try {
      await db.collection("user").deleteOne({ _id: new ObjectId(userId) });
    } catch (e) {
      await db.collection("user").deleteOne({ email: userId });
    }

    await client.close();
    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
