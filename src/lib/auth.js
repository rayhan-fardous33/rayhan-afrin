import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { createAuthMiddleware } from "better-auth/api";

const mongodbUri =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/RayhanAfrin";
const client = new MongoClient(mongodbUri);
const db = client.db("RayhanAfrin");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  user: {
    additionalFields: {
      role: { defaultValue: "User" },
      status: { defaultValue: "Active" },
      bloodGroup: { type: "string", required: false },
      district: { type: "string", required: false },
      upazila: { type: "string", required: false },
      phone: { type: "string", required: false },
      avatarUrl: { type: "string", required: false },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // Block sign-in via email/password if user is Blocked
      if (ctx.path === "/sign-in/email") {
        const email = ctx.body?.email;
        if (email) {
          const user = await db.collection("user").findOne({ email });
          if (user && (user.status || "").toLowerCase() === "blocked") {
            throw new Error(
              "Your account has been blocked by Admin Rayhan. You cannot log in."
            );
          }
        }
      }

      // Block sign-in via Google OAuth (social callback) if user is Blocked
      if (ctx.path === "/sign-in/social" || ctx.path?.startsWith("/callback/")) {
        // For OAuth, email may be in body or resolved after callback.
        // We check after the session is created via the `after` hook below.
      }
    }),

    after: createAuthMiddleware(async (ctx) => {
      // After OAuth callback: if the resulting session user is Blocked, revoke it
      if (
        ctx.path?.startsWith("/callback/") ||
        ctx.path === "/sign-in/social"
      ) {
        const sessionUser = ctx.context?.session?.user;
        if (
          sessionUser?.email &&
          (sessionUser?.status || "").toLowerCase() !== "blocked"
        ) {
          // Also re-check from DB for freshest status
          const dbUser = await db
            .collection("user")
            .findOne({ email: sessionUser.email });
          if (dbUser && (dbUser.status || "").toLowerCase() === "blocked") {
            // Revoke the newly created session
            if (ctx.context?.session?.session?.token) {
              await db
                .collection("session")
                .deleteOne({ token: ctx.context.session.session.token });
            }
            throw new Error(
              "Your account has been blocked by Admin Rayhan. You cannot log in."
            );
          }
        }
      }
    }),

    onSignUp: async (ctx) => {
      await db.collection("user").updateOne(
        { email: ctx.user.email },
        {
          $set: {
            role: "User",
            status: "Active",
          },
        }
      );

      const metadata = ctx.body?.metadata;

      if (metadata) {
        const updateFields = {
          bloodGroup: metadata.bloodGroup,
          district: metadata.district,
          upazila: metadata.upazila,
          phone: metadata.phone,
          avatarUrl: metadata.avatarUrl,
        };

        Object.keys(updateFields).forEach(
          (key) => updateFields[key] === undefined && delete updateFields[key]
        );

        if (Object.keys(updateFields).length) {
          await db
            .collection("user")
            .updateOne({ email: ctx.user.email }, { $set: updateFields });
        }
      }
    },
  },
});
