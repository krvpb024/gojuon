import { html, define, render } from 'hybrids'

const tableElement = {
  render: render(function renderTableViewContainer () {
    return html`
      <style>
      :host {
        width: 800px;
        display: flex;
        flex-wrap: wrap;
      }

      ::slotted() {
        box-sizing: border-box;
        width: 50px;
        height: 50px;
        padding: 3px;
      }
      </style>

      <slot></slot>
    `
  }),
}

define('table-element', tableElement)
