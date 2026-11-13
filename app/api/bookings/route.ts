import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
export async function POST(request: NextRequest) {
  // token verify protected api

  // token authentication check
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized. Please login first." },
      { status: 401 },
    );
  }

  // check if token is valid or not

  let decode;
  try {
    decode = jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid or expired token. Please login again." },
      { status: 401 },
    );
  }

  // token type check

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
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { message: "Invalid booking data" },
      { status: 400 },
    );
  }
  const { showId, time, seat, coupon } = body;

  // body variables type check

  if (
    typeof showId !== "string" ||
    typeof time !== "string" ||
    !Array.isArray(seat) ||
    seat.length === 0 ||
    !seat.every((s) => typeof s === "string")
  ) {
    return NextResponse.json(
      { message: "Invalid booking details" },
      { status: 400 },
    );
  }

  // check duplicate seat validation

  if (new Set(seat).size !== seat.length) {
    return NextResponse.json(
      { message: "Duplicate seats are not allowed" },
      { status: 400 },
    );
  }

  // seat format check

  const invalidSeat = seat.some((i) => !/^[A-E][1-8]$/.test(i));
  if (invalidSeat) {
    return NextResponse.json(
      { message: "Invalid seat selection" },
      { status: 400 },
    );
  }

  // db connection

  const client = await clientPromise;
  const db = client.db("movieBookings");

  const users = db.collection("users");

  // check if user exist or not

  const user = await users.findOne({ _id: new ObjectId(decode.userId) });
  if (!user) {
    return NextResponse.json(
      { message: "User not found. Please login again." },
      { status: 401 },
    );
  }

  const collection = db.collection("bookings");

  // find existing matching showid and time create a array because find will give Cursor we need array

  const existingBookings = await collection.find({ showId, time }).toArray();

  // check if the seat is already booked

  const alreadyBookedSeats = existingBookings.flatMap(
    (booking) => booking.seat,
  );

  const isSeatAlreadyBooked = seat.some((i) => alreadyBookedSeats.includes(i));

  if (isSeatAlreadyBooked) {
    return NextResponse.json(
      { message: "Some selected seats are already booked" },
      { status: 409 },
    );
  }

  // check price calculation
  const seatPrice: Record<string, number> = {
    A: 300,
    B: 250,
    C: 200,
    D: 150,
    E: 100,
  };

  const totalPrice = seat.reduce((total, seatId) => {
    const row = seatId[0];
    return total + seatPrice[row];
  }, 0);

  // coupen validation

  const couponCodes: Record<string, number> = {
    MYSHOW20: 20,
    FREESHOW100: 50,
  };

  const normalizedCoupon =
    typeof coupon === "string" ? coupon.trim().toUpperCase() : "";

  const discount = couponCodes[normalizedCoupon] ?? 0;

  if (normalizedCoupon && discount === undefined) {
    return NextResponse.json(
      { message: "Invalid coupon code" },
      { status: 400 },
    );
  }

  const finalPrice = Math.max(totalPrice - discount, 0);

  // create insert data variable and add the userId in the object

  const bookingData = {
    userId: new ObjectId(decode.userId),
    showId,
    time,
    seat,
    total: finalPrice,
    coupon: normalizedCoupon,
  };

  const result = await collection.insertOne(bookingData);
  return Response.json({
    message: "Booking Saved in MongoDB",
    result,
  });
}

export async function GET() {
  const client = await clientPromise;
  const db = client.db("movieBookings");
  const collection = db.collection("bookings");
  const bookings = await collection.find().toArray();
  return Response.json({
    bookings,
  });
}
