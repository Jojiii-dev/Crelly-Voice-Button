<template>
  <div>
    <DataTable
      :groups="sounds.groups"
      :filter="filterState"
      :playSound="playSound"
    />

    <VBottomSheet
      inset
      :model-value="!!currentPlayingSound"
      :scrim="false"
      disabled
      persistent
      no-click-animation
      scroll-strategy="none"
    >
      <VSheet>
        <VProgressLinear
          :model-value="currentPlayingSound?.progress"
          color="secondary"
        />

        <VList>
          <VListItem>
            <VListItemTitle class="!whitespace-normal">
              {{ currentPlayingSound?.name }}
            </VListItemTitle>

            <template v-slot:append>
              <VBtn
                v-if="hasClipboard"
                icon="mdi-share"
                variant="text"
                color="secondary"
                @click.stop="doShare"
              />

              <VBtn
                icon="mdi-download"
                variant="text"
                color="secondary"
                :href="`/voices/${currentPlayingSound?.path}`"
                target="_blank"
              />

              <VBtn
                :icon="soundSettings.loop ? 'mdi-repeat' : 'mdi-repeat-off'"
                variant="text"
                @click.stop="toggleSoundLoop"
                color="secondary"
              />

              <VBtn
                :icon="
                  currentPlayingSound?.isPlaying ? 'mdi-pause' : 'mdi-play'
                "
                variant="text"
                @click.stop="toggleSound"
                color="secondary"
              />

              <VBtn
                class="ms-0"
                icon="mdi-close"
                variant="text"
                color="secondary"
                @click.stop="stopSound"
              />
            </template>
          </VListItem>
        </VList>
      </VSheet>
    </VBottomSheet>

    <VFab location="bottom right" app icon="mdi-tune-vertical-variant">
      <VIcon>mdi-tune-vertical-variant</VIcon>

      <VMenu activator="parent" location="top">
        <VBtn
          :icon="soundSettings.loop ? 'mdi-repeat' : 'mdi-repeat-off'"
          class="my-2"
          @click="toggleSoundLoop"
        />
        <VBtn icon="mdi-cow" @click="playRandomSound" class="my-2" />
      </VMenu>
    </VFab>

    <ClientOnly>
      <VSonner
        position="top-right"
        :toast-options="{
          style: { background: '#c4986f', borderRadius: '8px' }
        }"
      />
    </ClientOnly>

    <div class="h-32" />

    <div
      class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
      v-if="isPageLoading"
    >
      <VProgressCircular indeterminate color="secondary" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { VSonner, toast } from 'vuetify-sonner';
import sounds from '~/assets/voices.json';
import dayjs from 'dayjs';

const route = useRoute();

const isPageLoading = ref(true);

const soundSettings = ref<{
  loop?: boolean;
  volume?: number;
  stack?: boolean;
}>({});

const filterState = reactive({
  group: 'All',
  search: '',
});

const toggleSoundLoop = () => {
  soundSettings.value.loop = !soundSettings.value.loop;
};

watch(
  () => soundSettings.value,
  (v) => {
    if (currentPlayingSound.value) {
      currentPlayingSound.value.settings = v;
    }
  },
  { deep: true }
);

watch(
  () => soundSettings.value.loop,
  (v) => {
    toast(v ? 'Looping on' : 'Looping off');
  }
);

const currentPlayingSound = ref<{
  audio: HTMLAudioElement;
  settings: { loop?: boolean; volume?: number; stack?: boolean };
  name: string;
  path: string;
  progress?: number;
  isPlaying?: boolean;
} | null>(null);

const setListenerForCurrentPlayingSound = () => {
  const audio = currentPlayingSound.value?.audio;
  if (!audio) return;

  audio.addEventListener('play', () => {
    if (currentPlayingSound.value) {
      currentPlayingSound.value.isPlaying = true;
    }
  });

  audio.addEventListener('pause', () => {
    if (currentPlayingSound.value) {
      currentPlayingSound.value.isPlaying = false;
    }
  });

  audio.addEventListener('ended', () => {
    if (currentPlayingSound.value) {
      if (soundSettings.value.loop) {
        currentPlayingSound.value.audio.play();
      } else {
        currentPlayingSound.value = null;
      }
    }
  });

  audio.addEventListener('timeupdate', () => {
    if (currentPlayingSound.value) {
      currentPlayingSound.value.progress =
        (audio.currentTime / audio.duration) * 100;
    }
  });
};

const playSound = async (soundPath: string, soundName: string) => {
  if (currentPlayingSound.value) {
    stopSound();
  }
  const assetPath = `/voices/${soundPath}`;

  let fetchPassed = false;
  try {
    const response = await fetch(assetPath, { method: 'HEAD' });
    if (response.status === 200) {
      fetchPassed = true;
    }
  } catch (error) {
    console.error(error);
    return;
  }

  if (!fetchPassed) {
    toast('Cannot find the sound file');
    return;
  }

  const audio = new Audio(assetPath);

  currentPlayingSound.value = {
    audio,
    settings: soundSettings.value,
    name: soundName,
    path: soundPath
  };

  setListenerForCurrentPlayingSound();
  currentPlayingSound.value?.audio?.play?.();
};

const playRandomSound = async () => {
  stopSound();
  const randomSoundGroup =
    sounds.groups[Math.floor(Math.random() * sounds.groups.length)];
  const randomSound =
    randomSoundGroup.voice_list[
      Math.floor(Math.random() * randomSoundGroup.voice_list.length)
    ];

  await nextTick();

  playSound(randomSound.path, randomSound.description);
};

const toggleSound = () => {
  if (currentPlayingSound.value?.audio?.paused) {
    currentPlayingSound.value?.audio?.play?.();
  } else {
    currentPlayingSound.value?.audio?.pause?.();
  }
};

const stopSound = () => {
  currentPlayingSound.value?.audio?.pause?.();
  currentPlayingSound.value = null;
};

const doShare = () => {
  const currentSound = currentPlayingSound.value;
  if (!currentSound) return;

  navigator.clipboard.writeText(
    `${location.origin}?btn=${encodeURIComponent(
      currentSound.path
    )}&name=${encodeURIComponent(currentSound.name)}`
  );
  toast('Copied to clipboard!');
};

const hasClipboard = ref(true);

onMounted(() => {
  nextTick(() => {
    isPageLoading.value = false;
  });

  if (!navigator.clipboard) {
    hasClipboard.value = false;
  }

  if (route.query?.btn && route.query?.name) {
    const search = decodeURIComponent(route.query.name as string);

    filterState.search = search;

    playSound(
      decodeURIComponent(route.query.btn as string),
      decodeURIComponent(search)
    );
  }
});

onBeforeUnmount(() => {
  stopSound();
});

defineExpose({
  playRandomSound
});
</script>

<style scoped>
.sound_btn {
  @apply relative;
  margin-top: 4px;
  margin-left: 4px;

  min-height: auto;
  height: auto;
  padding: 8px 20px;
}

.sound_btn:deep(.v-btn__content) {
  white-space: pre-wrap;
  word-break: break-word;
  text-align: left;
}

:deep(.card-snackbar) {
  background: transparent !important;
  color: #fff !important;
}
</style>
