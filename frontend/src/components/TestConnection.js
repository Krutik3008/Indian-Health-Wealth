import React, { useState } from 'react';
import { authAPI, assessmentAPI } from '../services/api';

const TestConnection = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testBackend = async () => {
    setLoading(true);
    try {
      // Test registration
      const testUser = {
        email: `test${Date.now()}@example.com`,
        password: 'test123',
        name: 'Test User'
      };
      
      const response = await authAPI.register(testUser);
      
      if (response.data.token) {
        setStatus('✅ Backend and Database connected successfully!');
        
        // Test assessment submission
        const testAssessment = {
          traits: {
            bodyBuild: 'medium',
            skin: 'normal',
            hair: 'thick',
            appetite: 'steady',
            digestion: 'slow',
            sleep: 'deep',
            energy: 'steady',
            temperament: 'calm',
            memory: 'slow-steady',
            weatherPreference: 'dry'
          }
        };
        
        localStorage.setItem('token', response.data.token);
        const assessmentResponse = await assessmentAPI.submit(testAssessment);
        
        if (assessmentResponse.data.success) {
          setStatus('✅ Full stack connection working! Data stored in database.');
        }
      }
    } catch (error) {
      setStatus(`❌ Connection failed: ${error.response?.data?.msg || error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-bold mb-2">Connection Test</h3>
      <button 
        onClick={testBackend}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Backend Connection'}
      </button>
      {status && <p className="mt-2">{status}</p>}
    </div>
  );
};

export default TestConnection;