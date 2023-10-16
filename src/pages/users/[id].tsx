import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Head from "next/head";
import ErrorPage from "next/error";
import { ssgHelper } from "~/server/api/ssgHelper";
import { api } from "~/utils/api";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { User2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useSession } from "next-auth/react";

const User: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  id,
}) => {
  const utils = api.useContext();
  const session = useSession();
  const { data: user } = api.user.get.useQuery({ id });
  const toggleFollow = api.user.toggleFollow.useMutation({
    onSuccess: ({ followerChange }) => {
      utils.user.get.setData({ id }, (oldData) => {
        if (oldData == null) {
          return;
        }

        return {
          ...oldData,
          isFollowing: followerChange > 0,
          followersCount: oldData.followersCount + followerChange,
        };
      });
    },
  });

  if (user == null) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>{`Yalo - ${user.name}`}</title>
      </Head>
      <div className="my-8 flex flex-grow flex-col">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.image || ""} />
                <AvatarFallback>
                  <User2 />
                </AvatarFallback>
              </Avatar>
              <span className="text-lg font-bold">{user.name}</span>
            </div>
            <div>
              {session.status !== "authenticated" ||
              session.data.user.id === id ? null : (
                <Button
                  disabled={toggleFollow.isLoading}
                  variant={user.isFollowing ? "destructive" : "default"}
                  onClick={() => toggleFollow.mutate({ id: id })}
                >
                  {user.isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p>
              <b>Followers:</b> {user.followersCount}
            </p>
            <p>
              <b>Follows:</b> {user.followsCount}
            </p>
            <p>
              <b>Posts:</b> {user.postsCount}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps(
  ctx: GetStaticPropsContext<{ id: string }>,
) {
  const id = ctx.params?.id;

  if (id == null) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const ssg = ssgHelper();
  await ssg.user.get.prefetch({ id });

  return {
    props: {
      id,
      trpcState: ssg.dehydrate(),
    },
  };
}

export default User;
