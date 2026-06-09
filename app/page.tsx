'use client';
import { SubmitEvent, useState } from 'react';

import { FetchApiOnClient } from './utils/fetch-api';
import SchedulingForm, { SchedulingFormProps } from './components/scheduling-form';
import {ApiError, default as ErrorUI} from './error';

import styles from './page.module.css';
import { HydratedReservationData } from './api/scheduling/handlers';

type RequestOptions = {
  reservationId?: number,
}

const Home = () => {
  const [error, setError] = useState<null | ApiError>(null);
  const [dataIsLoading, setDataIsLoading] = useState(false);
  const [response, setResponse] = useState<HydratedReservationData | undefined>(undefined);
  const endpoints = {
    reservation: 'http://localhost:3000/api/scheduling/',
    list: 'http://localhost:3000/api/scheduling/list/'
  }
  let apiUrl = endpoints.reservation;

  const onSubmitFn = (event: SubmitEvent<HTMLFormElement>) => {
    setDataIsLoading(true);
    setResponse(undefined);
    setError(null);

    const form = event.target

    const requestType = form['api-request-type'].value;
    console.log("🚀 ~ onSubmitFn ~ requestType:", requestType)
    const requestOptions: RequestOptions = {
      reservationId: 1,
    };

    switch (requestType) {
      case 'reservation':
        requestOptions.reservationId = form.reservationId.value;
      break;
      case 'list':
        delete requestOptions.reservationId;
        apiUrl = endpoints.list;
      break;
    }

    const payload = {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      ...requestOptions
    };
    console.log("🚀 ~ onSubmitFn ~ payload:", payload)

    FetchApiOnClient(apiUrl, 'POST', payload)
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
    onSubmitFn: onSubmitFn,
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
        {!dataIsLoading && (
          <textarea
            readOnly
            className={styles.reponseTextarea}
            value={JSON.stringify(response, null, 2)}
          />
        )}
        {dataIsLoading && (
          <h3>Data loading...</h3>
        )}
      </main>
    </div>
  );
}

export default Home;
