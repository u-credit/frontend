'use client';
import { useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from '@/assets/logo.svg';
import Link from 'next/link';
import { Button, useMediaQuery } from '@mui/material';
import CustomButton from '@/components/CustomButton';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

interface NavItem {
  path: string;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/course', label: 'ค้นหารายวิชา' },
  { path: '/schedule', label: 'ตารางเรียน' },
  { path: '/', label: 'เช็คหน่วยกิต' },
  { path: '/auth', label: 'เข้าสู่ระบบ' },
];

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('');

  const isMediumScreen = useMediaQuery('(min-width:768px)');

  useEffect(() => {
    setActivePage(pathname);
  }, [pathname]);

  useEffect(() => {
    if (isMediumScreen) {
      setIsMenuOpen(false);
    }
  }, [isMediumScreen]);

  const handleLogin = () => {
    setActivePage('');
    router.push(`/auth`);
  };

  return (
    <nav className="fixed w-full h-12 bg-white border-b-2 top-0 left-0 z-50 flex items-center">
      <div className="max-w-7xl mx-auto w-full h-full flex items-center justify-between px-4">
        <Logo className="h-8" />

        {/* Burger Menu*/}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <MenuIcon className="h-6 w-6 bg-primary-300 rounded-sm text-primary-100" />
            ) : (
              <MenuIcon className="h-6 w-6 bg-primary-100 rounded-sm text-primary-300 text-5xl" />
            )}
          </button>
        </div>

        {/* desktop */}
        <div className="hidden md:flex md:items-center h-full">
          {navItems
            .filter((item) => item.path !== '/auth')
            .map((item, index) => (
              <Link
                key={index}
                href={item.path}
                onClick={() => setActivePage(item.path)}
                className={`flex items-center space-x-2 h-full cursor-pointer border-y-[3px] border-transparent px-4 font-mitr
              ${activePage === item.path ? 'border-b-primary-400 text-primary-400' : 'hover:border-b-primary-400 hover:text-primary-400'}`}
              >
                {item.label}
              </Link>
            ))}

          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{ minWidth: '115px', marginLeft: '16px' }}
          >
            เข้าสู่ระบบ
          </Button>
        </div>

        {/* mobile */}
        <div
          className={`md:hidden flex flex-col absolute top-12 left-0 w-full bg-white shadow-md ${isMenuOpen ? 'block' : 'hidden'}`}
        >
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              onClick={() => setActivePage(item.path)}
              className="p-4 border-b last:border-b-0"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
