import React, { useState, useEffect } from 'react';
import type { AppState, CheatingLog } from './types/santa';
import { loadAppState, saveAppState, parseUrlAuth } from './services/storageService';
import { executeDraw } from './services/algorithm';
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

  // Exécution d'un premier tirage automatique au premier démarrage si non encore fait
  useEffect(() => {
    if (!state.draw.isDrawn && state.participants.length >= 2) {
      executeDraw(state.participants, state.exclusions).then(result => {
        if (result.success && result.encryptedAssignments && result.assignments) {
          const clearMap: Record<string, string> = {};
          const participantMap = new Map(state.participants.map(p => [p.id, p]));
          for (const [giverId, receiverId] of Object.entries(result.assignments)) {
            const receiver = participantMap.get(receiverId);
            if (receiver) clearMap[giverId] = receiver.name;
          }

          const initialDrawnState: AppState = {
            ...state,
            draw: {
              isDrawn: true,
              drawnAt: new Date().toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit'
              }),
              encryptedAssignments: result.encryptedAssignments,
              clearAssignmentsForAdmin: clearMap
            }
          };

          setState(initialDrawnState);
          saveAppState(initialDrawnState);
        }
      });
    }
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
