import { authenticated, entity, int, role, text, uuid } from '@microsoft/rayfin-core';

@entity()
@authenticated(['read', 'create'])
export class FlightRecord {
  @uuid() id!: string;
  @text({ min: 1, max: 20 }) alias!: string;
  @int() score!: number;
}
