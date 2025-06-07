import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile as updateFirebaseProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// These values should be replaced with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyBDC1cooe4zok2DGaaLEUFMV_FiOcJ14nA",
  authDomain: "login-page-8229f.firebaseapp.com",
  projectId: "login-page-8229f",
  storageBucket: "login-page-8229f.firebasestorage.app",
  messagingSenderId: "973268611847",
  appId: "1:973268611847:web:fc8f6e0983a47438190ba2"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Authentication helpers
export const createUser = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = () => {
  return signOut(auth);
};

export const updateUserProfile = (user: FirebaseUser, profile: { displayName?: string, photoURL?: string }) => {
  return updateFirebaseProfile(user, profile);
};

export const subscribeToAuthChanges = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};