import { Person } from "./Person";
import { Post } from "./Post";

export interface Prompt {
    id: number,
    person: Person,
    title: string,
    description: string,
    tags: string[],
    posts: Post[],
    views?: number,
    likes?: number,
    userLiked?: boolean,
    date?: Date,


    stringTags?: string,
    author?: string,
}