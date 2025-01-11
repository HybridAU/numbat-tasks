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
