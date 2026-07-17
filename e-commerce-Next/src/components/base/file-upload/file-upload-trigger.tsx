"use client";

import { Slot as SlotPrimitive } from "radix-ui";
import * as React from "react";
import { useAsRef } from "@/hooks/use-as-ref";
import { TRIGGER_NAME } from "./types";
import { useFileUploadContext } from "./context";

interface FileUploadTriggerProps extends React.ComponentProps<"button"> {
  asChild?: boolean;
}

function FileUploadTrigger(props: FileUploadTriggerProps) {
  const { asChild, onClick: onClickProp, ...triggerProps } = props;
  const context = useFileUploadContext(TRIGGER_NAME);
  const propsRef = useAsRef({ onClick: onClickProp });

  const onClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    propsRef.current.onClick?.(event);
    if (event.defaultPrevented) return;
    context.inputRef.current?.click();
  }, [context.inputRef, propsRef]);

  const TriggerPrimitive = asChild ? SlotPrimitive.Slot : "button";

  return (
    <TriggerPrimitive
      type="button"
      aria-controls={context.inputId}
      data-disabled={context.disabled ? "" : undefined}
      data-slot="file-upload-trigger"
      {...triggerProps}
      disabled={context.disabled}
      onClick={onClick}
    />
  );
}

export { FileUploadTrigger };
export type { FileUploadTriggerProps };
