'use client';
import { SubmitEvent, useState } from 'react';

import { FetchApiOnClient } from './utils/fetch-api';
import SchedulingForm, { SchedulingFormProps } from './components/scheduling-form';
import {ApiError, default as ErrorUI} from './error';
import { HydratedReservationData } from './api/scheduling/route';

import styles from './page.module.css';

const Home = () => {
  const [error, setError] = useState<null | ApiError>(null);
  const [dataIsLoading, setDataIsLoading] = useState(false);
  const [response, setResponse] = useState<HydratedReservationData | undefined>(undefined);

  const onRevenueSubmitFn = (e: SubmitEvent<HTMLFormElement>) => {
    setDataIsLoading(true);
    setResponse(undefined);
    setError(null);

    const payload = {
      reservationId: 1,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    FetchApiOnClient('http://localhost:3000/api/scheduling', 'POST', payload)
      .catch(error => {
        setError(error as ApiError);
      })
      .then((response: HydratedReservationData | ApiError) => {
        if ('error' in response) {
          setError(response as ApiError);
        } else {
          setResponse(response as HydratedReservationData);
        }
        setDataIsLoading(false);
      });
  };

  const schedulingFormProps: SchedulingFormProps = {
    onSubmitFn: onRevenueSubmitFn,
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
        <textarea
          className={styles.reponseTextarea}
          value={JSON.stringify(response, null, 2)}
        />
      </main>
    </div>
  );
}

export default Home;
