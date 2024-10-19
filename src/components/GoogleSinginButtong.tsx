'use client';
import { useEffect } from 'react';
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (params: {
            client_id: string;
            callback: (response: any) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: { theme?: string; size?: string },
          ) => void;
        };
      };
    };
  }
}

const GoogleSignInButton = () => {
  useEffect(() => {
    // โหลด Google Sign-In API
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = () => {
        window.google.accounts.id.initialize({
          client_id: '828153522529-3r74o4rjjfhku1oqj1tt411crq1vc452.apps.googleusercontent.com',
          callback: handleCredentialResponse,
        });

        const buttonContainer = document.getElementById('google-signin-button');
        if (buttonContainer) {
          window.google.accounts.id.renderButton(buttonContainer, {
            theme: 'outline',
            size: 'large',
          });
        }
      };
      document.body.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  const handleCredentialResponse = (response: { credential: string }) => {
    console.log('Encoded JWT ID token: ' + response.credential);
    // ทำการประมวลผล JWT token ที่ได้รับ เช่น ส่งไปยังเซิร์ฟเวอร์เพื่อการตรวจสอบ
  };

  return <div id="google-signin-button"></div>;
};

export default GoogleSignInButton;
