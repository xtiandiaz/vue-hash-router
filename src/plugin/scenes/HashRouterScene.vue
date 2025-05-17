<script setup lang="ts">
import { inject } from 'vue'
import { type HashRouter } from '../models'
import HashRouterModalScene from './HashRouterModalScene.vue'
import type { NavigationBarVM } from '@vueties/view-models'
import NavigationalView from '@vueties/views/NavigationalView.vue'

defineProps<{
  navigationBarVM: NavigationBarVM
}>()

const hashRouter = inject('hash-router') as HashRouter | undefined

function navigateToRoute(key: string) {
  hashRouter?.pushRoute(key)
}
</script>

<template>
  <NavigationalView
    :navigationBarVM="navigationBarVM"
    @route-selected="navigateToRoute"
  >
    <component :is="hashRouter?.baseRoute?.value.view" />
  </NavigationalView>
  
  <HashRouterModalScene 
    :route="hashRouter?.modalRoute.value"
  />
</template>
