/**
 * @import {ElementContent} from 'hast'
 */

/**
 * @template T
 * @callback Map
 * @param {T} name
 * @returns {Array<ElementContent> | ElementContent}
 */

/**
 * @callback More
 * @param {number} count
 * @param {number} total
 * @returns {ElementContent}
 */

/**
 * @typedef Options
 * @property {number | undefined} [max]
 * @property {More | undefined} [more]
 * @property {ElementContent | undefined} [trail]
 */

/**
 * @template T
 * @param {ReadonlyArray<T>} names
 * @param {Map<T>} map
 * @param {Options | undefined} [options]
 * @returns {Array<ElementContent>}
 */
export function list(names, map, options) {
  let {max, more, trail} = options || {}
  let values = names
  const total = values.length

  if (more && max && total >= max) {
    trail = more(total - (max - 1), total)
    values = names.slice(0, max - 1)
  }

  /** @type {Array<ElementContent>} */
  const children = []

  for (const d of values) {
    const result = map(d)

    if (Array.isArray(result)) {
      children.push(...result)
    } else {
      children.push(result)
    }
  }

  if (trail) {
    children.push(trail)
  }

  return children
}
