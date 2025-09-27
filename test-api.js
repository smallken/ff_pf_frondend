// 简单的API测试脚本
const testLogin = async () => {
  try {
    const response = await fetch('http://localhost:8101/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        userAccount: 'admin',
        userPassword: '123456'
      })
    });
    
    const result = await response.json();
    
    if (result.code === 0) {
      console.log('✅ Login successful');
    } else {
      console.log('❌ Login failed:', result.message);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
};

testLogin();
