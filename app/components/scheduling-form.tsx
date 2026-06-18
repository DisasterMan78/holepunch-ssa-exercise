import { ChangeEvent, JSX, SubmitEvent, useEffect, useState } from "react";

import styles from '../page.module.css';
import { ValidatedDatePicker } from "./date-picker";
import { TimeRange } from "./time-range";
import { catalogResources } from "../api/catalog-resources";
import { ResourceSelector } from "./resource-selector";
import { Input, Label, TextField } from "@heroui/react";
import { HydratedReservationData, ResourceData } from "../api/scheduling/handlers";
import { ReservationSelector } from "./reservation-selector";

export type SchedulingFormProps = {
  reservationsList: HydratedReservationData[] | undefined,
  fetchReservationsList: () => void,
  listIsLoading: boolean,
  onSubmitFn: (event: SubmitEvent<HTMLFormElement>) => void,
};

type ReplaceReservationInputsProps = {
  reservationOptions: HydratedReservationData[] | undefined,
  resourceOptions: ResourceData[],
  selectedReservation: HydratedReservationData | undefined,
  setReplacementReservation: (reservationIndex: number) => void
}

const SchedulingForm = ({ reservationsList, fetchReservationsList, listIsLoading, onSubmitFn }: SchedulingFormProps) => {
  const [showSingleOption, setShowSingleOption] = useState(false);
  const [showListOptions, setShowListOptions] = useState(false);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [showReplaceOptions, setShowReplaceOptions] = useState(false);
  const [reservationId, setReservationId] = useState('1');
  const [resourceId, setResourceId] = useState('');
  const [paginationSize, setPaginationSize] = useState('');
  const [page, setPage] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<HydratedReservationData | undefined>(undefined);

  const resetOptions = () => {
    setShowSingleOption(false);
    setShowListOptions(false);
    setShowAddOptions(false);
    setShowReplaceOptions(false)
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
      case 'replace':
        setShowReplaceOptions(true);
        fetchReservationsList()
        break;
    }

  }

  const setReplacementReservation = (reservationIndex: number) => {
    reservationsList && setSelectedReservation(reservationsList[reservationIndex])
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
        <label htmlFor="apiRequestReplace">
          <input
            type="radio"
            name="apiRequestType"
            id="apiRequestReplace"
            value="replace"
            onChange={(e) => showFieldOptions(e)}
          />
          Replace Reservation
        </label>
      </fieldset>
      <br />
      {!listIsLoading && (
        <>
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
          {showReplaceOptions && (
            <ReplaceReservationInputs
              reservationOptions={reservationsList}
              resourceOptions={catalogResources}
              selectedReservation={selectedReservation}
              setReplacementReservation={setReplacementReservation}
            />
          )}
          <br />
          <br />
          <button className="button border border-2">Submit POST request to Scheduling API</button>
        </>
      )}
      {listIsLoading && (
        <h3>Form data loading...</h3>
      )}
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
        id="resourceId"
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
      initiallySelected={undefined}
      resourceOptions={resourceOptions}
    />
    <ValidatedDatePicker />
    <br />
    <TimeRange />
  </>
)


const ReplaceReservationInputs = ({ reservationOptions, resourceOptions, selectedReservation, setReplacementReservation }: ReplaceReservationInputsProps) => {
  const [holder, setHolder] = useState(selectedReservation?.holder);

  useEffect(() => {
    setHolder(selectedReservation?.holder);
  }, [selectedReservation])

  return (
  <>
    <ReservationSelector
      reservationOptions={reservationOptions}
      setReplacementReservation={setReplacementReservation}
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
          initiallySelected={selectedReservation.id}
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

export default SchedulingForm;