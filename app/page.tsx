import Container from "@/components/Container";
import Image from "next/image";
import { movies } from "@/lib/movies";
import MovieCard from "@/components/MovieCard";

export default function Home() {
  return (
    <div className="w-full flex flex-col flex-1  py-10  font-sans dark:bg-black">
      <Container>
        <div>
          <h2 className="text-white font-poppines text-3xl">
            Movie Booking App
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {movies.map((item) => (
              <MovieCard key={item.id} items={item} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
