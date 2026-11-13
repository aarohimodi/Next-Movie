"use client";
import React, { useEffect, useState } from "react";
import { movies } from "@/lib/movies";
type Booking = {
  _id: string;
  showId: string;
  time: string;
  seat: string[];
  total: number;
  coupon: string;
};
export type MovieType = {
  id: number;
  title: string;
  image: string;
  des: string;
};

function page() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("/api/bookings/my-booking");
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch bookings");
        }
        setBookings(result.bookings);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Something went wrong",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);
  console.log("sdfsdfsdfsd", bookings);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        {/* Page Heading */}
        <h1 className="mb-8 text-3xl font-bold text-gray-800">My Bookings</h1>

        {/* Booking Card */}
        {isLoading ? (
          <div>
            <p className="mt-1 text-xl text-center text-gray-500">
              Loading....
            </p>
          </div>
        ) : (
          <>
            {bookings.map((booking) => {
              const movie: MovieType | undefined = movies.find(
                (item) => item.id === Number(booking.showId),
              );
              return (
                <div
                  key={booking._id}
                  className="max-w-3xl mt-3 rounded-xl bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {movie?.title ?? "Movie not found"}
                      </h2>
                      {/* <p className="mt-1 text-sm text-gray-500">
                  Booking ID: 
                </p> */}
                    </div>

                    <span className="h-fit w-fit rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">
                      Confirmed
                    </span>
                  </div>

                  <hr className="my-5" />

                  {/* Booking Details */}
                  <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                    <div>
                      <p className="text-sm text-gray-500">Show Time</p>
                      <p className="mt-1 font-medium text-gray-800">
                        {booking.time}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Seats</p>
                      <p className="mt-1 font-medium text-gray-800">
                        {booking.seat.join(", ")}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="mt-1 font-medium text-gray-800">
                        ₹{booking.total}
                      </p>
                    </div>
                  </div>

                  <hr className="my-5" />

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Booking Status</span>
                    <span className="font-semibold text-green-600">
                      Payment Successful
                    </span>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default page;
