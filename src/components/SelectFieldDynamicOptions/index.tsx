"use client";

import React from "react";
import {
  useController,
  UseControllerProps,
  useWatch,
  useFormContext,
} from "react-hook-form";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { type FormType } from "@/schema/form";

type SelectFieldProps<T> = UseControllerProps<FormType> & {
  label: string;
  required?: boolean;
  watchedName: string;
  getOptions: (watchedValue: T) => { label: string; value: string }[];
};

export default function SelectFieldDynamicOptions<T>({
  label,
  required,
  getOptions,
  watchedName,
  ...props
}: SelectFieldProps<T>) {
  const { field } = useController(props);
  const { setValue } = useFormContext();

  const watchedValue = useWatch({ name: watchedName });
  const [options, setOptions] = React.useState<
    { label: string; value: string }[]
  >(getOptions(watchedValue));

  React.useEffect(() => {
    setValue(props.name, "");
    setOptions(getOptions(watchedValue));
  }, [watchedValue]);

  return (
    <FormControl fullWidth required={required ? true : false}>
      <InputLabel>{label}</InputLabel>
      <Select {...field} label={label}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
