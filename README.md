# vue-safeguard

A tiny Vue 3 component/plugin that warns users before leaving a page with unsaved changes.  
Uses the native `beforeunload` event. No DOM rendered; optional slot text becomes the message.

> Note: Some browsers ignore custom text, but using `event.preventDefault()` and `event.returnValue` is the correct API.

---

## Install

```bash
# choose one
npm i vue-safeguard
# or
pnpm add vue-safeguard
# or
yarn add vue-safeguard
```

**Peer dependency:** Vue `^3.3.0`.

---

## Quick Start

### As a global plugin

```js
// main.js
import { createApp } from 'vue';
import VueSafeguard from 'vue-safeguard';
import App from './App.vue';

const app = createApp(App);
app.use(VueSafeguard); // registers <safe-guard />
app.mount('#app');
```

Then in any component:

```vue
<template>
  <safe-guard :guard="isDirty">
    You have unsaved changes. Are you sure you want to leave?
  </safe-guard>

  <!-- your form/UI -->
</template>

<script>
export default {
  data() {
    return { isDirty: false };
  }
};
</script>
```

### As a local component

```js
import { SafeGuard } from 'vue-safeguard';

export default {
  components: { SafeGuard }
};
```

---

## API

### `<safe-guard />` props

| Prop      | Type      | Default                                                               | Description                                   |
|-----------|-----------|-----------------------------------------------------------------------|-----------------------------------------------|
| `guard`   | `Boolean` | `true`                                                                | Toggle the guard on/off.                      |
| `message` | `String`  | `'You have unsaved changes. Are you sure you want to leave?'`         | Message used for `beforeunload` (see note).   |

**Slot:** Optional. If provided, its text is used as the message (overrides `message` prop).

Example:

```vue
<safe-guard :guard="true">
  <!-- Nothing is rendered; the slot is only used as the source for the text -->
  You have unsaved changes!
</safe-guard>
```

---

## How it works

- Adds a capturing `beforeunload` listener on `mounted`.
- If `guard` is `true`, calls `event.preventDefault()` and sets `event.returnValue`.
- Removes the listener on `unmounted`.

> Browser note: modern browsers may ignore custom strings and show a standard prompt instead. This is expected and per spec.

---

## Patterns & Tips

- **Form dirty state:** Set `guard` to `true` when any form field differs from its initial value.
- **Route changes:** This component guards **tab/window closes and reloads**. For **in-app navigation** (Vue Router), use a route guard too if needed:
  ```js
  // pseudo-example
  router.beforeEach((to, from, next) => {
    if (store.isDirty && !confirm('Unsaved changes. Leave?')) return next(false);
    next();
  });
  ```
- **SSR:** No effect on the server; `beforeunload` runs in the browser only.

---

## Import formats

- ESM: `import { SafeGuard } from 'vue-safeguard'`
- Plugin: `import VueSafeguard from 'vue-safeguard'` then `app.use(VueSafeguard)`

---

## License

MIT © Rene Koch
