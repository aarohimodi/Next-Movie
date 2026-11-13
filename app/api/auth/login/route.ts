import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        {
          message: "Invalid data types",
        },
        {
          status: 400,
        },
      );
    }
    if (!email.trim() || password.length === 0) {
      return NextResponse.json(
        {
          message: "Email and password are required",
        },
        {
          status: 400,
        },
      );
    }
    const client = await clientPromise;
    const db = client.db("movieBookings");
    const users = db.collection("users");

    const user = await users.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          message: "Invalid email or password",
        },
        {
          status: 401,
        },
      );
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );
    const response = NextResponse.json({
      message: "Login Api is working",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      {
        status: 500,
      },
    );
  }
}
