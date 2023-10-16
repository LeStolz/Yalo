import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input: { content }, ctx }) => {
      const post = await ctx.db.post.create({
        data: {
          userId: ctx.session.user.id,
          content,
        },
      });

      ctx.revalidateSSG?.(`/users/${ctx.session.user.id}`);

      return post;
    }),

  getInfinite: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      }),
    )
    .query(async ({ input: { limit = 10, cursor }, ctx }) => {
      const posts = await ctx.db.post.findMany({
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              id: true,
              image: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor | undefined;

      if (posts.length > limit) {
        const nextPost = posts.pop();

        if (nextPost != null) {
          nextCursor = {
            id: nextPost.id,
            createdAt: nextPost.createdAt,
          };
        }
      }

      return { posts, nextCursor };
    }),
});
