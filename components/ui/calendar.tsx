"use client";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

export function Calendar(props: React.ComponentProps<typeof DayPicker>) {
  return <DayPicker className="rounded-lg bg-[#0d0d0d] p-3" {...props} />;
}

