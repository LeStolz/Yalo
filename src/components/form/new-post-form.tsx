import { User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "../ui/card";
import { FormEvent, useRef, useState } from "react";
import { api } from "~/utils/api";

export function NewPostForm() {
  const utils = api.useContext();
  const session = useSession();
  const user = session.data?.user;

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const createPost = api.post.create.useMutation({
    onSuccess: async (freshlyNewPost) => {
      updateTextarea("");

      if (user == null) {
        return;
      }

      utils.post.getInfinite.setInfiniteData({}, (oldData) => {
        if (oldData == null || oldData.pages[0] == null) return;

        const newPost = {
          ...freshlyNewPost,
          user: {
            id: user.id,
            name: user.name || null,
            image: user.image || null,
          },
        };

        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              posts: [newPost, ...oldData.pages[0].posts],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
    },
  });

  function updateTextarea(text: string) {
    const textArea = textAreaRef.current;

    if (textArea == null) return;

    setText(text);
    textArea.style.height = "0";
    textArea.style.height = `${textArea.scrollHeight}px`;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = Object.fromEntries(new FormData(event.currentTarget));

    createPost.mutate({ content: formData.content as string });
  }

  if (user == null) {
    return <></>;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <Avatar>
              <AvatarImage src={user?.image || ""} />
              <AvatarFallback>
                <User2 />
              </AvatarFallback>
            </Avatar>
            <Textarea
              name="content"
              ref={textAreaRef}
              onChange={(event) => updateTextarea(event.target.value)}
              value={text}
              className="h-10 flex-grow resize-none overflow-hidden border-0 p-1.5 text-lg outline-none"
              placeholder="What's new?"
            />
          </div>
          <Button>Post</Button>
        </form>
      </CardContent>
    </Card>
  );
}
