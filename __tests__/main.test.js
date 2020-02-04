import isComboHotKey, { splitHotKey, parseHotkey, EVENT_CACHE_KEY } from '../index'

const runSeriesNextTick = list => {
  if (!list.length) return
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      list[0]()
      resolve(runSeriesNextTick(list.slice(1)))
    })
  })
}

describe('spec', function() {
  it('should splitHotKey', function() {
    expect(splitHotKey('shift*2')).toMatchInlineSnapshot(`
            Array [
              "shift",
              "shift",
            ]
        `)
    expect(splitHotKey('shift->shift')).toMatchInlineSnapshot(`
            Array [
              "shift",
              "shift",
            ]
        `)
    expect(splitHotKey('shift*2->shift')).toMatchInlineSnapshot(`
            Array [
              "shift",
              "shift",
              "shift",
            ]
        `)

    expect(splitHotKey('shift->cmd*2')).toMatchInlineSnapshot(`
            Array [
              "shift",
              "cmd",
              "cmd",
            ]
        `)

    expect(splitHotKey('shift+a->cmd+a*2')).toMatchInlineSnapshot(`
            Array [
              "shift+a",
              "cmd+a",
              "cmd+a",
            ]
        `)
  })

  it('should isComboHotKey', async function() {
    expect(isComboHotKey('shift+*', new KeyboardEvent('keydown', parseHotkey('shift+*')))).toBeTruthy()

    await runSeriesNextTick([
      () => expect(isComboHotKey('shift+**2', new KeyboardEvent('keydown', parseHotkey('shift+*')))).toBeFalsy(),
      () => expect(isComboHotKey('shift+**2', new KeyboardEvent('keydown', parseHotkey('shift+*')))).toBeTruthy(),

      // again
      () => expect(isComboHotKey('shift+**2', new KeyboardEvent('keydown', parseHotkey('shift+*')))).toBeFalsy(),
      () => expect(isComboHotKey('shift+**2', new KeyboardEvent('keydown', parseHotkey('shift+*')))).toBeTruthy(),
    ])
  })

  it('should isComboHotKey different', async function() {
    await runSeriesNextTick([
      () => expect(isComboHotKey('shift->a', new KeyboardEvent('keydown', parseHotkey('shift')))).toBeFalsy(),
      () => expect(isComboHotKey('shift->a', new KeyboardEvent('keydown', parseHotkey('a')))).toBeTruthy(),

      () => expect(isComboHotKey('shift->a', new KeyboardEvent('keydown', parseHotkey('shift')))).toBeFalsy(),
      () => expect(isComboHotKey('shift->a', new KeyboardEvent('keydown', parseHotkey('shift')))).toBeFalsy(),
      () => expect(isComboHotKey('shift->a', new KeyboardEvent('keydown', parseHotkey('a')))).toBeTruthy(),

      () => expect(isComboHotKey(['shift', 'a'], new KeyboardEvent('keydown', parseHotkey('shift')))).toBeFalsy(),
      () => expect(isComboHotKey('shift->a', new KeyboardEvent('keydown', parseHotkey('a')))).toBeTruthy(),
    ])
  })

  it('should isComboHotKey timeout & case insensitive', function(done) {
    expect(isComboHotKey('shift->A', new KeyboardEvent('keydown', parseHotkey('shift')))).toBeFalsy()
    setTimeout(() => {
      expect(
        isComboHotKey('shift->a', new KeyboardEvent('keydown', parseHotkey('a')), {
          duration: 1
        })
      ).toBeFalsy()
      done()
    }, 2)
  })

  it('should isComboHotKey async', function(done) {
    expect(isComboHotKey('shift->A', new KeyboardEvent('keydown', parseHotkey('shift')))).toBeFalsy()
    setTimeout(() => {
      expect(isComboHotKey('shift->a', new KeyboardEvent('keydown', parseHotkey('a')))).toBeTruthy()
      done()
    }, 50)
  })

  it('should isComboHotKey allows bubble', function(done) {
    const main = document.createElement('div')
    const sub = document.createElement('div')
    const chunks = []
    main.addEventListener(
      'keydown',
      evt => {
        chunks.push('main enter')
        if (isComboHotKey('shift->a', evt)) {
          chunks.push('main match')
        }
      },
      true
    )
    sub.addEventListener('keydown', evt => {
      chunks.push('sub enter')
      if (isComboHotKey('shift->a', evt)) {
        chunks.push('sub match')
      }
    })
    main.appendChild(sub)
    document.body.appendChild(main)

    sub.dispatchEvent(new KeyboardEvent('keydown', parseHotkey('shift')))
    requestAnimationFrame(() => {
      sub.dispatchEvent(new KeyboardEvent('keydown', parseHotkey('a')))

      expect(main[EVENT_CACHE_KEY]).toBe(undefined)
      expect(sub[EVENT_CACHE_KEY].get('shift->a').triggerTimes).toBe(1)
      expect(chunks).toMatchInlineSnapshot(`
Array [
  "main enter",
  "sub enter",
  "main enter",
  "main match",
  "sub enter",
  "sub match",
]
`)
      requestAnimationFrame(() => {
        expect(sub[EVENT_CACHE_KEY].get('shift->a')).toBeUndefined()
        done()
      })
    })
  })
})
