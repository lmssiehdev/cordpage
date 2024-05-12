import { cn } from "@/lib/utils";
import React from "react";

interface LinkProps extends React.LinkHTMLAttributes<HTMLAnchorElement> {}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ children, className, ...props }, ref) => {
    return (
        <a
          className={cn(
            "hover:bg-gray-700/10 cursor-pointer flex justify-between items-center p-2 border-[rgba(78,80,88,0.48)] border rounded shadow",
            className
          )}
          {...props}
          ref={ref}
        >
          {children}
          <svg
            className="size-4 rotate-[45deg]"
            aria-hidden="true"
            role="img"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <polygon
              fill="currentColor"
              fillRule="nonzero"
              points="13 20 11 20 11 8 5.5 13.5 4.08 12.08 12 4.16 19.92 12.08 18.5 13.5 13 8"
            ></polygon>
          </svg>
        </a>
    );
  }
);
