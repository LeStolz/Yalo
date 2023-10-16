import { cn } from "~/utils/utils";
import { Loader2Icon } from "lucide-react";

type LoadingProps = {
  className?: string;
  full?: boolean;
  screen?: boolean;
};

export function Loading({ className, full, screen }: LoadingProps) {
  return (
    <>
      {full ? (
        <div className="flex h-full w-full items-center justify-center">
          <Loader2Icon className={cn("animate-spin", className)}></Loader2Icon>
        </div>
      ) : screen ? (
        <div className="min-w-screen flex min-h-screen items-center justify-center">
          <Loader2Icon className={cn("animate-spin", className)}></Loader2Icon>
        </div>
      ) : (
        <Loader2Icon className={cn("animate-spin", className)}></Loader2Icon>
      )}
      <span className="sr-only">Loading</span>
    </>
  );
}
