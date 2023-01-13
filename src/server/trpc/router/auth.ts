import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { nanoid } from "nanoid";

export const authRouter = router({
  getUsernameAndApiKey: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const user = await ctx.prisma.user.findUnique({
      include: {
        apiKeys: true,
      },
      where: { id: userId },
    });
    const apiKey = user.apiKeys?.[0]?.key;
    return { username: user.username, apiKey };
  }),
  updateUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      await ctx.prisma.user.update({
        where: { id: userId },
        data: {
          username: input.username,
          apiKeys: {
            create: {
              key: nanoid(36),
            },
          },
        },
      });

      return { message: "success" };
    }),
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
