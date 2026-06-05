import { FormEvent } from "react";

export type SchedulingFormProps = {
  onSubmitFn: (event: FormEvent<HTMLFormElement>) => void,
};


const SchedulingForm = ({ onSubmitFn }: SchedulingFormProps) => {

  return (
    <form
      id='Scheduling-form' aria-label='Scheduling Form'
      method='POST'
      onSubmit={(e: FormEvent<HTMLFormElement>) => { e.preventDefault(); onSubmitFn(e) }}
    >
      <h2>Scheduling Form</h2>
      <button>Submit POST request to Scheduling API</button>
    </form>
  );
}

export default SchedulingForm;
