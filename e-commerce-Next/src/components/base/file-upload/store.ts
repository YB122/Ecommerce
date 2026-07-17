"use client";

import * as React from "react";
import { useLazyRef } from "@/hooks/use-lazy-ref";
import {
  ROOT_NAME,
  type FileState,
  type Store,
  type StoreAction,
  type StoreState,
} from "./types";

const StoreContext = React.createContext<Store | null>(null);

function useStoreContext(consumerName: string) {
  const context = React.useContext(StoreContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ROOT_NAME}\``);
  }
  return context;
}

function useStore<T>(selector: (state: StoreState) => T): T {
  const store = useStoreContext("useStore");

  const lastValueRef = useLazyRef<{ value: T; state: StoreState } | null>(
    () => null,
  );

  const getSnapshot = React.useCallback(() => {
    const state = store.getState();
    const prevValue = lastValueRef.current;

    if (prevValue && prevValue.state === state) {
      return prevValue.value;
    }

    const nextValue = selector(state);
    lastValueRef.current = { value: nextValue, state };
    return nextValue;
  }, [store, selector, lastValueRef]);

  return React.useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}

function createStore(
  files: Map<File, FileState>,
  initialInvalid: boolean,
  propsRef: React.MutableRefObject<{
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
  }>,
  urlCache: WeakMap<File, string>,
  listeners: Set<() => void>,
): Store {
  let state: StoreState = {
    files,
    dragOver: false,
    invalid: initialInvalid,
  };

  function reducer(state: StoreState, action: StoreAction): StoreState {
    switch (action.type) {
      case "ADD_FILES": {
        for (const file of action.files) {
          files.set(file, { file, progress: 0, status: "idle" });
        }
        if (propsRef.current.onValueChange) {
          const fileList = Array.from(files.values()).map((fs) => fs.file);
          propsRef.current.onValueChange(fileList);
        }
        return { ...state, files };
      }
      case "SET_FILES": {
        const newFileSet = new Set(action.files);
        for (const existingFile of files.keys()) {
          if (!newFileSet.has(existingFile)) files.delete(existingFile);
        }
        for (const file of action.files) {
          const existingState = files.get(file);
          if (!existingState) {
            files.set(file, { file, progress: 0, status: "idle" });
          }
        }
        return { ...state, files };
      }
      case "SET_PROGRESS": {
        const fileState = files.get(action.file);
        if (fileState) {
          files.set(action.file, { ...fileState, progress: action.progress, status: "uploading" });
        }
        return { ...state, files };
      }
      case "SET_SUCCESS": {
        const fileState = files.get(action.file);
        if (fileState) {
          files.set(action.file, { ...fileState, progress: 100, status: "success" });
        }
        return { ...state, files };
      }
      case "SET_ERROR": {
        const fileState = files.get(action.file);
        if (fileState) {
          files.set(action.file, { ...fileState, error: action.error, status: "error" });
        }
        return { ...state, files };
      }
      case "REMOVE_FILE": {
        const cachedUrl = urlCache.get(action.file);
        if (cachedUrl) { URL.revokeObjectURL(cachedUrl); urlCache.delete(action.file); }
        files.delete(action.file);
        if (propsRef.current.onValueChange) {
          const fileList = Array.from(files.values()).map((fs) => fs.file);
          propsRef.current.onValueChange(fileList);
        }
        return { ...state, files };
      }
      case "SET_DRAG_OVER": {
        return { ...state, dragOver: action.dragOver };
      }
      case "SET_INVALID": {
        return { ...state, invalid: action.invalid };
      }
      case "CLEAR": {
        for (const file of files.keys()) {
          const cachedUrl = urlCache.get(file);
          if (cachedUrl) { URL.revokeObjectURL(cachedUrl); urlCache.delete(file); }
        }
        files.clear();
        if (propsRef.current.onValueChange) propsRef.current.onValueChange([]);
        return { ...state, files, invalid: false };
      }
      default:
        return state;
    }
  }

  return {
    getState: () => state,
    dispatch: (action) => {
      state = reducer(state, action);
      for (const listener of listeners) listener();
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export { StoreContext, useStoreContext, useStore, createStore };
