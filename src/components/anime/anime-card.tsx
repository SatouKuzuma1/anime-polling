"use client";

import { cn } from "~/lib/utils";

import Image from "next/image";
import { Card } from "~/components/ui/card";

import { type AnimeCardProps } from "~/types";

import Vote from "./vote";
import { MotionDiv } from "./motion-div";
import { Star } from "lucide-react";

function AnimeCard({ anime, index, session }: AnimeCardProps) {
  const stagger = 0.25;

  const variants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const animeData = {
    id: anime.id,
    name: anime.name,
    image: anime.image,
    episodes: anime.episodes,
    episodes_aired: anime.episodes_aired,
    score: anime.score,
    kind: anime.kind,
    isFavorite: true,
  };

  const imageSrc = anime.image?.original
    ? `https://shikimori.one${anime.image.original}`
    : null;

  return (
    <>
      <MotionDiv
        variants={variants}
        initial="visible"
        animate="visible"
        transition={{
          delay: stagger * index,
          ease: "easeInOut",
          duration: 0.5,
        }}
        viewport={{ amount: 0 }}
        className="relative ml-4 h-full w-full max-w-sm rounded p-4 shadow-md"
      >
        <div className="relative h-[37vh] w-full sm:justify-center">
          {imageSrc && (
            <div className="h-12 w-full cursor-pointer">
              <Image
                src={imageSrc}
                alt={anime.name}
                fill
                className="rounded-xl object-contain"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 py-4">
          <div className="flex items-center justify-between gap-1">
            <h2 className="line-clamp-1 w-full text-lg font-bold text-white">
              {anime.name}
            </h2>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-row gap-2">
              <div className="flex flex-row items-center gap-2">
                <Star className="h-4 w-4 object-contain" />
                <p className="text-base font-bold text-[#FFAD49]">
                  {anime.score}
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Vote animeId={anime.id} session={session} />
            </div>
          </div>
        </div>
      </MotionDiv>
    </>
  );
}

export default AnimeCard;
