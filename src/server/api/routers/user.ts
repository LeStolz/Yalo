import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      if (id === "favicon.ico") {
        return null;
      }

      const currentId = ctx.session?.user.id;

      const user = await ctx.db.user.findUnique({
        where: { id },
        select: {
          name: true,
          image: true,
          _count: {
            select: {
              followers: true,
              follows: true,
              posts: true,
            },
          },
          followers:
            currentId == null ? undefined : { where: { id: currentId } },
        },
      });

      if (user == null) {
        return null;
      }

      return {
        name: user.name,
        image: user.image,
        followersCount: user._count.followers,
        followsCount: user._count.follows,
        postsCount: user._count.posts,
        isFollowing: user.followers?.length > 0,
      };
    }),

  toggleFollow: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const currentId = ctx.session.user.id;
      const existingFollow = await ctx.db.user.findFirst({
        where: {
          id,
          followers: { some: { id: currentId } },
        },
      });

      let followerChange = 0;

      if (existingFollow == null) {
        await ctx.db.user.update({
          where: { id },
          data: {
            followers: { connect: { id: currentId } },
          },
        });

        followerChange = 1;
      } else {
        await ctx.db.user.update({
          where: { id },
          data: {
            followers: { disconnect: { id: currentId } },
          },
        });

        followerChange = -1;
      }

      ctx.revalidateSSG?.(`/users/${id}`);
      ctx.revalidateSSG?.(`/users/${currentId}`);

      return { followerChange };
    }),
});
