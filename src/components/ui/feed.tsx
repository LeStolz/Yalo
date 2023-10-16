import InfiniteScroll from "react-infinite-scroll-component";
import { Loading } from "./loading";
import { Card, CardContent, CardHeader } from "./card";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { User2 } from "lucide-react";

type Post = {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    image: string | null;
    name: string | null;
  };
};

type FeedProps = {
  posts?: Post[];
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => Promise<unknown>;
};

export function Feed({
  posts,
  isLoading,
  isError,
  hasNextPage,
  fetchNextPage,
}: FeedProps) {
  if (isLoading) {
    return <Loading full className="h-16 w-16" />;
  }

  if (isError) {
    return <h1>Failed to load posts. Please try again later.</h1>;
  }

  if (posts == null || posts.length === 0) {
    return (
      <h1 className="my-4 text-center text-xl text-gray-500">No posts.</h1>
    );
  }

  const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
  });

  return (
    <InfiniteScroll
      className="flex-grow"
      dataLength={posts.length}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={<Loading full className="h-16 w-16" />}
    >
      {posts.map((post) => (
        <Card key={post.id} className="mt-6">
          <CardHeader className="pb-4">
            <Link
              href={`/users/${post.user.id}`}
              className="flex items-center gap-2"
            >
              <Avatar>
                <AvatarImage src={post.user.image || ""} />
                <AvatarFallback>
                  <User2 />
                </AvatarFallback>
              </Avatar>
              <span className="text-lg font-bold">{post.user.name}</span>
              <span className="text-gray-500">
                · {dateTimeFormatter.format(post.createdAt)}
              </span>
            </Link>
          </CardHeader>
          <CardContent className="whitespace-pre-wrap text-lg">
            {post.content}
          </CardContent>
        </Card>
      ))}
    </InfiniteScroll>
  );
}
