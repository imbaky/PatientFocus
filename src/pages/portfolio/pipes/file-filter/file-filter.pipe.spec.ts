import { ItemType } from '@enum/item-type.enum';
import { PortfolioType, FileFormatType } from '@enum/file-type.enum';
import { FileFilterByDate, FileFilterByName, FileFilterByDocType, FileFilterByFormatType } from './file-filter.pipe';
import { Item } from '@services/item/item.service';
import { File } from '@services/file/file.service';
import {Directory} from '@services/directory/directory.service';

describe('FilterItemPipe', () => {
    const pipeFilterByDate = new FileFilterByDate();
    const pipeFilterByName = new FileFilterByName();
    const pipeFilterByDocType = new FileFilterByDocType();
    const pipeFilterByFormat = new FileFilterByFormatType();

  const items: Item[] = [
    {
      description: 'description',
      chosen_date: '2018-01-12',
      title: 'defined_name1',
      document_type: PortfolioType.LAB_TEST,
      file: {
        size: 1234,
        format: FileFormatType.JPG,
        file_name: 'filename1.txt',
      }
    },
    {
      description: 'description',
      chosen_date: '2018-01-13',
      title: 'defined_name2',
      document_type: PortfolioType.LAB_TEST,
      file: {
        size: 1234,
        format: FileFormatType.PDF,
        file_name: 'filename2.txt'
      }
    },
    {
      description: 'description',
      chosen_date: '2018-01-14',
      title: 'defined_name3',
      document_type: PortfolioType.CONSULTATION,
      file: {
        size: 1234,
        format: FileFormatType.JPG,
        file_name: 'filename3.txt'
      }
    }
  ] as Item[];


    it('should only return 1 file within the date range "2018-01-11"-"2018-01-12"', () => {
        const files = pipeFilterByDate.transform(items, '2018-01-11', '2018-01-12');
        expect(files.length).toBe(1);
        expect(files[0].file.file_name).toBe('filename1.txt');
    });

  it('should return all files within the date range 2011-2018', () => {
    const files = pipeFilterByDate.transform(items, '2010-01-12', '2018-01-14');
    expect(files.length).toBe(3);
    expect(files[0].file.file_name).toBe('filename1.txt');
    expect(files[1].file.file_name).toBe('filename2.txt');
    expect(files[2].file.file_name).toBe('filename3.txt');
  });

  it('should return 1 file with user defined name defined_name1', () => {
    const files = pipeFilterByName.transform(items, 'defined_name1');
    expect(files.length).toBe(1);
    expect(files[0].title).toBe('defined_name1');
  });

  it('should return 3 files with user defined name of defined_name', () => {
    const files = pipeFilterByName.transform(items, 'defined_name');
    expect(files.length).toBe(3);
    expect(files[0].title).toBe('defined_name1');
    expect(files[1].title).toBe('defined_name2');
    expect(files[2].title).toBe('defined_name3');
  });

  it('should return 2 files with document type lab test', () => {
    const files = pipeFilterByDocType.transform(items, PortfolioType.LAB_TEST);
    expect(files.length).toBe(2);
    expect(files[0].title).toBe('defined_name1');
    expect(files[1].title).toBe('defined_name2');
  });

  it('should return 4 files with document undefined (ANY)', () => {
    const files = pipeFilterByDocType.transform(items, undefined);
    expect(files.length).toBe(3);
    expect(files[0].title).toBe('defined_name1');
    expect(files[1].title).toBe('defined_name2');
    expect(files[2].title).toBe('defined_name3');
  });

  it('should return 0 files with document DIAGNOSIS', () => {
    const files = pipeFilterByDocType.transform(items, PortfolioType.DIAGNOSIS);
    expect(files.length).toBe(0);
  });

  it('should return 2 files with format JPEG', () => {
    const files = pipeFilterByFormat.transform(items, FileFormatType.JPG);
    expect(files.length).toBe(2);
    expect(files[0].title).toBe('defined_name1');
    expect(files[1].title).toBe('defined_name3');
  });

  it('should return 4 files with format undefined (ANY)', () => {
    const files = pipeFilterByFormat.transform(items, undefined);
    expect(files.length).toBe(3);
    expect(files[0].title).toBe('defined_name1');
    expect(files[1].title).toBe('defined_name2');
    expect(files[2].title).toBe('defined_name3');
  });


});
