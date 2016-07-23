/* @flow */

import { cleanPath } from './util/path'

export function createRouteMap (routes: Array<RouteConfig>): {
  pathMap: RouteMap,
  nameMap: RouteMap
} {
  const pathMap: RouteMap = Object.create(null)
  const nameMap: RouteMap = Object.create(null)

  routes.forEach(route => {
    addRoute(pathMap, nameMap, route)
  })

  return {
    pathMap,
    nameMap
  }
}

function addRoute (
  pathMap: RouteMap,
  nameMap: RouteMap,
  route: RouteConfig,
  parent?: RouteRecord
) {
  const { path, name } = route

  if (path == null) {
    throw new Error('[vue-router] "path" is required in a route configuration.')
  }

  const record: RouteRecord = {
    path: normalizePath(path, parent),
    components: route.components || { default: route.component },
    instances: {},
    name,
    parent,
    alias: route.alias,
    redirect: route.redirect,
    canActivate: route.canActivate,
    canDeactivate: route.canDeactivate
  }

  if (route.children) {
    route.children.forEach(child => {
      addRoute(pathMap, nameMap, child, record)
    })
  }

  pathMap[record.path] = record
  if (name) nameMap[name] = record
}

function normalizePath (path: string, parent?: RouteRecord): string {
  if (path[0] === '/') return path
  if (parent == null) return path
  return cleanPath(`${parent.path}/${path}`)
}
