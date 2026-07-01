import type { HydratedReservationData } from "../api/scheduling/handlers";

import { JSX } from "react";
import {
  ReservationSelector,
} from ".";


type DeleteReservationInputsProps = {
  reservationOptions: HydratedReservationData[] | undefined,
  setDeleteData: (reservationIndex: number) => void,
}

export const DeleteReservationInputs = ({ reservationOptions, setDeleteData }: DeleteReservationInputsProps): JSX.Element => (
  <ReservationSelector
    reservationOptions={reservationOptions}
    setReplacementData={setDeleteData}
  />
);