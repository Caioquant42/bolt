import { createContext, useEffect, useReducer } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail // Add this import
} from "firebase/auth";
// FIREBASE CONFIGURATION
import { firebaseConfig } from "app/config";
// GLOBAL CUSTOM COMPONENT
import Loading from "app/components/MatxLoading";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const initialAuthState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FB_AUTH_STATE_CHANGED": {
      const { isAuthenticated, user } = action.payload;
      return { ...state, isAuthenticated, isInitialized: true, user };
    }

    default: {
      return state;
    }
  }
};

const AuthContext = createContext({
  ...initialAuthState,
  method: "FIREBASE",
  resetPassword: () => Promise.resolve() // Add this line
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  const signInWithEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const createUserWithEmail = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error creating user:", error.code, error.message);
      throw error;
    }
  };

  const logout = () => signOut(auth);

  // Add this function
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({
          type: "FB_AUTH_STATE_CHANGED",
          payload: {
            isAuthenticated: true,
            user: {
              id: user.uid,
              email: user.email,
              avatar: user.photoURL,
              name: user.displayName || user.email
            }
          }
        });
      } else {
        dispatch({
          type: "FB_AUTH_STATE_CHANGED",
          payload: { isAuthenticated: false, user: null }
        });
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (!state.isInitialized) return <Loading />;

  return (
    <AuthContext.Provider
      value={{
        ...state,
        logout,
        signInWithGoogle,
        method: "FIREBASE",
        signInWithEmail,
        createUserWithEmail,
        resetPassword // Add this line
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;