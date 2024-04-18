import { Document } from './Document';

export interface DocumentFile {
    id: number,
    document: Document,
    filename: string,
    status: string,
    path: string,
}