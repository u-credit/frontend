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
      <main className="pt-8">
        <div className="flex flex-col bg-white h-96 rounded-3xl justify-center items-center gap-10">
          <div className="font-mitr font-medium text-4xl text-center border-b-[1px] w-11/12 pb-5">
            เข้าสู่ระบบ
          </div>
          <div className='flex flex-col items-center gap-2'>
            <div className="font-mitr font-medium text-xl">
              ยืนยันตัวตนด้วยบริการของ Google
            </div>
            <div className="font-bai-jamjuree font-normal text-lg text-primary-400">
              โดยใช้ Email Account ของสถาบันฯ
            </div>
          </div>
          <GoogleSignInButton />
        </div>
      </main>
    );
  }

  return (
    <main>
      <h1>Authenticated</h1>
    </main>
  );
}
