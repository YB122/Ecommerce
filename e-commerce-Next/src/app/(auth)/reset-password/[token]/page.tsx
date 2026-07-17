import { Suspense } from "react";
import { ResetPasswordPageContent } from "./content";

export default function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return (
    <Suspense>
      <ResetPasswordPageContent params={params} />
    </Suspense>
  );
}
