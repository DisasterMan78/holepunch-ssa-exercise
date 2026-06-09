import { SubmitEvent } from "react";

export type SchedulingFormProps = {
  onSubmitFn: (event: SubmitEvent<HTMLFormElement>) => void,
};


const SchedulingForm = ({ onSubmitFn }: SchedulingFormProps) => (
  <form
    id='Scheduling-form' aria-label='Scheduling Form'
    method='POST'
    onSubmit={(e: SubmitEvent<HTMLFormElement>) => { e.preventDefault(); onSubmitFn(e) }}
  >
    <h2>Scheduling Form</h2>
    <button>Submit POST request to Scheduling API</button>
  </form>
);

export default SchedulingForm;