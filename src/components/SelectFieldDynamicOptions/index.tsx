'use client';

import React from 'react';
import {
  useController,
  UseControllerProps,
  useWatch,
  useFormContext,
} from 'react-hook-form';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import { type FormType } from '@/schema/form';
import { shallowEqualArrays } from '@/lib';
import { AxiosError } from 'axios';

type SelectFieldProps<T> = UseControllerProps<FormType> & {
  label: string;
  required?: boolean;
  watchedNames: string[];
  getOptions: (
    watchedValues: T[]
  ) => Promise<{ label: string; value: string }[]>;
};

// watchedValuesが変更されたらversionをインクリメントする
function useVersion(watchedValues: string[]) {
  const watchedValuesRef = React.useRef<string[] | null>(null);
  const prevWatchedValues = watchedValuesRef.current;
  const versionRef = React.useRef(0);
  if (prevWatchedValues === null) {
    watchedValuesRef.current = watchedValues;
    return true;
  }
  const ret = shallowEqualArrays(prevWatchedValues, watchedValues);
  if (!ret) {
    watchedValuesRef.current = watchedValues;
    versionRef.current += 1;
  }
  return versionRef.current;
}

export default function SelectFieldDynamicOptions<T>({
  label,
  required,
  getOptions,
  watchedNames,
  ...props
}: SelectFieldProps<T>) {
  const { field } = useController(props);
  const { setValue } = useFormContext();
  const watchedValues = useWatch({ name: watchedNames });
  const version = useVersion(watchedValues);
  const [error, setError] = React.useState<{ message: string | null }>({
    message: null,
  });

  const defaultOptions = [{ label: 'No Items', value: '' }];
  const [options, setOptions] =
    React.useState<{ label: string; value: string }[]>(defaultOptions);

  React.useEffect(() => {
    let ignore = false;
    getOptions(watchedValues)
      .then((options) => {
        if (!ignore) {
          setValue(props.name, '');
          setOptions(options);
          setError({ message: null });
        }
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          setError({ message: e.response.statusText });
        }
      });
    return () => {
      ignore = true;
    };
  }, [version]); // watchedValuesに応じてoptionsを更新する。watchedValuesが配列のため、custom hookで変更有無を判定する。他にも、本Componentではoptionをpropsで受け取り、Parent ComponentでwatchedValues をもとにReact.useMemoでoptionsをmemo & 更新する方法もある。useMemoを使うのはParent Componentでもつ他のComponentの再レンでリングを防ぐため
  // more info: https://github.com/facebook/react/issues/14476#issuecomment-722109683

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
      {error.message && (
        <FormHelperText error required>
          {error.message}
        </FormHelperText>
      )}
    </FormControl>
  );
}
