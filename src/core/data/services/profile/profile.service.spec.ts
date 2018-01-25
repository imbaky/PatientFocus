import { TestBed } from "@angular/core/testing";
import { File as NativeFile} from '@ionic-native/file'
import { DexieService } from "../dexie/dexie.service";
import Dexie from "dexie";
import { SCHEMA } from "../dexie/database";
import { ProfileService } from "./profile.service";
import { DirectoryService } from "../directory/directory.service";
import { ItemService } from "../item/item.service";
import { FileService } from "../file/file.service";


class DATABASE extends Dexie {
    constructor() {
        super("profile_test");

        this.version(1).stores(SCHEMA);
    }
}

const testBedSetup = {
    providers: [
        {
            provide: DexieService,
            useClass: DATABASE
        },
        ProfileService,
        DirectoryService,
        ItemService,
        FileService,
        NativeFile
    ]
};

describe("Profile Service", () => {
    let dexie: DexieService;
    let profileService: ProfileService;
    let mockDatabase: DATABASE;

    beforeEach(async() => {
        mockDatabase = new DATABASE();
        let bed = TestBed.configureTestingModule(testBedSetup);
        TestBed.overrideProvider(DexieService, {useValue: mockDatabase});
        dexie = bed.get(DexieService);
        profileService = bed.get(ProfileService);
        profileService.clearDb();
    });

    it("GIVEN no Profiles THEN it should not retrieve anything", async() => {
        const profile = await profileService.getFirstProfile();
        expect(profile).toBeUndefined();
    });

    it("GIVEN an existing Profile THEN it should retrieve it", async() => {
        await profileService.save({
            name: "John",
            password: "Password"
        });
        const profile = await profileService.getFirstProfile();
        expect(profile.name).toBe("John");
    });

    it("GIVEN an existing Profile THEN it should contain a directory with the same id", async() => {
        await profileService.save({
            name: "John",
            password: "Password"
        });
        const profile = await profileService.getFirstProfile();
        expect(profile.directory).toEqual(profile.id);
    });

    it("GIVEN an existing Profile THEN the fields can be modified", async() => {
        await profileService.save({
            name: "John",
            password: "Password"
        });
        const profile = await profileService.getFirstProfile();
        await profileService.editProfile('Tim', 'Male', 'January 1 1995');
        const profile = await profileService.getFirstProfile();
        expect(profile.gender).toEqual('Male');
        expect(profile.name).toEqual('Tim');
        expect(profile.dob).toEqual('January 1 1995');
    })
});
