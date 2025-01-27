/**
 * @import {ElementContent} from 'hast'
 */

import {h} from 'hastscript'
import {oc as icon} from '../icon/oc.js'

/**
 * @param {string} name
 * @returns {ElementContent}
 */
export function oc(name) {
  let node = icon()

  if (name) {
    node = h('a.tap-target', {href: 'https://opencollective.com/' + name}, node)
  }

  return h('li', {}, node)
}
