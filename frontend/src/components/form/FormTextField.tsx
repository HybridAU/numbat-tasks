import TextField, { type TextFieldProps } from "@mui/material/TextField";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";

type FormInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
} & TextFieldProps &
  FieldValues;

// I'm not saying this is the right way to do it, but it seems to me
// that we want to create a controlled TextField, and we want to pass
// through any props, without needing to explicitly list all the possible
// props that a text filed can have. I'm going to disable the linter for now
// and figure out why this is a bad idea (and how to fix it) later.
/* eslint-disable react/jsx-props-no-spreading */
function FormTextField<T extends FieldValues>({
  name,
  control,
  label,
  ...props
}: FormInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          helperText={error ? error.message : null}
          error={!!error}
          onChange={onChange}
          value={value}
          label={label}
          {...props}
        />
      )}
    />
  );
}

export default FormTextField;
