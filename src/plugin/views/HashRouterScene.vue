<script setup lang="ts">
import { inject } from 'vue'
import { type HashRouter } from '../models'
import HashRouterModalScene from './HashRouterModalScene.vue'
import type { NavigationBarVM } from '@vueties/view-models'
import NavigationBar from '@vueties/bars/NavigationBar.vue'

defineProps<{
  navigationBarVM: NavigationBarVM
}>()

const hashRouter = inject('hash-router') as HashRouter | undefined

function navigateToRoute(key: string) {
  hashRouter?.pushRoute(key)
}
</script>

<template>
  <NavigationBar 
    v-if="navigationBarVM.isVisible" 
    :vm="navigationBarVM" 
    @route-selected="navigateToRoute"
  />
  
  <component :is="hashRouter?.baseRoute?.view" />
  
  <HashRouterModalScene 
    :route="hashRouter?.modalRoute"
  />
</template>

<style scoped lang="scss">
</style>
