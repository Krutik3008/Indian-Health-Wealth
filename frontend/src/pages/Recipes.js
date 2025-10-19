import React, { useState, useEffect } from 'react';
import { recipesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Recipes = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDosha, setSelectedDosha] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    doshaTags: [],
    category: '',
    cookTime: '',
    difficulty: 'Easy',
    benefits: ''
  });

  const doshas = [
    { value: 'vata', label: 'Vata', icon: '💨', color: 'blue' },
    { value: 'pitta', label: 'Pitta', icon: '🔥', color: 'red' },
    { value: 'kapha', label: 'Kapha', icon: '🌍', color: 'green' },
  ];

  const categories = [
    { value: 'breakfast', label: 'Breakfast', icon: '🍳' },
    { value: 'soup', label: 'Soups', icon: '🍲' },
    { value: 'main', label: 'Main Dishes', icon: '🍽️' },
    { value: 'beverage', label: 'Beverages', icon: '☕' },
    { value: 'snack', label: 'Snacks', icon: '🍪' },
    { value: 'dessert', label: 'Desserts', icon: '🍮' },
  ];

  const defaultRecipes = [
    // Vata Balancing Recipes
    {
      title: 'Warming Oatmeal with Dates',
      ingredients: ['Rolled oats', 'Almond milk', 'Dates', 'Cinnamon', 'Ghee', 'Chopped almonds'],
      instructions: 'Cook oats with milk and spices. Top with dates, ghee, and almonds. Serve warm.',
      doshaTags: ['vata'],
      category: 'breakfast',
      cookTime: '15 mins',
      difficulty: 'Easy',
      benefits: 'Grounding, nourishing, promotes stability'
    },
    {
      title: 'Mung Bean Soup',
      ingredients: ['Yellow mung dal', 'Ginger', 'Turmeric', 'Cumin', 'Ghee', 'Fresh cilantro'],
      instructions: 'Cook dal with spices until soft. Temper with ghee and cumin. Garnish with cilantro.',
      doshaTags: ['vata'],
      category: 'soup',
      cookTime: '30 mins',
      difficulty: 'Easy',
      benefits: 'Easy to digest, warming, protein-rich'
    },
    {
      title: 'Golden Milk Latte',
      ingredients: ['Turmeric', 'Warm almond milk', 'Ginger', 'Cinnamon', 'Cardamom', 'Honey'],
      instructions: 'Heat milk with spices for 5 minutes. Strain and add honey. Serve warm.',
      doshaTags: ['vata', 'kapha'],
      category: 'beverage',
      cookTime: '10 mins',
      difficulty: 'Easy',
      benefits: 'Anti-inflammatory, calming, immune-boosting'
    },
    
    // Pitta Balancing Recipes
    {
      title: 'Cooling Cucumber Mint Salad',
      ingredients: ['Cucumber', 'Fresh mint', 'Coconut flakes', 'Lime juice', 'Fennel seeds', 'Rock salt'],
      instructions: 'Slice cucumber, mix with mint and coconut. Dress with lime juice and fennel.',
      doshaTags: ['pitta'],
      category: 'main',
      cookTime: '10 mins',
      difficulty: 'Easy',
      benefits: 'Cooling, hydrating, reduces heat'
    },
    {
      title: 'Coconut Rice with Cilantro',
      ingredients: ['Basmati rice', 'Coconut milk', 'Fresh cilantro', 'Lime zest', 'Cardamom'],
      instructions: 'Cook rice in coconut milk with cardamom. Garnish with cilantro and lime zest.',
      doshaTags: ['pitta'],
      category: 'main',
      cookTime: '25 mins',
      difficulty: 'Medium',
      benefits: 'Cooling, satisfying, reduces acidity'
    },
    {
      title: 'Rose Petal Lassi',
      ingredients: ['Fresh yogurt', 'Rose water', 'Cardamom', 'Honey', 'Ice cubes', 'Rose petals'],
      instructions: 'Blend yogurt with rose water and cardamom. Add honey and ice. Garnish with petals.',
      doshaTags: ['pitta'],
      category: 'beverage',
      cookTime: '5 mins',
      difficulty: 'Easy',
      benefits: 'Cooling, calming, aids digestion'
    },
    
    // Kapha Balancing Recipes
    {
      title: 'Spiced Quinoa Breakfast Bowl',
      ingredients: ['Quinoa', 'Ginger', 'Cinnamon', 'Cloves', 'Honey', 'Pumpkin seeds', 'Berries'],
      instructions: 'Cook quinoa with warming spices. Top with seeds, berries, and a drizzle of honey.',
      doshaTags: ['kapha'],
      category: 'breakfast',
      cookTime: '20 mins',
      difficulty: 'Easy',
      benefits: 'Energizing, light, metabolism-boosting'
    },
    {
      title: 'Ginger Turmeric Tea',
      ingredients: ['Fresh ginger', 'Turmeric powder', 'Black pepper', 'Lemon juice', 'Honey'],
      instructions: 'Boil ginger in water, add turmeric and pepper. Strain, add lemon and honey.',
      doshaTags: ['kapha'],
      category: 'beverage',
      cookTime: '10 mins',
      difficulty: 'Easy',
      benefits: 'Warming, stimulating, clears congestion'
    },
    {
      title: 'Spicy Lentil Curry',
      ingredients: ['Red lentils', 'Onion', 'Garlic', 'Ginger', 'Turmeric', 'Cayenne', 'Mustard seeds'],
      instructions: 'Sauté aromatics, add lentils and spices. Simmer until tender. Temper with mustard seeds.',
      doshaTags: ['kapha'],
      category: 'main',
      cookTime: '35 mins',
      difficulty: 'Medium',
      benefits: 'Warming, protein-rich, stimulates digestion'
    },
    
    // Tridoshic (Balancing for all)
    {
      title: 'Kitchari (Cleansing Rice & Lentils)',
      ingredients: ['Basmati rice', 'Mung dal', 'Turmeric', 'Cumin', 'Coriander', 'Ginger', 'Ghee'],
      instructions: 'Cook rice and dal together with spices until soft. Finish with ghee.',
      doshaTags: ['vata', 'pitta', 'kapha'],
      category: 'main',
      cookTime: '40 mins',
      difficulty: 'Medium',
      benefits: 'Detoxifying, easy to digest, balancing'
    },
    {
      title: 'Herbal Digestive Tea',
      ingredients: ['Cumin seeds', 'Coriander seeds', 'Fennel seeds', 'Ginger', 'Mint leaves'],
      instructions: 'Boil all seeds and ginger for 10 minutes. Add mint leaves, steep 5 minutes.',
      doshaTags: ['vata', 'pitta', 'kapha'],
      category: 'beverage',
      cookTime: '15 mins',
      difficulty: 'Easy',
      benefits: 'Aids digestion, reduces bloating, calming'
    }
  ];

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const response = await recipesAPI.getAll();
      const savedRecipes = JSON.parse(localStorage.getItem('userRecipes') || '[]');
      const allRecipes = [...defaultRecipes, ...savedRecipes];
      setRecipes(response.data.length > 0 ? [...response.data, ...savedRecipes] : allRecipes);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      const savedRecipes = JSON.parse(localStorage.getItem('userRecipes') || '[]');
      setRecipes([...defaultRecipes, ...savedRecipes]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecipe = (e) => {
    e.preventDefault();
    const recipe = {
      ...newRecipe,
      ingredients: newRecipe.ingredients.split(',').map(ing => ing.trim()),
      id: Date.now()
    };
    
    const savedRecipes = JSON.parse(localStorage.getItem('userRecipes') || '[]');
    const updatedRecipes = [...savedRecipes, recipe];
    localStorage.setItem('userRecipes', JSON.stringify(updatedRecipes));
    
    setRecipes(prev => [...prev, recipe]);
    setNewRecipe({
      title: '',
      ingredients: '',
      instructions: '',
      doshaTags: [],
      category: '',
      cookTime: '',
      difficulty: 'Easy',
      benefits: ''
    });
    setShowAddForm(false);
    alert('Recipe added successfully!');
  };

  const handleDoshaToggle = (dosha) => {
    setNewRecipe(prev => ({
      ...prev,
      doshaTags: prev.doshaTags.includes(dosha)
        ? prev.doshaTags.filter(d => d !== dosha)
        : [...prev.doshaTags, dosha]
    }));
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesDosha = !selectedDosha || recipe.doshaTags.includes(selectedDosha);
    const matchesCategory = !selectedCategory || recipe.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesDosha && matchesCategory && matchesSearch;
  });

  const getDoshaColor = (dosha) => {
    const colors = {
      vata: 'bg-blue-100 text-blue-800 border-blue-200',
      pitta: 'bg-red-100 text-red-800 border-red-200',
      kapha: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[dosha] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center">
          <span className="text-5xl mr-4">🍽️</span>
          Ayurvedic Recipe Collection
        </h1>
        <p className="text-xl text-green-100">
          Nourish your body with dosha-balancing recipes crafted according to ancient Ayurvedic principles
        </p>
      </div>

      {/* Add Recipe Button */}
      <div className="text-center">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
        >
          {showAddForm ? 'Cancel' : '+ Add Your Own Recipe'}
        </button>
      </div>

      {/* Add Recipe Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="text-3xl mr-3">📝</span>
            Add Your Recipe
          </h2>
          <form onSubmit={handleAddRecipe} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Title</label>
                <input
                  type="text"
                  required
                  value={newRecipe.title}
                  onChange={(e) => setNewRecipe(prev => ({...prev, title: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cook Time</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 30 mins"
                  value={newRecipe.cookTime}
                  onChange={(e) => setNewRecipe(prev => ({...prev, cookTime: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  required
                  value={newRecipe.category}
                  onChange={(e) => setNewRecipe(prev => ({...prev, category: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={newRecipe.difficulty}
                  onChange={(e) => setNewRecipe(prev => ({...prev, difficulty: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Suitable for Doshas</label>
              <div className="flex gap-3">
                {doshas.map(dosha => (
                  <button
                    key={dosha.value}
                    type="button"
                    onClick={() => handleDoshaToggle(dosha.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center ${
                      newRecipe.doshaTags.includes(dosha.value)
                        ? `bg-${dosha.color}-600 text-white`
                        : `bg-${dosha.color}-100 text-${dosha.color}-800 hover:bg-${dosha.color}-200`
                    }`}
                  >
                    <span className="mr-2">{dosha.icon}</span>
                    {dosha.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients (comma-separated)</label>
              <textarea
                required
                rows={3}
                placeholder="Rice, lentils, turmeric, ginger..."
                value={newRecipe.ingredients}
                onChange={(e) => setNewRecipe(prev => ({...prev, ingredients: e.target.value}))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
              <textarea
                required
                rows={4}
                value={newRecipe.instructions}
                onChange={(e) => setNewRecipe(prev => ({...prev, instructions: e.target.value}))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
              <input
                type="text"
                required
                placeholder="e.g., Warming, energizing, aids digestion"
                value={newRecipe.benefits}
                onChange={(e) => setNewRecipe(prev => ({...prev, benefits: e.target.value}))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-200"
              >
                Add Recipe
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="text-3xl mr-3">🔍</span>
          Find Your Perfect Recipe
        </h2>
        
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search recipes or ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Dosha Filters */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Filter by Dosha</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedDosha('')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                !selectedDosha 
                  ? 'bg-gray-800 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Recipes
            </button>
            {doshas.map((dosha) => (
              <button
                key={dosha.value}
                onClick={() => setSelectedDosha(dosha.value)}
                className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center ${
                  selectedDosha === dosha.value
                    ? `bg-${dosha.color}-600 text-white shadow-lg`
                    : `bg-${dosha.color}-100 text-${dosha.color}-800 hover:bg-${dosha.color}-200`
                }`}
              >
                <span className="mr-2">{dosha.icon}</span>
                {dosha.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Filter by Category</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                !selectedCategory 
                  ? 'bg-orange-600 text-white shadow-lg' 
                  : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center ${
                  selectedCategory === category.value
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-center">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-green-600">{filteredRecipes.length}</span> recipes
          {selectedDosha && ` for ${selectedDosha.charAt(0).toUpperCase() + selectedDosha.slice(1)} dosha`}
          {selectedCategory && ` in ${categories.find(c => c.value === selectedCategory)?.label}`}
        </p>
      </div>

      {/* Recipe Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center">
            <div className="spinner mr-3"></div>
            <span className="text-gray-600">Loading delicious recipes...</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map((recipe, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
              {/* Recipe Header */}
              <div className="bg-gradient-to-r from-orange-400 to-pink-400 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold">{recipe.title}</h3>
                  <span className="text-2xl">
                    {categories.find(c => c.value === recipe.category)?.icon}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-orange-100">
                  <span>⏱️ {recipe.cookTime}</span>
                  <span>👨‍🍳 {recipe.difficulty}</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                {/* Dosha Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.doshaTags.map((tag, i) => {
                    const dosha = doshas.find(d => d.value === tag);
                    return (
                      <span
                        key={i}
                        className={`text-xs px-3 py-1 rounded-full border flex items-center ${getDoshaColor(tag)}`}
                      >
                        {dosha && <span className="mr-1">{dosha.icon}</span>}
                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </span>
                    );
                  })}
                </div>

                {/* Benefits */}
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <span className="font-semibold">🌱 Benefits:</span> {recipe.benefits}
                  </p>
                </div>
                
                {/* Ingredients */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center">
                    <span className="mr-2">🥕</span>Ingredients:
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {recipe.ingredients.slice(0, 4).map((ingredient, i) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2 flex-shrink-0"></span>
                        {ingredient}
                      </li>
                    ))}
                    {recipe.ingredients.length > 4 && (
                      <li className="text-gray-500 text-xs">+ {recipe.ingredients.length - 4} more ingredients</li>
                    )}
                  </ul>
                </div>

                {/* Instructions */}
                <div className="mb-4 flex-1">
                  <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center">
                    <span className="mr-2">📝</span>Instructions:
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{recipe.instructions}</p>
                </div>

                {/* Action Button */}
                <div className="mt-auto">
                <button 
                  onClick={() => {
                    // Track recipe exploration per user
                    const userKey = user?.email || 'guest';
                    const currentCount = parseInt(localStorage.getItem(`recipesExplored_${userKey}`) || '0');
                    localStorage.setItem(`recipesExplored_${userKey}`, (currentCount + 1).toString());
                    
                    // Show success message
                    alert(`🎉 Great choice! "${recipe.title}" has been added to your tried recipes. Happy cooking!`);
                  }}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  👨‍🍳 Try This Recipe
                </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {filteredRecipes.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No recipes found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
          <button
            onClick={() => {
              setSelectedDosha('');
              setSelectedCategory('');
              setSearchTerm('');
            }}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Recipes;