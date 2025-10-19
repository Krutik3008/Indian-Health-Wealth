import React, { useState, useEffect } from 'react';
import { assessmentAPI } from '../services/api';

const AssessmentHistory = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await assessmentAPI.getHistory();
        setAssessments(response.data);
      } catch (error) {
        console.error('Failed to fetch assessment history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (assessments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🧘♀️</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Assessments Yet</h3>
        <p className="text-gray-600">Take your first Prakriti assessment to see your results here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="text-3xl mr-3">📊</span>
        Assessment History
      </h3>
      
      <div className="space-y-4">
        {assessments.map((assessment) => {
          const date = new Date(assessment.created_at).toLocaleDateString();
          const doshaColors = {
            vata: 'bg-blue-100 text-blue-800',
            pitta: 'bg-red-100 text-red-800',
            kapha: 'bg-green-100 text-green-800'
          };
          
          return (
            <div key={assessment.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">Assessment #{assessment.id}</h4>
                  <p className="text-gray-600">{date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${doshaColors[assessment.dosha_result] || 'bg-gray-100 text-gray-800'}`}>
                  {assessment.dosha_result?.charAt(0).toUpperCase() + assessment.dosha_result?.slice(1)} Dominant
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl mb-1">💨</div>
                  <div className="text-sm text-blue-700">Vata Responses</div>
                  <div className="text-lg font-semibold text-blue-800">
                    {Object.values(assessment.responses).filter(r => r === 'vata').length}
                  </div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl mb-1">🔥</div>
                  <div className="text-sm text-red-700">Pitta Responses</div>
                  <div className="text-lg font-semibold text-red-800">
                    {Object.values(assessment.responses).filter(r => r === 'pitta').length}
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl mb-1">🌍</div>
                  <div className="text-sm text-green-700">Kapha Responses</div>
                  <div className="text-lg font-semibold text-green-800">
                    {Object.values(assessment.responses).filter(r => r === 'kapha').length}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssessmentHistory;