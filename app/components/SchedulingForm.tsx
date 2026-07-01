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
  DeleteReservationInputs,
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

type FormFieldSets = 'single' | 'list' | 'add' | 'replace' | 'patch' | 'delete';

const SchedulingForm = ({ reservationsList, fetchReservationsList, listIsLoading, onSubmitFn, selectedReservation, setSelectedReservation }: SchedulingFormProps) => {
  const fieldSets:FormFieldSets[] = ['single', 'list', 'add', 'replace', 'patch', 'delete'];
  const [showFields, setShowFields] = useState<FormFieldSets>('single');
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
      case 'delete':
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
        {fieldSets.map((set) => (
          <span
            key={set}
          >
            <input
              type="radio"
              name="apiRequestType"
              id={`apiRequest${set.replace(/^./, set[0].toUpperCase())}`}
              value={set}
              onChange={(e) => showFieldOptions(e)}
              checked={showFields === set}
            />
            <label htmlFor={`apiRequest${set.replace(/^./, set[0].toUpperCase())}`}>
              {set.replace(/^./, set[0].toUpperCase())} Reservation
            </label>
          </span>
        ))}
      </fieldset>
      <fieldset className={styles.fieldComponents}>
        {!listIsLoading && (
        <>
          {showFields === 'single' && (
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
          {showFields === 'delete' && (
            <DeleteReservationInputs
              reservationOptions={reservationsList}
              setDeleteData={setReplacementData}
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
