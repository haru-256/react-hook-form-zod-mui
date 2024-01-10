'use client';

import React from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { type FormType } from '@/schema/form';

type SelectFieldProps = UseControllerProps<FormType> & {
  label: string;
  options: { label: string; value: string }[];
  required?: boolean;
};

export default function SelectField({
  label,
  required,
  options,
  ...props
}: SelectFieldProps) {
  const { field } = useController(props);

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
