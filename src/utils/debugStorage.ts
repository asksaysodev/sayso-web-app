// Debug utility to test storage system
import { cryptoStorage } from './tokenEncryption';

export const debugStorage = (): void => {
  console.log('🔍 Debugging Storage System...');
  
  // Test 1: Check if cryptoStorage is available
  console.log('1️⃣ Testing cryptoStorage availability...');
  try {
    console.log('✅ cryptoStorage is available');
  } catch (error) {
    console.log('❌ cryptoStorage error:', error instanceof Error ? error.message : error);
  }
  
  // Test 2: Test basic operations
  console.log('\n2️⃣ Testing basic storage operations...');
  const testKey = 'debug-test-key';
  const testValue = 'test-value-123';
  
  try {
    // Test setItem
    cryptoStorage.setItem(testKey, testValue);
    console.log('✅ setItem completed');
    
    // Test getItem
    const retrieved = cryptoStorage.getItem(testKey);
    console.log('✅ getItem completed, retrieved:', retrieved);
    
    // Test removeItem
    cryptoStorage.removeItem(testKey);
    console.log('✅ removeItem completed');
    
    console.log('✅ All basic operations working');
  } catch (error) {
    console.log('❌ Basic operations failed:', error instanceof Error ? error.message : error);
  }
  
  // Test 3: Check localStorage state
  console.log('\n3️⃣ Checking localStorage state...');
  const authData = localStorage.getItem('sayso-auth');
  if (authData) {
    console.log('✅ Found sayso-auth data in localStorage');
    try {
      const parsed = JSON.parse(authData);
      console.log('📊 Data structure:', Object.keys(parsed));
    } catch (error) {
      console.log('⚠️ Data is not JSON (might be encrypted or plain text)');
    }
  } else {
    console.log('⚠️ No sayso-auth data found');
  }
  
  console.log('\n🎯 Storage debug complete!');
};

// Make it available globally
if (typeof window !== 'undefined') {
  window.debugStorage = debugStorage;
  console.log('🔍 Storage debug available! Run: debugStorage()');
} 