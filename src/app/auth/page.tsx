<<<<<<< HEAD
import GoogleSignInButton from '@/components/GoogleSinginButtong';

export default function Auth() {
  return (
    <main>
      <GoogleSignInButton />
=======
'use client';
import GoogleSignInButton from './components/GoogleSignInButton';
import { useSelector } from 'react-redux';
import { RootState } from '@/features/store';

export default function Auth() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  if (!isAuthenticated) {
    return (
      <main>
        <GoogleSignInButton />
      </main>
    );
  }

  return (
    <main>
      <h1>Authenticated</h1>
>>>>>>> 627568dbfc261d653c9b1935f2f78ff4d0ab664a
    </main>
  );
}
