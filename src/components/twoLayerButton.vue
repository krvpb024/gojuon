<template>
  <button
    v-if="tagType == 'button'"
    class="two-layer-button"
    :class="{ 'two-layer-button--invert': invert }"
    @click="$emit('buttonClick')"
  >
    <span
      class="two-layer-button__content"
      :class="{ 'two-layer-button__content--invert': invert }"
    >
      <slot></slot>
    </span>
  </button>

  <a
    v-else-if="tagType == 'a'"
    :href="hrefValue"
    @click.prevent="$emit('buttonClick')"
    class="two-layer-button"
    :class="{ 'two-layer-button--invert': invert }"
  >
    <span
      class="two-layer-button__content"
      :class="{ 'two-layer-button__content--invert': invert }"
    >
      <slot></slot>
    </span>
  </a>
</template>

<script>
export default {
  props: {
    tagType: {
      type: String,
      default: 'button',
    },
    hrefValue: {
      type: String,
      default: '/',
    },
    invert: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped>
.two-layer-button {
  grid-area: install-button;
  border: none;
  padding: 0;
  position: relative;
  background-color: transparent;
  display: block;
}

.two-layer-button:focus {
  outline: var(--focus-default-outline);
  outline-offset: 5px;
}

body.using-mouse .two-layer-button:focus {
  outline: none;
}

.two-layer-button::after {
  content: "";
  display: block;
  background-color: var(--main-color);
  width: 100%;
  height: 100%;
  position: absolute;
  border: 2px solid var(--text-color);
  border-radius: 6px;
  top: 0;
  left: 0;
  z-index: 9;
  transform: translate(4px, 4px);
}

.two-layer-button--invert::after {
  background-color: #fff;
}

.two-layer-button__content {
  position: relative;
  background-color: #fff;
  display: inline-block;
  border: 2px solid var(--text-color);
  border-radius: 6px;
  padding: 6px;
  font-weight: bold;
  font-size: 1rem;
  z-index: 10;
  display: flex;
  align-items: center;
}

.two-layer-button__content img {
  max-width: 100%;
  max-height: 100%;
}

.two-layer-button__content--invert {
  background-color: var(--main-color);
}
</style>
