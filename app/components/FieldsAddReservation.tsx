import { JSX } from "react";
import { Input, Label, TextField } from "@heroui/react";
import { ResourceSelector, TimeRange, ValidatedDatePicker } from ".";

export const AddReservationInputs = ({resourceOptions}): JSX.Element => (
  <>
    <TextField
      isRequired
    >
      <Label
        htmlFor="holder"
      >Email address</Label>
      <Input
        type="email"
        name="holder"
        placeholder="jane@doe.com"
      />
    </TextField>
    <ResourceSelector
      initiallySelected={undefined}
      resourceOptions={resourceOptions}
    />
    <ValidatedDatePicker />
    <br />
    <TimeRange />
  </>
)