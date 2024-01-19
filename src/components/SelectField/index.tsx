'use client';

import React from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  FormHelperText,
} from '@mui/material';
import { type FormType } from '@/schema/form';

type SelectFieldProps = UseControllerProps<FormType> & {
  label: string;
  options: { label: string; value: string }[];
  required?: boolean;
  initValue?: boolean;
  errorMessage?: string;
  onChangePre?: (e: SelectChangeEvent<string>) => void;
};

export default function SelectField({
  label,
  required,
  options,
  initValue,
  errorMessage,
  ...props
}: SelectFieldProps) {
  const { field } = useController(props);
  return (
    <FormControl fullWidth required={required ? true : false}>
      <InputLabel>{label}</InputLabel>
      <Select
        {...field}
        label={label}
        onChange={(e) => {
          props.onChangePre && props.onChangePre(e);
          field.onChange(e);
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
    </FormControl>
  );
}
