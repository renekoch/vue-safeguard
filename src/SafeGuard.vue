<template>
<!-- Nothing is rendered; the slot is only used as the source for the text -->
</template>
<script setup>
defineOptions({ name: 'SafeGuard' });

/**
 * SafeGuard – warns before leaving when `guard` is true.
 * Uses native `beforeunload`. Some browsers ignore custom text, but this is the correct API.
 */
 
import {onMounted, onUnmounted, useSlots, isVNode, Text} from 'vue';

/**
 * @type {{guard: boolean|function: boolean, message: string}}
 */
const props = defineProps({
  /**
   * Enable the beforeunload guard. Can be a boolean or a function returning boolean.
   */
  guard: {type: [Boolean, Function], default: false},

  /**
   * Fallback message if no slot text is provided.
   */
  message: {
    type: String,
    default: 'Do you really want to leave? You have unsaved changes!',
  },
});

/**
 * Test if component is enabled (changes have been made).
 * @returns {boolean}
 */
function isEnabled() {
  return typeof props.guard === 'function' ? !!props.guard() : !!props.guard;
}


/**
 * Extract plain text from a slot's VNodes.
 * @param {(VNode|string)[]|string|null} nodes
 * @param {string[]} [acc]
 * @returns {string}
 */
function extractText(nodes, acc = []) {
  if (!nodes) return '';

  for (const n of nodes) {
    if (typeof n === 'string') {
      acc.push(n);
      continue;
    }
    if (!isVNode(n)) continue;
    if (n.type === Text) {
      acc.push(String(n.children ?? ''));
      continue;
    }
    if (Array.isArray(n.children)) extractText(n.children, acc);
    else if (typeof n.children === 'string') acc.push(n.children);
  }

  return acc.join('');
}

/**
 * @type {{default: null|function: VNode[]}}
 */
const slots = useSlots();

/**
 * @type {{value: string}}
 */
const effectiveMessage = computed(() => {
  const slotNodes = slots.default ? slots.default() : [];
  const fromSlot = extractText(slotNodes).trim();
  if (fromSlot) return fromSlot;

  return (props.message || '').trim();
});


/**
 * Handles beforeunload event and block it if enabled
 * @param {Event} e
 * @returns {string}
 */
function handler(e) {
  if (!isEnabled()) return;
  e.preventDefault();

  // Get text from slot or fallback to message prop
  const msg = effectiveMessage.value;

  e.returnValue = msg; // Some browsers ignore custom text, but this is the correct API.
  
  return msg;
}

onMounted(() => window.addEventListener('beforeunload', handler, {capture: true}));
onUnmounted(() => window.removeEventListener('beforeunload', handler, {capture: true}));
</script>
