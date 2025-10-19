import React from 'react';
import AssessmentHistoryComponent from '../components/AssessmentHistory';

const AssessmentHistory = () => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <span className="text-4xl mr-4">📊</span>
          Assessment History
        </h1>
        <p className="text-indigo-100">View all your completed Prakriti assessments</p>
      </div>
      
      <AssessmentHistoryComponent />
    </div>
  );
};

export default AssessmentHistory;