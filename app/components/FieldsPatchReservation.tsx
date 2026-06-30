import type { HydratedReservationData, ResourceData } from "../api/scheduling/handlers";
import type { PatchReservationOptions } from "../page";

import { Dispatch, JSX, SetStateAction, useEffect, useState } from "react";
import { Input, Label, TextField } from "@heroui/react";
import {
  ReservationSelector,
  ResourceSelector,
  TimeRange,
  ValidatedDatePicker,
} from ".";


type PatchReservationInputsProps = {
  reservationOptions: HydratedReservationData[] | undefined,
  resourceOptions: ResourceData[],
  selectedReservation: HydratedReservationData | undefined,
  setPatchData?: (reservationIndex: number) => void,
}

export const PatchReservationInputs = ({ reservationOptions, resourceOptions, selectedReservation, setPatchData }: PatchReservationInputsProps): JSX.Element => {
  const [holder, setHolder] = useState(selectedReservation?.holder);

  useEffect(() => {
    setHolder(selectedReservation?.holder);
  }, [selectedReservation])

  return (
  <>
    <ReservationSelector
      reservationOptions={reservationOptions}
      setReplacementData={setPatchData}
    />
    {selectedReservation && (
      <>
        <TextField
          isRequired
          name="holder"
          value={holder}
          onChange={setHolder}
        >
          <Label
            htmlFor="holder"
          >Email address</Label>
          <Input
            type="email"
            placeholder="jane@doe.com"
          />
        </TextField>
        <ResourceSelector
          initiallySelected={selectedReservation.resourceId}
          resourceOptions={resourceOptions}
        />
        <ValidatedDatePicker
          initialDate={new Date(selectedReservation.localStartsAt)}
          validate={false}
        />
        <br />
        <TimeRange
          startDate={selectedReservation.startsAt}
          endDate={selectedReservation.endsAt}
          timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
        />
      </>
    )}
  </>
)}