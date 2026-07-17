import { Skeleton } from "@/components/base/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="h-full overflow-hidden rounded-lg border">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-5 w-1/3" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="p-4">
        <Skeleton className="h-5 w-1/2" />
      </div>
    </div>
  );
}

export function CategoryGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function SubcategoryCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Skeleton className="aspect-video w-full" />
      <div className="p-4">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="mt-2 h-3 w-1/3" />
      </div>
    </div>
  );
}

export function SubcategoryGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SubcategoryCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="size-16 rounded" />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-6 w-1/3" />
        <div className="flex gap-3">
          <Skeleton className="h-11 flex-1 rounded-md" />
          <Skeleton className="size-11 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <Skeleton className="size-20 shrink-0 rounded-md" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="size-8 rounded-md" />
        <Skeleton className="h-4 w-6" />
        <Skeleton className="size-8 rounded-md" />
      </div>
      <Skeleton className="h-5 w-16" />
      <Skeleton className="size-9 shrink-0 rounded-md" />
    </div>
  );
}

export function CartSkeleton() {
  return (
    <section className="py-32 container mx-auto">
      <div className="container max-w-2xl">
        <Skeleton className="mb-8 h-8 w-24" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CartItemSkeleton key={i} />
          ))}
        </div>
        <Skeleton className="my-6 h-px w-full" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
          <Skeleton className="h-11 w-full rounded-md" />
        </div>
      </div>
    </section>
  );
}

export function WishlistSkeleton() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-10 w-40 rounded-md" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border">
              <Skeleton className="aspect-square w-full rounded-none" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HeroSkeleton() {
  return (
    <div className="space-y-4 text-center">
      <Skeleton className="mx-auto h-10 w-2/3 max-w-md" />
      <Skeleton className="mx-auto h-5 w-1/2 max-w-sm" />
      <Skeleton className="mx-auto mt-8 h-11 w-40 rounded-md" />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 py-8">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <Skeleton className="size-32 shrink-0 rounded-full sm:size-40" />
        <div className="flex flex-1 flex-col items-center gap-3 text-center sm:items-start sm:text-left">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-52" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <div className="mb-5 flex items-center gap-2">
            <Skeleton className="size-4 rounded" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-lg border p-6">
            <div className="mb-5 flex items-center gap-2">
              <Skeleton className="size-4 rounded" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-4 rounded" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-5 w-10 rounded-full" />
                </div>
              ))}
            </div>
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function AuthFormSkeleton() {
  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-md border border-muted bg-background px-6 py-8 shadow-md">
          <Skeleton className="mx-auto mb-6 h-6 w-32" />
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <Skeleton className="mx-auto my-6 h-px w-full" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <Skeleton className="mx-auto mt-4 h-4 w-48" />
      </div>
    </section>
  );
}
