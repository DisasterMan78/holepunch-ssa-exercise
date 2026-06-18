"use client";

import {Time} from "@internationalized/date";

import { Description, Label, TimeField } from "@heroui/react";
import {parseAbsolute} from "@internationalized/date";
import { useState } from "react";

type TimeRangeProps = {
  startDate?: string,
  endDate?: string,
  timeZone?: string
}

export function TimeRange({ startDate, endDate, timeZone }: TimeRangeProps) {
  const calendarStartDate = (startDate && timeZone) && parseAbsolute(startDate, timeZone);
  const calendarEndDate = (endDate && timeZone) && parseAbsolute(endDate, timeZone);
  const initialStartTime = (calendarStartDate && new Time(calendarStartDate.hour, calendarStartDate.minute, calendarStartDate.second)) || undefined;
  const initialEndTime = (calendarEndDate && new Time(calendarEndDate.hour, calendarEndDate.minute, calendarEndDate.second)) || undefined;
  const [startValue, setStartValue] = useState<Time | null>(initialStartTime || null);
  const [endValue, setEndValue] = useState<Time | null>(initialEndTime || null);

  return (
    <div className="flex flex-col gap-4">
      <TimeField
        isRequired
        className="w-[256px]"
        name="startsAt"
        value={startValue}
        onChange={setStartValue}
      >
        <Label>Start time</Label>
        <TimeField.Group>
          <TimeField.Input>{(segment) => <TimeField.Segment segment={segment} />}</TimeField.Input>
        </TimeField.Group>
        <Description>Enter the start time</Description>
      </TimeField>
      <TimeField
        isRequired
        className="w-[256px]"
        name="endsAt"
        value={endValue}
        onChange={setEndValue}
      >
        <Label>End time</Label>
        <TimeField.Group>
          <TimeField.Input>{(segment) => <TimeField.Segment segment={segment} />}</TimeField.Input>
        </TimeField.Group>
        <Description>Enter the end time</Description>
      </TimeField>
    </div>
  );
}