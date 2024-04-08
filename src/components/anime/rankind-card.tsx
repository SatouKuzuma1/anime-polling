"use clietn";

import React from "react";
import { type AnimeCardProps } from "~/types";
import { Star, Play } from "lucide-react";
import Image from "next/image";
import Vote from "./vote";

import { MotionDiv } from "./motion-div";

const RankingCard = ({ anime, session, index }: AnimeCardProps) => {
  const stagger = 0.25;

  const variants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };

  return (
    <>
      <MotionDiv
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{
          delay: stagger * index,
          ease: "easeInOut",
          duration: 0.5,
        }}
        viewport={{ amount: 0 }}
        className=" relative ml-4 h-full w-full max-w-sm rounded p-4  shadow-xl"
      >
        <div className="relative h-[37vh] w-full  sm:justify-center ">
          {anime.image && (
            <div className="h-12 w-full cursor-pointer">
              <Image
                src={anime.image}
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
                <Play className="badge-secondary h-4 w-4" />
                <p className="text-base font-bold text-white">{index + 1}</p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <Star className="h-4 w-4 object-contain" />
                <p className="text-base font-bold text-[#3a8a4e]">
                  {anime.score}
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Vote animeId={anime.id} session={session} />
              Votes
            </div>
          </div>
        </div>
      </MotionDiv>
    </>
  );
};

export default RankingCard;
