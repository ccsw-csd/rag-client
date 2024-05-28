export interface EmbeddingMessage {
    id: number,
    filename: string,
    tokens: number,
    status: string,
    path: string,
    chunkNumber: number,
    type: string,
    modifyTpe: string,
    embeddingId: string
}