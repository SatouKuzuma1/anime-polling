import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { VoteType } from "@prisma/client";

export const voteRouter = createTRPCRouter({
  getById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const upvotes = await ctx.db.animeVote.count({
        where: { animeId: input.id, voteType: "UPVOTE" },
      });

      const downvotes = await ctx.db.animeVote.count({
        where: { animeId: input.id, voteType: "DOWNVOTE" },
      });

      return { upvotes, downvotes, voteCount: upvotes - downvotes };
    }),
  getBySessionUser: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const animeVoteData = {
        animeId: input.id,
        userId: ctx.session.user.id,
      };

      return await ctx.db.animeVote.findUnique({
        where: {
          animeId_userId: animeVoteData,
        },
        select: {
          voteType: true,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        voteType: z.nativeEnum(VoteType),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.animeVote.create({
          data: {
            animeId: input.id,
            userId: ctx.session.user.id,
            voteType: input.voteType,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number().min(1),
        voteType: z.nativeEnum(VoteType),
        updateActionType: z.enum(["removeVote", "changeVote"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const animeVoteData = {
        animeId: input.id,
        userId: ctx.session.user.id,
      };

      try {
        if (input.updateActionType === "removeVote") {
          await ctx.db.animeVote.delete({
            where: {
              animeId_userId: animeVoteData,
            },
          });
        } else if (input.updateActionType === "changeVote") {
          await ctx.db.animeVote.delete({
            where: { animeId_userId: animeVoteData },
          });
          return await ctx.db.animeVote.create({
            data: {
              animeId: input.id,
              userId: ctx.session.user.id,
              voteType: input.voteType,
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    }),
});
