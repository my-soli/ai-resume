export default function RefundPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Refund Policy</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: June 2026</p>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">30-Day Money-Back Guarantee</h2>
          <p>If you are not satisfied with your Pro subscription, you may request a full refund within 30 days of your initial purchase. No questions asked.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">How to Request a Refund</h2>
          <p>Email us at <a href="mailto:ronoshalin@gmail.com" className="text-indigo-600 hover:underline">ronoshalin@gmail.com</a> with:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Your account email address</li>
            <li>Date of purchase</li>
            <li>Reason for refund (optional)</li>
          </ul>
          <p className="mt-3">We will process your refund within 5-7 business days.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Subscription Cancellation</h2>
          <p>You may cancel your Pro subscription at any time. Cancellation stops future billing. You will retain Pro access until the end of your current billing period.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Eligibility</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Refunds are available within 30 days of purchase only</li>
            <li>Only one refund per customer</li>
            <li>Refunds are not available for renewals beyond the first month</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact</h2>
          <p>Questions? Email <a href="mailto:ronoshalin@gmail.com" className="text-indigo-600 hover:underline">ronoshalin@gmail.com</a></p>
        </section>
      </div>
    </div>
  );
}
