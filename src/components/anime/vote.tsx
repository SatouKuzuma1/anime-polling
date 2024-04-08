"use client";
import React from "react";
import { api } from "~/trpc/react";
import { type VoteType } from "@prisma/client";

import { useRouter } from "next/navigation";
import { ThickArrowDownIcon, ThickArrowUpIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Button } from "../ui/button";
import { type Session } from "next-auth";

type VoteProps = {
  animeId: number;
  isFlexRow?: boolean;
  session: Session | null;
};

const Vote = ({ animeId, isFlexRow, session }: VoteProps) => {
  // const { data: sessionData } = useSession();
  const utils = api.useUtils();
  //GET
  // const { data: userId } = api.user.getUserId.useQuery();
  // const { data: anime } = api.anime.getAllAnime.useQuery();

  const router = useRouter();
  const {
    data: votes,
    isLoading: postVoteIsLoading,
    isError: postVoteIsError,
  } = api.vote.getById.useQuery({
    id: animeId,
  });

  const { data: voteByUser } = api.vote.getBySessionUser.useQuery({
    id: animeId,
  });
  const voteByUserType = voteByUser?.voteType;

  // POST
  const createVote = api.vote.create.useMutation({
    async onMutate({ voteType }) {
      await utils.vote.getById.cancel();
      await utils.vote.getBySessionUser.cancel();

      const prevPostVoteData = utils.vote.getById.getData();
      const prevPostVoteByUserData = utils.vote.getBySessionUser.getData();

      utils.vote.getById.setData({ id: animeId }, (old) =>
        old && voteType === "UPVOTE"
          ? { ...old, upvotes: old.upvotes + 1, voteCount: old.voteCount + 1 }
          : old && voteType === "DOWNVOTE"
            ? {
                ...old,
                downvotes: old.downvotes + 1,
                voteCount: old.voteCount - 1,
              }
            : old,
      );
      utils.vote.getBySessionUser.setData({ id: animeId }, (old) =>
        old ? { ...old, voteType: voteType } : old,
      );
      return { prevPostVoteData, prevPostVoteByUserData };
    },
    onError(err, { voteType }, ctx) {
      utils.vote.getById.setData({ id: animeId }, ctx?.prevPostVoteData);
      utils.vote.getBySessionUser.setData(
        { id: animeId },
        ctx?.prevPostVoteByUserData,
      );
    },
    onSettled: async () => {
      await utils.vote.getById.invalidate();
      await utils.vote.getBySessionUser.invalidate();
      router.refresh();
    },
  });

  const updateVote = api.vote.update.useMutation({
    async onMutate({ voteType, updateActionType }) {
      type computeVoteTypes = {
        oldVote: number;
        updateActionType: typeof updateActionType;
        voteType: typeof voteType;
        fieldType: "upvotes" | "downvotes" | "voteCount";
      };

      const computeVote = ({
        oldVote: oldCount,
        updateActionType,
        voteType,
        fieldType,
      }: computeVoteTypes) => {
        if (updateActionType === "removeVote") {
          if (voteType === "UPVOTE") {
            switch (fieldType) {
              case "upvotes":
                return oldCount - 1;
              case "downvotes":
                return oldCount;
              case "voteCount":
                return oldCount - 1;
            }
          } else {
            switch (fieldType) {
              case "upvotes":
                return oldCount;
              case "downvotes":
                return oldCount + 1;
              case "voteCount":
                return oldCount + 1;
            }
          }
          // "changeVote"
        } else {
          if (voteType === "UPVOTE") {
            switch (fieldType) {
              case "upvotes":
                return oldCount + 1;
              case "downvotes":
                return oldCount - 1;
              case "voteCount":
                return oldCount + 2;
              default:
                return oldCount;
            }
          } else {
            switch (fieldType) {
              case "upvotes":
                return oldCount - 1;
              case "downvotes":
                return oldCount + 1;
              case "voteCount":
                return oldCount - 2;
              default:
                return oldCount;
            }
          }
        }
      };

      await utils.vote.getById.cancel();
      await utils.vote.getBySessionUser.cancel();

      const prevPostVoteData = utils.vote.getById.getData();
      const prevPostVoteByUserData = utils.vote.getBySessionUser.getData();

      utils.vote.getById.setData({ id: animeId }, (old) =>
        old
          ? {
              ...old,
              upvotes: computeVote({
                oldVote: old.upvotes,
                updateActionType: updateActionType,
                voteType: voteType,
                fieldType: "upvotes",
              }),
              downvotes: computeVote({
                oldVote: old.downvotes,
                updateActionType: updateActionType,
                voteType: voteType,
                fieldType: "downvotes",
              }),
              voteCount: computeVote({
                oldVote: old.voteCount,
                updateActionType: updateActionType,
                voteType: voteType,
                fieldType: "voteCount",
              }),
            }
          : old,
      );
      utils.vote.getBySessionUser.setData({ id: animeId }, (old) =>
        old ? { ...old, voteType: voteType } : old,
      );

      return { prevPostVoteData, prevPostVoteByUserData };
    },
    onError(err, { voteType }, ctx) {
      utils.vote.getById.setData({ id: animeId }, ctx?.prevPostVoteData);
      utils.vote.getBySessionUser.setData(
        { id: animeId },
        ctx?.prevPostVoteByUserData,
      );
    },
    onSettled: async () => {
      await utils.vote.getById.invalidate();
      await utils.vote.getBySessionUser.invalidate();
      router.refresh();
    },
  });

  const handleVote = (voteType: VoteType) => {
    if (voteByUser) {
      if (voteByUserType === voteType) {
        updateVote.mutate({
          id: animeId,
          voteType: voteType,
          updateActionType: "removeVote",
        });
      } else {
        updateVote.mutate({
          id: animeId,
          voteType: voteType,
          updateActionType: "changeVote",
        });
      }
    } else {
      createVote.mutate({
        voteType: voteType,
        id: animeId,
      });
    }
  };

  //TODO add notification

  return (
    <div>
      <div className={"sm:flex-row$ flex items-center gap-1"}>
        <Button
          variant="link"
          onClick={
            session
              ? () => handleVote("UPVOTE")
              : router.push("/api/auth/signin")
          }
          size="icon"
        >
          <ThickArrowUpIcon
            className={`transition-colors hover:cursor-pointer ${
              voteByUserType === "UPVOTE"
                ? "fill-teal-700"
                : "hover:fill-teal-400/40"
            }`}
          />
        </Button>

        <span
          className={`text-md cursor-default font-bold ${
            voteByUserType === "UPVOTE"
              ? "text-teal-500"
              : voteByUserType === "DOWNVOTE"
                ? "text-rose-500"
                : ""
          }`}
        >
          {postVoteIsLoading || postVoteIsError ? "Vote" : votes?.voteCount}
        </span>
        {/* <Button
          onClick={
            session ? (
              () => handleVote("DOWNVOTE")
            ) : (
              router.push("/api/auth/signin")
            )
          }
          size="icon"
          variant="ghost"
        >
          <ThickArrowDownIcon
            className={` transition-colors hover:cursor-pointer ${
              voteByUserType === "DOWNVOTE"
                ? "fill-rose-500"
                : "hover:fill-rose-400/40"
            }`}
            // stroke={1.5}
          />
        </Button> */}
      </div>
    </div>
  );
};

export default Vote;
