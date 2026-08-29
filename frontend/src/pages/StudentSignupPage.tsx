import React from 'react';
import { StudentForm } from '../components/student/StudentForm';

export const StudentSignupPage: React.FC = () => {
  return (
    <main className="py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StudentForm />
      </div>
    </main>
  );
};

export default StudentSignupPage;
