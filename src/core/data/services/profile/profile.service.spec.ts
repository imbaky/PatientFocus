import { TestBed } from "@angular/core/testing";
import { DexieService } from "../dexie/dexie.service";
import Dexie from "dexie";
import { SCHEMA } from "../dexie/database";
import { ProfileService } from "./profile.service";

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
    ProfileService
  ]
};

describe("Profile Service", () => {
  let dexie: DexieService;
  let profileService: ProfileService;
  let mockDatabase: DATABASE;

  beforeEach(async() => {
    mockDatabase = new DATABASE();
    let bed = TestBed.configureTestingModule(testBedSetup);
    TestBed.overrideProvider(DexieService, { useValue: mockDatabase }); 
    dexie = bed.get(DexieService);
    profileService = bed.get(ProfileService);
    profileService.clearDb();
  });

  it("GIVEN no Profiles THEN it should not retrieve anything", async () => {
    const profile = await profileService.getFirstProfile();
    expect(profile).toBeUndefined();
  });

  it("GIVEN an existing ProfilePage THEN it should retrieve it", async () => {
    profileService.save({
      name: "John",
      password: "Password"
    });
    const profile = await profileService.getFirstProfile();
    expect(profile.name).toBe("John");
  });
});
