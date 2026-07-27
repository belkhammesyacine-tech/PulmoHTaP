// App.jsx — Root Application Component
import { AuthProvider } from './core/context/AuthContext.jsx';
import AppRouter from './core/router/AppRouter.jsx';

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
