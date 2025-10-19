import React, { useState } from 'react';
import { useFormik } from 'formik';
import { assessmentAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Assessment = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();

  const questions = [
    {
      id: 'bodyType',
      question: 'What best describes your body type?',
      category: 'Physical Traits',
      options: [
        { value: 'vata', label: 'Thin, light frame (naturally slim)' },
        { value: 'pitta', label: 'Medium build, muscular' },
        { value: 'kapha', label: 'Large frame, heavy build' },
      ],
    },
    {
      id: 'skin',
      question: 'How would you describe your skin?',
      category: 'Physical Traits',
      options: [
        { value: 'vata', label: 'Dry, rough, occasionally dry' },
        { value: 'pitta', label: 'Warm, oily, sensitive' },
        { value: 'kapha', label: 'Thick, moist, balanced' },
      ],
    },
    {
      id: 'hair',
      question: 'What describes your hair type?',
      category: 'Physical Traits',
      options: [
        { value: 'vata', label: 'Dry, thin, brittle' },
        { value: 'pitta', label: 'Oily, fine, thinning' },
        { value: 'kapha', label: 'Thick, oily, strong' },
      ],
    },
    {
      id: 'eyes',
      question: 'How would you describe your eyes?',
      category: 'Physical Traits',
      options: [
        { value: 'vata', label: 'Small, dry, active' },
        { value: 'pitta', label: 'Medium, bright, penetrating' },
        { value: 'kapha', label: 'Large, calm, attractive' },
      ],
    },
    {
      id: 'mindset',
      question: 'What describes your general mindset?',
      category: 'Mental & Emotional',
      options: [
        { value: 'vata', label: 'Restless, quick-thinking' },
        { value: 'pitta', label: 'Intense, focused, determined' },
        { value: 'kapha', label: 'Calm, steady, peaceful' },
      ],
    },
    {
      id: 'memory',
      question: 'How is your memory?',
      category: 'Mental & Emotional',
      options: [
        { value: 'vata', label: 'Quick to learn, quick to forget' },
        { value: 'pitta', label: 'Sharp, clear, remembers easily' },
        { value: 'kapha', label: 'Slow to learn, long-term retention' },
      ],
    },
    {
      id: 'emotions',
      question: 'What describes your emotional tendencies?',
      category: 'Mental & Emotional',
      options: [
        { value: 'vata', label: 'Anxious, worried, changeable' },
        { value: 'pitta', label: 'Irritable, angry under pressure' },
        { value: 'kapha', label: 'Content, stable, calm' },
      ],
    },
    {
      id: 'diet',
      question: 'What are your dietary preferences?',
      category: 'Daily Habits',
      options: [
        { value: 'vata', label: 'Warm, moist, grounding foods' },
        { value: 'pitta', label: 'Cool, sweet, mild foods' },
        { value: 'kapha', label: 'Spicy, light, warm foods' },
      ],
    },
    {
      id: 'sleep',
      question: 'How is your sleep pattern?',
      category: 'Daily Habits',
      options: [
        { value: 'vata', label: 'Light sleeper, restless, easily disturbed' },
        { value: 'pitta', label: 'Sound sleep, moderate duration' },
        { value: 'kapha', label: 'Deep sleep, long duration' },
      ],
    },
    {
      id: 'energy',
      question: 'What describes your energy levels?',
      category: 'Daily Habits',
      options: [
        { value: 'vata', label: 'Variable, bursts of energy' },
        { value: 'pitta', label: 'Moderate, steady, consistent' },
        { value: 'kapha', label: 'Balanced with high and low periods' },
      ],
    },
    {
      id: 'weather',
      question: 'What weather do you prefer?',
      category: 'Environmental',
      options: [
        { value: 'vata', label: 'Warm, humid climates' },
        { value: 'pitta', label: 'Cool, dry climates' },
        { value: 'kapha', label: 'Warm, dry climates' },
      ],
    },
    {
      id: 'stress',
      question: 'How do you respond to stress?',
      category: 'Environmental',
      options: [
        { value: 'vata', label: 'Become anxious, worried' },
        { value: 'pitta', label: 'Become irritable, angry' },
        { value: 'kapha', label: 'Handle calmly, may withdraw' },
      ],
    },
  ];

  const formik = useFormik({
    initialValues: questions.reduce((acc, q) => ({ ...acc, [q.id]: '' }), {}),
    validate: (values) => {
      const errors = {};
      questions.forEach(q => {
        if (!values[q.id]) {
          errors[q.id] = 'Please select an answer';
        }
      });
      return errors;
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await assessmentAPI.submit(values);
        setResult(response.data.result);
      } catch (error) {
        console.error('Assessment submission failed:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  if (result) {
    return (
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Results Header */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-4 flex items-center">
            <span className="text-4xl mr-4">🌱</span>
            Your Prakriti Assessment Results
          </h2>
          <p className="text-orange-100 text-lg">
            Based on your responses, here's your Ayurvedic constitution analysis
          </p>
        </div>

        {/* Dosha Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {result.percentages && Object.entries(result.percentages).map(([dosha, percentage]) => {
            const colors = {
              vata: 'from-blue-500 to-purple-500',
              pitta: 'from-red-500 to-orange-500', 
              kapha: 'from-green-500 to-teal-500'
            };
            const icons = { vata: '💨', pitta: '🔥', kapha: '🌍' };
            const isPrimary = result.primaryDosha === dosha;
            const isSecondary = result.secondaryDosha === dosha;
            
            return (
              <div key={dosha} className={`bg-gradient-to-br ${colors[dosha]} text-white rounded-xl p-6 shadow-lg ${isPrimary ? 'ring-4 ring-yellow-400' : ''}`}>
                <div className="text-center">
                  <div className="text-4xl mb-2">{icons[dosha]}</div>
                  <h3 className="text-2xl font-bold capitalize mb-2">{dosha}</h3>
                  <div className="text-4xl font-bold mb-2">{percentage}%</div>
                  <div className="w-full bg-white bg-opacity-30 rounded-full h-3 mb-4">
                    <div 
                      className="bg-white rounded-full h-3 transition-all duration-1000"
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    ></div>
                  </div>
                  {isPrimary && (
                    <div className="bg-yellow-400 text-gray-800 rounded-lg p-2 mb-2">
                      <span className="text-sm font-semibold">🏆 Primary</span>
                    </div>
                  )}
                  {isSecondary && (
                    <div className="bg-white bg-opacity-20 rounded-lg p-2">
                      <span className="text-sm font-semibold">🥈 Secondary</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Constitution Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="text-3xl mr-3">📊</span>
            Your Constitution: {result.constitutionType}
          </h3>
          
          {/* Response Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">Assessment Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{result.scores?.vata || 0}</div>
                <div className="text-sm text-blue-700">Vata Responses</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{result.scores?.pitta || 0}</div>
                <div className="text-sm text-red-700">Pitta Responses</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{result.scores?.kapha || 0}</div>
                <div className="text-sm text-green-700">Kapha Responses</div>
              </div>
            </div>
            <div className="text-center mt-2 text-gray-600 text-sm">
              Total Questions: {result.totalQuestions || 0}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {result.primaryDosha && (
                <div className={`bg-gradient-to-r p-6 rounded-lg border-l-4 ${
                  result.primaryDosha === 'vata' ? 'from-blue-50 to-purple-50 border-blue-500' :
                  result.primaryDosha === 'pitta' ? 'from-red-50 to-orange-50 border-red-500' :
                  'from-green-50 to-teal-50 border-green-500'
                }`}>
                  <h4 className={`font-semibold mb-2 flex items-center ${
                    result.primaryDosha === 'vata' ? 'text-blue-800' :
                    result.primaryDosha === 'pitta' ? 'text-red-800' :
                    'text-green-800'
                  }`}>
                    <span className="mr-2">
                      {result.primaryDosha === 'vata' ? '💨' : result.primaryDosha === 'pitta' ? '🔥' : '🌍'}
                    </span> 
                    Primary: {result.primaryDosha.charAt(0).toUpperCase() + result.primaryDosha.slice(1)} ({result.percentages?.[result.primaryDosha] || 0}%)
                  </h4>
                  <div className={`text-sm ${
                    result.primaryDosha === 'vata' ? 'text-blue-700' :
                    result.primaryDosha === 'pitta' ? 'text-red-700' :
                    'text-green-700'
                  }`}>
                    You selected {result.scores?.[result.primaryDosha] || 0} {result.primaryDosha} responses out of {result.totalQuestions || 0} questions
                  </div>
                </div>
              )}
              
              {result.secondaryDosha && (
                <div className={`bg-gradient-to-r p-6 rounded-lg border-l-4 ${
                  result.secondaryDosha === 'vata' ? 'from-blue-50 to-purple-50 border-blue-500' :
                  result.secondaryDosha === 'pitta' ? 'from-red-50 to-orange-50 border-red-500' :
                  'from-green-50 to-teal-50 border-green-500'
                }`}>
                  <h4 className={`font-semibold mb-2 flex items-center ${
                    result.secondaryDosha === 'vata' ? 'text-blue-800' :
                    result.secondaryDosha === 'pitta' ? 'text-red-800' :
                    'text-green-800'
                  }`}>
                    <span className="mr-2">
                      {result.secondaryDosha === 'vata' ? '💨' : result.secondaryDosha === 'pitta' ? '🔥' : '🌍'}
                    </span> 
                    Secondary: {result.secondaryDosha.charAt(0).toUpperCase() + result.secondaryDosha.slice(1)} ({result.percentages?.[result.secondaryDosha] || 0}%)
                  </h4>
                  <div className={`text-sm ${
                    result.secondaryDosha === 'vata' ? 'text-blue-700' :
                    result.secondaryDosha === 'pitta' ? 'text-red-700' :
                    'text-green-700'
                  }`}>
                    You selected {result.scores?.[result.secondaryDosha] || 0} {result.secondaryDosha} responses
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8 rounded-xl border-2 border-amber-200 shadow-lg">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">🎯</div>
                  <h4 className="text-2xl font-bold text-amber-800 mb-2">Your Constitution Summary</h4>
                  <p className="text-lg font-semibold text-amber-700">
                    Based on your assessment, you have a <span className="text-amber-900 font-bold">{result.constitutionType}</span> constitution.
                  </p>
                </div>
                
                <div className="bg-white bg-opacity-70 rounded-lg p-6 mb-6">
                  <h5 className="font-bold text-amber-800 mb-4 flex items-center">
                    <span className="text-xl mr-2">🎯</span>
                    Primary Focus Areas:
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center text-amber-700">
                      <span className="text-amber-600 mr-2">•</span>
                      Balance your dominant {result.primaryDosha} dosha
                    </div>
                    {result.secondaryDosha && (
                      <div className="flex items-center text-amber-700">
                        <span className="text-amber-600 mr-2">•</span>
                        Support secondary {result.secondaryDosha} constitution
                      </div>
                    )}
                    <div className="flex items-center text-amber-700">
                      <span className="text-amber-600 mr-2">•</span>
                      Maintain overall harmony between all doshas
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                  <h5 className="font-bold text-green-800 mb-4 flex items-center">
                    <span className="text-xl mr-2">✨</span>
                    Key Benefits:
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center text-green-700">
                      <span className="text-green-600 mr-2">•</span>
                      Improved energy levels
                    </div>
                    <div className="flex items-center text-green-700">
                      <span className="text-green-600 mr-2">•</span>
                      Better digestion and sleep
                    </div>
                    <div className="flex items-center text-green-700">
                      <span className="text-green-600 mr-2">•</span>
                      Enhanced mental clarity
                    </div>
                    <div className="flex items-center text-green-700">
                      <span className="text-green-600 mr-2">•</span>
                      Emotional balance
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Constitution Recommendations */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-xl p-8 border border-indigo-200">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🌱</div>
            <h3 className="text-3xl font-bold text-indigo-900 mb-3">
              Your Personal Constitution Recommendations
            </h3>
            <p className="text-lg text-indigo-700 max-w-2xl mx-auto">
              Tailored guidance for your <span className="font-semibold text-indigo-800">{result.constitutionType}</span> constitution to achieve optimal health and balance
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-100 to-red-100 p-8 rounded-2xl shadow-lg border-2 border-orange-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">🍽️</div>
                  <h4 className="text-xl font-bold text-orange-800">Diet & Nutrition</h4>
                </div>
                <div className="space-y-3">
                  {result.recommendations?.diet?.map((item, index) => (
                    <div key={index} className="flex items-start text-orange-700">
                      <span className="text-orange-500 mr-3 mt-1 text-lg">✓</span>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-8 rounded-2xl shadow-lg border-2 border-green-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">🏠</div>
                  <h4 className="text-xl font-bold text-green-800">Lifestyle & Daily Routine</h4>
                </div>
                <div className="space-y-3">
                  {result.recommendations?.lifestyle?.map((item, index) => (
                    <div key={index} className="flex items-start text-green-700">
                      <span className="text-green-500 mr-3 mt-1 text-lg">✓</span>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-8 rounded-2xl shadow-lg border-2 border-blue-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">🏃♀️</div>
                  <h4 className="text-xl font-bold text-blue-800">Exercise & Movement</h4>
                </div>
                <div className="space-y-3">
                  {result.recommendations?.exercise?.map((item, index) => (
                    <div key={index} className="flex items-start text-blue-700">
                      <span className="text-blue-500 mr-3 mt-1 text-lg">✓</span>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-8 rounded-2xl shadow-lg border-2 border-purple-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">🧘♀️</div>
                  <h4 className="text-xl font-bold text-purple-800">Mental & Emotional Wellness</h4>
                </div>
                <div className="space-y-3">
                  {result.recommendations?.mentalHealth?.map((item, index) => (
                    <div key={index} className="flex items-start text-purple-700">
                      <span className="text-purple-500 mr-3 mt-1 text-lg">✓</span>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <div className="bg-white bg-opacity-70 rounded-xl p-6 border border-indigo-200">
              <p className="text-indigo-700 text-lg leading-relaxed">
                <span className="font-semibold">🌟 Remember:</span> These recommendations are based on your unique constitution. 
                Start gradually and listen to your body's response. Consistency is key to achieving lasting balance.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Table Toggle */}
        <div className="text-center">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            {showComparison ? 'Hide' : 'Show'} Response Comparison Table
          </button>
        </div>

        {/* Comparison Table */}
        {showComparison && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <h3 className="text-2xl font-bold flex items-center">
              <span className="text-3xl mr-3">📋</span>
              Your Response Analysis
            </h3>
            <p className="text-indigo-100 mt-2">Compare your responses with dosha characteristics</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Question</th>
                  <th className="px-6 py-4 text-center font-semibold text-blue-600">💨 Vata</th>
                  <th className="px-6 py-4 text-center font-semibold text-red-600">🔥 Pitta</th>
                  <th className="px-6 py-4 text-center font-semibold text-green-600">🌍 Kapha</th>
                  <th className="px-6 py-4 text-center font-semibold text-purple-600">🎯 Your Choice</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question, index) => {
                  const userChoice = formik.values[question.id];
                  const userOption = question.options.find(opt => opt.value === userChoice);
                  
                  return (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 font-medium text-gray-800">{question.question}</td>
                      <td className="px-6 py-4 text-center text-blue-700 text-sm">
                        {question.options.find(opt => opt.value === 'vata')?.label}
                      </td>
                      <td className="px-6 py-4 text-center text-red-700 text-sm">
                        {question.options.find(opt => opt.value === 'pitta')?.label}
                      </td>
                      <td className="px-6 py-4 text-center text-green-700 text-sm">
                        {question.options.find(opt => opt.value === 'kapha')?.label}
                      </td>
                      <td className={`px-6 py-4 text-center font-semibold text-sm bg-purple-50 ${
                        userChoice === 'vata' ? 'text-blue-700' :
                        userChoice === 'pitta' ? 'text-red-700' :
                        userChoice === 'kapha' ? 'text-green-700' :
                        'text-gray-500'
                      }`}>
                        {userOption?.label || 'Not answered'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => {
              setResult(null);
              setCurrentQuestion(0);
              formik.resetForm();
            }}
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg"
          >
            🔄 Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  const groupedQuestions = questions.reduce((acc, question) => {
    if (!acc[question.category]) acc[question.category] = [];
    acc[question.category].push(question);
    return acc;
  }, {});

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
          <span className="text-5xl mr-4">🧘♀️</span>
          Prakriti Assessment
        </h1>
        <p className="text-xl text-orange-100 mb-2">
          Discover Your Ayurvedic Body Constitution
        </p>
        <p className="text-orange-100">
          Answer these questions to identify your unique combination of Vata, Pitta, and Kapha doshas
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <span className="text-3xl mr-3">📝</span>
          Instructions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">💨 Vata (Air + Space)</h3>
            <p className="text-blue-700">Movement, creativity, quick thinking, variable energy</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">🔥 Pitta (Fire + Water)</h3>
            <p className="text-red-700">Transformation, focus, determination, sharp intellect</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">🌍 Kapha (Earth + Water)</h3>
            <p className="text-green-700">Structure, stability, calmness, endurance</p>
          </div>
        </div>
      </div>

      {/* Assessment Form */}
      <form onSubmit={formik.handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Question {currentQuestion + 1} of {questions.length}</span>
              <span className="text-sm text-gray-500">{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Current Question */}
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-4">
                {questions[currentQuestion].category === 'Physical Traits' && '👥'}
                {questions[currentQuestion].category === 'Mental & Emotional' && '🧠'}
                {questions[currentQuestion].category === 'Daily Habits' && '📅'}
                {questions[currentQuestion].category === 'Environmental' && '🌍'}
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">{questions[currentQuestion].category}</h3>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">{questions[currentQuestion].question}</h2>
            </div>
            
            <div className="space-y-4 max-w-2xl mx-auto">
              {questions[currentQuestion].options.map((option) => {
                const isSelected = formik.values[questions[currentQuestion].id] === option.value;
                return (
                  <label key={option.value} className={`flex items-start space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'border-orange-500 bg-orange-100 shadow-md' 
                      : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                  }`}>
                    <input
                      type="radio"
                      name={questions[currentQuestion].id}
                      value={option.value}
                      checked={isSelected}
                      onChange={formik.handleChange}
                      className="mt-1 text-orange-600 focus:ring-orange-500"
                    />
                    <span className={`flex-1 leading-relaxed ${
                      isSelected ? 'text-orange-800 font-medium' : 'text-gray-700'
                    }`}>{option.label}</span>
                    {isSelected && <span className="text-orange-600 text-xl">✓</span>}
                  </label>
                );
              })}
            </div>
            
            {formik.errors[questions[currentQuestion].id] && (
              <div className="text-red-500 text-center mt-4">{formik.errors[questions[currentQuestion].id]}</div>
            )}
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            ← Previous
          </button>
          
          {currentQuestion === questions.length - 1 ? (
            <button
              type="submit"
              disabled={loading || !formik.values[questions[currentQuestion].id]}
              className="bg-gradient-to-r from-orange-600 to-pink-600 text-white py-3 px-8 rounded-lg font-semibold hover:from-orange-700 hover:to-pink-700 disabled:opacity-50 transition-all duration-200 shadow-lg"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="text-xl mr-2">🔍</span>
                  Complete Assessment
                </span>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
              disabled={!formik.values[questions[currentQuestion].id]}
              className="bg-gradient-to-r from-orange-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-700 hover:to-pink-700 disabled:opacity-50 transition-all duration-200"
            >
              Next →
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Assessment;