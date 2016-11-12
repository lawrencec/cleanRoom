(function (root, factory) {
    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([''], function () {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return (root.cleanRoom = factory());
        });
    } else {
        // Browser globals
        root.cleanRoom = factory();
    }
}(this, function () {
    var cleanCookies = function(name) {
      if (!name) {
        document.cookie.split(';').forEach(function (cookie) {
          cleanCookies(cookie.split('=')[0]);
        });
      };
      var pathBits = location.pathname.split('/');
      var pathCurrent = ' path=';

      document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;';

      for (var i = 0; i < pathBits.length; i++) {
          pathCurrent += ((pathCurrent.substr(-1) != '/') ? '/' : '') + pathBits[i];
          document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;' + pathCurrent + ';';
      }
    };

    function cleanAll() {
      cleanCookies();
      cleanLocalStorage();
      cleanSessionStorage();
    }

    function cleanLocalStorage(name) {
      (name && name.length) ? localStorage.removeItem(name) : localStorage.clear();
    }

    function cleanSessionStorage(name) {
      (name && name.length) ? sessionStorage.removeItem(name) : sessionStorage.clear();
    }

    function getCookieList() {
      var cookies = [];
      if (document.cookie.length) {
        document.cookie.split(';').forEach(function (cookie) {
          cookies.push(cookie.split('=')[0].trim());
        });
      }
      return cookies;
    }

    function getStorageList(storage) {
      if (storage.length) {
        var storageItems = [];
        for(var i = 0, iLen = storage.length; i < iLen; i++) {
          storageItems.push(storage.key(i).trim());
        }
        return storageItems;
      }
      return [];
    }

    function getLocalStorageList() {
      return getStorageList(localStorage);
    }

    function getSessionStorageList() {
      return getStorageList(sessionStorage);
    }

    function snitch() {
      var cookies = [];
      var localStorageItems = [];
      var sessionStorageItems = [];
      var errorMessage = '\nTsk, Tsk! You\'re on the naughty list! Remember to clean up after yourself!';
      if (document.cookie != '' || localStorage.length || sessionStorage.length) {
        cookies = getCookieList();
        localStorageItems = getLocalStorageList();
        sessionStorageItems = getSessionStorageList();

        throw new Error([
            errorMessage,
            (cookies.length) ? "\n\nThese cookies were found littering:\n\t" + cookies.join("\n\t") : '',
            (localStorageItems.length) ? "\n\nThese localStorage items were found littering:\n\t" + localStorageItems.join("\n\t") : '',
            (sessionStorageItems.length) ? "\n\nThese sessionStorage items were found littering:\n\t" + sessionStorageItems.join("\n\t") : ''
          ].join('')
        );
      }
    }

    return {
      cleanAll: cleanAll,
      cleanCookies: cleanCookies,
      cleanLocalStorage: cleanLocalStorage,
      cleanSessionStorage: cleanSessionStorage,
      snitch: snitch
    };
}));
