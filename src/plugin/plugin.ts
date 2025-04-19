import { type App } from 'vue'
import { HashRouter, type HashRouterOptions } from './models'

export default {
  install: (app: App, options: HashRouterOptions) => {
    const hashRouter = new HashRouter(options.routes, options.rootRouteKey)

    app.provide('hash-router', hashRouter)
    app.config.globalProperties.$hashRouter = hashRouter
  },
}
