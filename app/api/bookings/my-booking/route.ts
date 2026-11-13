import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized. Please login first." },
      { status: 401 },
    );
  }
  let decode;

  try {
    decode = jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid or expired token. Please login again." },
      { status: 401 },
    );
  }
  if (
    typeof decode === "string" ||
    typeof decode.userId !== "string" ||
    !ObjectId.isValid(decode.userId)
  ) {
    return NextResponse.json(
      { message: "Invalid user token" },
      { status: 401 },
    );
  }

  const client = await clientPromise;
  const db = client.db("movieBookings");
  const collection = db.collection("bookings");
  const bookings = await collection
    .find({
      userId: new ObjectId(decode.userId),
    })
    .toArray();
  return NextResponse.json({
    message: "My bookings fetched successfully",
    bookings,
  });
}
