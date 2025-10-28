import SafeGuard from './SafeGuard.vue';

/** Vue plugin API */
export function install(app, options = {}) {
  app.component(options.name || SafeGuard.name, SafeGuard);
}

export { SafeGuard };
export default { install };