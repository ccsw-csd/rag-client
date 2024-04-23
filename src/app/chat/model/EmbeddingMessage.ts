export interface EmbeddingMessage {
    id: number,
    embeddingId: string,
    content: string,
    type: number,
    order: number,
    document: string
}