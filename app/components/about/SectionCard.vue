<script setup lang="ts">
// A collapsible About-page section. The title is a heading whose only child is the toggle button,
// so screen readers list it as a heading and expose the expanded state on the button.
const props = withDefaults(defineProps<{ id: string; title: string; defaultOpen?: boolean }>(), {
  defaultOpen: false,
})

const uid = useId()
const bodyId = `${uid}-body`
const open = ref(props.defaultOpen)

// A deep link like /about#security opens its section and scrolls to it. Re-scroll after the
// body expands, since expanding shifts the layout.
function openIfLinked() {
  if (window.location.hash !== `#${props.id}`) return
  open.value = true
  nextTick(() => document.getElementById(props.id)?.scrollIntoView({ block: 'start' }))
}

onMounted(() => {
  openIfLinked()
  window.addEventListener('hashchange', openIfLinked)
})

onUnmounted(() => window.removeEventListener('hashchange', openIfLinked))
</script>

<template>
  <section :id="id" class="section-card" :class="{ open }">
    <h2 class="card-title display">
      <button
        type="button"
        class="card-summary"
        :aria-expanded="open"
        :aria-controls="bodyId"
        @click="open = !open"
      >
        <span class="card-title-text">{{ title }}</span>
        <span class="card-chevron" aria-hidden="true" />
      </button>
    </h2>
    <div v-show="open" :id="bodyId" class="card-body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.section-card {
  border: 1px solid var(--hairline);
  background: var(--surface-raised);
}

.section-card.open {
  border-color: color-mix(in oklab, var(--navy) 25%, transparent);
}

.card-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  padding: 1.25rem 1.5rem;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  user-select: none;
}

.card-summary:hover {
  background: color-mix(in oklab, var(--periwinkle) 40%, transparent);
}

.card-title {
  margin: 0;
  font-size: clamp(1.1rem, 2.5vw, 1.6rem);
  font-weight: 900;
  line-height: 1.15;
  text-wrap: balance;
}

.card-chevron {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  border-right: 2.5px solid var(--navy);
  border-bottom: 2.5px solid var(--navy);
  transform: rotate(45deg);
  transition: transform 0.2s ease;
  margin-top: -0.35rem;
}

.section-card.open .card-chevron {
  transform: rotate(-135deg);
  margin-top: 0.35rem;
}

.card-body {
  padding: 0 1.5rem 1.5rem;
}

/* ── Mission card variant ── */
.section-card.mission-card {
  background: var(--periwinkle);
  border-color: color-mix(in oklab, var(--navy) 15%, transparent);
}

.mission-card .card-summary:hover {
  background: color-mix(in oklab, var(--periwinkle) 70%, transparent);
}
</style>
