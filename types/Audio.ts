import type { AudioGroup } from './AudioGroup';

export interface Audio {
    name: string;
    path: string;
    group: AudioGroup;
    updatedAt: number;
}
