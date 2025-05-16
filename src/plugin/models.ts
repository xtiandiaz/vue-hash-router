import type { Component, ComputedRef, Ref } from 'vue'
import { ref, computed } from 'vue'
import '@/assets/tungsten/extensions/array.extensions'

export enum HashRoutePresentationStyle {
  Modal,
}

export interface HashRoute {
  key: string
  view: Component
  path?: string
  presentationStyle?: HashRoutePresentationStyle
}

export interface HashRouterOptions {
  rootRouteKey: string
  routes: HashRoute[]
}

export class HashRouter {
  readonly baseRoute: ComputedRef<HashRoute> = computed(() => {
    const reversedTrail = this._trail.value.reversed()
    const routeKey = reversedTrail.find(rk => this._routes[rk].presentationStyle !== HashRoutePresentationStyle.Modal)!
    
    return this._routes[routeKey]
  })
  
  readonly modalRoute: ComputedRef<HashRoute | undefined> = computed(() => {
    const latestRoute = this._latestRoute
    
    return latestRoute.presentationStyle === HashRoutePresentationStyle.Modal ? latestRoute : undefined
  })
  
  _homeRouteKey: string
  _routes: Record<string, HashRoute>
  _trail: Ref<string[]>

  constructor(routes: HashRoute[], homeRouteKey: string) {
    this._routes = Object.fromEntries(routes.map((r) => [r.key, r]))
    
    if (!this.isValidRouteKey(homeRouteKey)) {
      throw new Error(`[Hash Router] Invalid Home Route Key: ${homeRouteKey}`)
    }
    
    this._homeRouteKey = homeRouteKey
    
    this._trail = ref([homeRouteKey])
    
    const currentRouteKeyFromHash = this._routeFromHash(location.hash)?.key
    if (currentRouteKeyFromHash) {
      this.pushRoute(currentRouteKeyFromHash)
    }

    window.addEventListener('hashchange', () => {
      this._onHashChanged()
    })
  }
  
  get _latestRoute(): HashRoute {
    return this._routes[this._trail.value.last()!]
  }

  isValidRouteKey(key: string): boolean {
    return this._routes[key] !== undefined
  }
  
  isValidRoutePath(path: string): boolean {
    return this._routeFromPath(path) !== undefined
  }

  pushRoute(key: string) {
    if (!this.isValidRouteKey(key)) {
      console.error(`[Hash Router] Invalid key: ${key}`)
      return
    }
    
    this._trail.value.push(key)
    
    this._applyTrail()
  }

  popRoute(): string | undefined {
    const poppedRouteKey = this._trail.value.pop()
    
    if (this._trail.value.length === 0) {
      this._trail.value = [this._homeRouteKey]
    }

    this._applyTrail()

    return poppedRouteKey
  }

  setPath(path: string) {
    const route = this._routeFromPath(path)
    
    if (!route) {
      console.error(`[Hash Router] Invalid path: ${path}`)
      return
    }
    
    this._trail.value.push(route.key)
    
    this._applyTrail()
  }
  
  _routePathFromKey(key: string): string {
    return this._routes[key].path ?? `/${key}`
  }
  
  _routeFromPath(path: string): HashRoute | undefined {
    return Object.values(this._routes).find(r => this._routePathFromKey(r.key) === path)
  }
  
  _routeFromHash(hash: string): HashRoute | undefined {
    return this._routeFromPath(hash.slice(1))
  }

  _applyTrail() {
    location.hash = `#${this._routePathFromKey(this._latestRoute.key)}`
  }

  _onHashChanged() {
    const routeFromHash = this._routeFromHash(location.hash)
    
    if (routeFromHash && routeFromHash !== this._latestRoute) {
      this._trail.value.push(routeFromHash.key)
    }
  }
}
