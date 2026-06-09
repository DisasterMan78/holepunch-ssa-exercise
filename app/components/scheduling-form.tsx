import { ChangeEvent, SubmitEvent, useState } from "react";

export type SchedulingFormProps = {
  onSubmitFn: (event: SubmitEvent<HTMLFormElement>) => void,
};


const SchedulingForm = ({ onSubmitFn }: SchedulingFormProps) => {
  const [showSingleOption, setShowSingleOption] = useState(false);
  const [showListOptions, setShowListOptions] = useState(false);

  const resetOptions = () => {
    setShowSingleOption(false);
  }

  const showFieldOptions = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.value;
    console.log("🚀 ~ showFieldOptions ~ selected:", selected)
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
            name="api-request-type"
            id="api-request-reservation"
            value="reservation"
            onChange={(e) => showFieldOptions(e)}
          />
          Single Reservation
        </label>
        <label htmlFor="api-request-list">
          <input
            type="radio"
            name="api-request-type"
            id="api-request-list"
            value="list"
            onChange={(e) => showFieldOptions(e)}
          />
          List Reservations
        </label>
      </fieldset>
      <br />
      {showSingleOption && (
        <label htmlFor="reservationId">
          <input
            type="number"
            placeholder="id"
            name="reservationId"
          />
        </label>
      )}
      <br />
      <button>Submit POST request to Scheduling API</button>
    </form>
  )
};

export default SchedulingForm;