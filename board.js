if (globalThis.isNaN && !globalThis['&isNaN']) {
  objDefProp(globalThis, '&isNaN', globalThis.isNaN);
  objDefProp(globalThis, 'isNaN', function isNaN(str) {
    try {
      return globalThis['&isNaN'](str);
    } catch (e) {
      console.warn(e);
      try {
        return globalThis['&isNaN'](String(str.description ?? str));
      } catch (e) {
        console.warn(e);
        return NaN;
      }
    }
  });
}