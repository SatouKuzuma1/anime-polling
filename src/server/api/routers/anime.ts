import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const animeRouter = createTRPCRouter({
  // GET
  getAllAnime: publicProcedure
    .input(z.object({ take: z.number(), skip: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const animes = await ctx.db.anime.findMany({
          take: input.take,
          where: {
            votes: {
              some: {
                voteType: "UPVOTE",
              },
            },
          },
          orderBy: {
            votes: {
              _count: "desc",
            },
          },
          select: {
            votes: true,
            name: true,
            id: true,
            image: true,
            score: true,
          },
        });
        const total = await ctx.db.anime.count({
          where: {
            votes: {
              some: {
                voteType: "UPVOTE",
              },
            },
          },
        });
        const hasMore = input.skip + input.take < total;
        const totalPages = Math.ceil(total / input.take);
        const metadata = { hasMore, totalPages };
        return { animes, metadata };
      } catch (e) {
        console.log(e);
      }
    }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.anime.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  // POST
  add: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        image: z.string(),
        score: z.string(),
        episodes: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const animeAlredyIn = !!(await ctx.db.anime.findFirst({
          where: {
            id: input.id,
          },
        }));
        if (animeAlredyIn) return;
      } catch (e) {
        console.log(e);
      }

      return await ctx.db.anime.create({
        data: {
          id: input.id,
          name: input.name,
          image: input.image,
          episodes: input.episodes,
          score: input.score,
        },
      });
    }),
});
