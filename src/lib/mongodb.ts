/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MongoClient } from "mongodb";

const uri: any = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // @ts-expect-error
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    // @ts-expect-error
    global._mongoClientPromise = client.connect();
  }
  // @ts-expect-error
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
