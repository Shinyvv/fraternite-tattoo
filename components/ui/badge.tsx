import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("inline-flex items-center rounded-full border border-[#4a4a4a] px-2 py-1 text-xs font-semibold uppercase tracking-wider", className)} {...props} />;
}

export { Badge };

