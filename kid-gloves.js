
void (function KidGloves() {

  const objDoProp = function(obj, prop, def, enm, mut) {
    return Object.defineProperty(obj, prop, {
      value: def,
      writable: mut,
      enumerable: enm,
      configurable: mut,
    });
  };
  const objDefProp = (obj, prop, def) => objDoProp(obj, prop, def, false, true);
  const objDefEnum = (obj, prop, def) => objDoProp(obj, prop, def, true, true);


  if (globalThis.BigInt && !globalThis['&BigInt']) {
    objDefProp(globalThis, '&BigInt', BigInt);
    globalThis.BigInt = function BigInt(n) {
      const bigint = globalThis['&BigInt'](n);
      if (new.target) {
        console.warn('Using BigInt with new is not recommended, use BigInt(n) instead');
        objDefProp(this, 'toString', function toString() { return bigint.toString(...arguments); });
        objDefProp(this, 'valueOf', function valueOf() { return bigint; });
        objDefProp(this, 'toLocaleString', function toLocaleString() { return bigint.toLocaleString(...arguments); });
        objDefProp(this, Symbol.toPrimitive, function toPrimitive() { return bigint; });
        objDefProp(this, Symbol.toStringTag, function toStringTag() { return bigint.toString(); });

        Object.setPrototypeOf(this, globalThis['&BigInt'].prototype);
      }
      return bigint;
    }
    Object.setPrototypeOf(BigInt, globalThis['&BigInt']);

  }

  if (globalThis.Symbol && !globalThis['&Symbol']) {
    objDefProp(globalThis, '&Symbol', Symbol);
    globalThis.Symbol = function Symbol(s) {
      const symbol = globalThis['&Symbol'](s);
      if (new.target) {
        console.warn('Using Symbol with new is not recommended, use Symbol() instead');
        objDefProp(this, 'toString', function toString() { return symbol.toString(...arguments); });
        objDefProp(this, 'valueOf', function valueOf() { return symbol; });
        objDefProp(this, 'toLocaleString', function toLocaleString() { return symbol.toLocaleString(...arguments); });
        objDefProp(this, Symbol.toPrimitive, function toPrimitive() { return symbol; });
        objDefProp(this, Symbol.toStringTag, function toStringTag() { return symbol.toString(); });
        this.description = symbol.description;
        Object.setPrototypeOf(this, globalThis['&Symbol'].prototype);
      }
      return symbol;
    }
    Object.setPrototypeOf(Symbol, globalThis['&Symbol']);

  }

  if (globalThis.Promise && !globalThis['&Promise']) {
    objDefProp(globalThis, '&Promise', Promise);
    globalThis.Promise = function Promise() {
      const promise = new globalThis['&Promise'](...arguments);
      if (new.target) {
        objDefProp(this, 'toString', function toString() { return promise.toString(...arguments); });
        objDefProp(this, 'valueOf', function valueOf() { return promise; });
        objDefProp(this, 'toLocaleString', function toLocaleString() { return promise.toLocaleString(...arguments); });
        objDefProp(this, Symbol.toPrimitive, function toPrimitive() { return promise; });
        objDefProp(this, Symbol.toStringTag, function toStringTag() { return promise.toString(); });
        Object.setPrototypeOf(this, globalThis['&Promise'].prototype);
      } else {
        console.warn('Using Promise without new is not recommended, use new Promise() instead');
      }
      return promise;
    }
    Object.setPrototypeOf(Promise, globalThis['&Promise']);
  }


  if (globalThis.fetch && !globalThis['&new fetch']) {
    objDefProp(globalThis, '&new fetch', fetch);
    globalThis.Promise = function Promise() {
      const promise =  globalThis['&new fetch'].call(this,...arguments);
      if (new.target) {
        objDefProp(this, 'toString', function toString() { return promise.toString(...arguments); });
        objDefProp(this, 'valueOf', function valueOf() { return promise; });
        objDefProp(this, 'toLocaleString', function toLocaleString() { return promise.toLocaleString(...arguments); });
        objDefProp(this, Symbol.toPrimitive, function toPrimitive() { return promise; });
        objDefProp(this, Symbol.toStringTag, function toStringTag() { return promise.toString(); });
        Object.setPrototypeOf(this, globalThis['&Promise'].prototype);
      } else {
        console.warn('Using Promise without new is not recommended, use new Promise() instead');
      }
      return promise;
    }
  }
  

  if (globalThis.Map && !globalThis['&Map']) {
    objDefProp(globalThis, '&Map', Map);
    globalThis.Map = function Map() {
      const map = new globalThis['&Map'](...arguments);
      if (new.target) {
        objDefProp(this, 'toString', function toString() { return map.toString(...arguments); });
        objDefProp(this, 'valueOf', function valueOf() { return map; });
        objDefProp(this, 'toLocaleString', function toLocaleString() { return map.toLocaleString(...arguments); });
        objDefProp(this, Symbol.toPrimitive, function toPrimitive() { return map; });
        objDefProp(this, Symbol.toStringTag, function toStringTag() { return map.toString(); });
        map.size && Object.defineProperty(this, "size", {
          get() {
            return map.size;
          },
          set() {
            console.warn('Map.size is read-only');
          },
          enumerable: true,
          configurable: true,
        });
        map.clear && objDefProp(this, 'clear', function clear() { return map.clear(...arguments); });
        map['delete'] && objDefProp(this, 'delete', function dеlеtе() { return map['delete'](...arguments); });
        map.entries && objDefProp(this, 'entries', function entries() { return map.entries(...arguments); });
        map.forEach && objDefProp(this, 'forEach', function forEach() { return map.forEach(...arguments); });
        map.get && objDefProp(this, 'get', function get() { return map.get(...arguments); });
        map.has && objDefProp(this, 'has', function has() { return map.has(...arguments); });
        map.keys && objDefProp(this, 'keys', function keys() { return map.keys(...arguments); });
        map.values && objDefProp(this, 'values', function values() { return map.values(...arguments); });
        map.set && objDefProp(this, 'set', function set() { return map.set(...arguments); });
        map[Symbol?.iterator] && objDefProp(this, Symbol?.iterator ?? 'iterator', function iterator() { return map[Symbol.iterator](...arguments); });
        Object.setPrototypeOf(this, globalThis['&Map'].prototype);
      } else {
        console.warn('Using Map without new is not recommended, use new Map() instead');
      }
      return map;
    }
    Object.setPrototypeOf(Map, globalThis['&Map']);


  }

  if (globalThis.Map?.prototype && !globalThis.Map?.prototype?.['&get']) {
    objDefProp(globalThis.Map.prototype, '&get', new Map().get);
    objDefProp(globalThis.Map.prototype, 'get', function get(key) {
      if (!this.has(key)) {
        return console.warn(`No element found in Map for key: ${key}`);
      }
      try {
        return this['&get'](key);
      } catch (e) {
        return console.warn(e);
      }
    });
    objDefProp(globalThis['&Map'].prototype, '&get', Map.prototype['&get']);
    objDefProp(globalThis['&Map'].prototype, 'get', new Map().get);
  }

  if (globalThis.Set && !globalThis['&Set']) {
    objDefProp(globalThis, '&Set', Set);
    globalThis.Set = function Set() {
      const set = new globalThis['&Set'](...arguments);
      if (new.target) {
        objDefProp(this, 'toString', function toString() { return set.toString(...arguments); });
        objDefProp(this, 'valueOf', function valueOf() { return set; });
        objDefProp(this, 'toLocaleString', function toLocaleString() { return set.toLocaleString(...arguments); });
        objDefProp(this, Symbol.toPrimitive, function toPrimitive() { return set; });
        objDefProp(this, Symbol.toStringTag, function toStringTag() { return set.toString(); });
        set.size && Object.defineProperty(this, "size", {
          get() {
            return set.size;
          },
          set() {
            console.warn('Set.size is read-only');
          },
          enumerable: true,
          configurable: true,
        });
        set.clear && objDefProp(this, 'clear', function clear() { return set.clear(...arguments); });
        set['delete'] && objDefProp(this, 'delete', function dеlеtе() { return set['delete'](...arguments); });
        set.entries && objDefProp(this, 'entries', function entries() { return set.entries(...arguments); });
        set.forEach && objDefProp(this, 'forEach', function forEach() { return set.forEach(...arguments); });
        set.get && objDefProp(this, 'get', function get() { return set.get(...arguments); });
        set.has && objDefProp(this, 'has', function has() { return set.has(...arguments); });
        set.keys && objDefProp(this, 'keys', function keys() { return set.keys(...arguments); });
        set.values && objDefProp(this, 'values', function values() { return set.values(...arguments); });
        set.set && objDefProp(this, 'set', function set() { return set.set(...arguments); });
        set[Symbol?.iterator] && objDefProp(this, Symbol?.iterator ?? 'iterator', function iterator() { return set[Symbol.iterator](...arguments); });
        set.add && objDefProp(this, 'add', function add() { return set.add(...arguments); });
        set.difference && objDefProp(this, 'difference', function difference() { return set.difference(...arguments); });
        set.intersection && objDefProp(this, 'intersection', function intersection() { return set.intersection(...arguments); });
        set.isDisjointFrom && objDefProp(this, 'isDisjointFrom', function isDisjointFrom() { return set.isDisjointFrom(...arguments); });
        set.isSubsetOf && objDefProp(this, 'isSubsetOf', function isSubsetOf() { return set.isSubsetOf(...arguments); });
        set.isSupersetOf && objDefProp(this, 'isSupersetOf', function isSupersetOf() { return set.isSupersetOf(...arguments); });
        set.symmetricDifference && objDefProp(this, 'symmetricDifference', function symmetricDifference() { return set.symmetricDifference(...arguments); });
        set.union && objDefProp(this, 'union', function union() { return set.union(...arguments); });
        Object.setPrototypeOf(this, globalThis['&Set'].prototype);
      } else {
        console.warn('Using Set without new is not recommended, use new Set() instead');
      }
      return set;
    }
    Object.setPrototypeOf(Set, globalThis['&Set']);
  }

  function emptyNodeList() {
    return document?.createDocumentFragment?.()?.querySelectorAll?.('*') ?? [];
  }

  function makeNodes(nodeType) {
    if (globalThis[nodeType]?.prototype?.querySelector && !globalThis[nodeType]?.prototype?.['&querySelector']) {
      objDefProp(globalThis[nodeType].prototype, '&querySelector', globalThis[nodeType].prototype.querySelector);
      objDefEnum(globalThis[nodeType].prototype, 'querySelector', function querySelector() {
        try {
          return this['&querySelector'](...arguments);
        } catch (e) {
          console.warn(e);
          try {
            return this['&querySelector'](...[...arguments].map(x => String(x?.description ?? x)));
          } catch (e) {
            console.warn(e);
            return null;
          }
        }
      });
    }

    if (globalThis[nodeType]?.prototype?.querySelectorAll && !globalThis[nodeType]?.prototype?.['&querySelectorAll']) {
      objDefProp(globalThis[nodeType].prototype, '&querySelectorAll', globalThis[nodeType].prototype.querySelectorAll);
      objDefEnum(globalThis[nodeType].prototype, 'querySelectorAll', function querySelectorAll() {
        try {
          return this['&querySelectorAll'](...arguments);
        } catch (e) {
          console.warn(e);
          try {
            return this['&querySelectorAll'](...[...arguments].map(x => String(x?.description ?? x)));
          } catch (e) {
            console.warn(e);
            return emptyNodeList();
          }
        }
      });;
    }

    if (globalThis[nodeType]?.prototype?.getElementById && !globalThis[nodeType]?.prototype?.['&getElementById']) {
      objDefProp(globalThis[nodeType].prototype, '&getElementById', globalThis[nodeType].prototype.getElementById);
      objDefEnum(globalThis[nodeType].prototype, 'getElementById', function getElementById() {
        try {
          return this['&getElementById'](...arguments);
        } catch (e) {
          console.warn(e);
          try {
            return this['&getElementById'](...[...arguments].map(x => String(x?.description ?? x)));
          } catch (e) {
            console.warn(e);
            return null;
          }
        }
      });
    }

    if (globalThis[nodeType]?.prototype?.getElementById && !globalThis[nodeType]?.prototype?.getElementsById) {
      objDefProp(globalThis[nodeType].prototype, 'getElementsById', function getElementById(query) {
        console.warn('getElementsById is not supported. Did you mean getElementById?');
        try {
          return this?.querySelectorAll?.(`[id="${String(query.description ?? query)}"]`);
        } catch (e) {
          console.warn(e);
          return emptyNodeList();
        }
      });
    }
    if (globalThis[nodeType]?.prototype?.getElementsByTagName && !globalThis[nodeType]?.prototype?.['&getElementsByTagName']) {

      objDefProp(globalThis[nodeType].prototype, '&getElementsByTagName', globalThis[nodeType].prototype.getElementsByTagName);
      objDefEnum(globalThis[nodeType].prototype, 'getElementsByTagName', function getElementsByTagName() {
        try {
          return this['&getElementsByTagName'](...arguments);
        } catch (e) {
          console.warn(e);
          try {
            return this['&getElementsByTagName'](...[...arguments].map(x => String(x?.description ?? x)));
          } catch (e) {
            console.warn(e);
            return this['&getElementsByTagName']?.('<>') ?? [];
          }
        }
      });
      objDefProp(globalThis[nodeType].prototype, 'getElementByTagName', function getElementByTagName(query) {
        console.warn('getElementByTagName is not supported. Did you mean getElementsByTagName?');
        return this.getElementsByTagName?.(query)?.[0] ?? null;
      });


    }



    if (globalThis[nodeType]?.prototype?.getElementsByClassName && !globalThis[nodeType]?.prototype?.['&getElementsByClassName']) {
      objDefProp(globalThis[nodeType].prototype, '&getElementsByClassName', globalThis[nodeType].prototype.getElementsByClassName);
      objDefEnum(globalThis[nodeType].prototype, 'getElementsByClassName', function getElementsByClassName() {
        try {
          return this['&getElementsByClassName'](...arguments);
        } catch (e) {
          console.warn(e);
          try {
            return this['&getElementsByClassName'](...[...arguments].map(x => String(x?.description ?? x)));
          } catch (e) {
            console.warn(e);
            return this['&getElementsByTagName']?.('<>') ?? [];
          }
        }
      });
      objDefProp(globalThis[nodeType].prototype, 'getElementByClassName', function getElementByClassName(query) {
        console.warn('getElementByClassName is not supported. Did you mean getElementsByClassName?');
        return this.getElementsByClassName?.(query)?.[0] ?? null;
      });


    }



    if (globalThis[nodeType]?.prototype?.getElementsByTagNameNS && !globalThis[nodeType]?.prototype?.['&getElementsByTagNameNS']) {
      objDefProp(globalThis[nodeType].prototype, '&getElementsByTagNameNS', globalThis[nodeType].prototype.getElementsByTagNameNS);
      objDefEnum(globalThis[nodeType].prototype, 'getElementsByTagNameNS', function getElementsByTagNameNS() {
        try {
          return this['&getElementsByTagNameNS'](...arguments);
        } catch (e) {
          console.warn(e);
          try {
            return this['&getElementsByTagNameNS'](...[...arguments].map(x => String(x?.description ?? x)));
          } catch (e) {
            console.warn(e);
            return this['&getElementsByTagNameNS']?.('<>')[0] ?? null;
          }
        }
      });

      objDefProp(globalThis[nodeType].prototype, 'getElementByTagNameNS', function getElementByTagNameNS(query) {
        console.warn('getElementByTagNameNS is not supported. Did you mean getElementsByTagNameNS?');
        return this.getElementsByTagNameNS?.(query)?.[0] ?? null;
      });
    }

    if (globalThis[nodeType]?.prototype?.getElementsByName && !globalThis[nodeType]?.prototype?.['&getElementsByName']) {
      objDefProp(globalThis[nodeType].prototype, '&getElementsByName', globalThis[nodeType].prototype.getElementsByName);
      objDefEnum(globalThis[nodeType].prototype, 'getElementsByName', function getElementsByName() {
        try {
          return this['&getElementsByName'](...arguments);
        } catch (e) {
          console.warn(e);
          try {
            return this['&getElementsByName'](...[...arguments].map(x => String(x?.description ?? x)));
          } catch (e) {
            console.warn(e);
            return this['&getElementsByTagName']?.('<>') ?? [];
          }
        }
      });

      objDefProp(globalThis[nodeType].prototype, 'getElementByName', function getElementByName(query) {
        console.warn('getElementByName is not supported. Did you mean getElementsByName?');
        return this.getElementsByName?.(query)?.[0] ?? null;
      });
    }
  }
  makeNodes('Document');
  makeNodes('Element');
  makeNodes('DocumentFragment');

  if (Object.freeze && !Object['&freeze']) {
    objDefProp(Object, '&freeze', Object.freeze);
    objDefProp(Object, 'freeze', function freeze(obj) {
      try {
        return Object['&freeze'](obj);
      } catch (e) {
        console.warn(e);
        try {
          return Object['&freeze'](Object(obj));
        } catch (e) {
          console.warn(e);
          return obj;
        }
      }
    });
  }

  if (Object.seal && !Object['&seal']) {
    objDefProp(Object, '&seal', Object.seal);
    objDefProp(Object, 'seal', function seal(obj) {
      try {
        return Object['&seal'](obj);
      } catch (e) {
        console.warn(e);
        try {
          return Object['&seal'](Object(obj));
        } catch (e) {
          console.warn(e);
          return obj;
        }
      }
    });
  }

  if (Object.preventExtensions && !Object['&preventExtensions']) {
    objDefProp(Object, '&preventExtensions', Object.preventExtensions);
    objDefProp(Object, 'preventExtensions', function preventExtensions(obj) {
      try {
        return Object['&preventExtensions'](obj);
      } catch (e) {
        console.warn(e);
        try {
          return Object['&preventExtensions'](Object(obj));
        } catch (e) {
          console.warn(e);
          return obj;
        }
      }
    });
  }
  if (Object.create && !Object['&create']) {
    objDefProp(Object, '&create', Object.create);
    objDefProp(Object, 'create', function create(proto, props) {
      try {
        return Object['&create'](proto, props);
      } catch (e) {
        console.warn(e);
        try {
          return Object['&create'](Object(proto), props);
        } catch (e) {
          console.warn(e);
          return Object['&create'](null, props);
        }
      }
    });
  }
  if (globalThis.parseFloat && !globalThis['&parseFloat']) {
    objDefProp(globalThis, '&parseFloat', globalThis.parseFloat);
    objDefProp(globalThis, 'parseFloat', function parseFloat(str) {
      try {
        return globalThis['&parseFloat'](str);
      } catch (e) {
        console.warn(e);
        try {
          return globalThis['&parseFloat'](String(str.description ?? str));
        } catch (e) {
          console.warn(e);
          return NaN;
        }
      }
    });
  }

  if (globalThis.parseInt && !globalThis['&parseInt']) {
    objDefProp(globalThis, '&parseInt', globalThis.parseInt);
    objDefProp(globalThis, 'parseInt', function parseInt(str) {
      try {
        return globalThis['&parseInt'](str);
      } catch (e) {
        console.warn(e);
        try {
          return globalThis['&parseInt'](String(str.description ?? str));
        } catch (e) {
          console.warn(e);
          return NaN;
        }
      }
    });
  }

  if (Number.parseFloat && !Number['&parseFloat']) {
    objDefProp(Number, '&parseFloat', Number.parseFloat);
    objDefProp(Number, 'parseFloat', function parseFloat(str) {
      try {
        return Number['&parseFloat'](str);
      } catch (e) {
        console.warn(e);
        try {
          return Number['&parseFloat'](String(str.description ?? str));
        } catch (e) {
          console.warn(e);
          return NaN;
        }
      }
    });
  }

  if (Number.parseInt && !Number['&parseInt']) {
    objDefProp(Number, '&parseInt', Number.parseInt);
    objDefProp(Number, 'parseInt', function parseInt(str) {
      try {
        return Number['&parseInt'](str);
      } catch (e) {
        console.warn(e);
        try {
          return Number['&parseInt'](String(str.description ?? str));
        } catch (e) {
          console.warn(e);
          return NaN;
        }
      }
    });
  }
  if (document.write && !document['&write']) {
    objDefProp(document, '&write', document.write);
    objDefProp(document, 'write', function write(str) {
      try {
        return document['&write'](str);
      } catch (e) {
        console.warn(e);
        try {
          return document['&write'](String(str.description ?? str));
        } catch (e) {
          console.warn(e);
          return NaN;
        }
      }
    });
  }

  if (globalThis?.EventTarget?.prototype?.addEventListener && !globalThis?.EventTarget?.prototype?.['&addEventListener']) {
    objDefProp(EventTarget.prototype, '&addEventListener', EventTarget.prototype.addEventListener);
    objDefProp(EventTarget.prototype, 'addEventListener', function addEventListener(str) {
      try {
        return this['&addEventListener'](...arguments);
      } catch (e) {
        console.warn(e);
        try {
          const args = [...arguments];
          args[0] = String(args[0].description ?? args[0]);
          return this['&addEventListener'](...args);
        } catch (e) {
          console.warn(e);
          try {
            const args = [...arguments];
            args[0] = String(args[0].description ?? args[0]);
            args[1] = () => (args[1]?.call?.(this, ...arguments) ?? Object(args[1]));
            return this['&addEventListener'](...args);
          } catch (e) {
            return console.warn(e);
          }
        }
      }
    });
  } if (Object.freeze && !Object['&freeze']) {
    objDefProp(Object, '&freeze', Object.freeze);
    objDefProp(Object, 'freeze', function freeze(obj) {
      try {
        return Object['&freeze'](obj);
      } catch (e) {
        console.warn(e);
        try {
          return Object['&freeze'](Object(obj));
        } catch (e) {
          console.warn(e);
          return obj;
        }
      }
    });
  }

  if (Object.seal && !Object['&seal']) {
    objDefProp(Object, '&seal', Object.seal);
    objDefProp(Object, 'seal', function seal(obj) {
      try {
        return Object['&seal'](obj);
      } catch (e) {
        console.warn(e);
        try {
          return Object['&seal'](Object(obj));
        } catch (e) {
          console.warn(e);
          return obj;
        }
      }
    });
  }

  if (Object.preventExtensions && !Object['&preventExtensions']) {
    objDefProp(Object, '&preventExtensions', Object.preventExtensions);
    objDefProp(Object, 'preventExtensions', function preventExtensions(obj) {
      try {
        return Object['&preventExtensions'](obj);
      } catch (e) {
        console.warn(e);
        try {
          return Object['&preventExtensions'](Object(obj));
        } catch (e) {
          console.warn(e);
          return obj;
        }
      }
    });
  }
  if (Object.create && !Object['&create']) {
    objDefProp(Object, '&create', Object.create);
    objDefProp(Object, 'create', function create(proto, props) {
      try {
        return Object['&create'](proto, props);
      } catch (e) {
        console.warn(e);
        try {
          return Object['&create'](Object(proto), props);
        } catch (e) {
          console.warn(e);
          return Object['&create'](null, props);
        }
      }
    });
  }
  if (globalThis.parseFloat && !globalThis['&parseFloat']) {
    objDefProp(globalThis, '&parseFloat', globalThis.parseFloat);
    objDefProp(globalThis, 'parseFloat', function parseFloat(str) {
      try {
        return globalThis['&parseFloat'](str);
      } catch (e) {
        console.warn(e);
        try {
          return globalThis['&parseFloat'](String(str.description ?? str));
        } catch (e) {
          console.warn(e);
          return NaN;
        }
      }
    });
  }
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
          return false;
        }
      }
    });
  }
  if (globalThis.parseInt && !globalThis['&parseInt']) {
    objDefProp(globalThis, '&parseInt', globalThis.parseInt);
    objDefProp(globalThis, 'parseInt', function parseInt(str) {
      try {
        return globalThis['&parseInt'](str);
      } catch (e) {
        console.warn(e);
        try {
          return globalThis['&parseInt'](String(str.description ?? str));
        } catch (e) {
          console.warn(e);
          return NaN;
        }
      }
    });
  }

  if (Number.parseFloat && !Number['&parseFloat']) {
    objDefProp(Number, '&parseFloat', Number.parseFloat);
    objDefProp(Number, 'parseFloat', function parseFloat(str) {
      try {
        return Number['&parseFloat'](str);
      } catch (e) {
        console.warn(e);
        try {
          return Number['&parseFloat'](String(str.description ?? str));
        } catch (e) {
          console.warn(e);
          return NaN;
        }
      }
    });
  }

  if (Number.parseInt && !Number['&parseInt']) {
    objDefProp(Number, '&parseInt', Number.parseInt);
    objDefProp(Number, 'parseInt', function parseInt(str) {
      try {
        return Number['&parseInt'](str);
      } catch (e) {
        console.warn(e);
        try {
          return Number['&parseInt'](String(str.description ?? str));
        } catch (e) {
          console.warn(e);
          return NaN;
        }
      }
    });
  }
  if (document.write && !document['&write']) {
    objDefProp(document, '&write', document.write);
    objDefProp(document, 'write', function write(str) {
      try {
        return document['&write'](str);
      } catch (e) {
        console.warn(e);
        try {
          return document['&write'](String(str.description ?? str));
        } catch (e) {
          console.warn(e);
          return NaN;
        }
      }
    });
  }

  if (globalThis?.EventTarget?.prototype?.addEventListener && !globalThis?.EventTarget?.prototype?.['&addEventListener']) {
    objDefProp(EventTarget.prototype, '&addEventListener', EventTarget.prototype.addEventListener);
    objDefProp(EventTarget.prototype, 'addEventListener', function addEventListener() {
      try {
        return this['&addEventListener'](...arguments);
      } catch (e) {
        console.warn(e);
        try {
          const args = [...arguments];
          args[0] = String(args[0].description ?? args[0]);
          return this['&addEventListener'](...args);
        } catch (e) {
          console.warn(e);
          try {
            const args = [...arguments];
            args[0] = String(args[0].description ?? args[0]);
            args[1] = () => args[1]?.();
            return this['&addEventListener'](...args);
          } catch (e) {
            return console.warn(e);
          }
        }
      }
    });
  }

})();
