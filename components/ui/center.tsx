import * as React from "react";

import { cn } from "@/lib/utils";

export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  height: number;
}

const Center = React.forwardRef<HTMLDivElement, CenterProps>(
  ({ className, height, ...props }, ref) => {
    return (
      <div
        className={cn("flex justify-center items-center w-full", className)}
        style={{ height }}
        ref={ref}
        {...props}
      />
    );
  }
);
Center.displayName = "Input";

export { Center };
