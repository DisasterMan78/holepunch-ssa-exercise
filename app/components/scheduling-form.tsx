import { ChangeEvent, SubmitEvent, useState } from "react";

export type SchedulingFormProps = {
  onSubmitFn: (event: SubmitEvent<HTMLFormElement>) => void,
};

import styles from '../page.module.css';


const SchedulingForm = ({ onSubmitFn }: SchedulingFormProps) => {
  const [showSingleOption, setShowSingleOption] = useState(false);
  const [showListOptions, setShowListOptions] = useState(false);
  const [reservationId, setReservationId] = useState('1');
  const [resourceId, setResourceId] = useState('');
  const [paginationSize, setPaginationSize] = useState('');
  const [page, setPage] = useState('');

  const resetOptions = () => {
    setShowSingleOption(false);
    setShowListOptions(false)
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
      </fieldset>
      <br />
      {showSingleOption && (
        <>
          <label htmlFor="reservationId">
            Reservation ID
          </label>
          <br />
          <input
            type="number"
            placeholder="id"
            name="reservationId"
            value={reservationId}
            className={styles.idInput}
            onChange={(e) => setReservationId(e.target.value)}
          />
        </>
      )}
      {showListOptions && (
        <>
          <label htmlFor="resourceId">
            Resource ID
          </label>
          <br />
          <input
            type="number"
            placeholder="id"
            name="resourceId"
            value={resourceId}
            className={styles.idInput}
            onChange={(e) => setResourceId(e.target.value)}
          />
          <br />
          <label htmlFor="paginationSize">
            Pagination size
          </label>
          <br />
          <input
            type="number"
            placeholder="#"
            name="paginationSize"
            min="1"
            value={paginationSize}
            className={styles.idInput}
            onChange={(e) => setPaginationSize(e.target.value)}
          />
          <br />
          <label htmlFor="page">
            Page #
          </label>
          <br />
          <input
            type="number"
            placeholder="#"
            name="page"
            min="1"
            value={page}
            className={styles.idInput}
            onChange={(e) => setPage(e.target.value)}
          />
        </>
      )}
      <br />
      <button>Submit POST request to Scheduling API</button>
    </form>
  )
};

export default SchedulingForm;