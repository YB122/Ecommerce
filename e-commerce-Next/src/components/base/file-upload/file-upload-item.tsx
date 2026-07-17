"use client";

import { Slot as SlotPrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "@/lib/utils";
import { ITEM_NAME, type FileState, type FileUploadItemContextValue, type FileUploadItemProps } from "./types";
import { useFileUploadContext } from "./context";
import { useStore } from "./store";

const FileUploadItemContext = React.createContext<FileUploadItemContextValue | null>(null);

function useFileUploadItemContext(consumerName: string) {
  const context = React.useContext(FileUploadItemContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ITEM_NAME}\``);
  }
  return context;
}

function FileUploadItem(props: FileUploadItemProps) {
  const { value, asChild, className, ...itemProps } = props;
  const id = React.useId();
  const statusId = `${id}-status`;
  const nameId = `${id}-name`;
  const sizeId = `${id}-size`;
  const messageId = `${id}-message`;

  const context = useFileUploadContext(ITEM_NAME);
  const fileState = useStore((state) => state.files.get(value));
  const fileCount = useStore((state) => state.files.size);
  const fileIndex = useStore((state) => {
    const files = Array.from(state.files.keys());
    return files.indexOf(value) + 1;
  });

  const itemContext = React.useMemo(
    () => ({ id, fileState, nameId, sizeId, statusId, messageId }),
    [id, fileState, statusId, nameId, sizeId, messageId],
  );

  if (!fileState) return null;

  const statusText = fileState.error
    ? `Error: ${fileState.error}`
    : fileState.status === "uploading"
      ? `Uploading: ${fileState.progress}% complete`
      : fileState.status === "success"
        ? "Upload complete"
        : "Ready to upload";

  const ItemPrimitive = asChild ? SlotPrimitive.Slot : "div";

  return (
    <FileUploadItemContext.Provider value={itemContext}>
      <ItemPrimitive
        role="listitem"
        id={id}
        aria-setsize={fileCount}
        aria-posinset={fileIndex}
        aria-describedby={`${nameId} ${sizeId} ${statusId} ${fileState.error ? messageId : ""}`}
        aria-labelledby={nameId}
        data-slot="file-upload-item"
        dir={context.dir}
        {...itemProps}
        className={cn("relative flex items-center gap-2.5 rounded-md border p-3", className)}
      >
        {props.children}
        <span id={statusId} className="sr-only">{statusText}</span>
      </ItemPrimitive>
    </FileUploadItemContext.Provider>
  );
}

export { FileUploadItem, FileUploadItemContext, useFileUploadItemContext };
export type { FileUploadItemProps };
