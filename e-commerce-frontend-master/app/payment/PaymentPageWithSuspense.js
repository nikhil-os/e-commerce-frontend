import React, { Suspense } from "react";
import PaymentPage from "./page";

export default function PaymentPageWithSuspense() {
  return (
    <Suspense fallback={<div>Loading payment...</div>}>
      <PaymentPage />
    </Suspense>
  );
}
