import { Skeleton } from "@/components/base/skeleton";

interface LoadingProps {
  className?: string;
  text?: string;
}

export function Loading({ className, text }: LoadingProps) {
  return (
    <div className="space-y-4 py-32">
      {text === "hero" ? (
        <div className="space-y-4 text-center">
          <Skeleton className="mx-auto h-10 w-2/3 max-w-md" />
          <Skeleton className="mx-auto h-5 w-1/2 max-w-sm" />
          <Skeleton className="mx-auto mt-8 h-11 w-40 rounded-md" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          {text && <p className="text-sm text-muted-foreground">{text}</p>}
        </div>
      )}
    </div>
  );
}

export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-6xl space-y-8">
        <div className="space-y-4 text-center">
          <Skeleton className="mx-auto h-10 w-2/3 max-w-md" />
          <Skeleton className="mx-auto h-5 w-1/2 max-w-sm" />
          <Skeleton className="mx-auto mt-8 h-11 w-40 rounded-md" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border">
              <Skeleton className="aspect-square w-full rounded-none" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-5 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
