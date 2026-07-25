import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
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
    onSignUp: async (ctx) => {
      await db.collection("user").updateOne(
        { email: ctx.user.email },
        {
          $set: {
            role: "Donor",
            status: "Active",
          },
        },
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
          (key) => updateFields[key] === undefined && delete updateFields[key],
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
