'use client';
import { FormEvent, useState } from 'react';

import { FetchApiOnClient } from './utils/fetch-api';
import SchedulingForm, { SchedulingFormProps } from './components/scheduling-form';
import {default as ErrorUI} from './error';

import styles from './page.module.css';

type Response = {
  unbuiltAPI: boolean;
};

const Home = () => {
  const [error, setError] = useState<null | Error>(null);
  const [dataIsLoading, setDataIsLoading] = useState(false);
  const [response, setResponse] = useState<Response | undefined>(undefined);

  const onRevenueSubmitFn = (e: FormEvent<HTMLFormElement>) => {
    setDataIsLoading(true);
    setResponse(undefined);
    setError(null);

    const formElement = e.currentTarget;
    const payload = {
      dummy: true,
    };

    FetchApiOnClient('http://localhost:3000/api/scheduling', payload)
      .catch(error => {
        setError(error as Error);
      })
      .then((response: Response) => {
        console.log(response)
        setResponse(response)
        setDataIsLoading(false);
      });
  };

  const schedulingFormProps: SchedulingFormProps = {
    onSubmitFn: onRevenueSubmitFn
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 role="heading" aria-level={1}>Scheduling API User Simulator</h1>
        <SchedulingForm {...schedulingFormProps} />
        {
          error && (
          <ErrorUI error={error} reset={() => { }} />
          )
        }
      </main>
    </div>
  );
}

export default Home;
