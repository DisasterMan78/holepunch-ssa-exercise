"use client";

import {Button, FieldError, Form, Label, ListBox, Select} from "@heroui/react";

export const ResourceSelector = ({ resourceOptions }) => (
  <div className="flex w-[256px] flex-col gap-4">
    <Select
      isRequired
      className="w-full"
      name="resourceId"
      placeholder="Select one"
    >
      <Label>Reservation Type</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {
            resourceOptions.map((option) => { return (
              <ListBox.Item
                id={option.id}
                key={option.id}
                value={option.id}
                textValue={option.name}
              >
                {option.name} ({option.kind}, {option.capacity}ppl - {option.timezone})
                <ListBox.ItemIndicator />
              </ListBox.Item>
            )})
          }
        </ListBox>
      </Select.Popover>
      <FieldError />
    </Select>
  </div>
);