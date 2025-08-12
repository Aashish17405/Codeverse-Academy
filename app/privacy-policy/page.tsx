"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function PrivacyPolicy() {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    interpretation: true,
    "data-collection": true,
    "personal-data-usage": true,
    "data-retention": true,
    "childrens-privacy": true,
    links: true,
    changes: true,
    contact: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 bg-white dark:bg-gray-900">
      <header className="border-b pb-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Privacy Policy
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Last updated: May 09, 2025
        </p>
      </header>

      <section className="prose dark:prose-invert max-w-none mb-12">
        <p>
          This Privacy Policy outlines our policies and procedures on
          collecting, using, and disclosing your information when you use our
          Service. It also explains your privacy rights and how applicable laws
          protect you.
        </p>
        <p>
          By using our Service, you consent to the collection and use of your
          personal data in accordance with this Privacy Policy. This document
          was generated with assistance from the{" "}
          <a
            href="https://www.termsfeed.com/privacy-policy-generator/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Privacy Policy Generator
          </a>
          .
        </p>
      </section>

      <section className="space-y-6">
        {/* Interpretation and Definitions */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("interpretation")}
            className="flex justify-between items-center w-full p-4 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-expanded={expandedSections["interpretation"]}
            aria-controls="section-interpretation"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Interpretation and Definitions
            </h2>
            {expandedSections["interpretation"] ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {expandedSections["interpretation"] && (
            <div
              id="section-interpretation"
              className="p-4 bg-white dark:bg-gray-900 prose dark:prose-invert max-w-none"
            >
              <h3 className="text-lg font-medium mt-4 text-gray-900 dark:text-white">
                Interpretation
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Capitalized words have specific meanings as defined below. These
                definitions apply whether the words appear in singular or plural
                form.
              </p>

              <h3 className="text-lg font-medium mt-6 text-gray-900 dark:text-white">
                Definitions
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                For the purposes of this Privacy Policy:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  <strong>Account</strong>: a unique account created for You to
                  access our Service or parts of it.
                </li>
                <li>
                  <strong>Affiliate</strong>: an entity controlling, controlled
                  by, or under common control with a party (ownership of 50% or
                  more voting shares).
                </li>
                <li>
                  <strong>Company</strong>: refers to AstraTech, located at 3rd
                  Floor, Suman Tower, Sher-e-Punjab Chowk, Adityapur,
                  Jamshedpur.
                </li>
                <li>
                  <strong>Cookies</strong>: small files placed on Your device by
                  a website to store browsing information.
                </li>
                <li>
                  <strong>Country</strong>: refers to Jharkhand, India.
                </li>
                <li>
                  <strong>Device</strong>: any device capable of accessing the
                  Service, such as a computer, phone, or tablet.
                </li>
                <li>
                  <strong>Personal Data</strong>: information relating to an
                  identified or identifiable individual.
                </li>
                <li>
                  <strong>Service</strong>: the Website and its related
                  services.
                </li>
                <li>
                  <strong>Service Provider</strong>: third-party companies or
                  individuals who process data on behalf of the Company to
                  facilitate or analyze the Service.
                </li>
                <li>
                  <strong>Usage Data</strong>: data collected automatically from
                  use of the Service or its infrastructure (e.g., page visit
                  durations).
                </li>
                <li>
                  <strong>Website</strong>: AstraTech, accessible at{" "}
                  <a
                    href="https://www.astratechai.com"
                    target="_blank"
                    rel="noopener noreferrer nofollow external"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    https://www.astratechai.com
                  </a>
                </li>
                <li>
                  <strong>You</strong>: the individual or entity accessing or
                  using the Service.
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Data Collection */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("data-collection")}
            className="flex justify-between items-center w-full p-4 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-expanded={expandedSections["data-collection"]}
            aria-controls="section-data-collection"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Collecting and Using Your Personal Data
            </h2>
            {expandedSections["data-collection"] ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {expandedSections["data-collection"] && (
            <div
              id="section-data-collection"
              className="p-4 bg-white dark:bg-gray-900 prose dark:prose-invert max-w-none"
            >
              <h3 className="text-lg font-medium mt-4 text-gray-900 dark:text-white">
                Types of Data Collected
              </h3>

              <h4 className="text-base font-medium mt-4 text-gray-900 dark:text-white">
                Personal Data
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                When using our Service, we may request personal information that
                can identify or contact you. This may include:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Email address</li>
                <li>First and last name</li>
                <li>Phone number</li>
                <li>Usage Data</li>
              </ul>

              <h4 className="text-base font-medium mt-4 text-gray-900 dark:text-white">
                Usage Data
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                Usage Data is collected automatically and may include your
                device’s IP address, browser type and version, pages visited,
                visit times and durations, unique device identifiers, and
                diagnostic data.
              </p>

              <h4 className="text-base font-medium mt-4 text-gray-900 dark:text-white">
                Tracking Technologies and Cookies
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                We use Cookies and similar technologies (beacons, tags, scripts)
                to track activity on our Service and store certain information
                to improve and analyze it.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                For more details, see our Cookies Policy or the Cookies section
                of this Privacy Policy.
              </p>
            </div>
          )}
        </div>

        {/* Personal Data Usage */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("personal-data-usage")}
            className="flex justify-between items-center w-full p-4 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-expanded={expandedSections["personal-data-usage"]}
            aria-controls="section-personal-data-usage"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Use of Your Personal Data
            </h2>
            {expandedSections["personal-data-usage"] ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>
          {expandedSections["personal-data-usage"] && (
            <div
              id="section-personal-data-usage"
              className="p-4 bg-white dark:bg-gray-900 prose dark:prose-invert max-w-none"
            >
              <p className="text-gray-700 dark:text-gray-300">
                We use your Personal Data to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Provide and maintain our Service</li>
                <li>Notify you about changes to our Service</li>
                <li>Allow participation in interactive features</li>
                <li>Provide customer support</li>
                <li>Gather analysis to improve the Service</li>
                <li>Monitor usage trends</li>
                <li>Detect, prevent, and address technical issues</li>
              </ul>
            </div>
          )}
        </div>

        {/* Data Retention */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("data-retention")}
            className="flex justify-between items-center w-full p-4 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-expanded={expandedSections["data-retention"]}
            aria-controls="section-data-retention"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Retention of Your Personal Data
            </h2>
            {expandedSections["data-retention"] ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {expandedSections["data-retention"] && (
            <div
              id="section-data-retention"
              className="p-4 bg-white dark:bg-gray-900 prose dark:prose-invert max-w-none"
            >
              <p className="text-gray-700 dark:text-gray-300">
                We retain your Personal Data only as long as necessary to
                fulfill the purposes stated in this Privacy Policy. We will
                retain and use your data to comply with legal obligations,
                resolve disputes, and enforce agreements.
              </p>
            </div>
          )}
        </div>

        {/* Children’s Privacy */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("childrens-privacy")}
            className="flex justify-between items-center w-full p-4 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-expanded={expandedSections["childrens-privacy"]}
            aria-controls="section-childrens-privacy"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Children’s Privacy
            </h2>
            {expandedSections["childrens-privacy"] ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {expandedSections["childrens-privacy"] && (
            <div
              id="section-childrens-privacy"
              className="p-4 bg-white dark:bg-gray-900 prose dark:prose-invert max-w-none"
            >
              <p className="text-gray-700 dark:text-gray-300">
                Our Service does not address anyone under 13 years old. We do
                not knowingly collect personal information from children under
                13. If you believe we have inadvertently collected such data,
                please contact us so we can delete it.
              </p>
            </div>
          )}
        </div>

        {/* Links to Other Websites */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("links")}
            className="flex justify-between items-center w-full p-4 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-expanded={expandedSections["links"]}
            aria-controls="section-links"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Links to Other Websites
            </h2>
            {expandedSections["links"] ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {expandedSections["links"] && (
            <div
              id="section-links"
              className="p-4 bg-white dark:bg-gray-900 prose dark:prose-invert max-w-none"
            >
              <p className="text-gray-700 dark:text-gray-300">
                Our Service may contain links to third-party websites. We have
                no control over their content or privacy practices and are not
                responsible for their policies. We encourage you to review their
                privacy policies when visiting them.
              </p>
            </div>
          )}
        </div>

        {/* Changes to this Privacy Policy */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("changes")}
            className="flex justify-between items-center w-full p-4 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-expanded={expandedSections["changes"]}
            aria-controls="section-changes"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Changes to this Privacy Policy
            </h2>
            {expandedSections["changes"] ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {expandedSections["changes"] && (
            <div
              id="section-changes"
              className="p-4 bg-white dark:bg-gray-900 prose dark:prose-invert max-w-none"
            >
              <p className="text-gray-700 dark:text-gray-300">
                We may update our Privacy Policy periodically. We will notify
                you of any changes by posting the new Privacy Policy on this
                page. Changes are effective immediately upon posting. We
                encourage you to review this policy regularly.
              </p>
            </div>
          )}
        </div>

        {/* Contact Us */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("contact")}
            className="flex justify-between items-center w-full p-4 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-expanded={expandedSections["contact"]}
            aria-controls="section-contact"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Contact Us
            </h2>
            {expandedSections["contact"] ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {expandedSections["contact"] && (
            <div
              id="section-contact"
              className="p-4 bg-white flex dark:bg-gray-900 prose dark:prose-invert max-w-none"
            >
              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  If you have any questions about this Privacy Policy, please
                  contact us at:
                </p>
                <address className="not-italic text-gray-700 dark:text-gray-300 mt-2">
                  AstraTech
                  <br />
                  3rd Floor, Suman Tower,
                  <br />
                  Sher-e-Punjab Chowk,
                  <br />
                  Adityapur, Jamshedpur
                  <br />
                  Email:{" "}
                  <a
                    href="mailto:support@astratechai.com"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    support@astratechai.com
                  </a>
                </address>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  If you have any questions about this Privacy Policy, please
                  contact us at:
                </p>
                <address className="not-italic text-gray-700 dark:text-gray-300 mt-2">
                  Devraj Srivastawa
                  <br />
                  Q.no - 100/2/3, Road number - 5 Adityapur, Jamshedpur
                  <br />
                  <br />
                  Phone number - 7004933980
                  <br />
                  Email:{" "}
                  <a
                    href="dev5032@outlook.com"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    dev5032@outlook.com
                  </a>
                </address>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
