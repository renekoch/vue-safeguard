import UnsavedChangesGuard from './UnsavedChangesGuard.vue';

/** Vue plugin API */
export function install(app, options = {}) {
  app.component(options.name || MyWidget.name, UnsavedChangesGuard);
}

export { MyWidget };
export default { install };