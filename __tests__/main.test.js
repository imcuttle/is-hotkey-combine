import isComboHotKey, {splitHotKey, parseHotkey} from '../index';

describe('spec', function() {
  it('should splitHotKey', function() {
    expect(splitHotKey('shift*2')).toMatchInlineSnapshot(`
            Array [
              "shift",
              "shift",
            ]
        `);
    expect(splitHotKey('shift->shift')).toMatchInlineSnapshot(`
            Array [
              "shift",
              "shift",
            ]
        `);
    expect(splitHotKey('shift*2->shift')).toMatchInlineSnapshot(`
            Array [
              "shift",
              "shift",
              "shift",
            ]
        `);

    expect(splitHotKey('shift->cmd*2')).toMatchInlineSnapshot(`
            Array [
              "shift",
              "cmd",
              "cmd",
            ]
        `);

    expect(splitHotKey('shift+a->cmd+a*2')).toMatchInlineSnapshot(`
            Array [
              "shift+a",
              "cmd+a",
              "cmd+a",
            ]
        `);
  });

  it('should isComboHotKey', function() {
    expect(isComboHotKey('shift+*', new KeyboardEvent('keydown', parseHotkey('shift+*')))).toBeTruthy();

    expect(isComboHotKey('shift+**2', new KeyboardEvent('keydown', parseHotkey('shift+*')))).toBeFalsy();
    expect(isComboHotKey('shift+**2', new KeyboardEvent('keydown', parseHotkey('shift+*')))).toBeTruthy();

    // again
    expect(isComboHotKey('shift+**2', new KeyboardEvent('keydown', parseHotkey('shift+*')))).toBeFalsy();
    expect(isComboHotKey('shift+**2', new KeyboardEvent('keydown', parseHotkey('shift+*')))).toBeTruthy();
  });

  it('should isComboHotKey different', function() {
    expect(isComboHotKey('shift->a', new KeyboardEvent('keydown', parseHotkey('shift')))).toBeFalsy();
    expect(isComboHotKey('shift->a', new KeyboardEvent('keydown', parseHotkey('a')))).toBeTruthy();

    expect(isComboHotKey('shift->a', new KeyboardEvent('keydown', parseHotkey('shift')))).toBeFalsy();
    expect(isComboHotKey('shift->a', new KeyboardEvent('keydown', parseHotkey('shift')))).toBeFalsy();
    expect(isComboHotKey('shift->a', new KeyboardEvent('keydown', parseHotkey('a')))).toBeTruthy();

    expect(isComboHotKey(['shift', 'a'], new KeyboardEvent('keydown', parseHotkey('shift')))).toBeFalsy();
    expect(isComboHotKey('shift->a', new KeyboardEvent('keydown', parseHotkey('a')))).toBeTruthy();
  });

  it('should isComboHotKey timeout & case insensitive', function(done) {
    expect(isComboHotKey('shift->A', new KeyboardEvent('keydown', parseHotkey('shift')))).toBeFalsy();
    setTimeout(() => {
      expect(
        isComboHotKey('shift->a', new KeyboardEvent('keydown', parseHotkey('a')), {
          duration: 1
        })
      ).toBeFalsy();
      done();
    }, 2);
  });

  it('should isComboHotKey async', function(done) {
    expect(isComboHotKey('shift->A', new KeyboardEvent('keydown', parseHotkey('shift')))).toBeFalsy();
    setTimeout(() => {
      expect(isComboHotKey('shift->a', new KeyboardEvent('keydown', parseHotkey('a')))).toBeTruthy();
      done();
    }, 50);
  });
});
