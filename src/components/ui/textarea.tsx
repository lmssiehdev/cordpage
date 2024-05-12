import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const textAreaVariants = cva(
  "flex min-h-[80px] w-full border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "rounded-md border bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ",
        discord: "bg-[--input-background] text-[--text-normal] rounded-sm",
      },
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textAreaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ variant = "default", className, ...props }, ref) => {
    return (
      <textarea
        className={cn(textAreaVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
