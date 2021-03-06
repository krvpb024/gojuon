<template>
  <section
    class="exam-range-modal"
    aria-labelledby="exam-range-modal-title"
    role="dialog"
    aria-modal="true"
    ref="examRangeModalContainerElement"
    tabindex="-1"
    @keydown.esc="service.send('HIDE_EXAM_RANGE_MODAL')"
  >
    <div
      class="exam-range-modal__background"
      ref="examRangeModalBackground"
      @click="service.send('HIDE_EXAM_RANGE_MODAL')"
    ></div>

    <div
      class="exam-range-modal__form-block"
      ref="examRangeModalElement"
    >
      <form
        class="exam-range-modal-form-block__form"
        @submit.prevent="service.send('SET_EXAM_RANGE')"
      >
        <top-bar :withBorder="false">
          <template #leftContainer>
            <button
              type="button"
              aria-labelledby="exam-range-modal-title"
              @click="service.send('HIDE_EXAM_RANGE_MODAL')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14.729"
                height="14.727"
                viewBox="0 0 16 16"
                aria-labelledby="exam-range-modal-title"
                role="img"
              >
                <title id="exam-range-modal-title">關閉</title>

                <filter id="shadow">
                  <feDropShadow
                    dx="2.2"
                    dy="2.2"
                    stdDeviation="0"
                    flood-color="#ffffff"
                  />
                </filter>

                <g
                  id="Group_101"
                  data-name="Group 101"
                  transform="translate(-.414 -.415)"
                >
                  <path
                    id="Union_10"
                    d="M-11781.959-9448.151l-5.657-5.657-5.656 5.657a1 1 0 0 1-1.415 0 1 1 0 0 1 0-1.415l5.657-5.656-5.657-5.657a1 1 0 0 1 0-1.412 1 1 0 0 1 1.415 0l5.656 5.656 5.657-5.656a1 1 0 0 1 1.415 0 1 1 0 0 1 0 1.412l-5.658 5.658 5.655 5.655a1 1 0 0 1 0 1.415.991.991 0 0 1-.705.293 1 1 0 0 1-.707-.293z"
                    class="cls-1"
                    fill="#313131"
                    filter="url(#shadow)"
                    data-name="Union 10"
                    transform="translate(11795.395 9463)"
                  />
                </g>
              </svg>
            </button>
          </template>

          <h1 id="exam-range-modal-title">設定</h1>

          <template #rightContainer>
            <button
              class="exam-range-modal__save-button"
              @click="setExamRange"
              type="submit"
            >
              儲存
            </button>

            <div class="exam-range-modal-save-button__tooltips">
              <tooltips
                @click="service.send('TOOLTIPS_HIDE')"
                :show="current.matches('examRangeModal.show.tooltipsShow')"
                :service="service"
                :current="current"
                :anglePosition="{ right: 0, top: 0 }"
                angleTransformX="-20px"
                angleTransformY="-50%"
              >
                請至少選擇一項
              </tooltips>
            </div>
          </template>
        </top-bar>

        <div
          tabindex="0"
          class="exam-range-modal-form__scroll-content"
          ref="examRangeModalScrollContentElement"
          aria-labelledby="exam-range-modal-scroll-content__subtitle"
        >

          <h2
            id="exam-range-modal-scroll-content__subtitle"
            class="exam-range-modal-scroll-content__subtitle"
          >
            設定測驗範圍
          </h2>

          <section
            class="exam-range-modal-scroll-content__group"
            v-for="([groupName, rows]) in Object.entries(current.context.gojuon)"
            :key="groupName"
          >
            <gojuon-title>
              <h3>{{generateTitle(groupName)}}</h3>
            </gojuon-title>

            <div
              class="exam-range-modal-group__group-content"
              v-for="(row, rowIndex) in rows"
              :key="rowIndex"
            >
              <input
                class="app-visual-hidden"
                type="checkbox"
                :id="`${groupName}-row-${rowIndex}-select-all`"
                :checked="current.context.selectedGojuon.includes(`${groupName}-${rowIndex}`)"
                @focus="checkboxFocus"
                @input="updateSelectedGojuon({ groupName, rowIndex }, $event)"
              >
              <checkbox-label :forId="`${groupName}-row-${rowIndex}-select-all`">
                <span
                  v-for="hiragana in getRowString(row)"
                  :key="hiragana"
                  class="exam-range-modal-group-content__label-text"
                >
                  {{ hiragana }}
                </span>
              </checkbox-label>
            </div>
          </section>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import { ref, watch } from '@vue/composition-api'
import { gsap } from 'gsap'
import { generateTitle } from '@/states/gojuon.js'
import { useModalNavigation } from '@/utils/useModalNavigation.js'
import topBar from '@/components/topBar.vue'
import gojuonTitle from '@/components/gojuonTitle.vue'
import checkboxLabel from '@/components/checkboxLabel.vue'
import tooltips from '@/components/tooltips.vue'

export default {
  components: { topBar, gojuonTitle, checkboxLabel, tooltips },
  props: {
    service: {
      type: Object,
      required: true,
    },
    current: {
      type: Object,
      required: true,
    },
    buttonInfo: {
      type: Object,
    },
  },
  setup (props, context) {
    // element
    const examRangeModalContainerElement = ref(null)
    const examRangeModalElement = ref(null)
    const examRangeModalBackground = ref(null)
    const examRangeModalScrollContentElement = ref(null)

    // data
    const examRangeModalAnimationTimeline = ref(null)
    const modalFocusables = ref(null)
    useModalNavigation(modalFocusables)

    // effect
    watch(
      () => props.current.matches('examRangeModal.showAnimation'),
      function showModalAnimationWatcher (value) {
        if (!value) return

        showModalAnimation()
          .then(function animationEnd () {
            props.service.send('SHOW_EXAM_RANGE_MODAL_ANIMATION_END')
            modalFocusables.value = examRangeModalContainerElement.value.querySelectorAll('button, input[type="checkbox"]')
            modalFocusables.value[0] && modalFocusables.value[0].focus()
          })

        function showModalAnimation () {
          gsap.set(examRangeModalElement.value, { clearProps: 'all' })
          gsap.set(examRangeModalContainerElement.value, { display: 'block' })

          examRangeModalAnimationTimeline.value = gsap.timeline({ paused: true })
          const duration = 0.3

          return examRangeModalAnimationTimeline.value
            .from(examRangeModalElement.value, {
              left: props.buttonInfo.left,
              top: props.buttonInfo.top,
              width: props.buttonInfo.width,
              height: props.buttonInfo.height,
              duration,
              ease: 'circ.inOut',
            })
            .from(examRangeModalElement.value, {
              x: '+=50%',
              y: '+=50%',
              duration: duration / 2,
            }, '-=0.3')
            .to(examRangeModalBackground.value, {
              duration,
              opacity: 0.5,
            }, '-=0.3')
            .to(examRangeModalScrollContentElement.value, {
              display: 'block',
              duration: 0,
            })
            .to(examRangeModalScrollContentElement.value, {
              duration: duration / 2,
              opacity: 1,
            })
            .play()
        }
      },
      { lazy: true }
    )

    watch(
      () => props.current.matches('examRangeModal.hideAnimation'),
      function hideModalAnimationWatcher (value) {
        if (!value) return

        examRangeModalAnimationTimeline.value.reverse()
          .then(function hideModal () {
            gsap.set(examRangeModalContainerElement.value, { display: 'none' })
          })
          .then(function animationEnd () {
            props.service.send('HIDE_EXAM_RANGE_MODAL_ANIMATION_END')
            context.emit('modalHide')
          })
      },
      { lazy: true }
    )

    return {
      // elements
      examRangeModalBackground,
      examRangeModalScrollContentElement,
      examRangeModalElement,
      examRangeModalContainerElement,
      // data
      generateTitle,
      // methods
      getRowString,
      updateSelectedGojuon,
      setExamRange,
      checkboxFocus,
    }

    function getRowString (row) {
      return row
        .filter(function removeEmpty (gojuon) {
          return gojuon != 'empty'
        })
        .map(function remainHiragana ([hiragana]) {
          return hiragana
        })
    }

    function updateSelectedGojuon ({ groupName, rowIndex }, { currentTarget: { checked } }) {
      props.service.send('UPDATE_SELECTED_GOJUON', {
        data: {
          checked,
          target: `${groupName}-${rowIndex}`,
        },
      })
    }

    function setExamRange () {
      window.localStorage.setItem(
        'submittedGojuon',
        JSON.stringify(props.current.context.selectedGojuon)
      )

      props.service.send('SET_EXAM_RANGE')
    }

    function checkboxFocus (e) {
      if (document.body.classList.contains('using-mouse')) return
      // add header height
      examRangeModalScrollContentElement.value.scrollTop = e.target.offsetTop - 50
    }
  },
}
</script>

<style scoped>
.exam-range-modal {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: none;
}

.exam-range-modal__background {
  position: fixed;
  background-color: #000;
  opacity: 0;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
}

.exam-range-modal__form-block {
  will-change: width, height, transform, top, left;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  max-width: calc(var(--app-max-width) * 0.8);
  border: solid 2px var(--text-color);
  border-radius: 4px;
  overflow: hidden;
}

.exam-range-modal-form-block__form {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  text-align: left;
  background-color: #fff;
}

.exam-range-modal__save-button {
  position: relative;
}

.exam-range-modal-save-button__tooltips {
  position: absolute;
  bottom: 0;
  right: 0;
  transform: translate(0, 125%);
  z-index: 10;
}

.exam-range-modal-form__scroll-content {
  position: relative;
  flex: 1;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  padding: 10px;
  display: none;
  opacity: 0;
  scroll-behavior: smooth;
}

.exam-range-modal-form__scroll-content:focus {
  outline-offset: -5px;
}

.exam-range-modal-scroll-content__subtitle {
  font-size: 1.2rem;
  font-weight: bold;
  padding: 12px 8px;
  margin: 0;
}

.exam-range-modal-group__group-content {
  border-bottom: 0.5px solid #d3d3d3;
  padding: 10px;
}

.exam-range-modal-group-content__label-text {
  font-size: 1.25rem;
}

.exam-range-modal-group-content__label-text:first-child {
  margin-left: 10px;
}

.exam-range-modal-group-content__label-text
  + .exam-range-modal-group-content__label-text {
  margin-left: 1rem;
}
</style>
