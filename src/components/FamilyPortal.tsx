import React, { useState } from 'react';
import type { Participant, AppState, CheatingLog } from '../types/santa';
import { RevealModal } from './RevealModal';
import { TrollModal } from './TrollModal';
import { Gift, ShieldAlert, User } from 'lucide-react';

interface FamilyPortalProps {
  state: AppState;
  currentAuth: { userId: string | null; code: string | null };
  onOpenAdmin: () => void;
  onLogCheating: (log: CheatingLog) => void;
}

export const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = Number(parts[0]);
      const month = Number(parts[1]) - 1;
      const day = Number(parts[2]);
      const d = new Date(year, month, day);
      return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    }
  } catch {}
  return dateStr;
};

export const FamilyPortal: React.FC<FamilyPortalProps> = ({
  state,
  currentAuth,
  onOpenAdmin,
  onLogCheating
}) => {
  const [revealingParticipant, setRevealingParticipant] = useState<Participant | null>(null);
  const [trollTarget, setTrollTarget] = useState<Participant | null>(null);

  const isDrawn = state.draw.isDrawn;
  const participantCount = state.participants.length;

  const loggedUser = state.participants.find(
    p => p.id === currentAuth.userId && currentAuth.code === p.secretToken
  );

  const handleCardClick = (p: Participant) => {
    // Vérifier si l'utilisateur possède le bon token dans l'URL pour ce participant précis
    const isAuthorized =
      currentAuth.userId === p.id &&
      currentAuth.code &&
      currentAuth.code.trim().toLowerCase() === p.secretToken.trim().toLowerCase();

    if (isAuthorized) {
      setRevealingParticipant(p);
    } else {
      // Enregistrer l'infraction dans le journal pour Mr Jack !
      const fromName = loggedUser ? loggedUser.name : 'Visiteur anonyme (sans lien)';
      const fromAvatar = loggedUser?.avatar;

      onLogCheating({
        id: `cheat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        fromName,
        fromAvatar,
        targetName: p.name,
        targetAvatar: p.avatar,
        timestamp: new Date().toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      });

      setTrollTarget(p);
    }
  };

  return (
    <div className="portal-container">
      {/* Hero Header */}
      <header className="portal-hero">
        <h1 className="hero-title">{state.config.title}</h1>
        <p className="hero-callout">
          Choisi ton personnage, tu sauras te reconnaitre
        </p>
        <p className="hero-description">
          Tout cadeau supplémentaire offert à Mr Jack sera fortement apprécié
        </p>
      </header>

      {/* Avertissement si tirage non encore effectué */}
      {!isDrawn && (
        <div className="draw-pending-alert">
          <ShieldAlert size={24} className="alert-icon" />
          <div className="alert-content">
            <h3>Le tirage au sort n’est pas encore lancé !</h3>
            <p>
              Mr Jack (l’organisateur) doit d’abord valider les règles et cliquer sur <strong>« Lancer le tirage »</strong> dans Gérer le basar.
            </p>
          </div>
          <button onClick={onOpenAdmin} className="btn-secondary btn-sm">
            Gérer le basar
          </button>
        </div>
      )}

      {/* Grille des membres du Fanclub de Mr Jack */}
      <section className="family-grid-section">
        <div className="section-header">
          <h2 className="section-title">
            <Gift size={22} className="title-icon" /> Fanclub de Mr Jack
          </h2>
          <span className="participant-counter">
            {participantCount} membres
          </span>
        </div>

        <div className="family-grid">
          {state.participants.map(p => {
            const isMe = loggedUser?.id === p.id;

            return (
              <div
                key={p.id}
                className={`family-card ${isMe ? 'my-profile-card' : ''} ${p.isAdmin ? 'admin-card' : ''}`}
                onClick={() => handleCardClick(p)}
              >
                <div className="card-avatar-wrapper">
                  <img
                    src={p.avatar || '/avatars/1.jpeg'}
                    alt={p.name}
                    className="card-avatar-img"
                    loading="lazy"
                  />
                </div>
                <div className="card-content">
                  <div className="card-header-row">
                    <h3 className="card-name">{p.name}</h3>
                    {p.isAdmin && <span className="admin-tag">Nice Guy</span>}
                  </div>
                  <p className="card-action-hint">
                    Devenir Biquette Santa
                  </p>
                </div>
                <button
                  className="card-open-btn"
                  title={`Devenir Biquette Santa pour ${p.name}`}
                  aria-label={`Devenir Biquette Santa pour ${p.name}`}
                >
                  <Gift size={18} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer épuré */}
      <footer className="portal-footer">
        <button onClick={onOpenAdmin} className="admin-link-btn">
          <User size={14} /> Gérer le basar
        </button>
      </footer>

      {/* Modale de révélation légitime */}
      {revealingParticipant && currentAuth.code && (
        <RevealModal
          participant={revealingParticipant}
          participants={state.participants}
          userCode={currentAuth.code}
          assignment={state.draw.encryptedAssignments.find(
            a => a.giverId === revealingParticipant.id
          )}
          config={state.config}
          onClose={() => setRevealingParticipant(null)}
        />
      )}

      {/* Modale troll si clic sur un autre profil */}
      {trollTarget && (
        <TrollModal
          targetName={trollTarget.name}
          onClose={() => setTrollTarget(null)}
        />
      )}
    </div>
  );
};
