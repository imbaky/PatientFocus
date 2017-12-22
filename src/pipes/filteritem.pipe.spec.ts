import { FilterItemPipe } from './filteritem.pipe';
import { ItemType } from '../core/data/enum/item-type.enum';
import { DocumentType, FileFormatType } from '../core/data/enum/file-type.enum';

describe('FilterItemPipe', () => {
    const pipe = new FilterItemPipe();

    // TODO: complete mock data
    const mockFile1 = {
        name: "FileName1.txt",
        type: ItemType.FILE,
        value: {
            document_type: DocumentType.PRESCRIPTION,
            format: FileFormatType.TXT
        }
    };

    const mockFile2 = {
        name: "FileName2.jpg",
        type: ItemType.FILE,
        value: {
            document_type: DocumentType.IMAGE,
            format: FileFormatType.JPG
        }
    };

    const mockData1 = [
        mockFile1,
        mockFile2
    ];

    it('should return an empty list', () => {
        expect(pipe.transform([], "")).toEqual([]);
    });

    it('should return the same list', () => {
        expect(pipe.transform(mockData1, "")).toEqual(mockData1);
    });

    it('should return a txt file', () => {
        expect(pipe.transform(mockData1, FileFormatType.TXT)).toEqual([mockFile1]);
    });
})
