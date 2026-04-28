import { Suspense } from 'react';
import BookingDetailes from './Booking-detailes';

export default function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ doctorId?: string }>;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingDetailes searchParams={searchParams} />
    </Suspense>
  );
}
