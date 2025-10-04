import React, { Suspense } from "react";
import PaymentSuccessPageWithSuspense from "./PaymentSuccessPageWithSuspense";

export default function Page() {
  return (
    <Suspense>
      <PaymentSuccessPageWithSuspense />
    </Suspense>
  );
}
