import { TestBed } from "@angular/core/testing";
import { File } from "@ionic-native/file";
import Dexie from "dexie";
import { DexieService } from "../dexie/dexie.service";
import { DirectoryService } from "../directory/directory.service";
import { ItemService } from "../item/item.service";
import { FileService, File as FileType } from "../file/file.service";

import { DocumentType, FileFormatType } from "../../enum/file-type.enum";
import { ItemType } from "../../enum/item-type.enum";
import { SCHEMA } from "../dexie/database";

class DATABASE extends Dexie {
  constructor() {
    super("store");

    this.version(1).stores(SCHEMA);

    const date = new Date();
    this.on("populate", () => {
      this.table("profile").add({
        directory: 1
      });
      this.table("directory").bulkAdd([{ id: 1 }]);
      this.table("item").bulkAdd([
        {
          name: "Filename1.txt",
          description: "lab test1",
          type: ItemType.FILE,
          type_id: 1,
          directory_id: 1,
          created: date
        },
        {
          name: "Filename2.txt",
          description: "lab test2",
          type: ItemType.FILE,
          type_id: 2,
          directory_id: 1,
          created: date
        },
        {
          name: "Sub Folder1",
          description: "",
          type: ItemType.DIRECTORY,
          type_id: 2,
          directory_id: 1
        },
        {
          name: "Filename2.txt",
          description: "blood test",
          type: ItemType.FILE,
          type_id: 3,
          directory_id: 2,
          created: date
        }
      ]);
      this.table("file").bulkAdd([
        {
          path: "::directory/subdirectory/subsubdirectory1",
          size: 885421,
          document_type: DocumentType.BLOOD_TEST,
          format: FileFormatType.JPG
        },
        {
          path: "::directory/subdirectory/subsubdirectory2",
          size: 4122017,
          type: "jpeg",
          document_type: DocumentType.CONSULTATION,
          format: FileFormatType.PNG
        },
        {
          path: "::directory/subdirectory/subsubdirectory3",
          size: 9514173,
          type: "jpeg",
          document_type: DocumentType.PRESCRIPTION,
          format: FileFormatType.PDF
        }
      ]);
    });
  }
}

describe("File Service", () => {
  let dexie: DexieService;
  let directory: DirectoryService;
  let item: ItemService;
  let file: FileService;

  beforeEach(() => {
    let bed = TestBed.configureTestingModule({
      providers: [
        {
          provide: DexieService,
          useClass: DATABASE
        },
        DirectoryService,
        ItemService,
        FileService,
        File
      ]
    });

    dexie = bed.get(DexieService);
    directory = bed.get(DirectoryService);
    item = bed.get(ItemService);
    file = bed.get(FileService);
  });

  it("GIVEN three files THEN it should retrieve no files", async () => {
    const ids = [];
    let test = await file.getFilesByIds(ids);
    expect(test.length).toBe(0);
  });

  it("GIVEN three files THEN it should retrieve specifics files by ID", async () => {
    const ids = [1, 2, 3];
    let test = await file.getFilesByIds(ids);
    expect(test.length).toBe(3);
  });
});
