import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { api } from '../api';
import { useAuth } from './AuthContext';

const ApplicationContext = createContext();
export const useApplications = () => useContext(ApplicationContext);

export function ApplicationProvider({ children }) {
  const { logout } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  // Latest list, readable inside async handlers (used to roll back a failed drag & drop)
  const appsRef = useRef([]);
  appsRef.current = applications;

  // If the token expired, log the user out automatically.
  const guard = useCallback(
    (err) => {
      if (err.status === 401) logout();
      throw err;
    },
    [logout]
  );

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      setApplications(await api('/api/applications'));
    } catch (err) {
      guard(err);
    } finally {
      setLoading(false);
    }
  }, [guard]);

  const addApplication = async (data) => {
    try {
      const created = await api('/api/applications', { method: 'POST', body: data });
      setApplications((apps) => [created, ...apps]);
    } catch (err) {
      guard(err);
    }
  };

  const updateApplication = async (id, data) => {
    try {
      const updated = await api(`/api/applications/${id}`, { method: 'PUT', body: data });
      setApplications((apps) => apps.map((a) => (a._id === id ? updated : a)));
    } catch (err) {
      guard(err);
    }
  };

  // Optimistic status change for drag & drop: the card moves instantly,
  // and snaps back if the server rejects it.
  const moveApplication = async (id, status) => {
    const previous = appsRef.current.find((a) => a._id === id);
    if (!previous || previous.status === status) return;
    setApplications((apps) => apps.map((a) => (a._id === id ? { ...a, status } : a)));
    try {
      const updated = await api(`/api/applications/${id}`, { method: 'PUT', body: { status } });
      setApplications((apps) => apps.map((a) => (a._id === id ? updated : a)));
    } catch (err) {
      setApplications((apps) => apps.map((a) => (a._id === id ? previous : a)));
      guard(err);
    }
  };

  const deleteApplication = async (id) => {
    try {
      await api(`/api/applications/${id}`, { method: 'DELETE' });
      setApplications((apps) => apps.filter((a) => a._id !== id));
    } catch (err) {
      guard(err);
    }
  };

  return (
    <ApplicationContext.Provider
      value={{ applications, loading, fetchApplications, addApplication, updateApplication, moveApplication, deleteApplication }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}
