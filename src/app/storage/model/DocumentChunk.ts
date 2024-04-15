export interface DocumentChunk {
    id: number,
    order: number,
    filename: string,
    content: string,
    loaded: boolean,
    lineNumber?: number,
    tokens?: number,
}