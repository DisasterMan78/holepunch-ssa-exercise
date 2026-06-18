"use client";

import type {DateValue} from "@internationalized/date";

import {Calendar, DateField, DatePicker, FieldError, Label} from "@heroui/react";
import {CalendarDate, getLocalTimeZone, today} from "@internationalized/date";
import { useState } from "react";

type ValidatedDatePickerProps = {
  initialDate?: Date,
  validate?: boolean,
}

export function ValidatedDatePicker({initialDate, validate = true}: ValidatedDatePickerProps) {
  const [value, setValue] = useState<DateValue | undefined>((initialDate && new CalendarDate(initialDate.getFullYear(), initialDate.getMonth() + 1, initialDate.getDay())) || undefined);
  const currentDate = today(getLocalTimeZone());
  const isInvalid = validate ? value && value.compare(currentDate) < 0 : false;

  return (
    <DatePicker
      isRequired
      className="w-64"
      isInvalid={isInvalid}
      minValue={currentDate}
      name="date"
      value={value}
      onChange={(date) => { date && setValue(date) }}
    >
      <Label>Reservation date</Label>
      <DateField.Group
        fullWidth
      >
        <DateField.Input>
          {(segment) => <DateField.Segment segment={segment} />}
        </DateField.Input>
        <DateField.Suffix>
          <DatePicker.Trigger>
            <DatePicker.TriggerIndicator />
          </DatePicker.Trigger>
        </DateField.Suffix>
      </DateField.Group>
      <FieldError>
        Date must be today or in the future.
      </FieldError>
      <DatePicker.Popover>
        <Calendar
          aria-label="Event date"
        >
          <Calendar.Header>
            <Calendar.YearPickerTrigger>
              <Calendar.YearPickerTriggerHeading />
              <Calendar.YearPickerTriggerIndicator />
            </Calendar.YearPickerTrigger>
            <Calendar.NavButton
              slot="previous"
            />
            <Calendar.NavButton
              slot="next"
            />
          </Calendar.Header>
          <Calendar.Grid>
            <Calendar.GridHeader>
              {(day) => <Calendar.HeaderCell>{day}
            </Calendar.HeaderCell>}
            </Calendar.GridHeader>
            <Calendar.GridBody>
              {(date) => <Calendar.Cell date={date} />}
            </Calendar.GridBody>
          </Calendar.Grid>
          <Calendar.YearPickerGrid>
            <Calendar.YearPickerGridBody>
              {({year}) => <Calendar.YearPickerCell year={year} />}
            </Calendar.YearPickerGridBody>
          </Calendar.YearPickerGrid>
        </Calendar>
      </DatePicker.Popover>
    </DatePicker>
  );
}