'use client';

import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { CalendarToday, BarChart } from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    href: '/admin',
    label: 'Year/Semester',
    icon: CalendarToday,
  },
  {
    href: '/admin/reports',
    label: 'Reports',
    icon: BarChart,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-full flex flex-col gap-y-4 p-4 mb-10 mt-3 ">
      <div className="flex items-center justify-center text-primary-400 space-x-2">
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'rubik',
            fontWeight: 600,
            fontSize: '1.25rem',
            textAlign: 'center',
            width: '100%',
          }}
        >
          Admin Setting
        </Typography>
      </div>

      <List>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isSelected =
            pathname === item.href ||
            (pathname === '/admin' && item.href === '/admin');

          return (
            <ListItem
              key={item.href}
              component={Link}
              href={item.href}
              sx={{
                borderRadius: 2,
                mb: 1,
                bgcolor: isSelected ? 'primary.main' : 'white',
                color: isSelected ? 'white' : 'inherit',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: isSelected ? 'primary.main' : 'action.hover',
                  color: isSelected ? 'white' : 'inherit',
                },
              }}
            >
              <ListItemIcon>
                <Icon
                  sx={{
                    color: isSelected ? 'white' : 'inherit',
                    transition: 'all 0.2s ease',
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  '.MuiListItemText-primary': {
                    fontFamily: 'rubik',
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: isSelected ? 'white' : 'inherit',
                    transition: 'all 0.2s ease',
                  },
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
