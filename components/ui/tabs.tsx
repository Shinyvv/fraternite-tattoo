"use client";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;
const TabsContent = TabsPrimitive.Content;
const TabsList = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) => <TabsPrimitive.List className={cn("inline-flex rounded-md bg-[#121212] p-1", className)} {...props} />;
const TabsTrigger = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) => <TabsPrimitive.Trigger className={cn("rounded-sm px-3 py-1.5 text-sm data-[state=active]:bg-[#262626]", className)} {...props} />;

export { Tabs, TabsList, TabsTrigger, TabsContent };

