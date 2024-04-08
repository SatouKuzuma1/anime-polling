import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  //POST

  // GET
  getUserId: publicProcedure.query(({ ctx }) => {
    return ctx.session?.user?.id;
  }),
  getInfo: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });
  }),
  getAllUsers: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany();
  }),
});
