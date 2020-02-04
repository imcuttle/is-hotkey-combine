/**
 * The shortest way to check multi-times keydown
 * @author imcuttle
 */
import isHotkey from 'is-hotkey'
export * from 'is-hotkey'

export const COMBO_SEP_STRING = '->'

export function getCacheKeyByHotKeyCombo(combo) {
  return combo.join(COMBO_SEP_STRING)
}

export function createIsComboHotKey() {
  /**
   * @type {Map<any, {lastTriggerTimestamp: number, triggerTimes: number}>}
   */
  const cacheMap = new Map()

  /**
   * 允许连击
   * @param hotKey - 'enter*2' | 'a->b'
   * @param event
   * @param options
   */
  return function isHotKeyCombo(hotKey, event, { cache = cacheMap, duration = 250, ...opts } = {}) {

    const hotKeyCombo = Array.isArray(hotKey) ? hotKey : splitHotKey(hotKey, opts)

    const runIsHotKey = hotKey => isHotkey(hotKey, { byKey: false, ...opts }, event)
    if (hotKeyCombo.length <= 1) {
      return runIsHotKey(hotKey)
    }

    const keyName = getCacheKeyByHotKeyCombo(hotKeyCombo)

    // Trigger again
    if (cacheMap.has(keyName)) {
      const oldEntity = cacheMap.get(keyName)
      if (runIsHotKey(hotKeyCombo[oldEntity.triggerTimes])) {
        const newEntity = {
          triggerTimes: oldEntity.triggerTimes + 1,
          lastTriggerTimestamp: Date.now()
        }
        if (newEntity.lastTriggerTimestamp - oldEntity.lastTriggerTimestamp > duration) {
          // Timeout
          cacheMap.set(keyName, {
            ...newEntity,
            triggerTimes: 1
          })
          return false
        }

        if (newEntity.triggerTimes === hotKeyCombo.length) {
          cacheMap.delete(keyName)
          return true
        }
        cacheMap.set(keyName, newEntity)
      }
    } else {
      const entity = {
        lastTriggerTimestamp: Date.now(),
        triggerTimes: 0
      }
      if (runIsHotKey(hotKeyCombo[entity.triggerTimes])) {
        entity.triggerTimes++
        cacheMap.set(keyName, entity)
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
