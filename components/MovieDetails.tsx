"use client";
import React from "react";
import { movies } from "@/lib/movies";

import Image from "next/image";

import Container from "@/components/Container";
import { useParams } from "next/navigation";
import BookingSection from "./BookingSection";

function MovieDetail() {
  const { id } = useParams<{ id: string }>();

  const singleMovie = movies.find((i) => i.id === Number(id));

  if (!singleMovie) {
    return (
      <div>
        <h2 className="text-center text-white text-4xl mt-10">
          Movie Not Found
        </h2>
      </div>
    );
  }
  return (
    <div className="py-10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="w-full h-[500px]">
            <Image
              src={singleMovie?.image}
              alt={singleMovie?.title}
              width={200}
              height={400}
              className="w-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-5">
            <h2 className="text-white text-3xl">{singleMovie?.title}</h2>
            <p className="text-white text-[16px]">{singleMovie?.des}</p>
            <BookingSection movieid={singleMovie?.id} />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default MovieDetail;
