import React, { useState, useEffect } from 'react';
import type { AppState, CheatingLog } from './types/santa';
import { loadAppState, saveAppState, parseUrlAuth } from './services/storageService';
import { Header } from './components/Header';
import { SnowEffect } from './components/SnowEffect';
import { FamilyPortal } from './components/FamilyPortal';
import { AdminPanel } from './components/AdminPanel';
import { toggleBackgroundMusic } from './services/soundEffects';

export const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [snowEnabled, setSnowEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentAuth, setCurrentAuth] = useState(() => parseUrlAuth());
  const soundEnabledRef = React.useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  // Lecture de la musique par défaut (avec déblocage au premier geste utilisateur si autoplay bloqué par le navigateur)
  useEffect(() => {
    toggleBackgroundMusic(true);

    const handleFirstInteraction = () => {
      if (soundEnabledRef.current) {
        toggleBackgroundMusic(true);
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  // Écouter les changements d'URL
  useEffect(() => {
    const handlePopState = () => {
      setCurrentAuth(parseUrlAuth());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Synchronisation avec le tirage officiel servi dans draw.json
  useEffect(() => {
    fetch(`/draw.json?t=${Date.now()}`)
      .then(res => {
        if (!res.ok) throw new Error('Fichier draw.json non accessible');
        return res.json();
      })
      .then(drawData => {
        if (drawData && drawData.isDrawn && Array.isArray(drawData.encryptedAssignments)) {
          setState(prev => {
            const syncedState: AppState = {
              ...prev,
              draw: {
                isDrawn: true,
                drawnAt: drawData.drawnAt || prev.draw.drawnAt,
                encryptedAssignments: drawData.encryptedAssignments,
                clearAssignmentsForAdmin: drawData.clearAssignmentsForAdmin || prev.draw.clearAssignmentsForAdmin
              }
            };
            saveAppState(syncedState);
            return syncedState;
          });
        }
      })
      .catch(err => {
        console.warn('Utilisation du tirage par défaut :', err);
      });
  }, []);

  const handleUpdateState = (newState: AppState) => {
    setState(newState);
    saveAppState(newState);
  };

  const handleLogCheating = (log: CheatingLog) => {
    setState(prev => {
      const updated = {
        ...prev,
        cheatingLogs: [log, ...(prev.cheatingLogs || [])]
      };
      saveAppState(updated);
      return updated;
    });
  };

  return (
    <div className="app-root">
      <SnowEffect enabled={snowEnabled} />

      <Header
        snowEnabled={snowEnabled}
        onToggleSnow={() => setSnowEnabled(!snowEnabled)}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const next = !soundEnabled;
          setSoundEnabled(next);
          toggleBackgroundMusic(next);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main className="main-content">
        <FamilyPortal
          state={state}
          currentAuth={currentAuth}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onLogCheating={handleLogCheating}
        />
      </main>

      {isAdminOpen && (
        <AdminPanel
          state={state}
          onUpdateState={handleUpdateState}
          onClose={() => setIsAdminOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
