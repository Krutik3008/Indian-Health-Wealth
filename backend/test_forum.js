const axios = require('axios');

const API_BASE = 'http://localhost:8080/api';

async function testForum() {
  try {
    console.log('Testing forum endpoints...');
    
    // Test GET posts
    console.log('\n1. Testing GET /api/forum');
    const getResponse = await axios.get(`${API_BASE}/forum`);
    console.log('GET Response:', getResponse.data);
    
    // Test POST new post
    console.log('\n2. Testing POST /api/forum');
    const postData = {
      title: 'Test Post from API',
      content: 'This is a test post to verify the forum functionality is working correctly.',
      category: 'general'
    };
    
    const postResponse = await axios.post(`${API_BASE}/forum`, postData, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('POST Response:', postResponse.data);
    
    // Test GET posts again to see the new post
    console.log('\n3. Testing GET /api/forum again');
    const getResponse2 = await axios.get(`${API_BASE}/forum`);
    console.log('GET Response after POST:', getResponse2.data);
    
    console.log('\n✅ Forum API tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testForum();