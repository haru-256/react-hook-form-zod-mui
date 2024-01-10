'use client';

import React from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { Box, Button, Typography } from '@mui/material';
import { type FormType } from '@/schema/form';
import SelectFieldDynamicOptions from '@/components/SelectFieldDynamicOptions';
import TextField from '@/components/TextFiled';
import { formSchema } from '@/schema/form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

type RepositoryResponse = {
  repository: string;
}[];

async function getRepositoryOptions(
  watchedValues: (string | null)[]
): Promise<{ label: string; value: string }[]> {
  const user = watchedValues[0];
  const defaultOptions = [{ label: 'No Items', value: '' }];
  if (!user) {
    return defaultOptions;
  }
  const res = await axios.get<RepositoryResponse>(
    `api/repository?user=${user}`
  );
  if (res.status !== 200) {
    return defaultOptions;
  }

  const data = res.data;
  if (data.length === 0) {
    return defaultOptions;
  }
  return data.map((d) => ({ label: d.repository, value: d.repository }));
}

type FileResponse = {
  filepath: string[];
};
async function getFileOptions(
  watchedValues: string[]
): Promise<{ label: string; value: string }[]> {
  const [user, repository] = watchedValues;
  const defaultOptions = [{ label: 'No Items', value: '' }];
  if (!user || !repository) {
    return defaultOptions;
  }
  const res = await axios.get<FileResponse>(
    `api/file?repository=${repository}`
  );
  if (res.status !== 200) {
    return defaultOptions;
  }

  const filepaths = res.data.filepath;
  if (filepaths.length === 0) {
    return defaultOptions;
  }
  return filepaths.map((filepath) => ({ label: filepath, value: filepath }));
}

let renderCount = 0;

export default function FormGroup() {
  const useFormMethod = useForm<FormType>({
    defaultValues: {
      user: '',
      repository: '',
      file: '',
    },
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });
  const [ok, setOk] = React.useState<{ data: FormType | null; ok: boolean }>({
    data: null,
    ok: false,
  });
  const errors = useFormMethod.formState.errors;
  const onSubmit: SubmitHandler<FormType> = (data) => {
    const result = formSchema.safeParse(data);
    if (result.success) {
      setOk({ data: result.data, ok: true });
    }
  };

  console.log('renderCount', renderCount++);

  return (
    <>
      <FormProvider {...useFormMethod}>
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: 400,
          }}
          onSubmit={useFormMethod.handleSubmit(onSubmit)}
        >
          <Box>
            <Typography variant="h4" align="center" fontWeight="bold">
              Github File Form
            </Typography>
          </Box>
          <TextField
            label="User Name"
            required
            control={useFormMethod.control}
            name="user"
          />
          <SelectFieldDynamicOptions<string>
            label="Repository"
            required
            watchedNames={['user']}
            getOptions={getRepositoryOptions}
            control={useFormMethod.control}
            name="repository"
          />
          <SelectFieldDynamicOptions<string>
            label="File"
            required
            // FIXME: この引数の順番とgetOptionsの引数の順番は同期している必要がある
            watchedNames={['user', 'repository']}
            getOptions={getFileOptions}
            control={useFormMethod.control}
            name="file"
          />
          <Button type="submit" variant="contained">
            SUBMIT
          </Button>
          {(errors.user || errors.repository || errors.file) && (
            <Box>Error: {JSON.stringify(errors, null, 2)}</Box>
          )}
          {}
          <Box sx={{ display: ok.data ? 'display' : 'none' }}>
            Submitted Data is following:
            {JSON.stringify(ok.data, null, 2)}
          </Box>
        </Box>
      </FormProvider>
    </>
  );
}
