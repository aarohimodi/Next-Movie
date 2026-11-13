"use client";
import Container from "@/components/Container";
import ShowGrid from "@/components/ShowGrid";
import { useParams } from "next/navigation";
import { Suspense } from "react";

function BookSeat() {
  let { movieid } = useParams<{ movieid: string }>();

  return (
    <div className="py-10 px-4">
      <Container>
        <h2 className="text-white text-3xl">Select Seats 🎟️</h2>
        {/* <h4 className="text-white  mt-3">Show Id : {movieid}</h4> */}
        <Suspense fallback={<p>Loading...</p>}>
          <ShowGrid showId={movieid} />
        </Suspense>
      </Container>
    </div>
  );
}

export default BookSeat;
