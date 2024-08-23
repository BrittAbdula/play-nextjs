import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - FLUX AI Online",
  alternates: {
    canonical: '/privacy-policy/',
  }
}

export default function PrivacyPolicy() {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Privacy Policy</h1>
        <div className="space-y-6 text-gray-600 dark:text-gray-300">
          <p>
            Last updated: 2024-08-20
          </p>
          <p>
          Your privacy is important to us. It is FLUX AI Online&apos;s policy to respect your privacy regarding any information we may collect from you across our website, flextoimage.com, and other sites we own and operate.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200">Information Collection and Use</h2>
          <p>
            We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we&apos;re collecting it and how it will be used.
          </p>
          <p>
            You can sign up with your Google account so your FLUX AI Online account username will be prefilled with your name and your public profile picture.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200">Data Retention and Protection</h2>
          <p>
          We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we&apos;ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorised access, disclosure, copying, use or modification.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200">Data Sharing</h2>
          <p>
          We don&apos;t share any personally identifying information publicly or with third-parties, except when required to by law.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200">GDPR Compliance</h2>
          <p>
            We act in the capacity of a data controller and a data processor with regard to the personal data processed through FLUX AI Online and the services in terms of the applicable data protection laws, including the EU General Data Protection Regulation (GDPR).
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200">External Links</h2>
          <p>
            Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200">Your Rights</h2>
          <p>
            You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200">Acceptance of Policy</h2>
          <p>
            Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us.
          </p>
        </div>
      </div>
    );
  }