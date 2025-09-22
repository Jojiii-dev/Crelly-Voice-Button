<script setup lang="ts">
import type { Audio }         from '~/types/Audio';
import type { AudioGroup }    from '~/types/AudioGroup';
import type { FilterState }   from '~/types/FilterState';
import type { RawAudio }      from '~/types/RawAudio';
import type { RawAudioGroup } from '~/types/RawAudioGroup';

import BaseTable from './BaseTable';
import Filters   from './Filters';

interface Props {
    groups: RawAudioGroup[];
    filter: FilterState;
    playSound: (path: string, name: string) => void;
}

const props = defineProps<Props>();

const groups: AudioGroup[] = [];

const fullTable = props.groups.map((audioGroup) => {
    const group = {
        name: audioGroup.group_name,
        displayName: audioGroup.group_description,
    };

    groups.push(group);

    return audioGroup.voice_list.map((audio) => ({
        name: audio.description,
        path: audio.path,
        group: group,
        updatedAt: audio.updated_at,
    }));
})
.flat();

const items = ref(fullTable);

function isEmpty(value: any) {
    return value == null || (typeof value === 'string' && !value.length);
}

function nameMatches(item: Audio, search: string): boolean {
    return isEmpty(search) || item.name.includes(search);
}

function groupMatches(item: Audio, group: string): boolean {
    return group === 'All' || item.group.name === group;
}

watch(props.filter, (newFilter, oldFilter) => {
    if (newFilter.group === 'All' && isEmpty(newFilter.search)) {
        items.value = fullTable;

        return;
    }

    items.value = fullTable.filter((item) => {
        const isNameMatch  = nameMatches(item, newFilter.search);
        const isGroupMatch = groupMatches(item, newFilter.group);

        return isNameMatch && isGroupMatch;
    });
});
</script>

<template>
    <div class="data-table">
        <Filters :groups="groups" :state="filter" />
        <BaseTable :items="items" :playSound="playSound" />
    </div>
</template>
