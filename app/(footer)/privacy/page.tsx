import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className=" shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-6">Privacy Policy</h1>
          <p className="text-black dark:text-blue-600 mb-4">
            At Virtual Assessment Platform, we are committed to protecting your privacy. This Privacy Policy
            explains how we collect, use, and safeguard your personal information when you use our platform.
          </p>
          
          <h2 className="text-2xl font-bold text-black dark:text-white mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-black dark:text-blue-600 mb-4">
            We collect the following types of information:
          </p>
          <ul className="list-disc list-inside text-black dark:text-blue-600 mb-4">
            <li><strong>Personal Information:</strong> This includes your name, email address, and other details you provide when creating an account.</li>
            <li><strong>Usage Data:</strong> We collect information on how you interact with our platform, such as pages visited, time spent, and questions answered.</li>
            <li><strong>Cookies:</strong> We use cookies to enhance your experience and gather information about your browsing activities.</li>
          </ul>

          <h2 className="text-2xl font-bold text-black dark:text-white mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-black dark:text-blue-600 mb-4">
            The information we collect is used to:
          </p>
          <ul className="list-disc list-inside text-black dark:text-blue-600 mb-4">
            <li>Provide, operate, and maintain the Virtual Assessment Platform.</li>
            <li>Personalize your experience on our platform.</li>
            <li>Analyze user activity and improve the platform’s functionality and content.</li>
            <li>Send notifications, updates, and support messages related to your use of the platform.</li>
          </ul>

          <h2 className="text-2xl font-bold text-black dark:text-white mt-8 mb-4">3. Data Security</h2>
          <p className="text-black dark:text-blue-600 mb-4">
            We implement a variety of security measures to protect your personal information. However, no method of transmission over the internet or method of electronic storage is completely secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="text-2xl font-bold text-black dark:text-white mt-8 mb-4">4. Third-Party Services</h2>
          <p className="text-black dark:text-blue-600 mb-4">
            We may use third-party service providers to help us operate the platform or perform services on our behalf, such as analytics or payment processing. These third parties have access to your information only to perform these tasks and are obligated not to disclose or use it for any other purpose.
          </p>

          <h2 className="text-2xl font-bold text-black dark:text-white mt-8 mb-4">5. Your Rights</h2>
          <p className="text-black dark:text-blue-600 mb-4">
            You have the right to access, correct, or delete the personal information we hold about you. You may also request that we limit the use of your data or object to its processing under certain conditions.
          </p>

          <h2 className="text-2xl font-bold text-black dark:text-white mt-8 mb-4">6. Changes to This Policy</h2>
          <p className="text-black dark:text-blue-600 mb-4">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. It is your responsibility to review this Privacy Policy periodically to stay informed of our practices.
          </p>

          <h2 className="text-2xl font-bold text-black dark:text-white mt-8 mb-4">7. Contact Us</h2>
          <p className="text-black dark:text-blue-600 mb-4">
            If you have any questions or concerns about this Privacy Policy or your personal data, please contact us at:
          </p>
          <p className="text-black dark:text-blue-600 mb-4">
            <strong>Email:</strong> support@example.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
