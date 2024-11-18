import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "./catalyst/dialog";
import { Button } from "./catalyst/button";

export const WelcomeModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const lastVisit = localStorage.getItem("lastVisit");
    const today = new Date().toDateString();

    if (!lastVisit || lastVisit !== today) {
      setIsOpen(true);
      localStorage.setItem("lastVisit", today);
    }
  }, []);

  const handleClose = () => setIsOpen(false);

  return (
    <Dialog
      open={isOpen}
      onClose={setIsOpen}
      className="md:pb-10 z-[100000000]"
    >
      <DialogTitle className="text-2xl font-bold text-center">
        Selamat Datang di Kopimap! ☕️🗺️
      </DialogTitle>
      <DialogDescription className="text-center">
        Temukan kafe terbaik di Jakarta untuk ngopi, kerja, atau bersantai.
      </DialogDescription>
      <DialogBody className="overflow-y-scroll max-h-[55dvh]">
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Jelajahi peta interaktif kafe Jakarta</li>
          <li>Baca ulasan dari komunitas</li>
          <li>Bagikan pengalaman kafe Anda</li>
        </ul>
        <p className="text-sm text-gray-600 mb-4">
          Kopimap adalah proyek yang dibuat dengan sepenuh hati oleh satu
          developer. Terima kasih telah bergabung dalam perjalanan kopi ini di
          Jakarta!
        </p>
      </DialogBody>
      <DialogActions>
        <Button color="orange" onClick={handleClose} className="w-full">
          Mulai Petualangan Kopi Anda
        </Button>
      </DialogActions>
    </Dialog>
  );
};
