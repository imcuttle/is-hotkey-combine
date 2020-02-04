/**
 * The shortest way to check multi-times keydown
 * @author imcuttle
 */
import isHotkey from 'is-hotkey'
export * from 'is-hotkey'

export const COMBO_SEP_STRING = '->'
export const EVENT_CACHE_KEY =
  typeof Symbol !== 'undefined' ? Symbol.for('hotKeyCombineCache') : '[[hotKeyCombineCache]]'

export function getCacheKeyByHotKeyCombo(combo) {
  return combo.join(COMBO_SEP_STRING)
}

const runInNextTick =
  (typeof requestAnimationFrame === 'function' ? requestAnimationFrame : process.nextTick) || (cb => setTimeout(cb))

export function createIsComboHotKey() {
  /**
   * @type {Map<any, {lastTriggerTimestamp: number, triggerTimes: number}>}
   */
  const cacheMap = new Map()

  /**
   * @param hotKey - 'enter*2' | 'a->b'
   * @param event
   * @param options
   */
  return function isHotKeyCombine(hotKey, event, { cache, duration = 250, ...opts } = {}) {
    // When triggering bubbles sync, We should modify cache async
    let runAction = runInNextTick

    if (!cache) {
      if (event.target && typeof event.target === 'object') {
        cache = event.target[EVENT_CACHE_KEY] = event.target[EVENT_CACHE_KEY] || new Map()
      } else {
        cache = cacheMap
      }
    }

    const hotKeyCombo = Array.isArray(hotKey) ? hotKey : splitHotKey(hotKey, opts)

    const runIsHotKey = hotKey => isHotkey(hotKey, { byKey: false, ...opts }, event)
    if (hotKeyCombo.length <= 1) {
      return runIsHotKey(hotKey)
    }

    const keyName = getCacheKeyByHotKeyCombo(hotKeyCombo)

    // Trigger again
    if (cache.has(keyName)) {
      const oldEntity = cache.get(keyName)
      if (runIsHotKey(hotKeyCombo[oldEntity.triggerTimes])) {
        const newEntity = {
          triggerTimes: oldEntity.triggerTimes + 1,
          lastTriggerTimestamp: Date.now()
        }
        if (newEntity.lastTriggerTimestamp - oldEntity.lastTriggerTimestamp > duration) {
          // Timeout
          runAction(() => {
            cache.set(keyName, {
              ...newEntity,
              triggerTimes: 1
            })
          })

          return false
        }

        if (newEntity.triggerTimes === hotKeyCombo.length) {
          runAction(() => {
            cache.delete(keyName)
          })
          return true
        }
        runAction(() => {
          cache.set(keyName, newEntity)
        })
      }
    } else {
      const entity = {
        lastTriggerTimestamp: Date.now(),
        triggerTimes: 0
      }
      if (runIsHotKey(hotKeyCombo[entity.triggerTimes])) {
        entity.triggerTimes++
        runAction(() => {
          cache.set(keyName, entity)
        })
      }
    }
    return false
  }
}

const isHotKeyCombine = createIsComboHotKey()
export default isHotKeyCombine

export function splitTimesHokKey(hotKey, opts) {
  hotKey = hotKey.toLowerCase()
  if (/^(.+)\*(\d+)$/.test(hotKey)) {
    hotKey = RegExp.$1
    const times = parseInt(RegExp.$2, 10)
    return new Array(times).fill(hotKey)
  }
  return [hotKey]
}

/**
 *
 * @param hotKey
 * @returns {string[]}
 */
export function splitHotKey(hotKey, opts) {
  if (typeof hotKey !== 'string') {
    throw new TypeError('`hotKey` requires string, but ' + typeof hotKey)
  }
  hotKey = hotKey.trim().toLowerCase()

  const hotKeyChunks = hotKey.split(COMBO_SEP_STRING)
  return hotKeyChunks.reduce((list, hotKey) => {
    const innerList = splitTimesHokKey(hotKey, opts)
    return list.concat(innerList)
  }, [])
}
