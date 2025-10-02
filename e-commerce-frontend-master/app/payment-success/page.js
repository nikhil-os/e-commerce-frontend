"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Force dynamic rendering
export const dynamic = "force-dynamic";

function PaymentSuccessRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get orderId from URL params
    const orderId = searchParams.get("orderId");

    // Redirect to the new order-success page
    if (orderId) {
      router.replace(`/order-success?orderId=${orderId}`);
    } else {
      // If no orderId, go to general order success
      router.replace("/order-success");
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a1a2e] via-[#3d1a2e] to-[#1a0f1f] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b9d]"></div>
    </div>
  );
}

export default function PaymentSuccessRedirect() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-[#2a1a2e] via-[#3d1a2e] to-[#1a0f1f] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b9d]"></div>
        </div>
      }
    >
      <PaymentSuccessRedirectContent />
    </Suspense>
  );
}
