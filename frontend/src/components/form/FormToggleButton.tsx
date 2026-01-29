import { FormControl, FormGroup, FormHelperText } from "@mui/material";
import ToggleButton, {
  type ToggleButtonProps,
} from "@mui/material/ToggleButton";
import type { ReactNode } from "react";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";

type FormInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  activeLabel: ReactNode;
  inactiveLabel: ReactNode;
} & ToggleButtonProps &
  FieldValues;

function FormToggleButton<T extends FieldValues>({
  name,
  control,
  activeLabel,
  inactiveLabel,
  ...props
}: FormInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl required={props.required} error={!!error}>
          <FormGroup>
            <ToggleButton
              selected={value}
              onChange={() => onChange(!value)}
              {...props}
            >
              {value ? activeLabel : inactiveLabel}
            </ToggleButton>
          </FormGroup>
          {error ? <FormHelperText>error.message</FormHelperText> : null}
        </FormControl>
      )}
    />
  );
}

export default FormToggleButton;
