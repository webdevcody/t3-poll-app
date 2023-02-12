import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const pollRouter = createTRPCRouter({
  getPoll: publicProcedure
    .input(
      z.object({
        pollId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.poll.findUnique({
        where: {
          id: input.pollId,
        },
        include: {
          answers: {
            include: {
              _count: {
                select: { responses: true },
              },
            },
          },
        },
      });
    }),
  submitResponse: publicProcedure
    .input(
      z.object({
        answerId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.response.create({
        data: {
          answerId: input.answerId,
        },
      });
    }),
});
