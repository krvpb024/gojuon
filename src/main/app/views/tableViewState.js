import { Machine, assign } from 'xstate'
// import { mutateByData, checkDataIs } from '../../../helpers/state.js'
import { gojuon } from '../../../helpers/gojuon.js'

const machine = Machine({
  id: 'table',
  type: 'parallel',
  context: {
    gojuon,
    groupName: null,
    row: null,
    column: null,
  },
  states: {
    table: {
      type: 'parallel',
      on: {
        UPDATE_CURSOR: [
          {
            cond: 'isNotMove',
            actions: 'clearCursor',
            target: 'drawingBoard.hide',
          },
          {
            actions: 'updateCursor',
            target: 'drawingBoard.show',
          },
        ],
      },
      states: {
        hiragana: {
          initial: 'show',
          on: {
            HIRAGANA_TOGGLE_DISPLAY: [
              {
                cond: 'isShow',
                target: '.show',
              },
              {
                target: '.hide',
              },
            ],
          },
          states: {
            show: {},
            hide: {},
          },
        },
        katakana: {
          initial: 'show',
          on: {
            KATAKANA_TOGGLE_DISPLAY: [
              {
                cond: 'isShow',
                target: '.show',
              },
              {
                target: '.hide',
              },
            ],
          },
          states: {
            show: {},
            hide: {},
          },
        },
      },
    },
    drawingBoard: {
      initial: 'hide',
      states: {
        show: {},
        hide: {},
      },
    },
  },
}, {
  guards: {
    isShow (context, { data }) {
      return data
    },
    isNotMove (context, {
      data: {
        groupName,
        row,
        column,
      },
    }) {
      return context.groupName == groupName &&
      context.row == row &&
      context.column == column
    },
  },
  actions: {
    clearCursor: assign({
      groupName: null,
      row: null,
      column: null,
    }),
    updateCursor: assign(function mutateCursorContext (context, {
      data: {
        groupName,
        row,
        column,
      },
    }) {
      return {
        groupName,
        row,
        column,
      }
    }),
  },
})

export {
  machine,
}
