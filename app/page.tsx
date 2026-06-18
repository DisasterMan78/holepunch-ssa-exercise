'use client';
import { SubmitEvent, useState } from 'react';

import { FetchApiOnClient } from './utils/fetch-api';
import SchedulingForm, { SchedulingFormProps } from './components/scheduling-form';
import {ApiError, default as ErrorUI} from './error';

import styles from './page.module.css';
import { HydratedReservationData } from './api/scheduling/handlers';

type ReservationOptions = {
  reservationId?: number
};

type ListOptions = {
  resourceId?: number,
  paginationSize?: number,
  page?: number,
};

type AddOrReplaceReservationOptions = {
  reservationId?: number,
  holder: string,
  resourceId: number,
  date: Date,
  startsAt: string,
  endsAt: string,
};

type RequestOptions = ReservationOptions | ListOptions | AddOrReplaceReservationOptions;

const Home = () => {
  const [error, setError] = useState<null | ApiError>(null);
  const [dataIsLoading, setDataIsLoading] = useState(false);
  const [listIsLoading, setListIsLoading] = useState(false);
  const [response, setResponse] = useState<HydratedReservationData | undefined>(undefined);
  const [reservationsList, setReservationsList] = useState<HydratedReservationData[] | undefined>(undefined);
  const endpoints = {
    reservation: 'http://localhost:3000/api/scheduling/',
    list: 'http://localhost:3000/api/scheduling/list/',
    addReservation: 'http://localhost:3000/api/scheduling/add/',
    replaceReservation: 'http://localhost:3000/api/scheduling/replace/',
  }
  let apiUrl = endpoints.reservation;


  const onSubmitFn = (event: SubmitEvent<HTMLFormElement>) => {
    setDataIsLoading(true);
    setResponse(undefined);
    setError(null);

    const form = event.target
    const requestType = form.apiRequestType.value;

    let requestOptions: RequestOptions = {};

    const resetRequestOptions = () => {
      requestOptions = {}
    }


    const buildFullReservationFromFormData = (requestOptions, form) => {

      const reservationEndDate = new Date(form.date.value);

      (requestOptions as AddOrReplaceReservationOptions).holder = form.holder.value;
      (requestOptions as AddOrReplaceReservationOptions).resourceId = form.resourceId.value;
      (requestOptions as AddOrReplaceReservationOptions).startsAt = new Date(`${form.date.value} ${form.startsAt.value}`).toISOString();

      if (form.startsAt.value > form.endsAt.value) {
        reservationEndDate.setDate(reservationEndDate.getDate() + 1)
      }

      (requestOptions as AddOrReplaceReservationOptions).endsAt = new Date(`${reservationEndDate.getFullYear()}-${reservationEndDate.getMonth() + 1}-${reservationEndDate.getDate()} ${form.endsAt.value}`).toISOString();

      return requestOptions;
    }

    switch (requestType) {
      case 'reservation':
        resetRequestOptions();
        apiUrl = endpoints.reservation;
        (requestOptions as ReservationOptions).reservationId = form.reservationId.value;
      break;

      case 'list':
        resetRequestOptions();
        apiUrl = endpoints.list;
        (requestOptions as ListOptions).resourceId = form.resourceId.value;
        (requestOptions as ListOptions).paginationSize = form.paginationSize.value;
        (requestOptions as ListOptions).page = form.page.value - 1;
      break;

      case 'add':
        resetRequestOptions();
        apiUrl = endpoints.addReservation;requestOptions = buildFullReservationFromFormData(requestOptions, form);
        apiUrl = endpoints.addReservation;
      break;

      case 'replace':
        resetRequestOptions();
        requestOptions = buildFullReservationFromFormData(requestOptions, form);
        (requestOptions as AddOrReplaceReservationOptions).reservationId = form.reservationId.value;
        apiUrl = endpoints.replaceReservation;

      break;
    }


    const payload = {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      ...requestOptions
    };


    FetchApiOnClient(apiUrl, 'POST', payload)
      .catch(error => {
        setError(error as ApiError);
      })
      .then((response: HydratedReservationData | ApiError) => {
        if (response && 'error' in response) {
          setError(response as ApiError);
        } else {
          setResponse(response as HydratedReservationData);
        }
        setDataIsLoading(false);
      });
  };

  const fetchReservationsList = () => {
    setListIsLoading(true);

    const payload = {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      requestOptions: {}
    };

    FetchApiOnClient(endpoints.list, 'POST', payload)
      .catch(error => {
        setError(error as ApiError);
      })
      .then((response: HydratedReservationData[] | ApiError) => {
        if (response && 'error' in response) {
          setError(response as ApiError);
        } else {
          setReservationsList(response);
        }
        setListIsLoading(false);
      });
  }

  const schedulingFormProps: SchedulingFormProps = {
    reservationsList,
    onSubmitFn,
    listIsLoading,
    fetchReservationsList,
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
