import {PageType} from '@enum/page-type.enum';
import {File} from '@interfaces/file/file';
import {PortfolioType} from '@enum/file-type.enum';

export interface Item {
    id?: number;
    title?: string;
    description?: string;
    file_id?: number;
    page: PageType; // specifies which page item belongs to
    chosen_date?: string;
    document_type?: PortfolioType;
    file?: File; // TODO change field to file and remove directory
    directory_id: number;
}