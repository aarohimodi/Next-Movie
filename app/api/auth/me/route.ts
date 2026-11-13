import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 },
    );
  }

  if (
    typeof decoded === "string" ||
    typeof decoded.userId !== "string" ||
    !ObjectId.isValid(decoded.userId)
  ) {
    return NextResponse.json(
      { message: "Invalid user token" },
      { status: 401 },
    );
  }

  const client = await clientPromise;
  const db = client.db("movieBookings");

  const user = await db.collection("users").findOne(
    { _id: new ObjectId(decoded.userId) },
    {
      projection: { password: 0 },
    },
  );

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
  });
}
