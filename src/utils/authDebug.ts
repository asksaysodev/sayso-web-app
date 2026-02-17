/**
 * Utility to check auth storage status
 * @returns {string} - The stored data
 */
export const checkAuthStorage = (): string | null => {
  const storageKey = 'sayso-auth';
  const storedData = localStorage.getItem(storageKey);
  
  console.log('🔐 Auth Storage Check:');
  console.log('Storage key:', storageKey);
  console.log('Data exists:', !!storedData);
  
  if (storedData) {
    try {
      const parsed = JSON.parse(storedData);
      console.log('Current user:', parsed.currentSession?.user?.email);
      console.log('Token expires:', parsed.currentSession?.expires_at);
      console.log('Is expired:', new Date(parsed.currentSession?.expires_at * 1000) < new Date());
    } catch (error) {
      console.error('Error parsing auth data:', error);
    }
  }
  
  return storedData || null;
};

/**
 * Check all localStorage keys related to auth
 * @returns {void}
 */
export const checkAllAuthKeys = (): void => {
  console.log('🔍 All localStorage keys:');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('auth') || key.includes('supabase'))) {
      console.log(`Key: ${key}`);
      console.log(`Value: ${localStorage.getItem(key)}`);
    }
  }
}; 