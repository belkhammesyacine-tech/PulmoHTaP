// App.jsx — Root Application Component
import { AuthProvider }     from './core/context/AuthContext.jsx';
import { ThemeProvider }    from './core/context/ThemeContext.jsx';
import { LanguageProvider } from './core/context/LanguageContext.jsx';
import AppRouter from './core/router/AppRouter.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
