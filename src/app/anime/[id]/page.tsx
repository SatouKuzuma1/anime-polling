import React from "react";
import AnimeCard from "~/components/anime/anime-card";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import shikimori from "~/utils/shikan";

type Params = {
  id: string;
};
const AnimeId = async ({ params }: { params: Params }) => {
  const id = Number(params.id);
  const session = await getServerAuthSession();

  const anime = await shikimori.animes.byId({ id: id });
  const imageSrc = anime.image?.original
    ? `https://shikimori.one${anime.image.original}`
    : null;

  console.log("anime", anime.score);

  const addAnimeToDatabase = await api.anime.add({
    id: anime.id,
    name: anime.name,
    image: imageSrc!,
    score: anime.score,
    episodes: anime.episodes,
  });

  addAnimeToDatabase;

  return (
    <div>
      <AnimeCard anime={anime} index={anime.id} session={session} />
    </div>
  );
};

export default AnimeId;
