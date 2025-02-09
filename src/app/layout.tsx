import { Mitr, Rubik, Bai_Jamjuree } from 'next/font/google';
import './globals.css';
import ClientLayout from './ClientLayout';
import { Metadata } from 'next';

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

export const metadata: Metadata = {
  title: 'u-credit',
  description:
    'แพลตฟอร์มการศึกษาสำหรับนักศึกษาสถาบันเทคโนโลยีพระจอมเก้าเจ้าคุณทหารลาดกระบัง',
  icons: {
    icon: '/icon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${mitr.variable} ${rubik.variable} ${baiJamjuree.variable}`}
    >
      <head>
        <script src="https://accounts.google.com/gsi/client" async></script>
      </head>
      <body className={`${baiJamjuree.className}`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
