'use client';

import React from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import { TextField as MUITextField } from '@mui/material';
import { type FormType } from '@/schema/form';

export default function TextField({
  label,
  required,
  onChangePre,
  ...props
}: UseControllerProps<FormType> & {
  label: string;
  required?: boolean;
  onChangePre?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}) {
  const { field } = useController(props);

  console.log(`SelectField: ${label} re-Render!!`);

  return (
    <MUITextField
      {...field}
      label={label}
      required={required ? true : false}
      onChange={(e) => {
        onChangePre && onChangePre(e);
        field.onChange(e);
      }}
    />
  );
}
