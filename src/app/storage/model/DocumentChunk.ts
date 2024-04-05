export interface DocumentChunk {
    id: number,
    order: number,
    splitFile: string,
    content: string,
    loaded: boolean,
}