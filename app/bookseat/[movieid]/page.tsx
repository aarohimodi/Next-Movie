import React from "react";
import BookSeat from "@/components/BookSeat";
import { Suspense } from "react";
function page() {
  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <BookSeat />
      </Suspense>
    </div>
  );
}

export default page;
