import { ItemType } from '../../core/data/enum/item-type.enum';
import { DocumentType, FileFormatType } from '../../core/data/enum/file-type.enum';

import { FileFilter } from './file-filter.pipe';
import { Item } from '../../core/data/services/item/item.service';
import { File } from '../../core/data/services/file/file.service';

describe('FilterItemPipe', () => {
    const pipe = new FileFilter();

    const items = [
        {
            name: "Directory",
            type: ItemType.DIRECTORY
        },
        {
            name: "1",
            type: ItemType.FILE,
            value: {
                document_type: DocumentType.PRESCRIPTION,
                format: FileFormatType.TXT
            }
        },
        {
            name: "2",
            type: ItemType.FILE,
            value: {
                document_type: DocumentType.CONSULTATION,
                format: FileFormatType.TXT
            }
        },
        {
            name: "3",
            type: ItemType.FILE,
            value: {
                document_type: DocumentType.IMAGE,
                format: FileFormatType.JPG
            }
        },
        {
            name: "4",
            type: ItemType.FILE,
            value: {
                document_type: DocumentType.IMAGE,
                format: FileFormatType.PNG
            }
        }
    ] as Item[];

    const documentTypeFilter = function (item: Item, type: DocumentType) {
        return (item.value as File).document_type === type;
    };

    const documentFileName = function (item: Item, compare: string) {
        return item.name.toLowerCase().includes(compare.toLowerCase());
    };

    it('should filter files with diagnosis document type image', () => {
        const files = pipe.transform(items, documentTypeFilter, DocumentType.IMAGE);

        expect(files.length).toBe(2);
    });

    it('should filter files with diagnosis document type image and file name 3', () => {
        let files = pipe.transform(items, documentTypeFilter, DocumentType.IMAGE);
        files = pipe.transform(files, documentFileName, "3");

        expect(files.length).toBe(1);
    });

});
