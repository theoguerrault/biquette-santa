import React from 'react';
import { Snowflake, Volume2, VolumeX } from 'lucide-react';

interface HeaderProps {
  snowEnabled: boolean;
  onToggleSnow: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  snowEnabled,
  onToggleSnow,
  soundEnabled,
  onToggleSound
}) => {
  return (
    <header className="site-header">
      <div className="header-actions">
        <button
          onClick={onToggleSnow}
          className={`header-tool-btn ${snowEnabled ? 'active' : ''}`}
          title={snowEnabled ? 'Désactiver la neige' : 'Activer la neige'}
          aria-label="Contrôle de la neige"
        >
          <Snowflake size={18} />
        </button>

        <button
          onClick={onToggleSound}
          className={`header-tool-btn ${soundEnabled ? 'active' : ''}`}
          title={soundEnabled ? 'Couper Mariah Carey' : 'Mariah Carey - All I Want For Christmas Is You'}
          aria-label="Contrôle du son"
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>
    </header>
  );
};
