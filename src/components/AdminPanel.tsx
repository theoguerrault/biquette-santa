import React, { useState } from 'react';
import type { AppState, Participant, ExclusionRule } from '../types/santa';
import { executeDraw } from '../services/algorithm';
import {
  saveAppState,
  AVAILABLE_AVATARS,
  buildParticipantUrl,
  generateSecretToken
} from '../services/storageService';
import {
  Sparkles,
  Unlock,
  Users,
  Shield,
  Settings,
  Share2,
  Copy,
  Check,
  Trash2,
  Plus,
  RefreshCw,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowRight,
  ArrowLeftRight,
  Gift,
  Edit2,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface AdminPanelProps {
  state: AppState;
  onUpdateState: (newState: AppState) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ state, onUpdateState, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordAttempt, setPasswordAttempt] = useState('');
  const [authError, setAuthError] = useState(false);

  const [activeTab, setActiveTab] = useState<'draw' | 'cheats' | 'participants' | 'rules' | 'share'>('draw');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [showClearSecrets, setShowClearSecrets] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawError, setDrawError] = useState<string | null>(null);

  // Formulaire d'ajout de participant
  const [newParticipantName, setNewParticipantName] = useState('');
  const [newParticipantAvatar, setNewParticipantAvatar] = useState('/avatars/1.jpeg');

  // Participant en cours d'édition
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);

  // Formulaire d'exclusion
  const [exclusionFrom, setExclusionFrom] = useState('');
  const [exclusionTo, setExclusionTo] = useState('');
  const [exclusionBidirectional, setExclusionBidirectional] = useState(true);

  // Authentification avec @biquettesanta44@
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordAttempt === state.adminPassword || passwordAttempt === '@biquettesanta44@') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  // Lancer le tirage
  const handleLaunchDraw = async () => {
    setIsDrawing(true);
    setDrawError(null);

    const result = await executeDraw(state.participants, state.exclusions);

    if (result.success && result.encryptedAssignments && result.assignments) {
      const clearMap: Record<string, string> = {};
      const participantMap = new Map(state.participants.map(p => [p.id, p]));
      for (const [giverId, receiverId] of Object.entries(result.assignments)) {
        const receiver = participantMap.get(receiverId);
        if (receiver) {
          clearMap[giverId] = receiver.name;
        }
      }

      const updatedState: AppState = {
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

      onUpdateState(updatedState);
      saveAppState(updatedState);
    } else {
      setDrawError(result.error || 'Erreur inconnue lors du tirage.');
    }

    setIsDrawing(false);
  };

  // Copier directement uniquement l'URL pure à envoyer (rien d'autre dans le presse-papier)
  const copyUrlForParticipant = async (p: Participant) => {
    const pUrl = buildParticipantUrl(p).trim();
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(pUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = pUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopiedId(p.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      window.prompt("Voici l'URL à copier :", pUrl);
    }
  };

  // Ajouter un participant
  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParticipantName.trim()) return;

    const newParticipant: Participant = {
      id: `p_${Date.now()}`,
      name: newParticipantName.trim(),
      secretToken: generateSecretToken(newParticipantName.trim().toLowerCase().slice(0, 4)),
      avatar: newParticipantAvatar,
      isAdmin: false
    };

    const updatedState: AppState = {
      ...state,
      participants: [...state.participants, newParticipant],
      draw: { isDrawn: false, encryptedAssignments: [] }
    };

    onUpdateState(updatedState);
    saveAppState(updatedState);

    setNewParticipantName('');
  };

  // Enregistrer la modification d'un participant
  const handleSaveParticipantEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParticipant) return;

    const updatedParticipants = state.participants.map(p =>
      p.id === editingParticipant.id ? editingParticipant : p
    );

    let newDrawState = state.draw;
    if (state.draw.isDrawn) {
      const drawResult = await executeDraw(updatedParticipants, state.exclusions);
      if (drawResult.success && drawResult.encryptedAssignments && drawResult.assignments) {
        const clearMap: Record<string, string> = {};
        const pMap = new Map(updatedParticipants.map(p => [p.id, p]));
        for (const [gId, rId] of Object.entries(drawResult.assignments)) {
          const rec = pMap.get(rId);
          if (rec) clearMap[gId] = rec.name;
        }
        newDrawState = {
          ...state.draw,
          encryptedAssignments: drawResult.encryptedAssignments,
          clearAssignmentsForAdmin: clearMap
        };
      }
    }

    const updatedState: AppState = {
      ...state,
      participants: updatedParticipants,
      draw: newDrawState
    };

    onUpdateState(updatedState);
    saveAppState(updatedState);
    setEditingParticipant(null);
  };

  // Supprimer un participant
  const handleDeleteParticipant = (id: string) => {
    if (confirm('Voulez-vous vraiment retirer ce participant ? Le tirage sera réinitialisé.')) {
      const updatedParticipants = state.participants.filter(p => p.id !== id);
      const updatedExclusions = state.exclusions.filter(e => e.fromId !== id && e.toId !== id);

      const updatedState: AppState = {
        ...state,
        participants: updatedParticipants,
        exclusions: updatedExclusions,
        draw: { isDrawn: false, encryptedAssignments: [] }
      };

      onUpdateState(updatedState);
      saveAppState(updatedState);
    }
  };

  // Ajouter une règle d'exclusion
  const handleAddExclusion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exclusionFrom || !exclusionTo || exclusionFrom === exclusionTo) return;

    const exists = state.exclusions.some(
      ex =>
        (ex.fromId === exclusionFrom && ex.toId === exclusionTo) ||
        (ex.bidirectional && ex.fromId === exclusionTo && ex.toId === exclusionFrom)
    );

    if (exists) {
      alert('Cette règle d’exclusion existe déjà !');
      return;
    }

    const newRule: ExclusionRule = {
      id: `ex_${Date.now()}`,
      fromId: exclusionFrom,
      toId: exclusionTo,
      bidirectional: exclusionBidirectional
    };

    const updatedState: AppState = {
      ...state,
      exclusions: [...state.exclusions, newRule],
      draw: { isDrawn: false, encryptedAssignments: [] }
    };

    onUpdateState(updatedState);
    saveAppState(updatedState);

    setExclusionFrom('');
    setExclusionTo('');
  };

  // Supprimer une exclusion
  const handleDeleteExclusion = (ruleId: string) => {
    const updatedState: AppState = {
      ...state,
      exclusions: state.exclusions.filter(r => r.id !== ruleId),
      draw: { isDrawn: false, encryptedAssignments: [] }
    };
    onUpdateState(updatedState);
    saveAppState(updatedState);
  };

  // Vider le journal des curieux
  const handleClearCheatingLogs = () => {
    if (confirm('Voulez-vous effacer l’historique des vilains petits canards ?')) {
      const updatedState: AppState = {
        ...state,
        cheatingLogs: []
      };
      onUpdateState(updatedState);
      saveAppState(updatedState);
    }
  };

  const cheatingCount = state.cheatingLogs?.length || 0;

  if (!isAuthenticated) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-container admin-login-card text-center" onClick={e => e.stopPropagation()}>
          <h2 className="modal-title" style={{ marginBottom: '1.2rem' }}>
            gerer le basar
          </h2>

          <form onSubmit={handleLogin} className="reveal-form">
            <input
              type="password"
              placeholder="Mot de passe..."
              value={passwordAttempt}
              onChange={e => setPasswordAttempt(e.target.value)}
              className={`custom-input ${authError ? 'input-error' : ''}`}
              autoFocus
            />
            {authError && <p className="error-message">Mot de passe incorrect (@biquettesanta44@)</p>}

            <div className="button-group modal-actions" style={{ marginTop: '1rem' }}>
              <button type="button" onClick={onClose} className="btn-secondary">
                Annuler
              </button>
              <button type="submit" className="btn-primary">
                <Unlock size={16} /> Entrer
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="admin-modal-container" onClick={e => e.stopPropagation()}>
        {/* En-tête Admin */}
        <header className="admin-header">
          <div className="admin-title-area">
            <h2 className="admin-main-title">
              <Sparkles size={22} className="gold" /> Gerer le basar
            </h2>
            <p className="admin-subtitle">Gérez les participants, liens d'accès, exclusions et le tirage.</p>
          </div>
          <button onClick={onClose} className="btn-secondary btn-sm">
            Fermer l’espace
          </button>
        </header>

        {/* Navigation par onglets */}
        <nav className="admin-tabs">
          <button
            className={`admin-tab-btn ${activeTab === 'draw' ? 'active' : ''}`}
            onClick={() => setActiveTab('draw')}
          >
            <Gift size={16} /> Tirage & Liens personnels
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'cheats' ? 'active alert-tab' : ''}`}
            onClick={() => setActiveTab('cheats')}
          >
            <ShieldAlert size={16} className={cheatingCount > 0 ? 'text-danger' : ''} />
            Vilains petits canards
            {cheatingCount > 0 && <span className="tab-pill-counter">{cheatingCount}</span>}
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'participants' ? 'active' : ''}`}
            onClick={() => setActiveTab('participants')}
          >
            <Users size={16} /> Participants ({state.participants.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
            onClick={() => setActiveTab('rules')}
          >
            <Shield size={16} /> Exclusions ({state.exclusions.length}) & Budget
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'share' ? 'active' : ''}`}
            onClick={() => setActiveTab('share')}
          >
            <Share2 size={16} /> Sauvegarde
          </button>
        </nav>

        {/* Contenu de l'onglet actif */}
        <div className="admin-tab-content">
          {/* ONGLET 1 : TIRAGE & LIENS PERSONNELS */}
          {activeTab === 'draw' && (
            <div className="tab-pane">
              <div className="draw-action-banner">
                <div className="draw-status-text">
                  <h3>
                    Statut : {state.draw.isDrawn ? 'Tirage au sort prêt !' : 'Aucun tirage actif'}
                  </h3>
                  <p>
                    {state.draw.isDrawn
                      ? `Tirage réalisé le ${state.draw.drawnAt}. Envoyez à chaque membre son lien personnel ci-dessous.`
                      : 'Cliquez sur le bouton ci-contre pour exécuter la chaîne circulaire équitable.'}
                  </p>
                </div>
                <button
                  onClick={handleLaunchDraw}
                  disabled={isDrawing || state.participants.length < 2}
                  className="btn-primary btn-sparkle"
                >
                  <RefreshCw size={18} className={isDrawing ? 'spin' : ''} />
                  {state.draw.isDrawn ? 'Re-tirer au sort' : 'Lancer le tirage'}
                </button>
              </div>

              {drawError && (
                <div className="error-banner">
                  <AlertTriangle size={18} /> {drawError}
                </div>
              )}

              {/* Tableau des participants avec boutons Copier le lien personnel */}
              <div className="admin-section-card">
                <div className="participants-passwords-table">
                  {state.participants.map(p => (
                    <div key={p.id} className="password-row-item">
                      <div className="person-identity">
                        <img
                          src={p.avatar || '/avatars/1.jpeg'}
                          alt={p.name}
                          className="table-avatar-img"
                        />
                        <div>
                          <strong>{p.name}</strong>
                          {p.isAdmin && <span className="mini-badge">Admin</span>}
                        </div>
                      </div>

                      <div className="row-actions">
                        <button
                          onClick={() => setEditingParticipant(p)}
                          className="btn-edit-icon"
                          title="Modifier le pseudo ou l'avatar"
                        >
                          <Edit2 size={15} />
                        </button>

                        <a
                          href={buildParticipantUrl(p)}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-edit-icon"
                          title="Tester le lien dans un nouvel onglet"
                        >
                          <ExternalLink size={15} />
                        </a>

                        <button
                          onClick={() => copyUrlForParticipant(p)}
                          className={`btn-copy-msg ${copiedId === p.id ? 'copied' : ''}`}
                          title={`Copier uniquement l'URL pour ${p.name}`}
                        >
                          {copiedId === p.id ? (
                            <>
                              <Check size={14} /> URL copiée !
                            </>
                          ) : (
                            <>
                              <Copy size={14} /> Copier l'URL
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Révélation d'urgence pour l'organisateur */}
              {state.draw.isDrawn && state.draw.clearAssignmentsForAdmin && (
                <div className="admin-section-card cheat-sheet-card">
                  <div className="cheat-header">
                    <h4>Anti-sèche Organisateur (Secrets du tirage)</h4>
                    <button
                      onClick={() => setShowClearSecrets(!showClearSecrets)}
                      className="btn-toggle-secret"
                    >
                      {showClearSecrets ? <EyeOff size={16} /> : <Eye size={16} />}
                      {showClearSecrets ? 'Cacher la liste' : 'Révéler la liste des cadeaux'}
                    </button>
                  </div>
                  {showClearSecrets ? (
                    <div className="cheat-sheet-list">
                      {state.participants.map(p => {
                        const target = state.draw.clearAssignmentsForAdmin?.[p.id];
                        return (
                          <div key={p.id} className="cheat-item">
                            <span>{p.name}</span>
                            <ArrowRight size={14} className="arrow" />
                            <strong>{target || '?'}</strong>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}

          {/* ONGLET 2 : VILAINS PETITS CANARDS (RÉCAP DES TENTATIVES DE TRICHE) */}
          {activeTab === 'cheats' && (
            <div className="tab-pane">
              <div className="admin-section-card cheats-summary-card">
                <div className="card-top-row">
                  <div>
                    <h4>
                      <ShieldAlert size={20} className="text-danger" /> Journal des vilains petits canards ({cheatingCount})
                    </h4>
                    <p className="card-desc">
                      Voici les petits curieux qui ont osé cliquer sur le profil d'un autre membre de la famille !
                    </p>
                  </div>
                  {cheatingCount > 0 && (
                    <button onClick={handleClearCheatingLogs} className="btn-secondary btn-sm">
                      <Trash2 size={14} /> Effacer l'historique
                    </button>
                  )}
                </div>

                {cheatingCount === 0 ? (
                  <div className="empty-cheats-state">
                    <p className="empty-cheats-text">
                      Aucun vilain petit canard pour le moment ! Tout le monde reste bien sage sur son propre profil.
                    </p>
                  </div>
                ) : (
                  <div className="cheating-logs-list">
                    {state.cheatingLogs.map(log => (
                      <div key={log.id} className="cheating-log-item">
                        <div className="cheater-col">
                          {log.fromAvatar && (
                            <img src={log.fromAvatar} alt="" className="log-avatar" />
                          )}
                          <span className="cheater-name">{log.fromName}</span>
                        </div>

                        <div className="action-col">
                          <span className="log-action-text">a tenté d'espionner</span>
                          <ArrowRight size={14} className="log-arrow text-danger" />
                        </div>

                        <div className="target-col">
                          {log.targetAvatar && (
                            <img src={log.targetAvatar} alt="" className="log-avatar" />
                          )}
                          <strong className="log-target-name">{log.targetName}</strong>
                        </div>

                        <div className="time-col">
                          <span className="log-time-badge">{log.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ONGLET 3 : GESTION DES PARTICIPANTS */}
          {activeTab === 'participants' && (
            <div className="tab-pane">
              <div className="admin-section-card">
                <h4>Ajouter un membre</h4>
                <form onSubmit={handleAddParticipant} className="add-participant-form">
                  <input
                    type="text"
                    placeholder="Prénom ou pseudo (ex: Tonton Jacques)"
                    value={newParticipantName}
                    onChange={e => setNewParticipantName(e.target.value)}
                    className="custom-input"
                  />

                  <div className="avatar-quick-select">
                    <span className="select-label">Personnage Rick & Morty :</span>
                    <div className="avatar-thumbnails-strip">
                      {AVAILABLE_AVATARS.map(av => (
                        <img
                          key={av.id}
                          src={av.url}
                          alt={av.name}
                          title={av.name}
                          onClick={() => setNewParticipantAvatar(av.url)}
                          className={`avatar-thumb-btn ${newParticipantAvatar === av.url ? 'selected' : ''}`}
                        />
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="btn-primary">
                    <Plus size={16} /> Ajouter
                  </button>
                </form>
              </div>

              <div className="admin-section-card">
                <div className="card-top-row">
                  <h4>Liste des participants ({state.participants.length})</h4>
                </div>

                <div className="participants-manage-list">
                  {state.participants.map(p => (
                    <div key={p.id} className="participant-manage-item">
                      <div className="info-with-avatar">
                        <img
                          src={p.avatar || '/avatars/1.jpeg'}
                          alt={p.name}
                          className="table-avatar-img"
                        />
                        <div className="info">
                          <strong>{p.name}</strong>
                          <span className="pwd-hint">Code URL : <code>{p.secretToken}</code></span>
                        </div>
                      </div>
                      <div className="actions">
                        <button
                          onClick={() => copyUrlForParticipant(p)}
                          className="btn-secondary btn-sm"
                          title="Copier l'URL à envoyer"
                        >
                          {copiedId === p.id ? <Check size={14} /> : <Copy size={14} />}
                          {copiedId === p.id ? "URL copiée" : "Copier l'URL"}
                        </button>
                        <button
                          onClick={() => setEditingParticipant(p)}
                          className="btn-secondary btn-sm"
                          title="Modifier"
                        >
                          <Edit2 size={14} /> Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteParticipant(p.id)}
                          className="btn-danger-icon"
                          title="Supprimer"
                          aria-label={`Supprimer ${p.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ONGLET 4 : RÈGLES D'EXCLUSION & BUDGET */}
          {activeTab === 'rules' && (
            <div className="tab-pane">
              <div className="admin-section-card">
                <h4><Settings size={18} /> Budget & Paramètres</h4>
                <div className="settings-grid">
                  <div className="field-group">
                    <label>Titre de l'événement</label>
                    <input
                      type="text"
                      value={state.config.title}
                      onChange={e => {
                        const updated: AppState = {
                          ...state,
                          config: { ...state.config, title: e.target.value }
                        };
                        onUpdateState(updated);
                        saveAppState(updated);
                      }}
                      className="custom-input"
                    />
                  </div>

                  <div className="field-group">
                    <label>Budget du cadeau (€)</label>
                    <input
                      type="number"
                      value={state.config.budget}
                      onChange={e => {
                        const updated: AppState = {
                          ...state,
                          config: { ...state.config, budget: Number(e.target.value) || 0 }
                        };
                        onUpdateState(updated);
                        saveAppState(updated);
                      }}
                      className="custom-input"
                    />
                  </div>

                  {/* Datepicker */}
                  <div className="field-group">
                    <label>Date de l'échange</label>
                    <input
                      type="date"
                      value={state.config.date}
                      onChange={e => {
                        const updated: AppState = {
                          ...state,
                          config: { ...state.config, date: e.target.value }
                        };
                        onUpdateState(updated);
                        saveAppState(updated);
                      }}
                      className="custom-input custom-datepicker"
                    />
                  </div>

                  {/* Textarea */}
                  <div className="field-group full-width">
                    <label>Consigne / Message</label>
                    <textarea
                      rows={3}
                      value={state.config.note}
                      onChange={e => {
                        const updated: AppState = {
                          ...state,
                          config: { ...state.config, note: e.target.value }
                        };
                        onUpdateState(updated);
                        saveAppState(updated);
                      }}
                      className="custom-textarea"
                      placeholder="Consigne optionnelle..."
                    />
                  </div>
                </div>
              </div>

              {/* Règles d'exclusion */}
              <div className="admin-section-card">
                <h4><Shield size={18} /> Ajouter une règle d'exclusion</h4>

                <form onSubmit={handleAddExclusion} className="add-exclusion-form">
                  <select
                    value={exclusionFrom}
                    onChange={e => setExclusionFrom(e.target.value)}
                    className="custom-select"
                  >
                    <option value="">Sélectionner une personne...</option>
                    {state.participants.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  <span className="exclusion-connector">ne doit pas offrir à</span>

                  <select
                    value={exclusionTo}
                    onChange={e => setExclusionTo(e.target.value)}
                    className="custom-select"
                  >
                    <option value="">Sélectionner une autre personne...</option>
                    {state.participants
                      .filter(p => p.id !== exclusionFrom)
                      .map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                  </select>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={exclusionBidirectional}
                      onChange={e => setExclusionBidirectional(e.target.checked)}
                    />
                    <span>Réciproque (dans les 2 sens)</span>
                  </label>

                  <button
                    type="submit"
                    disabled={!exclusionFrom || !exclusionTo || exclusionFrom === exclusionTo}
                    className="btn-primary"
                  >
                    Ajouter l'exclusion
                  </button>
                </form>

                {/* Liste des règles actives */}
                <div className="rules-active-list">
                  {state.exclusions.length === 0 ? (
                    <p className="no-rules-hint">Aucune exclusion définie pour le moment.</p>
                  ) : (
                    state.exclusions.map(r => {
                      const from = state.participants.find(p => p.id === r.fromId)?.name || 'Inconnu';
                      const to = state.participants.find(p => p.id === r.toId)?.name || 'Inconnu';

                      return (
                        <div key={r.id} className="exclusion-rule-pill">
                          <span className="rule-text">
                            <strong>{from}</strong>{' '}
                            {r.bidirectional ? (
                              <ArrowLeftRight size={14} className="icon-bidir" />
                            ) : (
                              <ArrowRight size={14} className="icon-unidir" />
                            )}{' '}
                            <strong>{to}</strong>
                          </span>
                          <button
                            onClick={() => handleDeleteExclusion(r.id)}
                            className="btn-rule-delete"
                            title="Supprimer la règle"
                            aria-label={`Supprimer l'exclusion entre ${from} et ${to}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ONGLET 5 : SAUVEGARDE */}
          {activeTab === 'share' && (
            <div className="tab-pane">
              <div className="admin-section-card">
                <h4>Sauvegarde & Réinitialisation</h4>
                <div className="backup-actions-row">
                  <button
                    onClick={() => {
                      const dataStr =
                        'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute('href', dataStr);
                      downloadAnchor.setAttribute('download', 'biquette-santa-backup.json');
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                    className="btn-secondary"
                  >
                    Télécharger la sauvegarde JSON
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Voulez-vous réinitialiser avec les 9 membres de la famille par défaut ?')) {
                        localStorage.clear();
                        window.location.hash = '';
                        window.location.search = '';
                        window.location.reload();
                      }
                    }}
                    className="btn-danger-outline"
                  >
                    Réinitialiser l'événement
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODALE DE MODIFICATION D'UN PARTICIPANT */}
        {editingParticipant && (
          <div className="modal-backdrop edit-submodal-backdrop" onClick={() => setEditingParticipant(null)}>
            <div className="modal-container edit-submodal" onClick={e => e.stopPropagation()}>
              <h3 className="submodal-title">Modifier le participant</h3>

              <form onSubmit={handleSaveParticipantEdit} className="edit-participant-form">
                <div className="field-group">
                  <label>Pseudo / Prénom</label>
                  <input
                    type="text"
                    value={editingParticipant.name}
                    onChange={e =>
                      setEditingParticipant({ ...editingParticipant, name: e.target.value })
                    }
                    className="custom-input"
                    required
                  />
                </div>

                <div className="field-group">
                  <label>Code URL secret</label>
                  <div className="input-with-action">
                    <input
                      type="text"
                      value={editingParticipant.secretToken}
                      onChange={e =>
                        setEditingParticipant({
                          ...editingParticipant,
                          secretToken: e.target.value
                        })
                      }
                      className="custom-input"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setEditingParticipant({
                          ...editingParticipant,
                          secretToken: generateSecretToken(
                            editingParticipant.name.toLowerCase().slice(0, 4)
                          )
                        })
                      }
                      className="btn-secondary btn-sm"
                      title="Générer un nouveau code secret"
                    >
                      <RefreshCw size={14} /> Hasard
                    </button>
                  </div>
                </div>

                <div className="field-group">
                  <label>Personnage Rick & Morty</label>
                  <div className="avatar-grid-select">
                    {AVAILABLE_AVATARS.map(av => (
                      <div
                        key={av.id}
                        className={`avatar-option-card ${
                          editingParticipant.avatar === av.url ? 'selected' : ''
                        }`}
                        onClick={() =>
                          setEditingParticipant({ ...editingParticipant, avatar: av.url })
                        }
                      >
                        <img src={av.url} alt={av.name} className="avatar-img-preview" />
                        <span className="avatar-name-preview">{av.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="button-group modal-actions">
                  <button
                    type="button"
                    onClick={() => setEditingParticipant(null)}
                    className="btn-secondary"
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary">
                    <Check size={16} /> Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
