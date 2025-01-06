'use client';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { Inter, Mitr, Rubik, Bai_Jamjuree } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import './globals.css';
import theme from '@/utils/mui-theme';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from '@/components/common/NavBar';
import StoreProvider from './StoreProvider';
import { useAuth } from '@/hooks/useAuth';

const inter = Inter({ subsets: ['latin'] });
const mitr = Mitr({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-mitr',
});
const rubik = Rubik({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rubik',
});
const baiJamjuree = Bai_Jamjuree({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-bai-jamjuree',
});
const AuthChecker = () => {
  useAuth();
  return null;
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${mitr.variable} ${rubik.variable} ${baiJamjuree.variable}`}
    >
      <head>
        <script src="https://accounts.google.com/gsi/client" async></script>
      </head>
      <body className={baiJamjuree.className}>
        <AppRouterCacheProvider>
          <StoreProvider>
            {' '}
            <AuthChecker />
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Navbar />
              <div className="bg-gray-100">
                <div className="mt-12 max-w-7xl mx-auto">{children}</div>
              </div>
            </ThemeProvider>
          </StoreProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
