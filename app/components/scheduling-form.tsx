import { ChangeEvent, JSX, SubmitEvent, useState } from "react";

import styles from '../page.module.css';
import { ValidatedDatePicker } from "./date-picker";
import { TimeRange } from "./time-range";
import { catalogResources } from "../api/catalog-resources";
import { ResourceSelector } from "./resource-selector";
import { Input, Label, TextField } from "@heroui/react";
import { isIgnored } from '../../node_modules/@jridgewell/trace-mapping/src/trace-mapping';

export type SchedulingFormProps = {
  onSubmitFn: (event: SubmitEvent<HTMLFormElement>) => void,
};

const SchedulingForm = ({ onSubmitFn }: SchedulingFormProps) => {
  const [showSingleOption, setShowSingleOption] = useState(false);
  const [showListOptions, setShowListOptions] = useState(false);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [reservationId, setReservationId] = useState('1');
  const [resourceId, setResourceId] = useState('');
  const [paginationSize, setPaginationSize] = useState('');
  const [page, setPage] = useState('');

  const resetOptions = () => {
    setShowSingleOption(false);
    setShowListOptions(false);
    setShowAddOptions(false);
  }

  const showFieldOptions = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.value;

    resetOptions();

    switch (selected) {
      case 'reservation':
        setShowSingleOption(true);
      break;
      case 'list':
        setShowListOptions(true);
      break;
      case 'add':
        setShowAddOptions(true);
      break;
    }

  }

  return (
    <form
      id='Scheduling-form' aria-label='Scheduling Form'
      method='POST'
      onSubmit={(e: SubmitEvent<HTMLFormElement>) => { e.preventDefault(); onSubmitFn(e) }}
    >
      <h2>Scheduling Form</h2>
      <fieldset>
        <label htmlFor="api-request-reservation">
          <input
            type="radio"
            name="apiRequestType"
            id="api-request-reservation"
            value="reservation"
            onChange={(e) => showFieldOptions(e)}
          />
          Single Reservation
        </label>
        <label htmlFor="apiRequestList">
          <input
            type="radio"
            name="apiRequestType"
            id="apiRequestList"
            value="list"
            onChange={(e) => showFieldOptions(e)}
          />
          List Reservations
        </label>
        <label htmlFor="apiRequestAdd">
          <input
            type="radio"
            name="apiRequestType"
            id="apiRequestAdd"
            value="add"
            onChange={(e) => showFieldOptions(e)}
          />
          Add Reservation
        </label>
      </fieldset>
      <br />
      {showSingleOption && (
        <SingleReservationInputs
          reservationId={reservationId}
          setReservationId={setReservationId}
        />
      )}
      {showListOptions && (
        <ListReservationsInputs
          resourceId={resourceId}
          setResourceId={setResourceId}
          paginationSize={paginationSize}
          setPaginationSize={setPaginationSize}
          page={page}
          setPage={setPage}
        />
      )}
      {showAddOptions && (
        <AddReservationInputs
          resourceOptions={catalogResources}
        />
      )}
      <br />
      <br />
      <button className="button border border-2">Submit POST request to Scheduling API</button>
    </form>
  )
};


const SingleReservationInputs = ({reservationId, setReservationId}) => (
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


const ListReservationsInputs = ({resourceId, setResourceId, paginationSize, setPaginationSize, page, setPage}): JSX.Element => (
  <>
    <TextField>
      <label htmlFor="resourceId">
        Resource ID
      </label>
      <Input
        type="number"
        placeholder="id"
        name="resourceId"
        value={resourceId}
        className={`${styles.idInput} border border-2 rounded-md`}
        onChange={(e) => setResourceId(e.target.value)}
      />
    </TextField>
    <TextField>
      <Label htmlFor="paginationSize">
        Pagination size
      </Label>
      <Input
        type="number"
        placeholder="#"
        name="paginationSize"
        min="1"
        value={paginationSize}
        className={`${styles.idInput} border border-2 rounded-md`}
        onChange={(e) => setPaginationSize(e.target.value)}
      />
    </TextField>
    <TextField>
      <Label htmlFor="page">
        Page #
      </Label>
      <Input
        type="number"
        placeholder="#"
        name="page"
        min="1"
        value={page}
        className={`${styles.idInput} border border-2 rounded-md`}
        onChange={(e) => setPage(e.target.value)}
      />
    </TextField>
  </>
)


const AddReservationInputs = ({resourceOptions}) => (
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
      resourceOptions={resourceOptions}
    />
    <ValidatedDatePicker />
    <br />
    <TimeRange />
  </>
)

export default SchedulingForm;