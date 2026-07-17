"use client";

import * as React from "react";
import { ROOT_NAME, type FileUploadContextValue } from "./types";

const FileUploadContext = React.createContext<FileUploadContextValue | null>(null);

function useFileUploadContext(consumerName: string) {
  const context = React.useContext(FileUploadContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ROOT_NAME}\``);
  }
  return context;
}

export { FileUploadContext, useFileUploadContext };
