import { Person } from "./Person";
import { Post } from "./Post";
import { Tag } from "./Tag";

export interface Prompt {
    id: number,
    person: Person,
    title: string,
    description: string,
    tags: string[],
    posts: Post[],
}