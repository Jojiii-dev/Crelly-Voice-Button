<script setup lang="ts">
import dayjs from 'dayjs';

import type { Audio } from '~/types/Audio';

interface Props {
    items: Audio[];
    playSound: (path: string, name: string) => void;
}

function sortByUpdated(a: Audio, b: Audio): number {
    if (a.updatedAt < b.updatedAt) {
        return -1;
    }

    if (a.updatedAt > b.updatedAt) {
        return 1;
    }

    return 0;
}

function sortByGroup(a: Audio, b: Audio): number {
    if (a.group.name < b.group.name) {
        return -1;
    }

    if (a.group.name > b.group.name) {
        return 1;
    }

    return 0;
}

const headers = ref([
    { title: 'Name', key: 'name' },
    {
        title: 'Group',
        key: 'group.displayName',
        sortRaw: sortByGroup,
    },
    {
        title: 'Added',
        key: 'updatedAt',
        sortRaw: sortByUpdated,
    },
]);

const goTo  = useGoTo()
const props = defineProps<Props>();

function handlePageChange(page: number) {
    // Scroll to top after page change
    goTo(0, {
        duration: 250,
        easing: 'easeInOutCubic',
    });
}
</script>

<template>
    <VDataTable
        items-per-page="50"
        :sort-by="[{ key: 'updatedAt', order: 'desc' }]"
        :headers="headers"
        :items="items"
        @update:page="handlePageChange"
        hover
    >
        <template v-slot:item="{ item }">
            <tr class="cursor-pointer" @click="playSound(item.path, item.name)">
                <td>{{ item.name }}</td>
                <td>{{ item.group.displayName }}</td>
                <td>{{ dayjs().diff(dayjs.unix(item.updatedAt), 'days') }}d ago</td>
            </tr>
        </template>
    </VDataTable>
</template>
