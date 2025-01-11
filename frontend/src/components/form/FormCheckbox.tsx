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
      // TODO this doesn't seem to be working, if I ticket and untick a box values are passed, but it's not ticked by default when it's in a form that's set to true.
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl required={props.required} error={!!error}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox onChange={onChange} value={value} {...props} />
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
