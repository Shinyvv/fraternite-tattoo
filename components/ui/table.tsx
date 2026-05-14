import { cn } from "@/lib/utils";
export const Table = ({ className, ...props }: React.ComponentProps<"table">) => <table className={cn("w-full text-sm", className)} {...props} />;
export const TableHeader = (props: React.ComponentProps<"thead">) => <thead {...props} />;
export const TableBody = (props: React.ComponentProps<"tbody">) => <tbody {...props} />;
export const TableRow = ({ className, ...props }: React.ComponentProps<"tr">) => <tr className={cn("border-b border-[#252525]", className)} {...props} />;
export const TableHead = ({ className, ...props }: React.ComponentProps<"th">) => <th className={cn("px-3 py-2 text-left text-xs uppercase tracking-wider text-[#999]", className)} {...props} />;
export const TableCell = ({ className, ...props }: React.ComponentProps<"td">) => <td className={cn("px-3 py-3", className)} {...props} />;

