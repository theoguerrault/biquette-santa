import type { Participant, ExclusionRule, EncryptedAssignment } from '../types/santa';
import { encryptSecret } from './cryptoService';

export interface DrawResult {
  success: boolean;
  assignments?: Record<string, string>; // giverId -> receiverId
  encryptedAssignments?: EncryptedAssignment[];
  error?: string;
}

// Mélange de Fisher-Yates
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Construit un ensemble d'arêtes interdites "fromId -> toId"
 */
function buildForbiddenSet(exclusions: ExclusionRule[]): Set<string> {
  const forbidden = new Set<string>();
  for (const rule of exclusions) {
    forbidden.add(`${rule.fromId}->${rule.toId}`);
    if (rule.bidirectional) {
      forbidden.add(`${rule.toId}->${rule.fromId}`);
    }
  }
  return forbidden;
}

/**
 * Recherche un cycle hamiltonien aléatoire (chaîne fermée où chacun offre et reçoit)
 */
function findHamiltonianCycle(
  participants: Participant[],
  forbidden: Set<string>,
  maxAttempts = 500
): Record<string, string> | null {
  const n = participants.length;
  if (n < 2) return null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const shuffled = shuffle(participants);
    let valid = true;

    for (let i = 0; i < n; i++) {
      const giver = shuffled[i];
      const receiver = shuffled[(i + 1) % n];

      if (giver.id === receiver.id || forbidden.has(`${giver.id}->${receiver.id}`)) {
        valid = false;
        break;
      }
    }

    if (valid) {
      const result: Record<string, string> = {};
      for (let i = 0; i < n; i++) {
        result[shuffled[i].id] = shuffled[(i + 1) % n].id;
      }
      return result;
    }
  }

  // Si le shuffle simple échoue (contraintes très denses), backtracking
  const ids = participants.map(p => p.id);
  const path: string[] = [ids[0]];
  const visited = new Set<string>([ids[0]]);

  function backtrack(): boolean {
    if (path.length === n) {
      const last = path[path.length - 1];
      const first = path[0];
      return !forbidden.has(`${last}->${first}`);
    }

    const current = path[path.length - 1];
    const candidates = shuffle(ids.filter(id => !visited.has(id)));

    for (const next of candidates) {
      if (!forbidden.has(`${current}->${next}`)) {
        visited.add(next);
        path.push(next);
        if (backtrack()) return true;
        path.pop();
        visited.delete(next);
      }
    }
    return false;
  }

  if (backtrack()) {
    const result: Record<string, string> = {};
    for (let i = 0; i < n; i++) {
      result[path[i]] = path[(i + 1) % n];
    }
    return result;
  }

  return null;
}

/**
 * Exécute le tirage et chiffre le résultat avec les tokens secrets de chaque participant
 */
export async function executeDraw(
  participants: Participant[],
  exclusions: ExclusionRule[]
): Promise<DrawResult> {
  if (participants.length < 2) {
    return {
      success: false,
      error: 'Il faut au minimum 2 participants pour organiser un Secret Santa !'
    };
  }

  // Vérifier que chaque participant a un secretToken
  for (const p of participants) {
    if (!p.secretToken || p.secretToken.trim() === '') {
      return {
        success: false,
        error: `Le participant "${p.name}" n'a pas de code secret configuré.`
      };
    }
  }

  const forbidden = buildForbiddenSet(exclusions);
  const assignments = findHamiltonianCycle(participants, forbidden);

  if (!assignments) {
    return {
      success: false,
      error:
        'Impossible de trouver un tirage respectant toutes les règles d’exclusion ! Essayez de retirer certaines exclusions.'
    };
  }

  // Chiffrement des assignations avec le secretToken de chaque donneur
  const participantMap = new Map(participants.map(p => [p.id, p]));
  const encryptedAssignments: EncryptedAssignment[] = [];

  for (const [giverId, receiverId] of Object.entries(assignments)) {
    const giver = participantMap.get(giverId);
    const receiver = participantMap.get(receiverId);

    if (!giver || !receiver) continue;

    const encrypted = await encryptSecret(receiver.name, giver.secretToken);
    encryptedAssignments.push({
      giverId: giver.id,
      ciphertext: encrypted.ciphertext,
      iv: encrypted.iv,
      salt: encrypted.salt
    });
  }

  return {
    success: true,
    assignments,
    encryptedAssignments
  };
}
