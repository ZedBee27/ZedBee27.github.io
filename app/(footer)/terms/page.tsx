import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className=" shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-6">Terms of Service</h1>
          <p className="text-black dark:text-blue-600 mb-6">
            Welcome to Virtual Assessment Platform! By accessing or using our platform, you agree to comply with
            the following Terms of Service. Please read them carefully before using our services.
          </p>

          <h2 className="text-2xl font-bold text-black dark:text-white mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-black dark:text-blue-600 mb-4">
            By creating an account or using our services, you agree to these Terms of Service, as well as our
            Privacy Policy. If you do not agree to any part of the Terms, you should discontinue the use of our
            platform.
          </p>

          <h2 className="text-2xl font-bold text-black dark:text-white mt-8 mb-4">2. User Accounts</h2>
          <p className="text-black dark:text-blue-600 mb-4">
            To use certain features of the Virtual Assessment Platform, you must create an account. You are
            responsible for maintaining the confidentiality of your account information and for any activity that
            occurs under your account.
          </p>

          <h2 className="text-2xl font-bold text-black dark:text-white mt-8 mb-4">3. Use of the Platform</h2>
          <p className="text-black dark:text-blue-600 mb-4">
            You agree to use the platform for lawful purposes only. You are prohibited from using the platform to
            engage in any activity that violates any local, state, national, or international laws.
          </p>

          <h2 className="text-2xl font-bold text-black dark:text-white mt-8 mb-4">4. Intellectual Property</h2>
          <p className="text-black dark:text-blue-600 mb-4">
            All content, including but not limited to text, graphics, logos, and software, is the property of
            Virtual Assessment Platform or its content suppliers and is protected by copyright, trademark, and other
            intellectual property laws. You may not copy, modify, distribute, or reproduce any content without
            express written permission.
          </p>

          <h2 className="text-2xl font-bold text-black dark:text-white mt-8 mb-4">5. User-Generated Content</h2>
          <p className="text-black dark:text-blue-600 mb-4">
            Users may submit content such as questions, answers, and comments on the platform. By submitting
            content, you grant us a non-exclusive, royalty-free license to use, modify, and distribute the content
            on our platform.
          </p>

          <h2 className="text-2xl font-bold text-black dark:text-white mt-8 mb-4">6. Limitation of Liability</h2>
          <p className="text-black dark:text-blue-600 mb-4">
            Virtual Assessment Platform is not liable for any damages arising out of your use or inability to use
            the platform, including but not limited to direct, indirect, incidental, or consequential damages.
          </p>

          <h2 className="text-2xl font-bold text-black dark:text-white mt-8 mb-4">7. Termination</h2>
          <p className="text-black dark:text-blue-600 mb-4">
            We reserve the right to suspend or terminate your account and access to the platform at any time, for any
            reason, without prior notice. This includes violations of these Terms or any applicable laws.
          </p>

          <h2 className="text-2xl font-bold text-black dark:text-white mt-8 mb-4">8. Changes to Terms</h2>
          <p className="text-black dark:text-blue-600 mb-4">
            We may modify these Terms of Service at any time. Any changes will be posted on this page, and your
            continued use of the platform after such changes signifies your acceptance of the updated Terms.
          </p>

          <h2 className="text-2xl font-bold text-black dark:text-white mt-8 mb-4">9. Contact Us</h2>
          <p className="text-black dark:text-blue-600 mb-4">
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <p className="text-black dark:text-blue-600">
            <strong>Email:</strong> support@example.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
