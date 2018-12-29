export class ZkillMail {
  attackers: Attacker[];
  killmail_id: number;
  killmail_time: string;
  solar_system_id: number;
  victim: Victim;
  zkb: Zkb;
  final_blow: Attacker;
}

export class Attacker {
  alliance_id: number;
  character_id: number;
  corporation_id: number;
  damage_done: number;
  final_blow: boolean;
  security_status: number;
  ship_type_id: number;
  weapon_type_id: number;
}

export class Victim {
  alliance_id: number;
  character_id: number;
  corporation_id: number;
  damage_taken: number;
  items: Item[];
  position: Position;
  ship_type_id: number;
}

export class Item {
  flag: number;
  item_type_id: number;
  quantity_dropped?: number;
  singleton: number;
  quantity_destroyed?: number;
}

export class Position {
  x: number;
  y: number;
  z: number;
}

export class Zkb {
  locationID: number;
  hash: string;
  fittedValue: number;
  totalValue: number;
  points: number;
  npc: boolean;
  solo: boolean;
  awox: boolean;
  esi: string;
  url: string;
}