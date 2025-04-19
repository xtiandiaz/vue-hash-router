<script setup lang="ts">
import { ref, inject } from 'vue'
import type { HashRoute, HashRouter } from '../models'
import ModalView from '@vueties/views/ModalView.vue'

defineProps<{
  route?: HashRoute
}>()

const hashRouter = inject('hash-router') as HashRouter | undefined

const currentTitle = ref<string>()
</script>

<template>
  <Transition>
    <ModalView 
      v-if="route"
      :title="currentTitle"
      @close-button-clicked="hashRouter?.popRoute()"
    >
      <component 
        :is="route.view" 
        @view-title="(title: string) => currentTitle = title"
      />
    </ModalView>
  </Transition>
</template>

<style scoped lang="scss">
$transition-duration: 0.25s;
$transition-timing-function: ease-in;

@mixin transition($timing-function, $duration: 0.25s) {
  transition: none $duration $timing-function;
  
  :deep(.background) {
    transition: opacity $duration $timing-function;
  }
  :deep(.view-wrapper) {
    transition: transform $duration $timing-function;
  }
}

.v-enter-active {
  @include transition(ease-out);
}
.v-leave-active {
  @include transition(ease-in);
}
.v-enter-from, .v-leave-to {
  :deep(.background) {
    opacity: 0;
  }
  :deep(.view-wrapper) {
    transform: translateY(100%);
  }
}
</style>
