import React from "react";
import Button from "./Button";
import Image from "next/image";
import Link from "next/link";
type movie = {
  id: number;
  title: string;
  image: string;
};
function MovieCard({ items }: { items: movie }) {
  return (
    <div className="bg-[#18181B] rounded-lg p-4">
      <Link href={`/movies/${items.id}`}>
        <Image
          src={items.image}
          alt=""
          width={400}
          height={600}
          className="w-full h-auto"
        />
      </Link>
      <h3 className="text-white my-4 text-[15px] md:text-xl">{items.title}</h3>
      <Link href={`/movies/${items.id}`}>
        <Button>Book Now</Button>
      </Link>
    </div>
  );
}

export default MovieCard;
