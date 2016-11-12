/*eslint-env browser */
'use strict';

(function() {
  var test = hugs(window.mocha);
  var assert = test.assert;
  var mock = test.mock;
  var spy = test.spy;
  var stub = test.stub;

  /*
  This function is from https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie/Simple_document.cookie_framework
  */
  var docCookies = {
    getItem: function (sKey) {
      if (!sKey) { return null; }
      return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
      var sExpires = "";
      if (vEnd) {
        switch (vEnd.constructor) {
          case Number:
            sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
            break;
          case String:
            sExpires = "; expires=" + vEnd;
            break;
          case Date:
            sExpires = "; expires=" + vEnd.toUTCString();
            break;
        }
      }
      document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
      return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
      if (!this.hasItem(sKey)) { return false; }
      document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
      return true;
    },
    hasItem: function (sKey) {
      if (!sKey) { return false; }
      return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: function () {
      var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
      for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
      return aKeys;
    }
  };

  /*
  This function is from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
  */
  function storageAvailable(type) {
    try {
      var storage = window[type],
        x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    }
    catch(e) {
      return false;
    }
  }

  test.afterEach(function() {
    docCookies.keys().forEach(function(cookieName) {
      docCookies.removeItem(cookieName);
    });
    if (storageAvailable('localStorage')) {
      localStorage.clear();
      assert.equal(localStorage.length, 0);
    }
    if (storageAvailable('sessionStorage')) {
      sessionStorage.clear();
      assert.equal(sessionStorage.length, 0);
    }
  });

  test(
    'cleans up cookie without path',
    function () {
      docCookies.setItem('whistleCookie', 'whileyouwork', 'Fri, 31 Dec 9999 23:59:59 GMT');
      assert.equal(document.cookie, 'whistleCookie=whileyouwork');

      cleanRoom.cleanCookies('whistleCookie');
      assert.equal(document.cookie, '');
    }
  );

  test(
    'cleans up cookie with path',
    function () {
      docCookies.setItem('whistleCookie', 'whileyouwork', 'Fri, 31 Dec 9999 23:59:59 GMT', '/');
      assert.equal(document.cookie, 'whistleCookie=whileyouwork');

      cleanRoom.cleanCookies('whistleCookie');
      assert.equal(document.cookie, '');
    }
  );

  test(
    'cleans up all cookies',
    function () {
      docCookies.setItem('whistleCookie', 'whileyouwork', 'Fri, 31 Dec 9999 23:59:59 GMT');
      docCookies.setItem('singCookie', 'whileyouwork', 'Fri, 31 Dec 9999 23:59:59 GMT');
      assert.equal(document.cookie, 'whistleCookie=whileyouwork; singCookie=whileyouwork');

      cleanRoom.cleanCookies();
      assert.equal(document.cookie, '');
    }
  );

  test(
    'snitches where there are littering cookies',
    function () {
      docCookies.setItem('whistleCookie', 'whileyouwork');
      docCookies.setItem('singCookie', 'whileyouwork');
      assert.equal(document.cookie, 'whistleCookie=whileyouwork; singCookie=whileyouwork');

      assert.throws(cleanRoom.snitch, '\nTsk, Tsk! You\'re on the naughty list! Remember to clean up after yourself!\n\nThese cookies were found littering:\n\twhistleCookie\n\tsingCookie');
    }
  );

  test(
    'does not snitch when there are no littering cookies',
    function () {
      assert.equal(document.cookie, '');

      assert.doesNotThrow(cleanRoom.snitch);
    }
  );

  if (storageAvailable('localStorage')) {
    test(
      'cleans up localStorage item',
      function () {
        localStorage.setItem('whistleLocalStorage', 'whileyouwork');
        localStorage.setItem('singLocalStorage', 'whileyouwork');
        assert.deepEqual(localStorage, {'whistleLocalStorage': 'whileyouwork', 'singLocalStorage': 'whileyouwork'});
        assert.equal(localStorage.length, 2);

        cleanRoom.cleanLocalStorage('whistleLocalStorage');
        assert.deepEqual(localStorage, {'singLocalStorage': 'whileyouwork'});
        assert.equal(localStorage.length, 1);
      }
    );

    test(
      'cleans up all localStorage items',
      function () {
        localStorage.setItem('whistleLocalStorage', 'whileyouwork');
        localStorage.setItem('singLocalStorage', 'whileyouwork');
        assert.deepEqual(localStorage, {'whistleLocalStorage': 'whileyouwork', 'singLocalStorage': 'whileyouwork'});
        assert.equal(localStorage.length, 2);

        cleanRoom.cleanLocalStorage();
        assert.deepEqual(localStorage, {});
        assert.equal(localStorage.length, 0);
      }
    );

    test(
      'snitches where there are littering localStorage items',
      function () {
        localStorage.setItem('whistleLocalStorage', 'whileyouwork');
        localStorage.setItem('singLocalStorage', 'whileyouwork');
        assert.deepEqual(localStorage, {'whistleLocalStorage': 'whileyouwork', 'singLocalStorage': 'whileyouwork'});
        assert.equal(localStorage.length, 2);

        assert.throws(cleanRoom.snitch, "\nTsk, Tsk! You're on the naughty list! Remember to clean up after yourself!\n\nThese localStorage items were found littering:\n\twhistleLocalStorage\n\tsingLocalStorage");
      }
    );

    test(
      'does not snitch when there are no littering localStorage items',
      function () {
        assert.equal(localStorage.length, 0);
        assert.doesNotThrow(cleanRoom.snitch);
      }
    );
  }

  if (storageAvailable('sessionStorage')) {
    test(
      'cleans up sessionStorage item',
      function () {
        sessionStorage.setItem('whistleSessionStorage', 'whileyouwork');
        sessionStorage.setItem('singSessionStorage', 'whileyouwork');
        assert.deepEqual(sessionStorage, {'whistleSessionStorage': 'whileyouwork', 'singSessionStorage': 'whileyouwork'});
        assert.equal(sessionStorage.length, 2);

        cleanRoom.cleanSessionStorage('whistleSessionStorage');
        assert.deepEqual(sessionStorage, {'singSessionStorage': 'whileyouwork'});
        assert.equal(sessionStorage.length, 1);
      }
    );

    test(
      'cleans up all sessionStorage items',
      function () {
        sessionStorage.setItem('whistleSessionStorage', 'whileyouwork');
        sessionStorage.setItem('singSessionStorage', 'whileyouwork');
        assert.deepEqual(sessionStorage, {'whistleSessionStorage': 'whileyouwork', 'singSessionStorage': 'whileyouwork'});
        assert.equal(sessionStorage.length, 2);

        cleanRoom.cleanSessionStorage();
        assert.deepEqual(sessionStorage, {});
        assert.equal(sessionStorage.length, 0);
      }
    );

    test(
      'snitches where there are littering sessionStorage items',
      function () {
        sessionStorage.setItem('whistleSessionStorage', 'whileyouwork');
        sessionStorage.setItem('singSessionStorage', 'whileyouwork');
        assert.deepEqual(sessionStorage, {'whistleSessionStorage': 'whileyouwork', 'singSessionStorage': 'whileyouwork'});
        assert.equal(sessionStorage.length, 2);

        assert.throws(cleanRoom.snitch, "\nTsk, Tsk! You're on the naughty list! Remember to clean up after yourself!\n\nThese sessionStorage items were found littering:\n\twhistleSessionStorage\n\tsingSessionStorage");
      }
    );

    test(
      'does not snitch when there are no littering sessionStorage items',
      function () {
        assert.equal(sessionStorage.length, 0);
        assert.doesNotThrow(cleanRoom.snitch);
      }
    );
  }

  test(
    'clears all items of every type',
    function () {
      docCookies.setItem('whistleCookie', 'whileyouwork');
      docCookies.setItem('singCookie', 'whileyouwork');
      assert.equal(document.cookie, 'whistleCookie=whileyouwork; singCookie=whileyouwork');

      localStorage.setItem('whistleLocalStorage', 'whileyouwork');
      localStorage.setItem('singLocalStorage', 'whileyouwork');
      assert.deepEqual(localStorage, {'whistleLocalStorage': 'whileyouwork', 'singLocalStorage': 'whileyouwork'});
      assert.equal(localStorage.length, 2);

      sessionStorage.setItem('whistleSessionStorage', 'whileyouwork');
      sessionStorage.setItem('singSessionStorage', 'whileyouwork');
      assert.deepEqual(sessionStorage, {'whistleSessionStorage': 'whileyouwork', 'singSessionStorage': 'whileyouwork'});
      assert.equal(sessionStorage.length, 2);

      cleanRoom.cleanAll();

      assert.equal(document.cookie, '');
      assert.deepEqual(localStorage, {});
      assert.equal(localStorage.length, 0);
      assert.deepEqual(sessionStorage, {});
      assert.equal(sessionStorage.length, 0);
    }
  );
})();
