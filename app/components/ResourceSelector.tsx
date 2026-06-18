"use client";

import type {Key} from "@heroui/react";
import type { ResourceData } from '../api/scheduling/handlers';

import {useState} from "react";
import { FieldError, Label, ListBox, Select } from "@heroui/react";

type ResourceSelectorProps = {
  resourceOptions: ResourceData[],
  initiallySelected: number | undefined,
}

export const ResourceSelector = ({ resourceOptions, initiallySelected }: ResourceSelectorProps) => {

  const states = resourceOptions
  const [state, setState] = useState<Key | null>(initiallySelected as Key);
  const selectedState = states.find((s) => s?.id === state);

  return (
    <div className="flex w-[256px] flex-col gap-4">
      <Select
        isRequired
        className="w-full"
        name="resourceId"
        placeholder="Select one"
        value={state}
        onChange={(value) => setState(value)}
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
                  textValue={option.id.toString()}
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
  )};