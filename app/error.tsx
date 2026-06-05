'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'

export default function Error({
  error,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div role="alert" aria-live="assertive">
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
    </div>
  )
}