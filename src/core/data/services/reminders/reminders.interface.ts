import Dexie from 'dexie';

import { DexieService } from '../dexie/dexie.service';

export interface Reminder {
    id?: number;
    reminder_id: number;
    fk_profile_id: number;
    title: string;
    text: string;
    every: number;
    frequencies: any;
    data?: any; // data in JSON format, may not use
    expires: string;
}
