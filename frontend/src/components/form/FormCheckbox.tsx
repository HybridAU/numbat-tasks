import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
} from "@mui/material";
import Checkbox, { type CheckboxProps } from "@mui/material/Checkbox";
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
} & CheckboxProps &
  FieldValues;

function FormCheckbox<T extends FieldValues>({
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
        <FormControl required={props.required} error={!!error}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox checked={value} onChange={onChange} {...props} />
              }
              label={label}
            />
          </FormGroup>
          {error ? <FormHelperText>error.message</FormHelperText> : null}
        </FormControl>
      )}
    />
  );
}

export default FormCheckbox;
