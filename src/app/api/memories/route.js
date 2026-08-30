import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "RayhanAfrin";

// Case-insensitive role check
function isPrivilegedRole(role) {
  if (!role) return false;
  const normalized = role.toLowerCase();
  return normalized === "rayhan" || normalized === "afrin";
}

function getDb() {
  if (!MONGODB_URI) throw new Error("MONGODB_URI is not set");
  const client = new MongoClient(MONGODB_URI);
  return { client, db: client.db(DB_NAME) };
}

const INITIAL_SEED_MEMORIES = [
  // Banner / Slideshow items
  {
    title: "The Nature Calls",
    date: "May 14, 2026",
    location: "Ramna Park",
    category: "trips",
    desc: "After college, we went to Ramna Park together. 🌳❤️ We took a break from our busy day, walked through the peaceful paths, simply enjoyed each other's company.",
    imageUrl: "https://i.ibb.co.com/60ZhcHZW/IMG-20260514-134231.jpg",
    isBanner: true,
    showOnHome: false,
    createdAt: new Date("2026-05-14T10:00:00Z"),
  },
  {
    title: "The First K***",
    date: "May 18, 2026",
    location: "Toggi Fun World",
    category: "trips",
    desc: "Toggi Fun World. 🎠❤️ A day filled with laughter, adventure, and so many firsts together—memories we'll never forget.",
    imageUrl: "https://i.ibb.co.com/NvzPGkb/IMG-20260518-144846.jpg",
    isBanner: true,
    showOnHome: false,
    createdAt: new Date("2026-05-18T10:00:00Z"),
  },
  {
    title: "Our First Game",
    date: "May, 2026",
    location: "Chillox, Dhanmondi",
    category: "dates",
    desc: "Chillox, Dhanmondi. ❤️ Our first game of UNO, shared food, shared books, and countless smiles. Sometimes the simplest moments become the most unforgettable memories.",
    imageUrl: "https://i.ibb.co.com/kgp6gYRd/20260511-123515-1.jpg",
    isBanner: true,
    showOnHome: false,
    createdAt: new Date("2026-05-11T10:00:00Z"),
  },
  {
    title: "Spicy Food 🌶️",
    date: "June 13, 2026",
    location: "Mohammadpur",
    category: "dates",
    desc: "A spicy date at Oro Restaurant, Mohammadpur. 🌶️❤️ Good food, great company, and another beautiful memory together.",
    imageUrl: "https://i.ibb.co.com/VrD5PKw/20260613-140455.jpg",
    isBanner: true,
    showOnHome: false,
    createdAt: new Date("2026-06-13T10:00:00Z"),
  },
  {
    title: "Movie Theater",
    date: "May 05, 2026",
    location: "Bashundhara City",
    category: "dates",
    desc: "We went to Star Cineplex at Bashundhara City to watch a movie together. It was our first movie date, and it made the day really special.",
    imageUrl: "https://i.ibb.co.com/QjHy6Z1p/IMG-20260505-122313.jpg",
    isBanner: true,
    showOnHome: false,
    createdAt: new Date("2026-05-05T10:00:00Z"),
  },
  // Homepage featured polaroids
  {
    title: "Messy Baking Night",
    date: "October 12, 2025",
    location: "Our Cozy Kitchen",
    category: "cozy",
    desc: "Attempted to bake a chocolate souffle from scratch. It completely collapsed, and we ended up eating gooey hot chocolate cake directly out of the ramekins.",
    imageUrl: "https://i.ibb.co.com/kVf8Bcrr/DSC01118-1.jpg",
    isBanner: false,
    showOnHome: true,
    createdAt: new Date("2025-10-12T10:00:00Z"),
  },
  {
    title: "Golden Hour Stroll",
    date: "April 22, 2025",
    location: "Ocean Breeze Pier",
    category: "dates",
    desc: "The warm breeze in your hair, the ocean tide washing over our bare feet, and a sunset that dyed the world pink. Times like this feel infinite.",
    imageUrl: "https://i.ibb.co.com/r29NfgCv/IMG-20260703-100811.jpg",
    isBanner: false,
    showOnHome: true,
    createdAt: new Date("2025-04-22T10:00:00Z"),
  },
  {
    title: "Wandering Kyoto Streets",
    date: "November 08, 2025",
    location: "Kyoto, Japan",
    category: "trips",
    desc: "Getting blissfully lost in narrow wooden alleyways, eating matcha soft serve in the autumn cold, and wishing this adventure would never have to end.",
    imageUrl: "https://i.ibb.co.com/d0Jm9K6N/20260505-102703.jpg",
    isBanner: false,
    showOnHome: true,
    createdAt: new Date("2025-11-08T10:00:00Z"),
  },
  {
    title: "Rainy Afternoon Cafe",
    date: "June 15, 2024",
    category: "dates",
    location: "The Local Grind",
    desc: "Where it all started. The rain was pouring and we shared a single blueberry muffin.",
    imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    isBanner: false,
    showOnHome: true,
    createdAt: new Date("2024-06-15T10:00:00Z"),
  },
  {
    title: "First Anniversary",
    date: "June 15, 2025",
    category: "celebrations",
    location: "La Piazza Ristorante",
    desc: "Dressed up and ate way too much pasta.",
    imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80",
    isBanner: false,
    showOnHome: true,
    createdAt: new Date("2025-06-15T10:00:00Z"),
  },
  {
    title: "Road Trip Horizons",
    date: "March 22, 2025",
    category: "trips",
    location: "Pacific Coast Highway",
    desc: "Driving with the windows down, music blasting, entirely disconnected from the world.",
    imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
    isBanner: false,
    showOnHome: true,
    createdAt: new Date("2025-03-22T10:00:00Z"),
  },
  {
    title: "Coffee Dates",
    date: "Every Sunday",
    category: "cozy",
    location: "Corner Bakery Cafe",
    desc: "Our favorite weekend ritual. Double lattes and planning the week.",
    imageUrl: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=600&q=80",
    isBanner: false,
    showOnHome: true,
    createdAt: new Date("2025-01-01T10:00:00Z"),
  },
  {
    title: "Midnight Picnic",
    date: "Aug 10, 2025",
    category: "dates",
    location: "Central Park Hill",
    desc: "Bought cheap wine and laid out a blanket in the park at midnight.",
    imageUrl: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&w=600&q=80",
    isBanner: false,
    showOnHome: true,
    createdAt: new Date("2025-08-10T10:00:00Z"),
  },
];

// ──────────────────────────────────────────────
// GET  /api/memories  — returns all memories from MongoDB
// Optional ?homeOnly=true returns memories flagged for homepage
// ──────────────────────────────────────────────
export async function GET(req) {
  let client;
  try {
    const { searchParams } = new URL(req.url);
    const homeOnly = searchParams.get("homeOnly") === "true";

    const dbObj = getDb();
    client = dbObj.client;
    const db = dbObj.db;
    await client.connect();

    const collection = db.collection("memories");
    const count = await collection.countDocuments();

    // Auto-seed initial memories into MongoDB if database is empty
    if (count === 0) {
      await collection.insertMany(INITIAL_SEED_MEMORIES);
    }

    const query = homeOnly ? { showOnHome: true } : {};
    const memories = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      memories: memories.map((m) => ({
        ...m,
        _id: m._id.toString(),
        id: m._id.toString(),
        showOnHome: m.showOnHome !== false,
      })),
    });
  } catch (error) {
    console.error("GET /api/memories error:", error);
    return NextResponse.json(
      { success: false, error: error.message, memories: [] },
      { status: 500 }
    );
  } finally {
    if (client) await client.close();
  }
}

// ──────────────────────────────────────────────
// POST /api/memories  — add a new memory
// Only role 'rayhan' or 'afrin' may add
// ──────────────────────────────────────────────
export async function POST(req) {
  let client;
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = session.user.role || "User";
    if (!isPrivilegedRole(role)) {
      return NextResponse.json(
        { error: "Only Rayhan and Afrin can add memories." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, date, location, category, desc, imageUrl, isBanner, showOnHome } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const newMemory = {
      title: title.trim(),
      date: date?.trim() || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      location: location?.trim() || "Somewhere Special",
      category: category || "dates",
      desc: desc?.trim() || "A precious moment etched in our story forever.",
      imageUrl:
        imageUrl?.trim() ||
        "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&w=800&q=80",
      isBanner: isBanner === true,
      showOnHome: showOnHome !== false,
      addedBy: session.user.name || session.user.email,
      addedByRole: role,
      createdAt: new Date(),
    };

    const dbObj = getDb();
    client = dbObj.client;
    const db = dbObj.db;
    await client.connect();

    const result = await db.collection("memories").insertOne(newMemory);

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
  } finally {
    if (client) await client.close();
  }
}

// ──────────────────────────────────────────────
// PUT /api/memories  — modify / edit an existing memory
// Only role 'rayhan' or 'afrin' may modify
// ──────────────────────────────────────────────
export async function PUT(req) {
  let client;
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = session.user.role || "User";
    if (!isPrivilegedRole(role)) {
      return NextResponse.json(
        { error: "Only Rayhan and Afrin can modify memories." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, title, date, location, category, desc, imageUrl, isBanner, showOnHome } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Memory id is required" },
        { status: 400 }
      );
    }

    const updateFields = {
      updatedAt: new Date(),
      updatedBy: session.user.name || session.user.email,
    };

    if (title !== undefined) updateFields.title = title.trim();
    if (date !== undefined) updateFields.date = date.trim();
    if (location !== undefined) updateFields.location = location.trim();
    if (category !== undefined) updateFields.category = category;
    if (desc !== undefined) updateFields.desc = desc.trim();
    if (imageUrl !== undefined) updateFields.imageUrl = imageUrl.trim();
    if (isBanner !== undefined) updateFields.isBanner = Boolean(isBanner);
    if (showOnHome !== undefined) updateFields.showOnHome = Boolean(showOnHome);

    const dbObj = getDb();
    client = dbObj.client;
    const db = dbObj.db;
    await client.connect();

    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
    const result = await db.collection("memories").findOneAndUpdate(
      filter,
      { $set: updateFields },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      memory: {
        ...result,
        _id: result._id.toString(),
        id: result._id.toString(),
      },
    });
  } catch (error) {
    console.error("PUT /api/memories error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}

// ──────────────────────────────────────────────
// DELETE /api/memories  — delete a memory by id
// Only role 'rayhan' or 'afrin' may delete
// ──────────────────────────────────────────────
export async function DELETE(req) {
  let client;
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = session.user.role || "User";
    if (!isPrivilegedRole(role)) {
      return NextResponse.json(
        { error: "Only Rayhan and Afrin can delete memories." },
        { status: 403 }
      );
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const dbObj = getDb();
    client = dbObj.client;
    const db = dbObj.db;
    await client.connect();

    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
    await db.collection("memories").deleteOne(filter);

    return NextResponse.json({ success: true, message: "Memory deleted" });
  } catch (error) {
    console.error("DELETE /api/memories error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}
