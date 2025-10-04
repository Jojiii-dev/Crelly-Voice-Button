<script setup lang="ts">
import type { AudioGroup }  from '~/types/AudioGroup';
import type { FilterState } from '~/types/FilterState';

interface Props {
    groups: AudioGroup[];
    state: FilterState;
}

const props = defineProps<Props>();

const groups = [
    { name: 'All', displayName: 'All' },
    ...props.groups,
]
</script>

<template>
    <VContainer>
        <VRow>
            <VCol cols="4">
                <VSelect
                    variant="outlined"
                    density="compact"
                    label="Select Group"
                    item-title="displayName"
                    item-value="name"
                    color="primary"
                    v-model="state.group"
                    :items="groups"
                />
            </VCol>
            <VCol>
                <VTextField
                    density="compact"
                    variant="outlined"
                    label="Search"
                    color="primary"
                    clearable
                    clear-icon="mdi-close"
                    append-inner-icon="mdi-magnify"
                    v-model="state.search"
                />
            </VCol>
        </VRow>
    </VContainer>
</template>
