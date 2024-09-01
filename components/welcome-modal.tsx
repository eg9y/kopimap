import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from './catalyst/dialog';
import { Button } from './catalyst/button';
import { useI18nContext } from '@/src/i18n/i18n-react';

export const WelcomeModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { LL } = useI18nContext();

  useEffect(() => {
    const checkAndShowModal = () => {
      const lastVisit = localStorage.getItem('lastVisit');
      const today = new Date().toDateString();

      if (!lastVisit || lastVisit !== today) {
        setIsOpen(true);
        localStorage.setItem('lastVisit', today);
      }
    };

    checkAndShowModal();
  }, []);

  const handleClose = () => setIsOpen(false);

  return (
    <Dialog open={isOpen} onClose={setIsOpen} className='pb-20 md:pb-10'>
      <DialogTitle className="text-2xl font-bold text-center">{LL.welcomeModal.title()}</DialogTitle>
      <DialogDescription className="text-center">{LL.welcomeModal.description()}</DialogDescription>
      <DialogBody>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          {Object.keys(LL.welcomeModal.features).map((key) => (
            <li key={key}>{LL.welcomeModal.features[key as keyof typeof LL.welcomeModal.features]()}</li>
          ))}
        </ul>
        <p className="text-sm text-gray-600 mb-2">{LL.welcomeModal.passionProject()}</p>
        <p className="text-sm italic mb-4">{LL.welcomeModal.personalNote()}</p>
        <p className="text-base font-medium text-center">{LL.welcomeModal.thankYou()}</p>
      </DialogBody>
      <DialogActions>
        <Button onClick={handleClose} className="w-full">{LL.welcomeModal.closeButton()}</Button>
      </DialogActions>
    </Dialog>
  );
};
