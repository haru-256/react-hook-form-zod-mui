"use client";

import React from "react";
import { useController, UseControllerProps } from "react-hook-form";
import { TextField as MUITextField } from "@mui/material";
import { type FormType } from "@/schema/form";

export default function TextField({
  label,
  required,
  ...props
}: UseControllerProps<FormType> & {
  label: string;
  required?: boolean;
}) {
  const { field } = useController(props);

  return (
    <MUITextField {...field} label={label} required={required ? true : false} />
  );
}
