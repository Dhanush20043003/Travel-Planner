import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return <div>Loading...</div>; // wait until context checks token
  return user ? children : <Navigate to="/" replace />;
}
