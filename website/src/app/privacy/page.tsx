import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Goyal Filling Station",
  description: "Privacy Policy for Goyal Filling Station",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-8 border-b pb-6">
          <Link href="/" className="text-[#0099D8] hover:underline mb-6 inline-block font-semibold">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-[#0A2240]">Privacy Policy</h1>
          <p className="text-gray-500 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-blue max-w-none text-gray-700 space-y-6">
          <p>
            Welcome to the Goyal Filling Station website. We respect your privacy and are committed to protecting any personal data you share with us.
          </p>

          <h2 className="text-xl font-bold text-[#0A2240] mt-8 mb-4">1. Information Collection</h2>
          <p>
            We only collect personal information that you voluntarily provide to us when you contact us directly (e.g., via email or WhatsApp). This may include your name, phone number, and any other details you choose to share.
          </p>

          <h2 className="text-xl font-bold text-[#0A2240] mt-8 mb-4">2. Analytics and Cookies</h2>
          <p>
            Our website may use basic cookies or standard analytics tools to track visitor numbers, page views, and general website performance. This helps us improve our online presence and better serve our customers.
          </p>

          <h2 className="text-xl font-bold text-[#0A2240] mt-8 mb-4">3. Data Sharing</h2>
          <p>
            We respect your privacy. Goyal Filling Station will never sell, rent, or trade your personal user information to third parties for any commercial purposes.
          </p>

          <h2 className="text-xl font-bold text-[#0A2240] mt-8 mb-4">4. Contact Details</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us at:
          </p>
          <p className="font-semibold text-[#0099D8]">info@goyalfillingstation.in</p>
        </div>
      </div>
    </div>
  );
}
