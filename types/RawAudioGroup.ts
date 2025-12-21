import type { RawAudio } from './RawAudio';

export interface RawAudioGroup {
    group_name: string;
    group_description: string;
    voice_list: RawAudio[];
}
