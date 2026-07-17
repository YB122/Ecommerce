"use client";

import * as React from "react";

const ROOT_NAME = "FileUpload";
const DROPZONE_NAME = "FileUploadDropzone";
const TRIGGER_NAME = "FileUploadTrigger";
const LIST_NAME = "FileUploadList";
const ITEM_NAME = "FileUploadItem";
const ITEM_PREVIEW_NAME = "FileUploadItemPreview";
const ITEM_METADATA_NAME = "FileUploadItemMetadata";
const ITEM_PROGRESS_NAME = "FileUploadItemProgress";
const ITEM_DELETE_NAME = "FileUploadItemDelete";
const CLEAR_NAME = "FileUploadClear";

type Direction = "ltr" | "rtl";

interface FileState {
  file: File;
  progress: number;
  error?: string;
  status: "idle" | "uploading" | "error" | "success";
}

interface StoreState {
  files: Map<File, FileState>;
  dragOver: boolean;
  invalid: boolean;
}

type StoreAction =
  | { type: "ADD_FILES"; files: File[] }
  | { type: "SET_FILES"; files: File[] }
  | { type: "SET_PROGRESS"; file: File; progress: number }
  | { type: "SET_SUCCESS"; file: File }
  | { type: "SET_ERROR"; file: File; error: string }
  | { type: "REMOVE_FILE"; file: File }
  | { type: "SET_DRAG_OVER"; dragOver: boolean }
  | { type: "SET_INVALID"; invalid: boolean }
  | { type: "CLEAR" };

type Store = {
  getState: () => StoreState;
  dispatch: (action: StoreAction) => void;
  subscribe: (listener: () => void) => () => void;
};

interface FileUploadContextValue {
  inputId: string;
  dropzoneId: string;
  listId: string;
  labelId: string;
  disabled: boolean;
  dir: Direction;
  inputRef: React.RefObject<HTMLInputElement | null>;
  urlCache: WeakMap<File, string>;
}

interface FileUploadItemContextValue {
  id: string;
  fileState: FileState | undefined;
  nameId: string;
  sizeId: string;
  statusId: string;
  messageId: string;
}

interface FileUploadProps
  extends Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> {
  value?: File[];
  defaultValue?: File[];
  onValueChange?: (files: File[]) => void;
  onAccept?: (files: File[]) => void;
  onFileAccept?: (file: File) => void;
  onFileReject?: (file: File, message: string) => void;
  onFileValidate?: (file: File) => string | null | undefined;
  onUpload?: (
    files: File[],
    options: {
      onProgress: (file: File, progress: number) => void;
      onSuccess: (file: File) => void;
      onError: (file: File, error: Error) => void;
    },
  ) => Promise<void> | void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
  dir?: Direction;
  label?: string;
  name?: string;
  asChild?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  multiple?: boolean;
  required?: boolean;
}

interface FileUploadDropzoneProps extends React.ComponentProps<"div"> {
  asChild?: boolean;
}

interface FileUploadTriggerProps extends React.ComponentProps<"button"> {
  asChild?: boolean;
}

interface FileUploadListProps extends React.ComponentProps<"div"> {
  orientation?: "horizontal" | "vertical";
  asChild?: boolean;
  forceMount?: boolean;
}

interface FileUploadItemProps extends React.ComponentProps<"div"> {
  value: File;
  asChild?: boolean;
}

interface FileUploadItemPreviewProps extends React.ComponentProps<"div"> {
  render?: (file: File, fallback: () => React.ReactNode) => React.ReactNode;
  asChild?: boolean;
}

interface FileUploadItemMetadataProps extends React.ComponentProps<"div"> {
  asChild?: boolean;
  size?: "default" | "sm";
}

interface FileUploadItemProgressProps extends React.ComponentProps<"div"> {
  variant?: "linear" | "circular" | "fill";
  size?: number;
  asChild?: boolean;
  forceMount?: boolean;
}

interface FileUploadItemDeleteProps extends React.ComponentProps<"button"> {
  asChild?: boolean;
}

interface FileUploadClearProps extends React.ComponentProps<"button"> {
  forceMount?: boolean;
  asChild?: boolean;
}

export {
  ROOT_NAME,
  DROPZONE_NAME,
  TRIGGER_NAME,
  LIST_NAME,
  ITEM_NAME,
  ITEM_PREVIEW_NAME,
  ITEM_METADATA_NAME,
  ITEM_PROGRESS_NAME,
  ITEM_DELETE_NAME,
  CLEAR_NAME,
};

export type {
  Direction,
  FileState,
  StoreState,
  StoreAction,
  Store,
  FileUploadContextValue,
  FileUploadItemContextValue,
  FileUploadProps,
  FileUploadDropzoneProps,
  FileUploadTriggerProps,
  FileUploadListProps,
  FileUploadItemProps,
  FileUploadItemPreviewProps,
  FileUploadItemMetadataProps,
  FileUploadItemProgressProps,
  FileUploadItemDeleteProps,
  FileUploadClearProps,
};
