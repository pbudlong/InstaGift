import { useState } from 'react';
import Logo from '@/components/Logo';
import PasswordModal from '@/components/PasswordModal';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';

export default function Landing() {
  const [showModal, setShowModal] = useState(false);
  const { checkPassword } = useAuth();
  const [, setLocation] = useLocation();

  const handleClick = () => {
    setShowModal(true);
  };

  const handlePasswordSuccess = () => {
    setLocation('/intro');
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div
      className="min-h-screen bg-background flex flex-col items-center justify-center px-6 cursor-pointer"
      onClick={handleClick}
      data-testid="landing-container"
    >
      <div className="flex-1 flex items-center justify-center">
        <div className="scale-[2.25]">
          <Logo />
        </div>
      </div>

      <div className="pb-12">
        <div className="text-center">
          <p className="text-xl font-medium text-primary animate-pulse">
            Check It Out
          </p>
        </div>
      </div>

      <PasswordModal
        open={showModal}
        onSuccess={handlePasswordSuccess}
        onClose={handleModalClose}
      />
    </div>
  );
}
