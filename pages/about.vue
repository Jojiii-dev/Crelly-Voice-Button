<template>
  <div>
    <VCard>
      <VCardTitle>
        <span class="text-3xl">Crelly Soundboard</span>
      </VCardTitle>
      <VCardText class="text-lg">
        <ul class="list-disc pl-6">
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
          <li>Sound file Sources: Twitch Clip、Discord</li>
          <li>Image Sources: Discord</li>
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
