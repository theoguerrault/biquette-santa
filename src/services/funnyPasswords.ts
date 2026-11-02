/**
 * Liste de mots de passe loufoques et générateurs pour Secret Santa
 */

export const FUNNY_WORDS = [
  'BiquetteEnPantoufles',
  'TartifletteAuChocolat',
  'ChaussetteAPaillettes',
  'RenneEnCharentaises',
  'LutinFarceur',
  'DindeAuxMarrons',
  'SapinQuiPique',
  'BarbeABabaNoel',
  'BucheIntergalactique',
  'BonhommeDeNeigeFrileux',
  'PapilloteExplosive',
  'MouflesMagiques',
  'TraineauEnPanne',
  'PainDEpicesNinja',
  'BouleDeNoelDisco',
  'GrelotEnchante',
  'FondueFestive',
  'RaclettePailletee'
];

/**
 * Mots de passe pré-configurés pour la liste initiale
 */
export const INITIAL_PASSWORDS: Record<string, string> = {
  'Mr Jack': 'JackSquelette2026',
  'Chachapristi': 'ChachouetteMagique',
  'Cha plane pour moi': 'AvionEnPainDepice',
  'Jérémy-figue mi-raisin': 'RaisinSecFestif',
  'Tomelette paysanne': 'OeufDeNoelEnFete',
  'Juju de chaussette': 'ChaussetteTroueeDuPèreNoël',
  'Marie-Antoinette': 'QuIlsMangentDeLaBuche',
  'Emilie une pattes': 'CanardBoiteuxEnLaponie',
  'Professeur Xavier': 'TelepathieDuPereNoel'
};

export function getRandomFunnyPassword(existingPasswords: string[] = []): string {
  const available = FUNNY_WORDS.filter(w => !existingPasswords.includes(w));
  if (available.length > 0) {
    return available[Math.floor(Math.random() * available.length)];
  }
  return `Lutin_${Math.floor(100 + Math.random() * 900)}`;
}
