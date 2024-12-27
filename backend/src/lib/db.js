import mongoose from "mongoose";

export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB : " + conn.connection.host);
  } catch (error) {
    console.error("MongoDB connection error : " + error.message);
  }
}

// import { MongoClient } from "mongodb";
// export async function connectDB() {
//   const client = new MongoClient("mongodb://localhost:27017");
//   try {
//     await client.connect();
//     console.log("Connected to MongoDB!");
//     const db = client.db("lets-connect-db");
//     const collections = await db.listCollections().toArray();
//     console.log("Collections:", collections);
//   } catch (err) {
//     console.error("Error connecting to MongoDB:", err);
//   } finally {
//     await client.close();
//   }
// }
