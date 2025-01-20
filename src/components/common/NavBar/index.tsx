'use client';
import { useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from '@/assets/logo.svg';
import Link from 'next/link';
import { Avatar, Button, Menu, MenuItem, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { AppDispatch, RootState } from '@/features/store';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/features/auth/authSlice';
import { handleLogout } from '@/features/auth/authAction';

interface NavItem {
  path: string;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/course', label: 'ค้นหารายวิชา' },
  { path: '/schedule', label: 'ตารางเรียน' },
  { path: '/transcript', label: 'เช็คหน่วยกิต' },
  { path: '/auth', label: 'เข้าสู่ระบบ' },
];

const navItemsAuthenticated: NavItem[] = [
  { path: '/course', label: 'ค้นหารายวิชา' },
  { path: '/schedule', label: 'ตารางเรียน' },
  { path: '/', label: 'เช็คหน่วยกิต' },
];
function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isMenuMobileOpen, setIsMenuMobileOpen] = useState(false);
  const [activePage, setActivePage] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMediumScreen = useMediaQuery('(min-width:768px)');
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  useEffect(() => {
    setActivePage(pathname);
  }, [pathname]);

  useEffect(() => {
    if (isMediumScreen) {
      setIsMenuMobileOpen(false);
    }
  }, [isMediumScreen]);

  const handleLogin = () => {
    setActivePage('');
    router.push(`/auth`);
  };

  const handleMobileMenuClose = () => {
    // setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const isMenuOpen = Boolean(anchorEl);
  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          dispatch(handleLogout());
          handleMenuClose();
        }}
      >
        ออกจากระบบ
      </MenuItem>
    </Menu>
  );

  return (
    <nav className="fixed w-full h-12 bg-white border-b-2 top-0 left-0 z-50 flex items-center">
      <div className="max-w-7xl mx-auto w-full h-full flex items-center justify-between px-4">
        <Logo className="h-8" />

        {/* Burger Menu*/}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMenuMobileOpen(!isMenuMobileOpen)}>
            {isMenuMobileOpen ? (
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

          {isAuthenticated ? (
            <Avatar
              {...stringAvatar('Kent Dodds')}
              sx={{
                width: '32px',
                height: '32px',
                fontSize: '14px',
                marginLeft: '16px',
                '&:hover': { cursor: 'pointer' },
              }}
              onClick={handleProfileMenuOpen}
            />
          ) : (
            <Button
              variant="contained"
              onClick={handleLogin}
              sx={{ minWidth: '115px', marginLeft: '16px' }}
            >
              เข้าสู่ระบบ
            </Button>
          )}
        </div>

        {/* mobile */}
        <div
          className={`md:hidden flex flex-col absolute top-12 left-0 w-full bg-white shadow-md ${isMenuMobileOpen ? 'block' : 'hidden'}`}
        >
          {isAuthenticated ? (
            <>
              {navItemsAuthenticated.map((item, index) => (
                <Link
                  key={index}
                  href={item.path}
                  onClick={() => {
                    setActivePage(item.path);
                    setIsMenuMobileOpen(false);
                  }}
                  className="p-4 border-b last:border-b-0"
                >
                  {item.label}
                </Link>
              ))}

              <div
                className="p-4 border-b last:border-b-0 hover:cursor-pointer"
                onClick={() => {
                  dispatch(handleLogout());
                  setIsMenuMobileOpen(false);
                }}
              >
                ออกจากระบบ
              </div>
            </>
          ) : (
            <>
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.path}
                  onClick={() => {
                    setActivePage(item.path);
                    setIsMenuMobileOpen(false);
                  }}
                  className="p-4 border-b last:border-b-0"
                >
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </div>

        {renderMenu}
      </div>
    </nav>
  );
}
