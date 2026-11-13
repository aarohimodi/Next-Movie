import React from "react";
import MovieDetail from "@/components/MovieDetails";
import { Suspense } from "react";
function page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <MovieDetail />
    </Suspense>
  );
}

export default page;
