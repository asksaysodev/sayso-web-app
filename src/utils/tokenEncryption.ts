// Simple encryption for tokens (not for high-security needs)
// For production, consider using Web Crypto API or server-side token management

const ENCRYPTION_KEY = import.meta.env.VITE_TOKEN_ENCRYPTION_KEY; // In production, use environment variable

// Simple XOR encryption (for demonstration - not cryptographically secure)
const encryptToken = (text: string): string | null => {
  if (!text) return null;
  
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length));
  }
  return btoa(result); // Base64 encode
};

const decryptToken = (encryptedText: string): string | null => {
  if (!encryptedText) return null;
  
  try {
    const decoded = atob(encryptedText); // Base64 decode
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length));
    }
    return result;
  } catch (error) {
    console.error('Error decrypting token:', error);
    return null;
  }
};

// Secure storage wrapper
export const secureStorage = {
  setItem: (key: string, value: string): void => {
    const encrypted = encryptToken(value);
    localStorage.setItem(key, encrypted);
  },
  
  getItem: (key: string): string | null => {
    const encrypted = localStorage.getItem(key);
    return encrypted ? decryptToken(encrypted) : null;
  },
  
  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  }
};

// Web Crypto API version (more secure, but requires HTTPS)
export const cryptoStorage = {
  async setItem(key: string, value: string): Promise<void> {
    // Check if Web Crypto API is available
    if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
      console.warn('Web Crypto API not available, falling back to localStorage');
      localStorage.setItem(key, value);
      return;
    }
    
    try {
      // Generate a key from password
      const encoder = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(ENCRYPTION_KEY),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );
      
      const derivedKey = await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: encoder.encode('sayso-salt'),
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt']
      );
      
      // Encrypt the data
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        derivedKey,
        encoder.encode(value)
      );
      
      // Store encrypted data + IV
      const encryptedData = {
        data: Array.from(new Uint8Array(encrypted)),
        iv: Array.from(iv)
      };
      
      localStorage.setItem(key, JSON.stringify(encryptedData));
    } catch (error) {
      console.error('Encryption failed, falling back to localStorage:', error);
      localStorage.setItem(key, value);
    }
  },
  
  async getItem(key: string): Promise<string | null> {
    // Check if Web Crypto API is available
    if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
      return localStorage.getItem(key);
    }
    
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      
      // Try to parse as encrypted data
      let encryptedData;
      try {
        encryptedData = JSON.parse(stored);
      } catch (parseError) {
        // If it's not JSON, it's probably plain text (fallback)
        return stored;
      }
      
      if (!encryptedData.data || !encryptedData.iv) {
        // Fallback to plain localStorage
        return stored;
      }
      
      // Decrypt the data
      const encoder = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(ENCRYPTION_KEY),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );
      
      const derivedKey = await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: encoder.encode('sayso-salt'),
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['decrypt']
      );
      
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(encryptedData.iv) },
        derivedKey,
        new Uint8Array(encryptedData.data)
      );
      
      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error('Decryption failed, returning raw data:', error);
      return localStorage.getItem(key);
    }
  },
  
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
};

// Fallback storage that always works (no encryption)
export const fallbackStorage = {
  setItem: (key: string, value: string): void => {
    localStorage.setItem(key, value);
  },
  
  getItem: (key: string): string | null => {
    return localStorage.getItem(key);
  },
  
  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  }
}; 