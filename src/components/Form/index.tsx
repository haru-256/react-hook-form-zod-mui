'use client';

import React from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { Box, Button, Typography } from '@mui/material';
import { type FormType } from '@/schema/form';
import TextField from '@/components/TextFiled';
import { formSchema } from '@/schema/form';
import { zodResolver } from '@hookform/resolvers/zod';
import SelectField from '@/components/SelectField';
import { useRepositoryOptions, useFileOptions } from '@/lib';

let renderCount = 0;

export default function Form() {
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

  const repository = useRepositoryOptions(useFormMethod.watch('user'));
  const file = useFileOptions(useFormMethod.watch('repository'));

  console.log('Form renderCount', renderCount++);

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
            onChangePre={(e) => {
              useFormMethod.setValue('repository', '');
              useFormMethod.setValue('file', '');
            }}
          />
          {/* NOTE: File フィールドの選択の際に再レンダリングされないようにmemo化を実施 */}
          <SelectField
            label="Repository"
            required
            options={repository.options}
            control={useFormMethod.control}
            name="repository"
            onChangePre={(e) => {
              useFormMethod.setValue('file', '');
            }}
            errorMessage={repository.error?.message}
          />
          {/* NOTE: Repository フィールドの選択の際に再レンダリングされないようにmemo化を実施 */}
          <SelectField
            label="File"
            required
            options={file.options}
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
