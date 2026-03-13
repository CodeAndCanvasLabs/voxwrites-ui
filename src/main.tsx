import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import { AuthProvider } from './lib/auth';
import App from './app/App';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
    <Toaster position="bottom-right" richColors closeButton />
  </AuthProvider>
);
