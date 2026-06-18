// Import mock Firebase for development
import * as MockFirebase from './mockFirebase';
import { configManager } from '../shared/config-manager';

// Import real Firebase functions
import {
  initializeApp
} from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword as realCreateUserWithEmailAndPassword,
  signInWithEmailAndPassword as realSignInWithEmailAndPassword,
  signOut as realSignOut,
  onAuthStateChanged as realOnAuthStateChanged,
  sendPasswordResetEmail as realSendPasswordResetEmail,
  updateProfile as realUpdateProfile,
  GoogleAuthProvider as realGoogleAuthProvider,
  signInWithPopup as realSignInWithPopup
} from 'firebase/auth';
import {
  getFirestore
} from 'firebase/firestore';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  onSnapshot,
  addDoc,
  writeBatch
} from 'firebase/firestore';
import {
  getStorage
} from 'firebase/storage';

let auth, db, storage, app;
let isInitialized = false;

function initializeFirebase() {
  if (isInitialized) return;
  
  try {
    // Ensure config manager is initialized first
    const config = configManager.initialize();
    const firebaseConfig = configManager.getFirebaseConfig();
    const envSettings = configManager.getEnvironmentSettings();
    
    // Only use mock Firebase if explicitly enabled in development
    if (config.isDevelopment && envSettings.enableMockData) {
      auth = MockFirebase.auth;
      db = MockFirebase.db;
      storage = MockFirebase.storage;
      app = MockFirebase.app;
      console.log('Using Mock Firebase services (Admin - Development Mode)');
    } else if (!firebaseConfig.apiKey) {
      throw new Error('Firebase configuration is required. Please set REACT_APP_FIREBASE_* environment variables.');
    } else {
      // Real Firebase for production or when credentials are provided
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);
      console.log('Using real Firebase services (Admin)');
    }
    isInitialized = true;
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    throw error; // Don't silently fall back to mocks in production
  }
}

// Initialize immediately if possible, otherwise defer
try {
  initializeFirebase();
} catch (error) {
  // Config not ready yet, will be initialized by App.tsx
  console.log('Firebase initialization deferred until config is loaded');
}

// Export functions that ensure Firebase is initialized
export function getFirebaseServices() {
  if (!isInitialized) {
    initializeFirebase();
  }
  return { auth, db, storage, app };
}

// Export appropriate Firebase functions based on current mode
export const firestoreFunctions = () => {
  if (!isInitialized) {
    initializeFirebase();
  }
  // If using mock Firebase, export mock functions, otherwise export real functions
  if (db === MockFirebase.db) {
    // Mock Firebase functions
    return {
      collection: MockFirebase.collection,
      doc: MockFirebase.doc,
      setDoc: MockFirebase.setDoc,
      getDoc: MockFirebase.getDoc,
      updateDoc: MockFirebase.updateDoc,
      deleteDoc: MockFirebase.deleteDoc,
      getDocs: MockFirebase.getDocs,
      query: MockFirebase.query,
      where: MockFirebase.where,
      orderBy: MockFirebase.orderBy,
      addDoc: MockFirebase.addDoc,
      Timestamp: MockFirebase.serverTimestamp
    };
  } else {
    // Real Firebase functions
    return {
      collection,
      doc,
      setDoc,
      getDoc,
      updateDoc,
      deleteDoc,
      getDocs,
      query,
      where,
      orderBy,
      limit,
      Timestamp,
      onSnapshot,
      addDoc,
      writeBatch
    };
  }
};

// Export appropriate auth functions based on current mode
export const authFunctions = () => {
  if (!isInitialized) {
    initializeFirebase();
  }
  // If using mock Firebase, export mock functions, otherwise export real functions
  if (auth === MockFirebase.auth) {
    // Mock Firebase functions
    return {
      createUserWithEmailAndPassword: MockFirebase.createUserWithEmailAndPassword,
      signInWithEmailAndPassword: MockFirebase.signInWithEmailAndPassword,
      signInWithPopup: MockFirebase.signInWithPopup,
      signOut: MockFirebase.signOut,
      onAuthStateChanged: MockFirebase.onAuthStateChanged,
      sendPasswordResetEmail: MockFirebase.sendPasswordResetEmail,
      updateProfile: MockFirebase.updateProfile,
      GoogleAuthProvider: MockFirebase.GoogleAuthProvider
    };
  } else {
    // Real Firebase functions
    return {
      createUserWithEmailAndPassword: realCreateUserWithEmailAndPassword,
      signInWithEmailAndPassword: realSignInWithEmailAndPassword,
      signInWithPopup: realSignInWithPopup,
      signOut: realSignOut,
      onAuthStateChanged: realOnAuthStateChanged,
      sendPasswordResetEmail: realSendPasswordResetEmail,
      updateProfile: realUpdateProfile,
      GoogleAuthProvider: realGoogleAuthProvider
    };
  }
};

export { auth, db, storage, initializeFirebase };
export default app;
