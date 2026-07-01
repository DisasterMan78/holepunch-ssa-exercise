"use client";

import {FieldError, Label, ListBox, Select} from "@heroui/react";

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
            (reservationOptions).map((option) => option && (
              <ListBox.Item
                id={option.id}
                key={option.id}
                textValue={option.holder}
              >
                {option.holder} ({option.resource?.name}, {new Date(option.localStartsAt).toDateString()})
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