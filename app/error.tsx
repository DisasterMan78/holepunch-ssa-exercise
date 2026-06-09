'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'

export type ApiError = {
  error: number,
  errorMessage: string,
}

export default function Error({
  error,
}: {
  error: ApiError,
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div role="alert" aria-live="assertive">
      <h2>Something went wrong!</h2>
      <h3>{error.error}</h3>
      <p>{error.errorMessage}</p>
    </div>
  )
}