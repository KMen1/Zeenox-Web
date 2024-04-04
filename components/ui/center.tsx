import * as React from "react";

import { cn } from "@/lib/utils";

const Center = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn("flex w-full items-center justify-center", className)}
      style={{ height: "100%" }}
      ref={ref}
      {...props}
    />
  );
});
Center.displayName = "Input";

export { Center };
