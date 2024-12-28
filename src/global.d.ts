import { MongoClient } from "mongodb";

declare module "jsonwebtoken";
declare module "file-saver";
declare module "quagga";

declare global {
  namespace NodeJS {
    interface Global {
      _mongoClientPromise?: Promise<MongoClient>;
    }
  }
}

export {};
