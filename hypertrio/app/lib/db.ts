import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI as string;
if (!uri) throw new Error("Missing MONGO_URI in .env.local");

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export async function getUser(email: string) {
  const client = await clientPromise;
  const db = client.db();
  return await db.collection("Users").findOne({ email });
}