import { Input, Label, TextField } from "@heroui/react";



export const SingleReservationInputs = ({reservationId, setReservationId, styles}) => (
  <>
    <TextField>
      <Label htmlFor="reservationId">
        Reservation ID
      </Label>
      <Input
        type="number"
        placeholder="id"
        name="reservationId"
        value={reservationId}
        className={`${styles.idInput} border border-2 rounded-md`}
        onChange={(e) => setReservationId(e.target.value)}
      />
    </TextField>
  </>
)