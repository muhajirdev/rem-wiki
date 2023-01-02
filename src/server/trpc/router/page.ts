import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const pageRouter = router({
  getPage: publicProcedure
    .input(z.object({ id: z.string() }).nullish())
    .query(({ ctx, input }) => {
      return ctx.prisma.page.findFirst({
        where: {
          nodeId: input.id,
        },
      });
    }),
});
