import { Country } from '../globals/countries.enum';
import { SquadNumber } from '../globals/squad-number.enum';

export interface Player {
  $key?: string;
  name: string;
  lastName: string;
  position: SquadNumber;
  weight: number;
  height: number;
  nationality: Country;
  leftFooted: boolean;
}
