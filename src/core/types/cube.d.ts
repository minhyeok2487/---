export interface AddCubeCharacterRequest {
  characterId: number;
  characterName: string;
}

export type CubeTicket = {
  [key in `ban${1 | 2 | 3 | 4 | 5}` | `unlock${1 | 2}`]?: number;
};

export interface UpdateCubeCharacterRequest extends CubeTicket {
  cubeId: number;
  characterId: number;
}

export interface CubeCharacter extends CubeTicket {
  cubeId: number;
  characterId: number;
  characterName: string;
  itemLevel: number;
}

export interface CubeReward {
  name: string;
  jewelry: number;
  leapStone: number;
  shilling: number;
  solarGrace: number;
  solarBlessing: number;
  solarProtection: number;
  cardExp: number;
  jewelryPrice: number;
}