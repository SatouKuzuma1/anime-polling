import Link from "next/link";
import AnimeCard from "~/components/anime/anime-card";
import RankingCard from "~/components/anime/rankind-card";
import Hero from "~/components/layout/hero";
import { PaginationMain } from "~/components/pagination/pagination";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {
  const session = await getServerAuthSession();

  const take = 10;
  const skip = 0;

  const data = await api.anime.getAllAnime({ take, skip });
  const animes = data?.animes;
  const metadata = data?.metadata;
  console.log("metadata", metadata);

  return (
    <main className="flex flex-col items-center justify-center gap-10 px-8 py-16 sm:p-16">
      <Hero />
      <div className="flex flex-col items-center justify-center gap-10  px-8 py-16 sm:p-16">
        <h2 className="text-3xl font-bold">
          Most <span className="red-gradient">Voted Animes</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {animes?.map((anime, i) => (
          <>
            <div className="" key={i}>
              <RankingCard anime={anime} index={i} session={session} />
            </div>
          </>
        ))}
      </div>

      <PaginationMain metadata={metadata} />
    </main>
  );
}
