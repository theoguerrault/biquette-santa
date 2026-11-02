import React, { useState, useEffect } from 'react';
import type { Participant, EncryptedAssignment, EventConfig } from '../types/santa';
import { decryptSecret } from '../services/cryptoService';
import { playJingleBells } from '../services/soundEffects';
import { PARTNERS_MAP } from '../services/storageService';
import confetti from 'canvas-confetti';
import { X } from 'lucide-react';

interface RevealModalProps {
  participant: Participant;
  participants: Participant[];
  assignment?: EncryptedAssignment;
  config?: EventConfig;
  userCode: string;
  onClose: () => void;
}

export const RevealModal: React.FC<RevealModalProps> = ({
  participant,
  participants,
  assignment,
  userCode,
  onClose
}) => {
  const [targetName, setTargetName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetParticipant = participants.find(p => p.name === targetName);
  const partnerName = PARTNERS_MAP[participant.name];

  useEffect(() => {
    let isCancelled = false;

    const decrypt = async () => {
      if (!assignment) {
        setError('Le tirage au sort n’est pas encore disponible.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      const decrypted = await decryptSecret(
        assignment.ciphertext,
        assignment.iv,
        assignment.salt,
        userCode
      );

      if (isCancelled) return;

      if (decrypted) {
        setTargetName(decrypted);
        playJingleBells();
        confetti({
          particleCount: 100,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#f4d06f', '#c83e4d', '#2e7d32', '#ffffff']
        });
      } else {
        setError('Erreur d’accès. Le lien utilisé ne semble pas valide.');
      }

      setIsLoading(false);
    };

    decrypt();

    return () => {
      isCancelled = true;
    };
  }, [assignment, userCode]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container reveal-modal-direct" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Fermer">
          <X size={20} />
        </button>

        {isLoading ? (
          <div className="reveal-loading-card text-center">
            <p className="loading-text">Ouverture de ton secret en cours...</p>
          </div>
        ) : error ? (
          <div className="reveal-form-card text-center">
            <h2 className="modal-title">Oups !</h2>
            <p className="error-message shake-animation">{error}</p>
            <button onClick={onClose} className="btn-secondary" style={{ marginTop: '1rem' }}>
              Fermer
            </button>
          </div>
        ) : (
          <div className="gift-unboxed-card fade-in">
            <h2 className="unboxed-main-title">
              Un grand pouvoir implique de grandes responsabilités
            </h2>

            <div className="biquette-letter">
              <p className="letter-greeting">Salut à toi jeune Biquette !</p>
              <p>
                Te voilà en possession d'un grand secret, nombreuses sont les biquettes qui ont échoué dans cette quête du silence, mais je pense que tu devrais en être capable cette année.
              </p>
              <p>
                Le bruit court que les biquettes qui se sont égarées en chemin, ayant failli à leur mission, ont été privées de bûche, ce serait bête que tu ne puisses pas tremper ta truffe dans le dessert cette année, alors sois prudent.
              </p>

              <div className="letter-ps-group">
                {partnerName ? (
                  <p className="letter-ps">
                    PS : T'étais pas censé le dire à {partnerName}, Mr Jack va devoir se servir dans ton dessert à Noël.
                  </p>
                ) : (
                  <p className="letter-ps">
                    PS : Mr Jack va devoir se servir dans ton dessert à Noël.
                  </p>
                )}
                <p className="letter-ps">
                  PS2 : J'ai entendu dire que c'était un chic type Mr Jack, j'espère que tu as la chance de le connaître.
                </p>
              </div>
            </div>

            <div className="target-reveal-box pop-in">
              <div className="target-ribbon">CADEAU À OFFRIR</div>

              {targetParticipant?.avatar && (
                <div className="target-avatar-container">
                  <img
                    src={targetParticipant.avatar}
                    alt={targetName || ''}
                    className="target-avatar-img"
                  />
                </div>
              )}

              <div className="target-name">{targetName}</div>
            </div>

            <button
              onClick={onClose}
              className="btn-secret-close"
            >
              Aller remercier Mr Jack parce que c'est un chic type
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
