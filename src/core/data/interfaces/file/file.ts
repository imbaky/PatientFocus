import {FileFormatType} from '@enum/file-type.enum';

export interface File {
    id?: number;
    path: string;
    size?: number;
    format: FileFormatType;
    file_name: string;
}