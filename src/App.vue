<template>
  <div id="app" class="app-root">
    <div class="app-root__container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted } from '@vue/composition-api'

export default {
  setup (props, context) {
    const homeBackgroundColor = computed(function getHomeBackgroundColor () {
      return context.root.$route.name == 'home'
    })

    onMounted(function addOnMounted () {
      document.body.addEventListener('mousedown', mouseDownHandler)
      document.body.addEventListener('keydown', keydownHandler)
    })

    onUnmounted(function addOnUnmounted () {
      document.body.removeEventListener('mousedown', mouseDownHandler)
      document.body.removeEventListener('keydown', keydownHandler)
    })

    function mouseDownHandler () {
      document.body.classList.add('using-mouse')
    }

    function keydownHandler () {
      document.body.classList.remove('using-mouse')
    }

    return {
      homeBackgroundColor,
    }
  },
}
</script>

<style>
:root {
  --main-color: #ffe65a;
  --text-color: #313131;
  --title-bg-color: #f5f5f5;
  --focus-border-width: 2.5px;
  --focus-border: solid var(--focus-border-width) var(--main-color);
  --app-max-width: 768px;
  --root-padding-size: 8px;
  --card-border-color: #1d1d1d;

  --focus-default-outline: 4px solid var(--text-color);
}

:focus {
  outline: var(--focus-default-outline);
  outline-offset: 5px;
}

body.using-mouse :focus {
  outline: none;
}

html {
  box-sizing: border-box;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin: 0;
  padding: 0;
  height: 100%;
}

a {
  color: inherit;
  text-decoration: none;
}

/* fix android firefox preview hover button text will disappear */
button:hover {
  color: inherit;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

body {
  color: var(--text-color);
  height: 100%;
  margin: 0;
  padding: 0;
}

.app-prevent-scroll {
  overflow: hidden;
  position: relative;
  height: 100%;
}

h1,
h2,
h3,
h4,
h5 {
  margin: 0;
}

p {
  margin: 0;
}

ul {
  margin: 0;
  padding: 0;
}

.app-visual-hidden {
  clip-path: inset(100%);
  clip: rect(1px 1px 1px 1px); /* IE 6/7 */
  clip: rect(1px, 1px, 1px, 1px);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap; /* added line */
  width: 1px;
}

.app-sticky-top {
  padding: var(--root-padding-size);
  background-color: #fff;
  padding-bottom: 0;
  position: sticky;
  top: 0;
  z-index: 11;
}

.app-sticky-bottom {
  position: sticky;
  padding: var(--root-padding-size);
  bottom: 0;
  pointer-events: none;
}

.app-top-bar-link-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-root {
  height: 100%;
  margin: 0;
  padding: 0;
}

.app-root__container {
  max-width: var(--app-max-width);
  margin: 0 auto;
  height: 100%;
}
</style>
