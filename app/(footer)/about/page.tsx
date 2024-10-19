import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-6">
            About Virtual Assessment Platform
          </h1>
          <p className="text-black dark:text-blue-600 mb-4">
            The Virtual Assessment Platform is a comprehensive web application designed to enhance
            the examination preparation process for students and educators. Our system streamlines
            the organization, management, and retrieval of both multiple-choice questions (MCQs) and
            descriptive questions across a wide range of subjects.
          </p>
          <p className="text-black dark:text-blue-600 mb-4">
            Students can practice and review questions to better prepare for their midterm and final
            exams, while administrators have full control over managing assessment platform. With a
            user-friendly interface, our platform provides the following key features:
          </p>
          <ul className="list-disc list-inside text-black dark:text-blue-600 mb-4">
            <li>Efficient storage and categorization of questions.</li>
            <li>Support for both MCQs and descriptive questions.</li>
            <li>Search functionality with filtering by question type and difficulty.</li>
            <li>Real-time question management for administrators.</li>
            <li>Performance analytics for students to track their progress.</li>
          </ul>
          <p className="text-black dark:text-blue-600 mb-4">
            Our goal is to create a platform that helps students improve their exam performance
            while reducing the administrative burden on educators. Join us in reshaping the exam
            preparation process with modern technology.
          </p>
          <h2 className="text-2xl font-bold text-black dark:text-white mt-8 mb-4">Our Mission</h2>
          <p className="text-black dark:text-blue-600 mb-4">
            To provide students and educators with a powerful and intuitive platform that simplifies
            exam preparation and enhances academic outcomes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
