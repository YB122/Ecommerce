"use client";

import { Slot as SlotPrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "@/lib/utils";
import { ITEM_METADATA_NAME } from "./types";
import { useFileUploadContext } from "./context";
import { useFileUploadItemContext } from "./file-upload-item";
import { formatBytes } from "./utils";

interface FileUploadItemMetadataProps extends React.ComponentProps<"div"> {
  asChild?: boolean;
  size?: "default" | "sm";
}

function FileUploadItemMetadata(props: FileUploadItemMetadataProps) {
  const { asChild, size = "default", children, className, ...metadataProps } = props;
  const context = useFileUploadContext(ITEM_METADATA_NAME);
  const itemContext = useFileUploadItemContext(ITEM_METADATA_NAME);

  if (!itemContext.fileState) return null;

  const ItemMetadataPrimitive = asChild ? SlotPrimitive.Slot : "div";

  return (
    <ItemMetadataPrimitive
      data-slot="file-upload-metadata"
      dir={context.dir}
      {...metadataProps}
      className={cn("flex min-w-0 flex-1 flex-col", className)}
    >
      {children ?? (
        <>
          <span id={itemContext.nameId} className={cn("truncate font-medium text-sm", size === "sm" && "font-normal text-[13px] leading-snug")}>
            {itemContext.fileState.file.name}
          </span>
          <span id={itemContext.sizeId} className={cn("truncate text-muted-foreground text-xs", size === "sm" && "text-[11px] leading-snug")}>
            {formatBytes(itemContext.fileState.file.size)}
          </span>
          {itemContext.fileState.error && (
            <span id={itemContext.messageId} className="text-destructive text-xs">
              {itemContext.fileState.error}
            </span>
          )}
        </>
      )}
    </ItemMetadataPrimitive>
  );
}

export { FileUploadItemMetadata };
export type { FileUploadItemMetadataProps };
