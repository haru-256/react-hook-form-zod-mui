"use client";

import React from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { Box, Button } from "@mui/material";
import { type FormType } from "@/schema/form";
import SelectField from "@/components/SelectField";
import SelectFieldDynamicOptions from "@/components/SelectFieldDynamicOptions";
import TextField from "@/components/TextFiled";
import { formSchema } from "@/schema/form";
import { zodResolver } from "@hookform/resolvers/zod";

function getFileOptions(repository: string) {
  switch (repository) {
    case "A":
      return [
        { label: "A.py", value: "A.py" },
        { label: "A.ipynb", value: "A.ipynb" },
      ];
    case "B":
      return [
        { label: "B.py", value: "B.py" },
        { label: "B.ipynb", value: "B.ipynb" },
      ];
    default:
      return [{ label: "No Items", value: "" }];
  }
}

let renderCount = 0;

export default function FormGroup() {
  const useFormMethod = useForm<FormType>({
    defaultValues: {
      name: "haru256",
      repository: "",
      file: "",
      schedule: "",
    },
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onBlur",
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
  const repositoryOptions = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
  ];

  console.log("renderCount", renderCount++);

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <FormProvider {...useFormMethod}>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: 300,
        }}
        onSubmit={useFormMethod.handleSubmit(onSubmit)}
      >
        <TextField
          label="Name"
          required
          control={useFormMethod.control}
          name="name"
        />
        <SelectField
          label="Repository"
          required
          options={repositoryOptions}
          control={useFormMethod.control}
          name="repository"
        />
        <SelectFieldDynamicOptions<string>
          label="File"
          required
          watchedName="repository"
          getOptions={getFileOptions}
          control={useFormMethod.control}
          name="file"
        />
        <TextField
          label="Schedule"
          required
          control={useFormMethod.control}
          name="schedule"
        />
        <Button type="submit" variant="contained">
          SUBMIT
        </Button>
        {(errors.name ||
          errors.repository ||
          errors.file ||
          errors.schedule) && (
          <Box>Error: {JSON.stringify(errors, null, 2)}</Box>
        )}
        {}
        <Box sx={{ display: ok.data ? "display" : "none" }}>
          Submitted Data is following:
          {JSON.stringify(ok.data, null, 2)}
        </Box>
      </Box>
    </FormProvider>
  );
}
