import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { Inter, Mitr, Rubik, Bai_Jamjuree } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import './globals.css';
import theme from '@/utils/mui-theme';
import CssBaseline from '@mui/material/CssBaseline';

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
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
