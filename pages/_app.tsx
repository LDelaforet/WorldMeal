import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { AuthProvider } from '@/components/AuthContext';
import { FavoritesProvider } from '@/components/FavoritesContext';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <FavoritesProvider>
                <Component {...pageProps} />
            </FavoritesProvider>
        </AuthProvider>
    );
}
