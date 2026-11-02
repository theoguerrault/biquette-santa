/**
 * Synthétiseur audio festif utilisant la Web Audio API native du navigateur.
 * Ne nécessite aucun fichier audio externe.
 */

let audioCtx: AudioContext | null = null;
let bgMusic: HTMLAudioElement | null = null;

/**
 * Active ou coupe la musique de fond (Mariah Carey - All I Want For Christmas Is You)
 */
export function toggleBackgroundMusic(enabled: boolean): void {
  try {
    if (!bgMusic) {
      bgMusic = new Audio('/mariah.mp3');
      bgMusic.loop = true;
      bgMusic.volume = 0.45;
    }

    if (enabled) {
      const playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Autoplay prevented by browser:', err);
        });
      }
    } else {
      bgMusic.pause();
    }
  } catch (err) {
    console.warn('Audio playback error:', err);
  }
}

/**
 * Vérifie si la musique de fond est en cours de lecture
 */
export function isMusicPlaying(): boolean {
  return !!bgMusic && !bgMusic.paused;
}

function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Joue un carillon magique de Noël (effet clochettes / jingle)
 */
export function playJingleBells(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // Do, Mi, Sol, Do aigu (C5, E5, G5, C6)
  const now = ctx.currentTime;

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.12);

    // Enveloppe sonore de clochette métallique douce
    gain.gain.setValueAtTime(0, now + idx * 0.12);
    gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.12 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.9);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.12);
    osc.stop(now + idx * 0.12 + 1.0);
  });
}

/**
 * Petit son de pop / clic festif
 */
export function playPopSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.1);
}

/**
 * Son de canard amusant (coin-coin) en Web Audio API
 */
export function playQuackSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.linearRampToValueAtTime(180, now + 0.18);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.2);
}
