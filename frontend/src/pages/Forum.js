import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { forumAPI } from '../services/api';

const Forum = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general'
  });

  const categories = [
    { value: 'general', label: 'General Discussion', icon: '💬' },
    { value: 'vata', label: 'Vata Constitution', icon: '💨' },
    { value: 'pitta', label: 'Pitta Constitution', icon: '🔥' },
    { value: 'kapha', label: 'Kapha Constitution', icon: '🌍' },
    { value: 'recipes', label: 'Recipe Sharing', icon: '🍽️' },
    { value: 'wellness', label: 'Wellness Tips', icon: '🌱' }
  ];

  const samplePosts = [
    {
      id: 1,
      title: 'My Vata Balancing Journey - Amazing Results!',
      content: 'I\'ve been following Vata-balancing practices for 3 months now and the results are incredible! My anxiety has reduced significantly, and I sleep much better. The key was establishing a regular routine with warm oil massages and eating warm, cooked foods. Has anyone else experienced similar improvements?',
      category: 'vata',
      author_name: 'Sarah M.',
      created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      title: 'Best Pitta-Cooling Recipes for Summer',
      content: 'Summer is here and my Pitta is definitely aggravated! I\'ve been experimenting with cooling recipes and found some amazing ones. Coconut rice with cilantro and cucumber mint salad have been game-changers. The rose petal lassi is also incredibly refreshing. What are your favorite Pitta-cooling recipes?',
      category: 'recipes',
      author_name: 'Raj P.',
      created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString()
    }
  ];

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await forumAPI.getPosts();
      const dbPosts = response.data || [];
      setPosts(dbPosts.length > 0 ? dbPosts : samplePosts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setPosts(samplePosts);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await forumAPI.createPost(newPost);
      
      // Track community post per user
      const userKey = user?.email || 'guest';
      const currentCount = parseInt(localStorage.getItem(`communityPosts_${userKey}`) || '0');
      localStorage.setItem(`communityPosts_${userKey}`, (currentCount + 1).toString());
      
      setNewPost({ title: '', content: '', category: 'general' });
      setShowCreateForm(false);
      
      // Refresh posts immediately to show new post with correct timestamp
      setTimeout(() => {
        fetchPosts();
      }, 100);
      
      alert('Post created successfully!');
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      // For sample posts, just remove from UI
      if (postId <= 2) {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        alert('Post deleted successfully!');
        return;
      }
      
      console.log('Deleting post ID:', postId);
      // For database posts, delete from database
      const response = await forumAPI.deletePost(postId);
      console.log('Delete response:', response);
      
      // Refresh posts from database
      fetchPosts();
      alert('Post deleted successfully!');
      
    } catch (error) {
      console.error('Delete error:', error.response?.data || error.message);
      alert(`Delete failed: ${error.response?.data?.message || error.message}`);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = selectedCategory 
    ? posts.filter(post => post.category === selectedCategory)
    : posts;

  const getCategoryInfo = (category) => {
    return categories.find(cat => cat.value === category) || categories[0];
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Handle invalid dates
    if (isNaN(date.getTime())) {
      return 'Just now';
    }
    
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${diffInDays}d ago`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center">
          <span className="text-5xl mr-4">👥</span>
          Wellness Community Forum
        </h1>
        <p className="text-xl text-purple-100">
          Connect with fellow wellness enthusiasts and share your Ayurvedic journey
        </p>
      </div>

      {/* Create Post Button */}
      <div className="text-center">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-200 shadow-lg"
        >
          {showCreateForm ? 'Cancel' : '+ Create New Post'}
        </button>
      </div>

      {/* Create Post Form */}
      {showCreateForm && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="text-3xl mr-3">✍️</span>
            Create New Post
          </h2>
          <form onSubmit={handleCreatePost} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Post Title</label>
                <input
                  type="text"
                  required
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({...prev, title: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="What's on your mind?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost(prev => ({...prev, category: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                required
                rows={6}
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({...prev, content: e.target.value}))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Share your thoughts, experiences, or questions..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
              >
                Post to Community
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="text-3xl mr-3">🏷️</span>
          Browse by Category
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              !selectedCategory 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
            }`}
          >
            All Posts ({posts.length})
          </button>
          {categories.map((category) => {
            const count = posts.filter(post => post.category === category.value).length;
            return (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center ${
                  selectedCategory === category.value
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <span className="text-gray-600">Loading community posts...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
              <p className="text-gray-500 mb-6">
                {selectedCategory 
                  ? `No posts in ${getCategoryInfo(selectedCategory).label} category yet.`
                  : 'Be the first to start a conversation!'
                }
              </p>
              {!showCreateForm && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                >
                  Create First Post
                </button>
              )}
            </div>
          ) : (
            filteredPosts.map((post) => {
              const categoryInfo = getCategoryInfo(post.category);
              return (
                <div key={post.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {post.author_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <span>by {post.author_name}</span>
                          <span>•</span>
                          <span>{timeAgo(post.created_at)}</span>
                          <span>•</span>
                          <span className="flex items-center">
                            <span className="mr-1">{categoryInfo.icon}</span>
                            {categoryInfo.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-gray-700 leading-relaxed mb-6">
                    {post.content}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-purple-600 transition-colors">
                        <span>👍</span>
                        <span>Like</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-purple-600 transition-colors">
                        <span>💬</span>
                        <span>Reply</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-purple-600 transition-colors">
                        <span>🔗</span>
                        <span>Share</span>
                      </button>
                    </div>
                    <button 
                      onClick={() => handleDeletePost(post.id)}
                      className="flex items-center space-x-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <span>🗑️</span>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Login Prompt */}
      {!user && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 text-center border border-indigo-200">
          <div className="text-4xl mb-4">🔐</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Join the Conversation</h3>
          <p className="text-gray-600 mb-6">Login to create posts and engage with the community</p>
          <a
            href="/login"
            className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
          >
            Login to Participate
          </a>
        </div>
      )}
    </div>
  );
};

export default Forum;