import { FilterItemPipe } from './filteritem.pipe';
import { ItemType } from '../core/data/enum/item-type.enum';

describe('FilterItemPipe', () => {
    const pipe = new FilterItemPipe();

    // TODO: complete mock data
    const mockFile1 = {
        name: "FileName1.txt",
        type: ItemType.FILE,
        value: {
            type: 'txt'
        }
    };

    const mockFile2 = {
        name: "FileName2.jpg",
        type: ItemType.FILE,
        value: {
            type: 'jpeg'
        }
    };

    const mockData1 = [
        mockFile1,
        mockFile2
    ];

    it('should return an empty list', () => {
        expect(pipe.transform([], "")).toEqual([]);
    });

    it('should return an same list', () => {
        expect(pipe.transform(mockData1, "")).toEqual(mockData1);
    });

    it('should return an txt file', () => {
        expect(pipe.transform(mockData1, "txt")).toEqual([mockFile1]);
    });
})
