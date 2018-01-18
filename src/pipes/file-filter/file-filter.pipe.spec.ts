import { ItemType } from '../../core/data/enum/item-type.enum';
import { DocumentType, FileFormatType } from '../../core/data/enum/file-type.enum';
import { FileFilterByDate, FileFilterByName, FileFilterByDocType, FileFilterByFormatType } from './file-filter.pipe';
import { Item } from '../../core/data/services/item/item.service';
import { File } from '../../core/data/services/file/file.service';

describe('FilterItemPipe', () => {
    const pipeFilterByDate = new FileFilterByDate();
    const pipeFilterByName = new FileFilterByName();
    const pipeFilterByDocType = new FileFilterByDocType();
    const pipeFilterByFormat = new FileFilterByFormatType();

  const items :Item[] = [
    {
      name: "filename1.txt",
      description: "description",
      chosen_date: "2018-01-12",
      file: {
        document_type: DocumentType.LAB_TEST,
        size: 1234,
        format: FileFormatType.JPG,
        user_defined_name: "defined_name1"
      }
    },
    {
      name: "filename2.txt",
      description: "description",
      chosen_date: "2018-01-13",
      file: {
        document_type: DocumentType.LAB_TEST,
        size: 1234,
        format: FileFormatType.PDF,
        user_defined_name: "defined_name2"
      }
    },
    {
      name: "filename3.txt",
      description: "description",
      chosen_date: "2018-01-14",
      file: {
        document_type: DocumentType.CONSULTATION,
        size: 1234,
        format: FileFormatType.JPG,
        user_defined_name: "defined_name3"
      }
    },
    {
      name: "directory",
      description: "description",
      chosen_date: "2018-01-14"
    }
  ] as Item[];

    it('should only return 1 file within the date range "2018-01-11"-"2018-01-12"', () => {
        const files = pipeFilterByDate.transform(items, "2018-01-11", "2018-01-12");
        expect(files.length).toBe(1);
        expect(files[0].name).toBe("filename1.txt");
    });

  it('should return all files within the date range 2011-2018', () => {
    const files = pipeFilterByDate.transform(items, "2010-01-12", "2018-01-14");
    expect(files.length).toBe(3);
    expect(files[0].name).toBe("filename1.txt");
    expect(files[1].name).toBe("filename2.txt");
    expect(files[2].name).toBe("filename3.txt");
  });

  it('should return 1 file with user defined name defined_name1', () => {
    const files = pipeFilterByName.transform(items, "defined_name1");
    expect(files.length).toBe(1);
    expect((<File>(files[0].file)).user_defined_name).toBe("defined_name1");
  });

  it('should return 3 files with user defined name of defined_name', () => {
    const files = pipeFilterByName.transform(items, "defined_name");
    expect(files.length).toBe(3);
    expect((<File>(files[0].file)).user_defined_name).toBe("defined_name1");
    expect((<File>(files[1].file)).user_defined_name).toBe("defined_name2");
    expect((<File>(files[2].file)).user_defined_name).toBe("defined_name3");
  });

  it('should return 2 files with document type lab test', () => {
    const files = pipeFilterByDocType.transform(items, DocumentType.LAB_TEST);
    expect(files.length).toBe(2);
    expect((<File>(files[0].file)).user_defined_name).toBe("defined_name1");
    expect((<File>(files[1].file)).user_defined_name).toBe("defined_name2");
  });

  it('should return 4 files with document undefined (ANY)', () => {
    const files = pipeFilterByDocType.transform(items, undefined);
    expect(files.length).toBe(4);
    expect((<File>(files[0].file)).user_defined_name).toBe("defined_name1");
    expect((<File>(files[1].file)).user_defined_name).toBe("defined_name2");
    expect((<File>(files[2].file)).user_defined_name).toBe("defined_name3");
    expect(files[3].name).toBe("directory");
  });

  it('should return 0 files with document DIAGNOSIS', () => {
    const files = pipeFilterByDocType.transform(items, DocumentType.DIAGNOSIS);
    expect(files.length).toBe(0);
  });

  it('should return 2 files with format JPEG', () => {
    const files = pipeFilterByFormat.transform(items, FileFormatType.JPG);
    expect(files.length).toBe(2);
    expect((<File>(files[0].file)).user_defined_name).toBe("defined_name1");
    expect((<File>(files[1].file)).user_defined_name).toBe("defined_name3");
  });

  it('should return 4 files with format undefined (ANY)', () => {
    const files = pipeFilterByFormat.transform(items, undefined);
    expect(files.length).toBe(4);
    expect((<File>(files[0].file)).user_defined_name).toBe("defined_name1");
    expect((<File>(files[1].file)).user_defined_name).toBe("defined_name2");
    expect((<File>(files[2].file)).user_defined_name).toBe("defined_name3");
    expect(files[3].name).toBe("directory");

  });


});
