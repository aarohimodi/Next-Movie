import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;

const client = new MongoClient(uri);

const clientPromise = client.connect();
clientPromise
  .then(() => console.log("mongo connected"))
  .catch((err) => console.error("errorrr hai bhai ji check kro ", err));
export default clientPromise;
