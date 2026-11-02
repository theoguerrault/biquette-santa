import React, { useState, useEffect } from 'react';
import { playQuackSound } from '../services/soundEffects';

interface TrollModalProps {
  onClose: () => void;
  targetName?: string;
}

export const TrollModal: React.FC<TrollModalProps> = ({ onClose }) => {
  const [shaking, setShaking] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  // Empêcher la fermeture via la touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        triggerTrap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerTrap = () => {
    setShaking(true);
    setAttemptCount(prev => prev + 1);
    setTimeout(() => setShaking(false), 500);
  };

  const handleConfess = () => {
    playQuackSound();
    onClose();
  };

  return (
    <div className="modal-backdrop dark-pattern-backdrop" onClick={triggerTrap}>
      <div
        className={`modal-container troll-modal-container ${shaking ? 'shake-animation' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="troll-content">
          <div className="troll-avatar-wrapper">
            <img
              src="/avatars/1.jpeg"
              alt="Rick Sanchez"
              className="troll-avatar-img"
            />
          </div>

          <h2 className="troll-title">
            Tu crois vraiment que j'avais pas prévu le coup ?
          </h2>

          {attemptCount > 0 && (
            <p className="trap-warning-text shake-animation">
              Inutile d'essayer de fermer ou de cliquer à côté, tu dois avouer !
            </p>
          )}

          <button onClick={handleConfess} className="btn-primary btn-troll">
            Fermer avec déception
          </button>
        </div>
      </div>
    </div>
  );
};
