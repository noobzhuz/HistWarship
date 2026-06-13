import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-full border border-slate-300 bg-white px-5 text-base text-slate-950 outline-none placeholder:text-slate-500 focus:border-sky-700 focus:ring-2 focus:ring-sky-200",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
