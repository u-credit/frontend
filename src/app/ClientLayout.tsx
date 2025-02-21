'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/utils/mui-theme';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from '@/components/common/NavBar';
import StoreProvider from './StoreProvider';
//import AlertNotification from '@/components/AlertNotification';
import { useAuth } from '@/hooks/useAuth';
import CustomAlert from '@/components/CustomAlert';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppRouterCacheProvider>
      <StoreProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthWrapper />
          <Navbar />
          <div className="h-screen bg-gray-100 overflow-auto ">
            <div className="mt-12 max-w-7xl mx-auto">{children}</div>
          </div>
          <CustomAlert />
        </ThemeProvider>
      </StoreProvider>
    </AppRouterCacheProvider>
  );
}

function AuthWrapper() {
  useAuth();

  return null;
}
