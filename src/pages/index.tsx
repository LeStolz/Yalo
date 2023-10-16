import { NewPostForm } from "~/components/form/new-post-form";
import { Feed } from "~/components/ui/feed";
import { api } from "~/utils/api";

export default function Home() {
  const posts = api.post.getInfinite.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  return (
    <div className="my-8 flex flex-grow flex-col">
      <NewPostForm />
      <Feed
        posts={posts.data?.pages.flatMap((page) => page.posts)}
        isError={posts.isError}
        isLoading={posts.isLoading}
        hasNextPage={posts.hasNextPage || false}
        fetchNextPage={posts.fetchNextPage}
      />
    </div>
  );
}
