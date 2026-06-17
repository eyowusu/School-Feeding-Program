import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { getFirebaseServices, firestoreFunctions } from '../services/firebase';
import { AuthContextType, User } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // Ensure Firebase is initialized before using auth
    const { auth } = getFirebaseServices();
    
    if (!auth) {
      console.error('Firebase auth not initialized');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get Firebase services to ensure db is initialized
        const { db } = getFirebaseServices();
        const { getDoc, setDoc } = firestoreFunctions();
        
        // Get user profile from Firestore
        const userDoc = await getDoc(db.collection('users').doc(firebaseUser.uid));
        if (userDoc.exists()) {
          const profileData = userDoc.data();
          const isDevelopment = process.env.NODE_ENV === 'development';
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || profileData.name || '',
            role: isDevelopment ? 'admin' : (profileData.role || 'editor'), // Admin role in development
            avatar: firebaseUser.photoURL || profileData.avatar,
            emailVerified: firebaseUser.emailVerified
          });
          setUserProfile(profileData);
        } else {
          // Create user profile if it doesn't exist
          const isDevelopment = process.env.NODE_ENV === 'development';
          const defaultProfile = {
            name: firebaseUser.displayName || 'Administrator',
            role: isDevelopment ? 'admin' : 'editor', // Admin role in development for easy access
            avatar: firebaseUser.photoURL || null,
            createdAt: new Date(),
            lastLogin: new Date()
          };
          await setDoc(db.collection('users').doc(firebaseUser.uid), defaultProfile, {});
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: defaultProfile.name,
            role: defaultProfile.role,
            avatar: defaultProfile.avatar,
            emailVerified: firebaseUser.emailVerified
          });
          setUserProfile(defaultProfile);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (email, password, name) => {
    try {
      const { auth } = getFirebaseServices();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateFirebaseProfile(user, {
        displayName: name
      });

      // Create user profile in Firestore
      const userProfile = {
        name,
        role: 'editor', // Default role for new users
        avatar: null,
        createdAt: new Date(),
        lastLogin: new Date(),
        emailVerified: false
      };

      const { db } = getFirebaseServices();
      const { setDoc } = firestoreFunctions();
      await setDoc(db.collection('users').doc(user.uid), userProfile, {});

      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  const login = async (email, password) => {
    try {
      const { auth } = getFirebaseServices();
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { auth } = getFirebaseServices();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Create user profile if it doesn't exist
      const { db } = getFirebaseServices();
      const { getDoc, setDoc } = firestoreFunctions();
      const userDoc = await getDoc(db.collection('users').doc(result.user.uid));
      if (!userDoc.exists()) {
        const userProfile = {
          name: result.user.displayName,
          role: 'editor',
          avatar: result.user.photoURL,
          createdAt: new Date(),
          lastLogin: new Date(),
          emailVerified: result.user.emailVerified
        };
        await setDoc(db.collection('users').doc(result.user.uid), userProfile, {});
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  const logout = async () => {
    try {
      const { auth } = getFirebaseServices();
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to logout' };
    }
  };

  const resetPassword = async (email) => {
    try {
      const { auth } = getFirebaseServices();
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const { auth } = getFirebaseServices();
      if (auth.currentUser) {
        await updateFirebaseProfile(auth.currentUser, updates);
        // Update Firestore profile
        const { db } = getFirebaseServices();
        const { updateDoc } = firestoreFunctions();
        await updateDoc(db.collection('users').doc(auth.currentUser.uid), {
          ...userProfile,
          ...updates,
          updatedAt: new Date()
        }, { merge: true });
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Try logging in instead.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  const value = {
    user,
    userProfile,
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
