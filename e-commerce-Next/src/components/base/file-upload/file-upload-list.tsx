"use client";

import { Slot as SlotPrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "@/lib/utils";
import { LIST_NAME } from "./types";
import { useFileUploadContext } from "./context";
import { useStore } from "./store";

interface FileUploadListProps extends React.ComponentProps<"div"> {
  orientation?: "horizontal" | "vertical";
  asChild?: boolean;
  forceMount?: boolean;
}

function FileUploadList(props: FileUploadListProps) {
  const { className, orientation = "vertical", asChild, forceMount, ...listProps } = props;
  const context = useFileUploadContext(LIST_NAME);
  const fileCount = useStore((state) => state.files.size);
  const shouldRender = forceMount || fileCount > 0;
  if (!shouldRender) return null;

  const ListPrimitive = asChild ? SlotPrimitive.Slot : "div";

  return (
    <ListPrimitive
      role="list"
      id={context.listId}
      aria-orientation={orientation}
      data-orientation={orientation}
      data-slot="file-upload-list"
      data-state={shouldRender ? "active" : "inactive"}
      dir={context.dir}
      {...listProps}
      className={cn(
        "data-[state=inactive]:fade-out-0 data-[state=active]:fade-in-0 data-[state=inactive]:slide-out-to-top-2 data-[state=active]:slide-in-from-top-2 flex flex-col gap-2 data-[state=active]:animate-in data-[state=inactive]:animate-out",
        orientation === "horizontal" && "flex-row overflow-x-auto p-1.5",
        className,
      )}
    />
  );
}

export { FileUploadList };
export type { FileUploadListProps };
