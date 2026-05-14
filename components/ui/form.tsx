"use client";
import * as React from "react";
import { Controller, FormProvider, useFormContext, type ControllerProps, type FieldPath, type FieldValues } from "react-hook-form";

const Form = FormProvider;
const FormField = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(props: ControllerProps<TFieldValues, TName>) => <Controller {...props} />;
const FormItem = ({ children, className = "space-y-2" }: React.PropsWithChildren<{ className?: string }>) => <div className={className}>{children}</div>;
const FormLabel = ({ children }: React.PropsWithChildren) => <label className="text-sm font-medium">{children}</label>;
const FormControl = ({ children }: React.PropsWithChildren) => <div>{children}</div>;
const FormMessage = ({ name }: { name: string }) => {
  const { formState: { errors } } = useFormContext();
  const message = (errors as Record<string, { message?: string }>)[name]?.message;
  if (!message) return null;
  return <p className="text-xs text-[#ff5a00]">{message}</p>;
};

export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage };

