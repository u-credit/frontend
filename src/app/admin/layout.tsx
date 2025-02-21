'use client';

import React from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminGuard from './components/AdminGuard';

export default function AdminLayout({ 
  children, 
}: { 
  children: React.ReactNode; 
}) {
  return (
    <AdminGuard>
      <main className="flex flex-row bg-gray-100 w-full h-screen overflow-hidden">
        <div className="hidden lg:flex fixed w-60 bg-white h-screen">
          <AdminSidebar />
        </div>

        <div className="flex flex-col w-full h-screen overflow-hidden">
          <div className="flex flex-col flex-grow h-full bg-white lg:ml-64 overflow-hidden">
            {children}
          </div>
        </div>
      </main>
    </AdminGuard>
  );
}