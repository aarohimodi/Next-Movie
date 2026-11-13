"use client";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  showId: string;
};
function ShowGrid({ showId }: Props) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const searchParam = useSearchParams();
  const selectedtime = searchParam.get("time");
  const seats = ["A", "B", "C", "D", "E"];
  const seatRow = 8;
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isBooking, setIsBooking] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const seatPrice: Record<string, number> = {
    A: 300,
    B: 250,
    C: 200,
    D: 150,
    E: 100,
  };
  const couponCode: Record<string, number> = { MYSHOW20: 20, FREESHOW100: 50 };
  const [selectedSeat, setSelectedSeat] = useState<string[]>([]);
  const [bookedSeat, setBookedSeats] = useState<string[]>([]);
  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    const response = await fetch("/api/bookings");
    const data = await response.json();
    const filteredBooking = data.bookings.filter(
      (book: any) => book.showId === showId && book.time === selectedtime,
    );
    const allSeats = filteredBooking.flatMap((booking: any) => booking.seat);
    setBookedSeats(allSeats);
  };
  const handleSelectSeat = (seatId: string) => {
    const isSelected = selectedSeat.find((s) => s === seatId);
    if (isSelected) {
      const filteredSeat = selectedSeat.filter((s) => s !== seatId);
      setSelectedSeat(filteredSeat);
      if (filteredSeat.length === 0) {
        setDiscount(0);
      }
    } else {
      setSelectedSeat((prev) => [...prev, seatId]);
    }
  };

  const totalPrice = selectedSeat.reduce((total, seat) => {
    const row = seat[0];
    return (total += seatPrice[row]);
  }, 0);

  const handleDiscount = () => {
    const value = couponCode[coupon.toUpperCase()];
    if (value !== undefined) {
      setDiscount(value);
    } else {
      alert("Invaild Coupon");
      setDiscount(0);
    }
  };
  const finalPrice = Math.max(totalPrice - discount, 0);
  const handleBooking = async () => {
    if (isLoading) return;
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setIsBooking(true);
    const bookingData = {
      showId: showId,
      time: selectedtime,
      seat: selectedSeat,
      total: finalPrice,
      coupon: coupon,
    };
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });
    const data = await response.json();
    if (response.ok) {
      setSelectedSeat([]);
      setSuccessMessage("Booking Successful ✅");
      fetchBooking();
      setIsBooking(false);
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div>
        <h4 className="text-white mt-5">Show Time : {selectedtime}</h4>
        {seats.map((row) => (
          <div key={row}>
            <div className="flex gap-2 items-center mt-2">
              <h3 className="text-white text-3xl mr-3">{row}</h3>
              <div className="flex gap-3 ">
                {Array.from({ length: seatRow }).map((_, i) => {
                  const seatId = `${row}${i + 1}`;
                  const isBooked = bookedSeat.includes(seatId);

                  const isSelected = selectedSeat.includes(seatId);

                  return (
                    <div
                      onClick={() => {
                        if (!isBooked) {
                          handleSelectSeat(seatId);
                        }
                      }}
                      key={i}
                      className={`${
                        isBooked
                          ? "bg-red-500 cursor-not-allowed"
                          : isSelected
                            ? "bg-green-500"
                            : "bg-[#3F3F46]"
                      } w-10 h-10 mt-4 rounded-lg flex justify-center items-center text-white`}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 w-[40%] md:w-full bg-[#18181B] mt-5 md:mt-0 rounded-lg flex flex-col justify-center gap-3">
        <h3 className="text-white text-2xl">Booking Summary</h3>
        <h4 className="text-white text-[18px]">
          Seats : {selectedSeat.join(",") || "None"}
        </h4>
        <h4 className="text-white text-[18px]"> Total : ₹{totalPrice}</h4>
        <div className="flex gap-3 mt-4">
          <input
            type="text"
            value={coupon}
            className="bg-white py-2 px-2 rounded-lg"
            onChange={(e) => setCoupon(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white rounded-lg py-2 px-3"
            onClick={handleDiscount}
          >
            Apply
          </button>
        </div>
        <h4 className="text-white text-[18px]"> Discount : ₹{discount}</h4>
        <h4 className="text-white text-[18px]"> Final Total : ₹{finalPrice}</h4>
        <button
          className={`mt-4 px-5 py-2  w-[250px] md:w-full rounded ${
            selectedSeat.length === 0
              ? "bg-gray-500 cursor-not-allowed text-black font-semibold"
              : "bg-red-500 hover:bg-red-600 text-white font-semibold"
          }`}
          onClick={handleBooking}
          disabled={selectedSeat.length === 0 || isBooking}
        >
          {isBooking ? "Booking..." : "Proceed to Booking"}
        </button>
        {successMessage && (
          <p className="text-green-500 mt-3">{successMessage}</p>
        )}
      </div>
    </div>
  );
}

export default ShowGrid;
