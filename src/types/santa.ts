export interface Participant {
  id: string;
  name: string;
  secretToken: string;
  avatar?: string;
  isAdmin?: boolean;
}

export interface ExclusionRule {
  id: string;
  fromId: string;
  toId: string;
  bidirectional: boolean;
}

export interface EventConfig {
  title: string;
  budget: number;
  currency: string;
  date: string;
  note: string;
  commonGiftMode: boolean;
}

export interface EncryptedAssignment {
  giverId: string;
  ciphertext: string;
  iv: string;
  salt: string;
}

export interface DrawState {
  isDrawn: boolean;
  drawnAt?: string;
  encryptedAssignments: EncryptedAssignment[];
  clearAssignmentsForAdmin?: Record<string, string>;
}

export interface CheatingLog {
  id: string;
  fromName: string;
  fromAvatar?: string;
  targetName: string;
  targetAvatar?: string;
  timestamp: string;
}

export interface AppState {
  config: EventConfig;
  participants: Participant[];
  exclusions: ExclusionRule[];
  draw: DrawState;
  adminPassword: string;
  cheatingLogs: CheatingLog[];
}
