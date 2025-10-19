import React, { useState, useEffect } from 'react';
import { recommendationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Recommendations = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState(null);
  const [selectedDosha, setSelectedDosha] = useState('pitta');
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showPersonalized, setShowPersonalized] = useState(true);
  const [viewedRecommendations, setViewedRecommendations] = useState(0);
  const [personalizedRecs, setPersonalizedRecs] = useState(null);

  const doshas = [
    { 
      value: 'vata', 
      label: 'Vata', 
      icon: '💨',
      gradient: 'from-blue-500 to-purple-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200'
    },
    { 
      value: 'pitta', 
      label: 'Pitta', 
      icon: '🔥',
      gradient: 'from-red-500 to-orange-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      borderColor: 'border-red-200'
    },
    { 
      value: 'kapha', 
      label: 'Kapha', 
      icon: '🌍',
      gradient: 'from-green-500 to-teal-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      borderColor: 'border-green-200'
    },
  ];

  const fetchPersonalizedRecommendations = async () => {
    try {
      const response = await recommendationsAPI.getPersonalized();
      setPersonalizedRecs(response.data);
    } catch (error) {
      console.error('Failed to fetch personalized recommendations:', error);
    }
  };

  const fetchRecommendations = async (dosha) => {
    setLoading(true);
    try {
      const response = await recommendationsAPI.getByDosha(dosha);
      setRecommendations(response.data);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      setRecommendations(getDefaultRecommendations(dosha));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations(selectedDosha);
    if (user) fetchPersonalizedRecommendations();
    
    // Track recommendation views
    const currentViews = parseInt(localStorage.getItem('recommendationsViewed') || '0');
    setViewedRecommendations(currentViews);
  }, [selectedDosha, user]);

  const trackRecommendationView = () => {
    const currentViews = parseInt(localStorage.getItem('recommendationsViewed') || '0');
    const newViews = currentViews + 1;
    localStorage.setItem('recommendationsViewed', newViews.toString());
    setViewedRecommendations(newViews);
  };

  const getDefaultRecommendations = (dosha) => {
    const defaults = {
      vata: {
        diet: ['Warm, cooked foods', 'Regular meal times', 'Healthy fats and oils', 'Sweet, sour, salty tastes'],
        lifestyle: ['Regular routines', 'Warm environment', 'Oil massage', 'Adequate rest'],
        exercise: ['Gentle yoga', 'Walking', 'Swimming', 'Tai chi'],
        mentalHealth: ['Meditation', 'Deep breathing', 'Calming music', 'Grounding activities']
      },
      pitta: {
        diet: ['Cooling foods', 'Sweet fruits', 'Avoid spicy foods', 'Moderate portions'],
        lifestyle: ['Stay cool', 'Regular sleep', 'Avoid overheating', 'Stress management'],
        exercise: ['Swimming', 'Moderate exercise', 'Moon salutations', 'Avoid competitive sports'],
        mentalHealth: ['Cooling pranayama', 'Nature walks', 'Avoid anger triggers', 'Peaceful activities']
      },
      kapha: {
        diet: ['Light, spicy foods', 'Reduce dairy', 'Smaller portions', 'Bitter and pungent tastes'],
        lifestyle: ['Stay active', 'Wake up early', 'Stimulating environment', 'Avoid excessive sleep'],
        exercise: ['Vigorous exercise', 'Running', 'Dynamic yoga', 'Cardio activities'],
        mentalHealth: ['Energizing activities', 'Social interaction', 'New experiences', 'Mental stimulation']
      }
    };
    return defaults[dosha] || defaults.pitta;
  };

  const toggleFavorite = (item) => {
    setFavorites(prev => 
      prev.includes(item) 
        ? prev.filter(fav => fav !== item)
        : [...prev, item]
    );
  };

  const currentDosha = doshas.find(d => d.value === selectedDosha);
  const displayRecommendations = recommendations || getDefaultRecommendations(selectedDosha);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center">
          <span className="text-5xl mr-4">💡</span>
          Personalized Recommendations
        </h1>
        <p className="text-xl text-indigo-100">
          Tailored wellness guidance based on Ayurvedic principles for optimal health and balance
        </p>
      </div>

      {/* Toggle Personalized View */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowPersonalized(!showPersonalized)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
        >
          {showPersonalized ? 'Hide' : 'Show'} Personal Recommendations
        </button>
      </div>

      {/* Personalized Section */}
      {personalizedRecs && showPersonalized && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="text-3xl mr-3">🎯</span>
            Your Personal Constitution Recommendations
          </h2>
          <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-6 rounded-xl border border-orange-200">
            <p className="text-orange-800 font-medium mb-4">
              Based on your assessment, you have a <strong>{personalizedRecs.constitutionType}</strong> constitution.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-orange-800 mb-2">Primary Focus Areas:</h4>
                <ul className="text-orange-700 space-y-1 text-sm">
                  {personalizedRecs.primaryFocus?.length > 0 ? (
                    personalizedRecs.primaryFocus.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))
                  ) : (
                    <>
                      <li>• Balance your dominant {personalizedRecs.primaryDosha || 'primary'} dosha</li>
                      {personalizedRecs.secondaryDosha && (
                        <li>• Support secondary {personalizedRecs.secondaryDosha} constitution</li>
                      )}
                      <li>• Maintain overall harmony between all doshas</li>
                    </>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-orange-800 mb-2">Key Benefits:</h4>
                <ul className="text-orange-700 space-y-1 text-sm">
                  <li>• Improved energy levels</li>
                  <li>• Better digestion and sleep</li>
                  <li>• Enhanced mental clarity</li>
                  <li>• Emotional balance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dosha Selection */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="text-3xl mr-3">⚖️</span>
          Explore Dosha-Specific Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {doshas.map((dosha) => (
            <button
              key={dosha.value}
              onClick={() => {
                setSelectedDosha(dosha.value);
                trackRecommendationView();
              }}
              className={`p-6 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                selectedDosha === dosha.value
                  ? `${dosha.bgColor} ${dosha.borderColor} border-2 shadow-lg`
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{dosha.icon}</div>
                <h3 className={`text-xl font-bold ${
                  selectedDosha === dosha.value ? dosha.textColor : 'text-gray-700'
                }`}>
                  {dosha.label}
                </h3>
                <p className={`text-sm mt-1 ${
                  selectedDosha === dosha.value ? dosha.textColor : 'text-gray-500'
                }`}>
                  {dosha.value === 'vata' && 'Air + Space'}
                  {dosha.value === 'pitta' && 'Fire + Water'}
                  {dosha.value === 'kapha' && 'Earth + Water'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
            <span className="text-gray-600">Loading recommendations...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Recommendation Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(displayRecommendations).map(([category, items]) => {
              const categoryIcons = {
                diet: '🍽️',
                lifestyle: '🏠',
                exercise: '🏃♀️',
                mentalHealth: '🧘♀️'
              };
              
              const isExpanded = expandedCategory === category;
              const displayItems = isExpanded ? items : items.slice(0, 3);
              
              return (
                <div key={category} className={`${currentDosha.bgColor} rounded-xl p-6 border ${currentDosha.borderColor} hover:shadow-lg transition-shadow`}>
                  <h3 className={`text-xl font-bold ${currentDosha.textColor} mb-4 flex items-center justify-between`}>
                    <span className="flex items-center">
                      <span className="text-2xl mr-3">{categoryIcons[category]}</span>
                      {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className={`text-sm ${currentDosha.textColor} opacity-70`}>
                      {items.length} tips
                    </span>
                  </h3>
                  <ul className={`${currentDosha.textColor} space-y-2`}>
                    {displayItems.map((item, index) => (
                      <li key={index} className="flex items-start justify-between group">
                        <div className="flex items-start flex-1">
                          <span className="w-2 h-2 rounded-full bg-current mt-2 mr-3 flex-shrink-0"></span>
                          <span>{item}</span>
                        </div>
                        <button
                          onClick={() => toggleFavorite(item)}
                          className={`ml-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                            favorites.includes(item) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                          }`}
                        >
                          {favorites.includes(item) ? '❤️' : '🤍'}
                        </button>
                      </li>
                    ))}
                  </ul>
                  {items.length > 3 && (
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? null : category)}
                      className={`mt-3 text-sm ${currentDosha.textColor} hover:underline`}
                    >
                      {isExpanded ? 'Show Less' : `Show ${items.length - 3} More`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Favorites Section */}
          {favorites.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-3xl mr-3">❤️</span>
                Your Favorite Recommendations ({favorites.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favorites.map((item, index) => (
                  <div key={index} className="bg-red-50 p-4 rounded-lg border border-red-200 flex items-start justify-between">
                    <span className="text-red-800">{item}</span>
                    <button
                      onClick={() => toggleFavorite(item)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      ❤️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="text-3xl mr-3">🚀</span>
              Quick Actions for {currentDosha.label} Balance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">🌅</div>
                <h3 className="font-bold text-gray-800 mb-2">Morning Routine</h3>
                <p className="text-gray-600 text-sm">
                  {selectedDosha === 'vata' && 'Wake early, oil massage, warm drinks, gentle movement'}
                  {selectedDosha === 'pitta' && 'Cool morning air, moderate exercise, avoid rushing'}
                  {selectedDosha === 'kapha' && 'Wake before sunrise, vigorous exercise, skip breakfast if not hungry'}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">🍽️</div>
                <h3 className="font-bold text-gray-800 mb-2">Meal Planning</h3>
                <p className="text-gray-600 text-sm">
                  {selectedDosha === 'vata' && 'Warm, cooked foods, regular meal times, healthy fats'}
                  {selectedDosha === 'pitta' && 'Cool, fresh foods, avoid spicy meals, eat in peaceful environment'}
                  {selectedDosha === 'kapha' && 'Light, spicy foods, smaller portions, avoid heavy meals'}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">🧘</div>
                <h3 className="font-bold text-gray-800 mb-2">Daily Practice</h3>
                <p className="text-gray-600 text-sm">
                  {selectedDosha === 'vata' && 'Grounding meditation, gentle yoga, consistent routines'}
                  {selectedDosha === 'pitta' && 'Cooling pranayama, moderate activities, avoid competition'}
                  {selectedDosha === 'kapha' && 'Energizing breathwork, vigorous exercise, stay active'}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Guidelines */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className={`text-2xl font-bold mb-6 flex items-center ${currentDosha.textColor}`}>
              <span className="text-3xl mr-3">{currentDosha.icon}</span>
              Complete {currentDosha.label} Lifestyle Guide
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className={`${currentDosha.bgColor} p-6 rounded-xl border ${currentDosha.borderColor}`}>
                  <h4 className={`font-bold ${currentDosha.textColor} mb-3`}>Daily Routine</h4>
                  <div className={`${currentDosha.textColor} space-y-2 text-sm`}>
                    {selectedDosha === 'vata' && (
                      <>
                        <p>• Wake up at 6 AM, sleep by 10 PM</p>
                        <p>• Eat meals at regular times</p>
                        <p>• Practice oil massage (Abhyanga)</p>
                        <p>• Create calm, warm environment</p>
                      </>
                    )}
                    {selectedDosha === 'pitta' && (
                      <>
                        <p>• Wake up at 5:30 AM, sleep by 10 PM</p>
                        <p>• Avoid midday sun exposure</p>
                        <p>• Take cool showers</p>
                        <p>• Practice moderation in all activities</p>
                      </>
                    )}
                    {selectedDosha === 'kapha' && (
                      <>
                        <p>• Wake up before 6 AM, avoid daytime naps</p>
                        <p>• Stay active throughout the day</p>
                        <p>• Dry brushing before shower</p>
                        <p>• Seek stimulating environments</p>
                      </>
                    )}
                  </div>
                </div>
                
                <div className={`${currentDosha.bgColor} p-6 rounded-xl border ${currentDosha.borderColor}`}>
                  <h4 className={`font-bold ${currentDosha.textColor} mb-3`}>Seasonal Adjustments</h4>
                  <div className={`${currentDosha.textColor} space-y-2 text-sm`}>
                    {selectedDosha === 'vata' && (
                      <>
                        <p>• Extra care during fall/winter</p>
                        <p>• Increase warm, oily foods</p>
                        <p>• Protect from cold and wind</p>
                      </>
                    )}
                    {selectedDosha === 'pitta' && (
                      <>
                        <p>• Extra care during summer</p>
                        <p>• Increase cooling foods and activities</p>
                        <p>• Avoid excessive heat exposure</p>
                      </>
                    )}
                    {selectedDosha === 'kapha' && (
                      <>
                        <p>• Extra care during spring</p>
                        <p>• Increase light, warming foods</p>
                        <p>• Boost physical activity</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className={`${currentDosha.bgColor} p-6 rounded-xl border ${currentDosha.borderColor}`}>
                  <h4 className={`font-bold ${currentDosha.textColor} mb-3`}>Foods to Favor</h4>
                  <div className={`${currentDosha.textColor} space-y-2 text-sm`}>
                    {selectedDosha === 'vata' && (
                      <>
                        <p>• Warm, cooked grains and vegetables</p>
                        <p>• Ghee, sesame oil, nuts</p>
                        <p>• Sweet fruits like bananas, dates</p>
                        <p>• Warm spices: ginger, cinnamon</p>
                      </>
                    )}
                    {selectedDosha === 'pitta' && (
                      <>
                        <p>• Cool, sweet fruits and vegetables</p>
                        <p>• Coconut, cucumber, leafy greens</p>
                        <p>• Cooling spices: coriander, fennel</p>
                        <p>• Room temperature or cool foods</p>
                      </>
                    )}
                    {selectedDosha === 'kapha' && (
                      <>
                        <p>• Light, dry, warm foods</p>
                        <p>• Spicy vegetables and legumes</p>
                        <p>• Warming spices: black pepper, ginger</p>
                        <p>• Bitter greens and astringent fruits</p>
                      </>
                    )}
                  </div>
                </div>
                
                <div className={`${currentDosha.bgColor} p-6 rounded-xl border ${currentDosha.borderColor}`}>
                  <h4 className={`font-bold ${currentDosha.textColor} mb-3`}>Yoga & Meditation</h4>
                  <div className={`${currentDosha.textColor} space-y-2 text-sm`}>
                    {selectedDosha === 'vata' && (
                      <>
                        <p>• Gentle, grounding poses</p>
                        <p>• Slow, mindful movements</p>
                        <p>• Focus on stability and calm</p>
                        <p>• Meditation with mantra</p>
                      </>
                    )}
                    {selectedDosha === 'pitta' && (
                      <>
                        <p>• Cooling, moderate practice</p>
                        <p>• Moon salutations</p>
                        <p>• Avoid heated rooms</p>
                        <p>• Meditation in nature</p>
                      </>
                    )}
                    {selectedDosha === 'kapha' && (
                      <>
                        <p>• Dynamic, energizing practice</p>
                        <p>• Sun salutations</p>
                        <p>• Backbends and inversions</p>
                        <p>• Active meditation techniques</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommendations;