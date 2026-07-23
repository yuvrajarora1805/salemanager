import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Disclaimer | Goyal Filling Station",
  description: "Disclaimer for Goyal Filling Station",
};

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-8 border-b pb-6">
          <Link href="/" className="text-[#0099D8] hover:underline mb-6 inline-block font-semibold">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-[#0A2240]">Disclaimer</h1>
          <p className="text-gray-500 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-blue max-w-none text-gray-700 space-y-6">
          <p>
            The information contained on the Goyal Filling Station website is for general information purposes only.
          </p>

          <h2 className="text-xl font-bold text-[#0A2240] mt-8 mb-4">1. Information Accuracy</h2>
          <p>
            While we strive to keep the website content updated and correct, Goyal Filling Station makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, fuel prices, products, services, operating hours, or related graphics contained on the website for any purpose. Any reliance you place on such information is therefore strictly at your own risk.
          </p>

          <h2 className="text-xl font-bold text-[#0A2240] mt-8 mb-4">2. External Links</h2>
          <p>
            Through this website, you are able to link to other websites (such as Nayara Energy official links) which are not under the control of Goyal Filling Station. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
          </p>

          <h2 className="text-xl font-bold text-[#0A2240] mt-8 mb-4">3. No Liability</h2>
          <p>
            In no event will Goyal Filling Station be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.
          </p>
        </div>
      </div>
    </div>
  );
}
