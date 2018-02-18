import { DiaryFilterByDate, DiaryFilterByTerm } from './diary-filter.pipe';
import { Item } from '@services/item/item.service';
import { PortfolioType, FileFormatType } from '@enum/file-type.enum';

describe('DiaryFilterPipe', () => {
    const pipeFilterByDate = new DiaryFilterByDate();
    const pipeFilterByTerm = new DiaryFilterByTerm();

    const items: Item[] = [
        {
          description: 'Rash on arm',
          chosen_date: '2018-01-12',
          title: 'Entry01',
          document_type: PortfolioType.IMAGE,
          file: {
            size: 1234,
            format: FileFormatType.JPG,
            file_name: 'filename1.txt',
          }
        },
        {
            description: 'Itchy scalp',
            chosen_date: '2018-01-13',
            title: 'Entry02',
            document_type: PortfolioType.IMAGE,
            file: {
              size: 1234,
              format: FileFormatType.PDF,
              file_name: 'filename2.txt'
            }
        },
        {
            description: 'The quick red fox jumped over the lazy dog.',
            chosen_date: '2018-01-14',
            title: 'Entry03'
        },
        {
            description: 'To be or not to be that is the question.',
            chosen_date: '2018-01-15',
            title: 'Entry04'
        }
    ] as Item[];

    it('GIVEN the date range "2018-01-11"-"2018-01-12" THEN one diary entry is returned.', () => {
        const files = pipeFilterByDate.transform(items, '2018-01-11', '2018-01-12');
        expect(files.length).toBe(1);
        expect(files[0].file.file_name).toBe('filename1.txt');
    });

    it('GIVEN the term "red" THEN one diary entry is returned.', () => {
        const files = pipeFilterByTerm.transform(items, 'red');
        expect(files.length).toBe(1);
        expect(files[0].description).toBe('The quick red fox jumped over the lazy dog.');
    });

    it('GIVEN the terms "red Entry01" THEN two diary entries are returned.', () => {
        const files = pipeFilterByTerm.transform(items, 'red Entry01');
        expect(files.length).toBe(2);
    });
});
