import type { AppState, Participant } from '../types/santa';

const STORAGE_KEY = 'biquette_santa_family_2026_tokens_v4';

export interface AvatarOption {
  id: string;
  name: string;
  url: string;
}

export const AVAILABLE_AVATARS: AvatarOption[] = [
  { id: '1', name: 'Rick Sanchez', url: '/avatars/1.jpeg' },
  { id: '2', name: 'Morty Smith', url: '/avatars/2.jpeg' },
  { id: '3', name: 'Summer Smith', url: '/avatars/3.jpeg' },
  { id: '4', name: 'Beth Smith', url: '/avatars/4.jpeg' },
  { id: '5', name: 'Jerry Smith', url: '/avatars/5.jpeg' },
  { id: '242', name: 'Mr. Poopybutthole', url: '/avatars/242.jpeg' },
  { id: '244', name: 'Mr. Meeseeks', url: '/avatars/244.jpeg' },
  { id: '47', name: 'Birdperson', url: '/avatars/47.jpeg' },
  { id: '265', name: 'Pickle Rick', url: '/avatars/265.jpeg' },
  { id: '118', name: 'Evil Morty', url: '/avatars/118.jpeg' },
  { id: '331', name: 'Squanchy', url: '/avatars/331.jpeg' },
  { id: '180', name: 'Jessica', url: '/avatars/180.jpeg' },
  { id: '306', name: 'Scary Terry', url: '/avatars/306.jpeg' },
];

export const INITIAL_PARTICIPANTS: Participant[] = [
  { id: 'p1', name: 'Mr Jack', secretToken: 'jack_x792a', avatar: '/avatars/1.jpeg', isAdmin: true },
  { id: 'p2', name: 'Chachapristi', secretToken: 'chacha_k812b', avatar: '/avatars/2.jpeg' },
  { id: 'p3', name: 'Cha plane pour moi', secretToken: 'plane_m441c', avatar: '/avatars/3.jpeg' },
  { id: 'p4', name: 'Jérémy-figue mi-raisin', secretToken: 'jerem_r923d', avatar: '/avatars/265.jpeg' },
  { id: 'p5', name: 'Tomelette paysanne', secretToken: 'tome_w518e', avatar: '/avatars/5.jpeg' },
  { id: 'p6', name: 'Juju de chaussette', secretToken: 'juju_q773f', avatar: '/avatars/242.jpeg' },
  { id: 'p7', name: 'Marie-Antoinette', secretToken: 'marie_v309g', avatar: '/avatars/4.jpeg' },
  { id: 'p8', name: 'Emilie une pattes', secretToken: 'emilie_z662h', avatar: '/avatars/47.jpeg' },
  { id: 'p9', name: 'Professeur Xavier', secretToken: 'xav_p804i', avatar: '/avatars/244.jpeg' }
];

export const PARTNERS_MAP: Record<string, string> = {
  'Chachapristi': 'Professeur Xavier',
  'Professeur Xavier': 'Chachapristi',
  'Cha plane pour moi': 'Jérémy-figue mi-raisin',
  'Jérémy-figue mi-raisin': 'Cha plane pour moi',
  'Tomelette paysanne': 'Emilie une pattes',
  'Emilie une pattes': 'Tomelette paysanne',
  'Marie-Antoinette': 'Juju de chaussette',
  'Juju de chaussette': 'Marie-Antoinette'
};

export const DEFAULT_EXCLUSIONS = [
  { id: 'ex_couple_1', fromId: 'p2', toId: 'p9', bidirectional: true }, // Chachapristi <-> Professeur Xavier
  { id: 'ex_couple_2', fromId: 'p3', toId: 'p4', bidirectional: true }, // Cha plane pour moi <-> Jérémy-figue mi-raisin
  { id: 'ex_couple_3', fromId: 'p5', toId: 'p8', bidirectional: true }, // Tomelette paysanne <-> Emilie une pattes
  { id: 'ex_couple_4', fromId: 'p7', toId: 'p6', bidirectional: true }, // Marie-Antoinette <-> Juju de chaussette
];

export const OFFICIAL_ENCRYPTED_DRAW = [
  {
    giverId: "p1",
    ciphertext: "46bb2f485eef643bfe1b8bc4086906240022e808f7e94e7c63250552273b5093",
    iv: "f955cfb9f5c0514b585213b0",
    salt: "60e67ad464488a8dc7f5896a1d24f4f1"
  },
  {
    giverId: "p7",
    ciphertext: "dce5908405eda14b252b8ba60631cfd2e0724701bfdbcc75858a4aa282a7d795232d61095cda32ca",
    iv: "67bd697a3ed4e3f98821de8c",
    salt: "4813ddaf85913d4c4ccfa969b10926c4"
  },
  {
    giverId: "p4",
    ciphertext: "dbaa048a6a495a34d98a9e942b8c00d2cc07652764132d60b88edca4d67804520e",
    iv: "268e7b218339cb2d26199f13",
    salt: "f2229aaf79aa8d2050e4c82f1b4f90d9"
  },
  {
    giverId: "p9",
    ciphertext: "99db74ac22287e8b4475e74f626c20f7ffb8dc57f47a49bb61603c3a8773020a00e5",
    iv: "93770b21c84b639b407673d6",
    salt: "9c9d01cc7f40a395fc429bc17b0d6338"
  },
  {
    giverId: "p6",
    ciphertext: "8f1a49df17c426713582ab10dec96e37be1bdc6358784504e20ba14685c575bf3a",
    iv: "181794a47afebfbb43885e08",
    salt: "09923c8669e44bdc49e3eaa5016c0a93"
  },
  {
    giverId: "p8",
    ciphertext: "6239fed6a51cf738071743e262bd6dbd9a9a0fb899e0582b0e702ffd9c7828e33b1c",
    iv: "839e2fb8daa0c70df36a22ee",
    salt: "670a4435030fce7c7493b4dac8a2ea36"
  },
  {
    giverId: "p3",
    ciphertext: "9fd2206a9c21e1363b95effe7fb5d60da34a8c2e449d3772db65aff4",
    iv: "4f13f43c72f801ee7414bea4",
    salt: "0b788fe16a81aeab10dd3eb6ebfdf5d0"
  },
  {
    giverId: "p2",
    ciphertext: "926b56c175d276673596d824a06819dd74a56339915f62e4db9b3efb9bb3714a6ad1",
    iv: "7bbc4c7f2152d9f82dd86288",
    salt: "95ea9d1f2679bf1d4bd122566ad5c76b"
  },
  {
    giverId: "p5",
    ciphertext: "102f76b49062cd29e408187a7fcd7b23aadac8f816dd7b",
    iv: "3a647cfd4de36111749a738e",
    salt: "1653bc5fad6123d97fb4ef70df394ac1"
  }
];

export const OFFICIAL_ADMIN_ASSIGNMENTS = {
  p1: "Marie-Antoinette",
  p7: "Jérémy-figue mi-raisin",
  p4: "Professeur Xavier",
  p9: "Juju de chaussette",
  p6: "Emilie une pattes",
  p8: "Cha plane pour moi",
  p3: "Chachapristi",
  p2: "Tomelette paysanne",
  p5: "Mr Jack"
};

export const DEFAULT_STATE: AppState = {
  config: {
    title: 'Biquette Santa 2026',
    budget: 20,
    currency: '€',
    date: '2026-12-24',
    note: '',
    commonGiftMode: false
  },
  participants: INITIAL_PARTICIPANTS,
  exclusions: DEFAULT_EXCLUSIONS,
  draw: {
    isDrawn: true,
    drawnAt: '6 novembre à 22:38',
    encryptedAssignments: OFFICIAL_ENCRYPTED_DRAW,
    clearAssignmentsForAdmin: OFFICIAL_ADMIN_ASSIGNMENTS
  },
  adminPassword: '@biquettesanta44@',
  cheatingLogs: []
};

export function generateSecretToken(prefix = 'santa'): string {
  const rand = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${rand}`;
}

export function loadAppState(): AppState {
  // 1. Regarder si des données complètes sont encodées dans le hash (#state=...)
  if (typeof window !== 'undefined' && window.location.hash) {
    try {
      const match = window.location.hash.match(/state=([^&]+)/);
      if (match && match[1]) {
        const decoded = decodeURIComponent(atob(match[1]));
        const parsed = JSON.parse(decoded) as AppState;
        if (parsed && parsed.participants && parsed.draw) {
          parsed.cheatingLogs = parsed.cheatingLogs || [];
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Impossible de charger le state depuis le hash:', e);
    }
  }

  // 2. Sinon regarder dans le localStorage
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AppState;
        if (parsed && parsed.participants && parsed.draw) {
          // Assurer la présence des tokens et renommer Chachapristi
          parsed.participants = parsed.participants.map((p, idx) => ({
            ...p,
            name: p.name === 'Chachapristie' ? 'Chachapristi' : p.name,
            secretToken: p.secretToken || INITIAL_PARTICIPANTS[idx]?.secretToken || generateSecretToken(),
            avatar: p.avatar || INITIAL_PARTICIPANTS[idx]?.avatar || '/avatars/1.jpeg'
          }));
          parsed.adminPassword = '@biquettesanta44@';
          parsed.cheatingLogs = parsed.cheatingLogs || [];
          const rawNote = parsed.config?.note || '';
          const cleanedNote = (rawNote.includes('surprenant') || rawNote.includes('tendresse')) ? '' : rawNote;

          parsed.config = {
            ...DEFAULT_STATE.config,
            ...(parsed.config || {}),
            title: 'Biquette Santa 2026',
            note: cleanedNote
          };
          if (!parsed.exclusions || parsed.exclusions.length === 0) {
            parsed.exclusions = DEFAULT_EXCLUSIONS;
          }

          // Vérifier si un ancien tirage a attribué un cadeau à un partenaire
          let hasPartnerViolation = false;
          if (parsed.draw?.clearAssignmentsForAdmin) {
            for (const p of parsed.participants) {
              const receiverName = parsed.draw.clearAssignmentsForAdmin[p.id];
              if (receiverName && PARTNERS_MAP[p.name] === receiverName) {
                hasPartnerViolation = true;
                break;
              }
            }
          }
          if (hasPartnerViolation || !parsed.draw?.isDrawn || !parsed.draw?.encryptedAssignments?.length) {
            parsed.draw = DEFAULT_STATE.draw;
          }

          return parsed;
        }
      }
    } catch (e) {
      console.warn('Erreur lecture localStorage:', e);
    }
  }

  return DEFAULT_STATE;
}

export function saveAppState(state: AppState): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Erreur sauvegarde localStorage:', e);
    }
  }
}

export function generateShareableUrl(state: AppState): string {
  if (typeof window === 'undefined') return '';
  const json = JSON.stringify(state);
  const base64 = btoa(encodeURIComponent(json));
  const url = new URL(window.location.origin + window.location.pathname);
  url.hash = `state=${base64}`;
  return url.toString();
}

/**
 * Génère le lien personnalisé pour un participant
 */
export function buildParticipantUrl(participant: Participant): string {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set('user', participant.id);
  url.searchParams.set('code', participant.secretToken);
  return url.toString();
}

/**
 * Analyse l'URL courante pour extraire le participant connecté et son token
 */
export function parseUrlAuth(): { userId: string | null; code: string | null } {
  if (typeof window === 'undefined') return { userId: null, code: null };

  // Vérifier d'abord les query params (?user=...&code=...)
  const params = new URLSearchParams(window.location.search);
  let userId = params.get('user');
  let code = params.get('code');

  // Vérifier aussi le hash au cas où (#user=...&code=...)
  if (!userId && window.location.hash) {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    userId = hashParams.get('user');
    code = hashParams.get('code');
  }

  return { userId, code };
}
