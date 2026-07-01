'use client';
import { SubmitEvent, useState } from 'react';

import { FetchApiOnClient } from './utils/fetch-api';
import SchedulingForm, { SchedulingFormProps } from './components/SchedulingForm';
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

export type PatchReservationOptions = {
  reservationId: number,
  holder?: string,
  resourceId?: number,
  date?: Date,
  startsAt?: string,
  endsAt?: string,
};

export type DeleteReservationOptions = {
  reservationId: number,
};

type RequestOptions =
  ReservationOptions |
  ListOptions |
  AddOrReplaceReservationOptions |
  PatchReservationOptions;

export type OnSubmitFn = (event: SubmitEvent<HTMLFormElement>) => void;

type APIResponseType = HydratedReservationData | ApiError;


const buildFullReservationFromFormData = (
  requestOptions: AddOrReplaceReservationOptions,
  form: EventTarget & HTMLFormElement
) => {

  const reservationEndDate = new Date(form.date.value);

  requestOptions.holder = form.holder.value;
  requestOptions.resourceId = form.resourceId.value;
  requestOptions.startsAt = new Date(`${form.date.value} ${form.startsAt.value}`).toISOString();

  if (form.startsAt.value > form.endsAt.value) {
    reservationEndDate.setDate(reservationEndDate.getDate() + 1)
  }

  requestOptions.endsAt = new Date(`${reservationEndDate.getFullYear()}-${reservationEndDate.getMonth() + 1}-${reservationEndDate.getDate()} ${form.endsAt.value}`).toISOString();

  return requestOptions;
}


const buildPatchReservationFromFormData = (
  selectedReservation: HydratedReservationData,
  form: EventTarget & HTMLFormElement,
) => {
  const patchOptions: PatchReservationOptions = {
    reservationId: selectedReservation?.id as number,
  };

  if (selectedReservation?.holder !== form.holder.value) {
    patchOptions.holder = form.holder.value;
  };

  if (selectedReservation?.resourceId.toString() !== form.resourceId.value) {
    patchOptions.resourceId = parseInt(form.resourceId.value);
  };

  const reservationStartDate = new Date(`${form.date.value} ${form.startsAt.value}`).toISOString().replace('.000Z', 'Z');

  if (selectedReservation?.startsAt !== reservationStartDate) {
    patchOptions.startsAt = reservationStartDate;
  }

  const reservationEndDate = new Date(form.date.value);

  if (form.startsAt.value > form.endsAt.value) {
    reservationEndDate.setDate(reservationEndDate.getDate() + 1)
  }

  const reservationEndstring = new Date(`${reservationEndDate.getFullYear()}-${reservationEndDate.getMonth() + 1}-${reservationEndDate.getDate()} ${form.endsAt.value}`).toISOString().replace('.000Z', 'Z');

  if (selectedReservation?.endsAt !== reservationEndstring) {
    patchOptions.endsAt = reservationEndstring;
  }

  return patchOptions;
}


const Home = () => {
  const [error, setError] = useState<null | ApiError>(null);
  const [dataIsLoading, setDataIsLoading] = useState(false);
  const [listIsLoading, setListIsLoading] = useState(false);
  const [response, setResponse] = useState<HydratedReservationData | undefined>(undefined);
  const [reservationsList, setReservationsList] = useState<HydratedReservationData[] | undefined>(undefined);
  const [selectedReservation, setSelectedReservation] = useState<HydratedReservationData | undefined>(undefined);
  const endpoints = {
    reservation: 'http://localhost:3000/api/scheduling/',
    list: 'http://localhost:3000/api/scheduling/list/',
    addReservation: 'http://localhost:3000/api/scheduling/add/',
    replaceReservation: 'http://localhost:3000/api/scheduling/replace/',
    patchReservation: 'http://localhost:3000/api/scheduling/patch/',
    deleteReservation: 'http://localhost:3000/api/scheduling/delete/',
  }
  let apiUrl = endpoints.reservation;


  const onSubmitFn: OnSubmitFn = (event) => {
    setDataIsLoading(true);
    setResponse(undefined);
    setError(null);

    const form = event.target
    const requestType = form.apiRequestType.value;

    let requestOptions: RequestOptions = {};

    const resetRequestOptions = () => {
      requestOptions = {}
    }

    switch (requestType) {
      case 'single':
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
        apiUrl = endpoints.addReservation;requestOptions = buildFullReservationFromFormData(requestOptions as AddOrReplaceReservationOptions, form);
        apiUrl = endpoints.addReservation;
      break;

      case 'replace':
        resetRequestOptions();
        requestOptions = buildFullReservationFromFormData(requestOptions as AddOrReplaceReservationOptions, form);
        (requestOptions as AddOrReplaceReservationOptions).reservationId = form.reservationId.value;
        apiUrl = endpoints.replaceReservation;

      break;

      case 'patch':
        resetRequestOptions();
        selectedReservation && (requestOptions =
        buildPatchReservationFromFormData(selectedReservation, form));
        apiUrl = endpoints.patchReservation;
      break;

      case 'delete':
        resetRequestOptions();
        (requestOptions as DeleteReservationOptions).reservationId = form.reservationId.value;
        apiUrl = endpoints.deleteReservation;
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
      .then((response: APIResponseType) => {
        if (response && 'error' in response) {
          setError(response as ApiError);
        } else {
          setResponse(response as HydratedReservationData);
        }
        if (requestType === 'delete') {
          fetchReservationsList();
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
          const reservationsArray = Object.entries(response).map(entry => entry[1])
          setReservationsList(reservationsArray);
        }
        setListIsLoading(false);
      });
  }

  const schedulingFormProps: SchedulingFormProps = {
    reservationsList,
    onSubmitFn,
    listIsLoading,
    fetchReservationsList,
    selectedReservation,
    setSelectedReservation,
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
