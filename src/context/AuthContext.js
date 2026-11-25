import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, TOKEN_KEY } from '../api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem(TOKEN_KEY));

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  // Restore session on page load
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    api('/api/auth/getuser')
      .then(setUser)
      .catch(logout)
      .finally(() => setLoading(false));
  }, [logout]);

  const authenticate = async (path, payload) => {
    const data = await api(path, { method: 'POST', body: payload });
    localStorage.setItem(TOKEN_KEY, data.authtoken);
    setUser(await api('/api/auth/getuser'));
  };

  const login = (email, password) => authenticate('/api/auth/login', { email, password });
  const signup = (name, email, password) =>
    authenticate('/api/auth/createuser', { name, email, password });

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
