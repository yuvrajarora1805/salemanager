import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Goyal Filling Station",
  description: "Terms of Service for Goyal Filling Station",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-8 border-b pb-6">
          <Link href="/" className="text-[#0099D8] hover:underline mb-6 inline-block font-semibold">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-[#0A2240]">Terms of Service</h1>
          <p className="text-gray-500 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-blue max-w-none text-gray-700 space-y-6">
          <p>
            Welcome to the Goyal Filling Station website. By accessing or using this website, you agree to comply with and be bound by the following terms and conditions.
          </p>

          <h2 className="text-xl font-bold text-[#0A2240] mt-8 mb-4">1. Acceptable Use</h2>
          <p>
            Users agree to use this website only for lawful purposes. You agree not to misuse the website, attempt to gain unauthorized access to our servers, or scrape data, images, or content from the site for unauthorized use.
          </p>

          <h2 className="text-xl font-bold text-[#0A2240] mt-8 mb-4">2. Intellectual Property</h2>
          <p>
            All content on this website, including but not limited to the gallery images, text, and design, belongs to Goyal Filling Station unless otherwise noted. The "Nayara Energy" logos and related branding belong strictly to Nayara Energy. Unauthorized reproduction is prohibited.
          </p>

          <h2 className="text-xl font-bold text-[#0A2240] mt-8 mb-4">3. Offer Terms and Schemes</h2>
          <p>
            Any "Offers & Schemes" displayed on this website are strictly subject to availability. Goyal Filling Station reserves the right to modify, suspend, or cancel any offer without prior notice. All offers must be claimed in person at the station, and management decisions regarding eligibility are final.
          </p>

          <h2 className="text-xl font-bold text-[#0A2240] mt-8 mb-4">4. Modifications to Terms</h2>
          <p>
            We may revise these Terms of Service at any time without notice. By using this website, you agree to be bound by the current version of these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}
