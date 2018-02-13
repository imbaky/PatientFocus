import {Item} from '@interfaces/item/item';


export interface Directory {
    id?: number;
    items: Item[];
    directories: Directory[]; // directories on the first level. inner level directories would be defined in subsequent directories
}
