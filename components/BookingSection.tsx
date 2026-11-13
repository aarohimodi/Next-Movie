"use client";
import React, { useState } from "react";
import Button from "./Button";

import { useRouter } from "next/navigation";
type time = {
  id: number;
  time: string;
};
function BookingSection({ movieid }: { movieid: number }) {
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState("");
  const bookTime: time[] = [
    {
      id: 1,
      time: "10:00 AM",
    },
    {
      id: 2,
      time: "2:00 PM",
    },
    {
      id: 3,
      time: "9:00 PM",
    },
  ];
  const handleBooking = () => {
    if (!selectedTime) {
      return;
    }
    router.push(
      `/bookseat/${movieid}?time=${encodeURIComponent(selectedTime)}`,
    );
  };
  return (
    <div>
      <div className="flex gap-4 mb-5">
        {bookTime.map((t) => (
          <button
            onClick={() => setSelectedTime(t.time)}
            key={t.id}
            className={` text-white rounded-lg py-2 px-4 cursor-pointer ${selectedTime === t.time ? "bg-red-500" : "bg-[#18181B]"}`}
          >
            {t.time}
          </button>
        ))}
      </div>
      <Button onClick={handleBooking} disabled={!selectedTime}>
        Book Now
      </Button>
    </div>
  );
}

export default BookingSection;
