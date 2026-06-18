import type { HydratedReservationData } from "../api/scheduling/handlers";

import { ChangeEvent, SubmitEvent, useState } from "react";

import { catalogResources } from "../api/catalog-resources";
import {
  AddReservationInputs, ListReservationsInputs, ReplaceReservationInputs, SingleReservationInputs
} from "./fieldsets";

import styles from '../page.module.css';

export type SchedulingFormProps = {
  reservationsList: HydratedReservationData[] | undefined,
  fetchReservationsList: () => void,
  listIsLoading: boolean,
  onSubmitFn: (event: SubmitEvent<HTMLFormElement>) => void,
};

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
              styles={styles}
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
              styles={styles}
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

export default SchedulingForm;