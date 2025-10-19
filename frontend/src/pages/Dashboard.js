import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { progressAPI, assessmentAPI } from '../services/api';
import AssessmentHistory from '../components/AssessmentHistory';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    assessments: 0,
    recommendations: 0,
    recipes: 0,
    posts: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const assessmentResponse = await assessmentAPI.getHistory();
        setStats({
          assessments: assessmentResponse.data.length,
          recommendations: parseInt(localStorage.getItem('recommendationsViewed') || '0'),
          recipes: parseInt(localStorage.getItem('recipesExplored') || '0'),
          posts: parseInt(localStorage.getItem('communityPosts') || '0')
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setStats({ 
          assessments: 0, 
          recommendations: parseInt(localStorage.getItem('recommendationsViewed') || '0'),
          recipes: parseInt(localStorage.getItem('recipesExplored') || '0'),
          posts: parseInt(localStorage.getItem('communityPosts') || '0')
        });
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [user]);

  const features = [
    {
      title: 'Prakriti Assessment',
      description: 'Comprehensive body constitution analysis with detailed trait comparison',
      link: '/assessment',
      icon: '🧘‍♀️',
      gradient: 'from-blue-500 to-purple-600',
      hoverGradient: 'from-blue-600 to-purple-700',
    },
    {
      title: 'Personalized Recommendations',
      description: 'Tailored lifestyle, diet, and wellness recommendations for your dosha',
      link: '/recommendations',
      icon: '💡',
      gradient: 'from-green-500 to-teal-600',
      hoverGradient: 'from-green-600 to-teal-700',
    },
    {
      title: 'Ayurvedic Recipes',
      description: 'Discover traditional recipes that balance your constitution',
      link: '/recipes',
      icon: '🍽️',
      gradient: 'from-orange-500 to-red-600',
      hoverGradient: 'from-orange-600 to-red-700',
    },
    {
      title: 'Wellness Community',
      description: 'Connect with others on their Ayurvedic wellness journey',
      link: '/forum',
      icon: '👥',
      gradient: 'from-purple-500 to-pink-600',
      hoverGradient: 'from-purple-600 to-pink-700',
    },
  ];

  const doshaInfo = [
    {
      name: 'Vata',
      element: 'Air + Space',
      icon: '💨',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      traits: ['Creative', 'Energetic', 'Quick-thinking', 'Variable']
    },
    {
      name: 'Pitta', 
      element: 'Fire + Water',
      icon: '🔥',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      traits: ['Focused', 'Determined', 'Sharp intellect', 'Goal-oriented']
    },
    {
      name: 'Kapha',
      element: 'Earth + Water', 
      icon: '🌍',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      traits: ['Calm', 'Steady', 'Nurturing', 'Enduring']
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3 flex items-center">
              <span className="text-5xl mr-4">🙏</span>
              Namaste, {user?.name}!
            </h1>
            <p className="text-xl text-orange-100 mb-2">
              Welcome to your Ayurvedic Wellness Dashboard
            </p>
            <p className="text-orange-200">
              Discover your unique body constitution and achieve optimal health through ancient wisdom
            </p>
          </div>
          <div className="hidden md:block text-8xl opacity-20">
            🕉️
          </div>
        </div>
      </div>

      {/* Project Information */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="text-3xl mr-3">📚</span>
          About This Project
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-200 hover:shadow-md transition-shadow duration-200">
            <h3 className="font-semibold text-indigo-800 mb-3 flex items-center">
              <span className="text-lg mr-2">🎓</span>
              Academic Project
            </h3>
            <div className="space-y-2 text-indigo-700 text-sm">
              <p><strong>Course:</strong> Indian Health, Wellness and Psychology</p>
              <p><strong>Student ID:</strong> 202203103510037</p>
              <p><strong>Developer:</strong> Patel Krutik Chandreshbhai</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-teal-50 p-5 rounded-xl border border-green-200 hover:shadow-md transition-shadow duration-200">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center">
              <span className="text-lg mr-2">🎯</span>
              Project Objective
            </h3>
            <p className="text-green-700 text-sm leading-relaxed">
              Help students identify their body constitution (Prakriti) through comprehensive digital assessment.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-5 rounded-xl border border-yellow-200 hover:shadow-md transition-shadow duration-200">
            <h3 className="font-semibold text-yellow-800 mb-3 flex items-center">
              <span className="text-lg mr-2">🔬</span>
              Assessment Features
            </h3>
            <ul className="text-yellow-700 space-y-1 text-sm">
              <li>• Physical trait analysis</li>
              <li>• Mental pattern assessment</li>
              <li>• Daily habits evaluation</li>
              <li>• Environmental reactions</li>
              <li>• Dosha distribution</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-pink-50 to-red-50 p-5 rounded-xl border border-pink-200 hover:shadow-md transition-shadow duration-200">
            <h3 className="font-semibold text-pink-800 mb-3 flex items-center">
              <span className="text-lg mr-2">💎</span>
              Key Benefits
            </h3>
            <ul className="text-pink-700 space-y-1 text-sm">
              <li>• Personalized analysis</li>
              <li>• Detailed comparisons</li>
              <li>• Lifestyle recommendations</li>
              <li>• Educational insights</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Three Doshas Information */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="text-3xl mr-3">⚖️</span>
          Understanding the Three Doshas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {doshaInfo.map((dosha, index) => (
            <div key={index} className={`${dosha.bgColor} ${dosha.borderColor} border-2 rounded-xl p-5 h-72 flex flex-col hover:shadow-xl hover:scale-105 transition-all duration-300 group`}>
              <div className="text-center mb-4 flex-shrink-0">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">{dosha.icon}</div>
                <h3 className={`text-xl font-bold ${dosha.color} mb-1`}>{dosha.name}</h3>
                <p className={`text-xs ${dosha.color} opacity-75 font-medium`}>{dosha.element}</p>
              </div>
              <div className="space-y-2 flex-grow">
                {dosha.traits.map((trait, traitIndex) => (
                  <div key={traitIndex} className={`${dosha.color} text-sm flex items-center`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 opacity-70 flex-shrink-0"></span>
                    <span className="font-medium">{trait}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Link
            key={index}
            to={feature.link}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 block transform hover:-translate-y-1"
          >
            <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} group-hover:bg-gradient-to-br group-hover:${feature.hoverGradient} rounded-2xl flex items-center justify-center text-white text-3xl mb-6 transition-all duration-300`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
              {feature.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {feature.description}
            </p>
            <div className="mt-4 flex items-center text-orange-600 font-semibold">
              <span>Explore</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="text-3xl mr-3">📊</span>
          Your Wellness Journey
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="text-3xl mb-2">🧘‍♀️</div>
            <div className="text-3xl font-bold text-blue-600 mb-1">{stats.assessments}</div>
            <div className="text-sm text-blue-700 font-medium">Assessments Completed</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-200">
            <div className="text-3xl mb-2">💡</div>
            <div className="text-3xl font-bold text-green-600 mb-1">{stats.recommendations}</div>
            <div className="text-sm text-green-700 font-medium">Recommendations Viewed</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
            <div className="text-3xl mb-2">🍽️</div>
            <div className="text-3xl font-bold text-orange-600 mb-1">{stats.recipes}</div>
            <div className="text-sm text-orange-700 font-medium">Recipes Explored</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-3xl font-bold text-purple-600 mb-1">{stats.posts}</div>
            <div className="text-sm text-purple-700 font-medium">Community Posts</div>
          </div>
        </div>
      </div>

      {/* Assessment History */}
      {user && <AssessmentHistory />}

      {/* Ayurvedic Recipe Collection */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="text-3xl mr-3">🍽️</span>
          Ayurvedic Recipe Collection
        </h2>
        <p className="text-gray-600 mb-6">
          Discover traditional recipes crafted to balance your dosha and nourish your body according to ancient Ayurvedic principles.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
            <div className="text-3xl mb-3">💨</div>
            <h3 className="font-bold text-blue-800 mb-2">Vata Recipes</h3>
            <p className="text-blue-700 text-sm mb-4">Warming, grounding foods that calm and nourish</p>
            <ul className="text-blue-600 text-sm space-y-1">
              <li>• Warming oatmeal with dates</li>
              <li>• Mung bean soup</li>
              <li>• Golden milk latte</li>
            </ul>
          </div>
          <div className="bg-red-50 p-6 rounded-xl border border-red-200">
            <div className="text-3xl mb-3">🔥</div>
            <h3 className="font-bold text-red-800 mb-2">Pitta Recipes</h3>
            <p className="text-red-700 text-sm mb-4">Cooling, soothing foods that reduce heat</p>
            <ul className="text-red-600 text-sm space-y-1">
              <li>• Cucumber mint salad</li>
              <li>• Coconut rice with cilantro</li>
              <li>• Rose petal lassi</li>
            </ul>
          </div>
          <div className="bg-green-50 p-6 rounded-xl border border-green-200">
            <div className="text-3xl mb-3">🌍</div>
            <h3 className="font-bold text-green-800 mb-2">Kapha Recipes</h3>
            <p className="text-green-700 text-sm mb-4">Light, spicy foods that energize and stimulate</p>
            <ul className="text-green-600 text-sm space-y-1">
              <li>• Spiced quinoa breakfast bowl</li>
              <li>• Ginger turmeric tea</li>
              <li>• Spicy lentil curry</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-6">
          <Link
            to="/recipes"
            className="inline-flex items-center bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-200 shadow-lg"
          >
            <span className="text-xl mr-2">🍽️</span>
            Explore All Recipes
          </Link>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-xl text-indigo-100 mb-6">
            Start with our comprehensive Prakriti assessment to discover your unique body constitution
          </p>
          <Link
            to="/assessment"
            className="inline-flex items-center bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-colors duration-200 shadow-lg"
          >
            <span className="text-2xl mr-3">🚀</span>
            Start Assessment Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;