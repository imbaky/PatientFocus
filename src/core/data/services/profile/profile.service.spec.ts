import { TestBed } from '@angular/core/testing';
import { DexieService } from '../dexie/dexie.service';
import Dexie from 'dexie';
import { SCHEMA } from '../dexie/database';
import { ProfileService } from "./profile.service";

class DATABASE extends Dexie {
    constructor() {
        super('test');

        this.version(1).stores(SCHEMA);
    }
}

describe('Profile Service', () => {
    let dexie: DexieService;
    let profileService: ProfileService;

    beforeEach(() => {
        Dexie.delete();
        let bed = TestBed.configureTestingModule({
            providers: [
                {
                    provide: DexieService,
                    useClass: DATABASE
                },
                ProfileService
            ]
        });

        dexie = bed.get(DexieService);
        profileService = bed.get(ProfileService);
    });

    it('GIVEN no Profiles THEN it should not retrieve anything', async () => {
        const profile = await profileService.getFirstProfile();
        expect(profile).toBeUndefined();
    });

    it('GIVEN an existing Profile THEN it should retrieve it', async () => {
        profileService.save({
            name: 'John',
            password: 'Password'
        });
        const profile  = await profileService.getFirstProfile();
        expect(profile.name).toBe('John');
    });
});