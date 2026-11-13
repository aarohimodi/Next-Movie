import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  console.log("REGISTER API CALLED");
  try {
    const client = await clientPromise;
    const db = client.db("movieBookings");
    const users = db.collection("users");
    const body = await request.json();
    if (body === null || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 },
      );
    }
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          message: "Name,email and password are required",
        },
        { status: 400 },
      );
    }
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        { message: "Invalid data types" },
        { status: 400 },
      );
    }
    if (!name.trim() || !email.trim() || !password.trim()) {
      return NextResponse.json(
        {
          message: "Name, Email and password are required",
        },
        {
          status: 400,
        },
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        {
          message: "Please enter a valid email address",
        },
        { status: 400 },
      );
    }

    const existingUser = await users.findOne({
      email: email.trim().toLowerCase(),
    });
    if (existingUser) {
      return NextResponse.json(
        {
          message: "Email is already registered",
        },
        {
          status: 409,
        },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await users.insertOne({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });
    return NextResponse.json(
      {
        message: "Registration successful",
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("CATCH BLOCK RUNNING");
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
