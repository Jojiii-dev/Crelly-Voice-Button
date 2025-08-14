<template>
  <div>
    <VCard>
      <VCardTitle>
        <span class="text-3xl">Crelly Soundboard</span>
      </VCardTitle>
      <VCardText class="text-lg">
        <ul class="list-disc pl-6">
          <p>
            Thanks for visiting my little crelly soundboard site. I hope you
            enjoyed it. All the sounds are from Crelly's stream or clips. No AI
            generated soundbites here. Most soundbites are only trimmed and have
            bgm or noises removed. Only the ones specifically said it's edited
            are edited and stiched together.
          </p>
          <li>
            Created by:
            <a class="link" href="https://x.com/Jojiii_dev" target="_blank">
              Jojiii
            </a>
          </li>
          <li>
            Template made by:
            <a class="link" href="https://konnokai.me/" target="_blank">
              孤之界
            </a>
            ,
            <a class="link" href="https://twitter.com/7Red4" target="_blank">
              紅柿
            </a>
            ,
            <a
              class="link"
              href="https://github.com/kujyonatsume"
              target="_blank"
            >
              九条夏目
            </a>
          </li>
          <li>
            Sound file Sources: Twitch Clip, Discord, Youtube clips, Community
            and mods submitted soundbites
          </li>
          <li>
            Contributors for soundbites (let me know if you've submitted and
            want to be added here): ZeroRelevance0, mw
          </li>
        </ul>
      </VCardText>
    </VCard>
  </div>
</template>
<script setup lang="ts"></script>

<style scoped>
.link {
  @apply text-primary-500 underline;
}

ul * {
  @apply text-lg;
}
</style>
