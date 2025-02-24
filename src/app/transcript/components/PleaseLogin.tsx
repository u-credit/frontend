import React from 'react';
import GoogleSignInButton from '@/app/auth/components/GoogleSignInButton';

const PleaseLogin = () => {
    return (
    <div className="flex flex-col bg-white h-96 rounded-3xl justify-center items-center gap-10">
      <div className="font-mitr font-medium text-4xl text-center border-b-[1px] w-11/12 pb-5">
        กรุณาเข้าสู่ระบบ เพื่อดำเนินการต่อ
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
    
    );
};
export default PleaseLogin;