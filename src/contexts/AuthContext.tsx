import { createContext, useState, useEffect, ReactNode } from 'react';

import { auth, firebase } from '../services/firebase';

interface IUserType {
  id: string;
  name: string;
  avatar: string;
}

interface IAuthContextType {
  user: IUserType | undefined;
  signInWithGoogle: () => Promise<void>;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as IAuthContextType);

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<IUserType>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account.');
        }

        setUser({ id: uid, name: displayName, avatar: photoURL });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);

    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google Account.');
      }

      setUser({ id: uid, name: displayName, avatar: photoURL });
    }
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
