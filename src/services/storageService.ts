import type { AppState, Participant } from '../types/santa';

const STORAGE_KEY = 'biquette_santa_family_2026_tokens_v5';

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
    "giverId": "p3",
    "ciphertext": "f64d51fc88544f0cca2f3703f2ab6f999e5cd88c82271a",
    "iv": "2e8812cfb25ffe37ecfa6852",
    "salt": "90a8464a1399a022951cdacc67d7b8fe"
  },
  {
    "giverId": "p1",
    "ciphertext": "b23825ce7c9c5021facd48014bb42a45b87d2be4fc148eca485aee6e06922533b989",
    "iv": "b7647efa83bc0e4b857f3775",
    "salt": "7c3c3b3740540205102e757e37c14b71"
  },
  {
    "giverId": "p5",
    "ciphertext": "9df26789cf78de81d8922965504ccc2f33a589dfbdb1c54fa41685b7bec75ecfe5",
    "iv": "7e55e7bccc20052ce2ab9b6a",
    "salt": "04a4e147a4f391d49076429366c8cbd8"
  },
  {
    "giverId": "p9",
    "ciphertext": "efd81c8a506f2e5db9cce1477c6c847dbf9ffd6c4dd25df542eca554e458bc1e02",
    "iv": "d070f994698a800cb71aef02",
    "salt": "101304bda8ac90b162b4e8129caa4132"
  },
  {
    "giverId": "p8",
    "ciphertext": "09b12185b5b2aeb8536fdb9d2e4719033aee78d7fd8905a105f8bb86b47dd641af977ad09e454f3f",
    "iv": "22cbc4414ab6584d38c9a4d0",
    "salt": "d369c46f28db6f066f654eb743ebc3ad"
  },
  {
    "giverId": "p4",
    "ciphertext": "f5e9d19403877a62ca81b1fb99598bd8fc73ccbf8c03ed3e70b52ac5f46bce771283",
    "iv": "a9213da8711aa23766d50aa5",
    "salt": "ca85416e949887eb9c122ef5bea5fc57"
  },
  {
    "giverId": "p6",
    "ciphertext": "cf5218f6469094250f6b25b1be3507a076e2b8399c9e53e56e64d74e",
    "iv": "21e596331a5d1e12274267dc",
    "salt": "6960acca759d1b1090b6a9a3783c1e05"
  },
  {
    "giverId": "p2",
    "ciphertext": "feb18bcccf5bc9696ae1c8f224f8b68d124b346de81e440bb0251ab41bb3fe48",
    "iv": "acfb283ab3426fe90bad197c",
    "salt": "777d9733370b5f6888c603796c34be70"
  },
  {
    "giverId": "p7",
    "ciphertext": "af2c7f999043a1aad7dcdee1159a452727cd8df63da64bfcee8ca7938a7f2782c36e",
    "iv": "e025213415f40d94d0cf955b",
    "salt": "a3ccba9d1e80adf346d47f170ef35cec"
  }
];

export const OFFICIAL_ADMIN_ASSIGNMENTS = {
  "p3": "Mr Jack",
  "p1": "Tomelette paysanne",
  "p5": "Professeur Xavier",
  "p9": "Emilie une pattes",
  "p8": "Jérémy-figue mi-raisin",
  "p4": "Juju de chaussette",
  "p6": "Chachapristi",
  "p2": "Marie-Antoinette",
  "p7": "Cha plane pour moi"
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
