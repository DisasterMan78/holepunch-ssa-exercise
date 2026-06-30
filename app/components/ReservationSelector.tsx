"use client";

import {FieldError, Label, ListBox, Select} from "@heroui/react";
import { HydratedReservationData } from "../api/scheduling/handlers";

export const ReservationSelector = ({ reservationOptions, setReplacementData }) => (
  <div className="flex w-[256px] flex-col gap-4">
    <Select
      isRequired
      className="w-full"
      name="reservationId"
      placeholder="Select one"
      onChange={(e) => setReplacementData(e)}
    >
      <Label>Reservations</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {
            (Object.entries(reservationOptions) as unknown as HydratedReservationData[]).map((option) => option && (
              <ListBox.Item
                id={option[0]}
                key={option[0]}
                value={{id: option[0]}}
                textValue={option[1].holder}
              >
                {option[1].holder} ({option[1].resource?.name}, {new Date(option[1].localStartsAt).toDateString()})
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))
          }
        </ListBox>
      </Select.Popover>
      <FieldError />
    </Select>
  </div>
);