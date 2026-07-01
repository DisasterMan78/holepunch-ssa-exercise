import type { HydratedReservationData } from "../api/scheduling/handlers";
import type {
  OnSubmitFn,
} from "../page";

import { ChangeEvent, Dispatch, SetStateAction, SubmitEvent, useState } from "react";

import { catalogResources } from "../api/catalog-resources";
import {
  AddReservationInputs,
  ListReservationsInputs,
  ReplaceReservationInputs,
  SingleReservationInputs,
  PatchReservationInputs,
} from "./fieldsets";

import styles from '../page.module.css';

export type SchedulingFormProps = {
  reservationsList: HydratedReservationData[] | undefined,
  selectedReservation: HydratedReservationData | undefined;
  setSelectedReservation: Dispatch<SetStateAction<HydratedReservationData | undefined>>,
  fetchReservationsList: () => void,
  listIsLoading: boolean,
  onSubmitFn: OnSubmitFn,
};

type FormFieldSets = 'reservation' | 'list' | 'add' | 'replace' | 'patch';

const SchedulingForm = ({ reservationsList, fetchReservationsList, listIsLoading, onSubmitFn, selectedReservation, setSelectedReservation }: SchedulingFormProps) => {
  const [showFields, setShowFields] = useState<FormFieldSets>('reservation');
  const [reservationId, setReservationId] = useState('1');
  const [resourceId, setResourceId] = useState('');
  const [paginationSize, setPaginationSize] = useState('');
  const [page, setPage] = useState('');

  const showFieldOptions = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.value;

    setShowFields(selected as FormFieldSets);

    switch (selected) {
      case 'replace':
      case 'patch':
        fetchReservationsList();
        break;
    }

  }

  const setReplacementData = (selectedReservationId: number) => {
    const reservationById = reservationsList?.find(reservation => reservation?.id === selectedReservationId);

    setSelectedReservation(reservationById);
  }

  return (
    <form
      id='Scheduling-form' aria-label='Scheduling Form'
      method='POST'
      onSubmit={(e: SubmitEvent<HTMLFormElement>) => { e.preventDefault(); onSubmitFn(e) }}
    >
      <h2>Scheduling Form</h2>
      <fieldset
        className={styles.radioTabs}
      >
        <input
          type="radio"
          name="apiRequestType"
          id="api-request-reservation"
          value="reservation"
          onChange={(e) => showFieldOptions(e)}
        />
        <label htmlFor="api-request-reservation">
          Single Reservation
        </label>
        <input
          type="radio"
          name="apiRequestType"
          id="apiRequestList"
          value="list"
          onChange={(e) => showFieldOptions(e)}
        />
        <label htmlFor="apiRequestList">
          List Reservations
        </label>
        <input
          type="radio"
          name="apiRequestType"
          id="apiRequestAdd"
          value="add"
          onChange={(e) => showFieldOptions(e)}
        />
        <label htmlFor="apiRequestAdd">
          Add Reservation
        </label>
        <input
          type="radio"
          name="apiRequestType"
          id="apiRequestReplace"
          value="replace"
          onChange={(e) => showFieldOptions(e)}
        />
        <label htmlFor="apiRequestReplace">
          Replace Reservation
        </label>
        <input
          type="radio"
          name="apiRequestType"
          id="apiRequestPatch"
          value="patch"
          onChange={(e) => showFieldOptions(e)}
        />
        <label htmlFor="apiRequestPatch">
          Patch Reservation
        </label>
      </fieldset>
      <fieldset className={styles.fieldComponents}>
        {!listIsLoading && (
        <>
          {showFields === 'reservation' && (
            <SingleReservationInputs
              reservationId={reservationId}
              setReservationId={setReservationId}
              styles={styles}
            />
          )}
          {showFields === 'list' && (
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
          {showFields === 'add' && (
            <AddReservationInputs
              resourceOptions={catalogResources}
            />
          )}
          {showFields === 'replace' && (
            <ReplaceReservationInputs
              reservationOptions={reservationsList}
              resourceOptions={catalogResources}
              selectedReservation={selectedReservation}
              setReplacementData={setReplacementData}
            />
          )}
          {showFields === 'patch' && (
            <PatchReservationInputs
              reservationOptions={reservationsList}
              resourceOptions={catalogResources}
              selectedReservation={selectedReservation}
              setPatchData={setReplacementData}
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
      </fieldset>
    </form>
  )
};

export default SchedulingForm;