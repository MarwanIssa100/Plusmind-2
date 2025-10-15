import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'mindcare-default-key-2024';

export const encryptNote = (content) => {
  try {
    return CryptoJS.AES.encrypt(content, SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    return null;
  }
};

export const decryptNote = (encryptedContent) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedContent, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
};