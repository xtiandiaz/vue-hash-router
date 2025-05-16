<script setup lang="ts">
import { inject } from 'vue'
import { type HashRouter } from '../models'
import HashRouterModalScene from './HashRouterModalScene.vue'
import type { NavigationBarVM } from '@vueties/view-models'
import NavigationBar from '@vueties/bars/NavigationBar.vue'
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
  <NavigationalView>
    <template v-slot:bar>
      <NavigationBar 
        v-if="navigationBarVM.isVisible" 
        :vm="navigationBarVM" 
        @route-selected="navigateToRoute"
      />
    </template>
    <template v-slot:view>
      <component :is="hashRouter?.baseRoute?.value.view" />
    </template>
  </NavigationalView>
  
  <HashRouterModalScene 
    :route="hashRouter?.modalRoute.value"
  />
</template>
