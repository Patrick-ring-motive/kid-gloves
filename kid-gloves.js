if (!globalThis.namespaces?.['kid-gloves']) {
  void (function KidGloves() {
    const q = (varFn) => {
      try {
        return varFn?.();
      } catch (e) {
        if (e.name != 'ReferenceError') {
          throw e;
        }
      }
    }

    const globalObject = q(() => globalThis) // works in most modern runtimes
      ?? q(() => self) // also works in most modern runtimes
      ?? q(() => global) // fallback for older nodejs
      ?? q(() => window) // fallback for older browsers
      ?? this ?? {}; // fallbacks for edge cases.

    for (let x of ['globalThis', 'self', 'global']) {
      globalObject[x] = globalObject;
    }
    self.q = q;

    self.newQ = (...args) => {
      const fn = args?.shift?.();
      return fn && new fn(...args);
    };
    globalThis.objDoProp = function(obj, prop, def, enm, mut) {
      return Object.defineProperty(obj, prop, {
        value: def,
        writable: mut,
        enumerable: enm,
        configurable: mut,
      });
    };
    globalThis.objDefProp = (obj, prop, def) => objDoProp(obj, prop, def, false, true);
    globalThis.objDefEnum = (obj, prop, def) => objDoProp(obj, prop, def, true, true);
    globalThis.objFrzProp = (obj, prop, def) => objDoProp(obj, prop, def, false, false);
    globalThis.objFrzEnum = (obj, prop, def) => objDoProp(obj, prop, def, true, false);
    globalThis.objectNames = (x) => Object.getOwnPropertyNames(x);
    globalThis.objectSymbols = function() {
      return Object.getOwnPropertySymbols(...arguments);
    };
    globalThis.objDefProps = function objDefProps(obj, props = {}) {
      for (let prop in props) {
        objDefProp(obj, prop, props[prop]);
      }
      return obj;
    };
    globalThis.objGetProto = function() {
      return Object.getPrototypeOf(...arguments);
    };
    globalThis.objSetProto = function() {
      return Object.setPrototypeOf(...arguments);
    };

    globalThis.create = (proto) => Object.create(proto);
    function assignAll(target, src) {
      let excepts = ["prototype", "constructor", "__proto__"];
      let enums = [];
      let source = src;
      while (source) {
        for (let x in source) {
          try {
            if (excepts.includes(x)) {
              continue;
            }
            objDefEnum(target, x, source[x]);
            enums.push(x);
          } catch (e) {
            continue;
          }
        }
        for (let key of objectNames(source)) {
          try {
            if (enums.includes(key) || excepts.includes(key)) {
              continue;
            }
            objDefProp(target, key, source[key]);
          } catch {
            continue;
          }
        }
        for (let key of objectSymbols(source)) {
          try {
            if (enums.includes(key) || excepts.includes(key)) {
              continue;
            }
            objDefProp(target, key, source[key]);
          } catch {
            continue;
          }
        }
        if (source.entries && source.get && source.set) {
          try {
            for (let [key, value] of source.entries()) {
              try {
                target.set(key, value);
              } catch (e) {
                continue;
              }
            }
          } catch (e) { }
        }
        if (source.add && source.keys) {
          try {
            for (let key of source.keys()) {
              try {
                target.add(key);
              } catch {
                continue;
              }
            }
          } catch { }
        }
        source = objGetProto(source);
      }
      return target;
    }
    function assignProto(target, src) {
      const proto = src?.prototype ?? Object(src);
      try {
        objDefProp(target, 'prototype', proto);
      } catch {
        try {
          target.prototype = proto;
        } catch { }
        if (target.prototype != proto) {
          assignAll(target.prototype, proto);
        }
      }
    }
    Object.defineProperty(globalThis, "arguments", {
      get() {
        try {
          throw new Error('Attempting to retrieve arguments in the wrong context');
        } catch (e) {
          console.warn(e);
        }
        return (function args() { return arguments })();
      },
      set(newValue) {
        try {
          throw new Error('Attempting to set arguments in the wrong context');
        } catch (e) {
          console.warn(e);
        }
      },
      enumerable: false,
      configurable: true,
    });

    Object.defineProperty(globalThis, "of", {
      get() {
        try {
          throw new Error('Attempting to call "of" in the wrong context');
        } catch (e) {
          console.warn(e);
        }
        return _ => _;
      },
      set(newValue) {
      },
      enumerable: false,
      configurable: true,
    });

    Object.defineProperty(globalThis, "from", {
      get() {
        try {
          throw new Error('Attempting to call "from" in the wrong context');
        } catch (e) {
          console.warn(e);
        }
        return _ => _;
      },
      set(newValue) {
      },
      enumerable: false,
      configurable: true,
    });
    if (globalThis.BigInt && !globalThis['&BigInt']) {
      objDefProp(globalThis, '&BigInt', BigInt);
      globalThis.BigInt = function BigInt(n) {
        const bigint = globalThis['&BigInt'](n);
        if (new.target) {
          try {
            throw new Error('Using BigInt with new is not recommended, use BigInt(n) instead');
          } catch (e) {
            console.warn(e, this, new.target, ...arguments);
          }
          objDefProp(this, 'toString', function toString() { return bigint.toString(...arguments); });
          objDefProp(this, 'valueOf', function valueOf() { return bigint; });
          objDefProp(this, 'toLocaleString', function toLocaleString() { return bigint.toLocaleString(...arguments); });
          objDefProp(this, Symbol.toPrimitive, function toPrimitive() { return bigint; });
          objDefProp(this, Symbol.toStringTag, function toStringTag() { return bigint.toString(); });

          Object.setPrototypeOf(this, globalThis['&BigInt'].prototype);
        }
        return bigint;
      }
      assignProto(BigInt, globalThis['&BigInt']);
      Object.setPrototypeOf(BigInt, globalThis['&BigInt']);

    }

    if (globalThis.Symbol && !globalThis['&Symbol']) {
      objDefProp(globalThis, '&Symbol', Symbol);
      globalThis.Symbol = function Symbol(s) {
        const symbol = globalThis['&Symbol'](s);
        if (new.target) {
          try {
            throw new Error('Using Symbol with new is not recommended, use Symbol() instead');
          } catch (e) {
            console.warn(e, this, new.target, ...arguments);
          }
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
      assignProto(Symbol, globalThis['&Symbol']);
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
          try {
            throw new Error('Using Promise without new is not recommended, use new Promise() instead');
          } catch (e) {
            console.warn(e, this, new.target, ...arguments);
          }
        }
        return promise;
      }
      assignProto(Promise, globalThis['&Promise']);
      Object.setPrototypeOf(Promise, globalThis['&Promise']);
    }

    if (globalThis.RegExp && !globalThis['&RegExp']) {
      objDefProp(globalThis, '&RegExp', RegExp);
      globalThis.RegExp = function RegExp() {
        let rex;
        try {
          if (new.target) {
            rex = new (globalThis['&RegExp'])(...arguments);
            objDefProp(this, 'toString', function toString() { return rex.toString(...arguments); });
            objDefProp(this, 'valueOf', function valueOf() { return rex; });
            objDefProp(this, 'toLocaleString', function toLocaleString() { return rex.toLocaleString(...arguments); });
            objDefProp(this, Symbol.toPrimitive, function toPrimitive() { return rex; });
            objDefProp(this, Symbol.toStringTag, function toStringTag() { return rex.toString(); });
            objDefProp(this, 'hasOwnProperty', function hasOwnProperty() { return rex.hasOwnProperty(...arguments); });
            objDefProp(this, 'isPrototypeOf', function isPrototypeOf() { return rex.isPrototypeOf(...arguments); });
            objDefProp(this, 'propertyIsEnumerable', function propertyIsEnumerable() { return rex.propertyIsEnumerable(...arguments); });

            for (let x of ['dotAll', 'flags', 'global', 'hasIndicies', 'ignoreCase', 'lastIndex', 'multiline', 'source', 'sticky', 'unicode', 'unicodeSets']) {
              rex.size && Object.defineProperty(this, x, {
                get() {
                  return rex[x];
                },
                set(val) {
                  rex[x] = val;
                },
                enumerable: true,
                configurable: true,
              });
            }
            rex.compile && objDefProp(this, 'compile', function compile() { return rex.compile(...arguments); });
            rex.exec && objDefProp(this, 'exec', function exec() { return rex.exec(...arguments); });
            rex.test && objDefProp(this, 'test', function test() { return rex.test(...arguments); });
            rex.clear && objDefProp(this, 'clear', function clear() { return rex.clear(...arguments); });
            rex['delete'] && objDefProp(this, 'delete', function dеlеtе() { return rex['delete'](...arguments); });
            rex.entries && objDefProp(this, 'entries', function entries() { return rex.entries(...arguments); });
            rex.forEach && objDefProp(this, 'forEach', function forEach() { return rex.forEach(...arguments); });
            rex.get && objDefProp(this, 'get', function get() { return rex.get(...arguments); });
            rex.has && objDefProp(this, 'has', function has() { return rex.has(...arguments); });
            rex.keys && objDefProp(this, 'keys', function keys() { return rex.keys(...arguments); });
            rex.values && objDefProp(this, 'values', function values() { return rex.values(...arguments); });
            rex.set && objDefProp(this, 'set', function set() { return rex.set(...arguments); });
            rex[Symbol?.iterator] && objDefProp(this, Symbol?.iterator ?? 'iterator', function iterator() { return rex[Symbol.iterator](...arguments); });
            rex[Symbol?.match] && objDefProp(this, Symbol?.match ?? 'match', function match() { return rex[Symbol.match](...arguments); });
            rex[Symbol?.matchAll] && objDefProp(this, Symbol?.matchAll ?? 'matchAll', function matchAll() { return rex[Symbol.matchAll](...arguments); });
            rex[Symbol?.replace] && objDefProp(this, Symbol?.replace ?? 'replace', function replace() { return rex[Symbol.replace](...arguments); });
            rex[Symbol?.replaceAll] && objDefProp(this, Symbol?.replaceAll ?? 'replaceAll', function replaceAll() { return rex[Symbol.replaceAll](...arguments); });
            rex[Symbol?.search] && objDefProp(this, Symbol?.search ?? 'search', function search() { return rex[Symbol.search](...arguments); });
            rex[Symbol?.split] && objDefProp(this, Symbol?.split ?? 'split', function split() { return rex[Symbol.split](...arguments); });

            Object.setPrototypeOf(this, globalThis['&RegExp'].prototype);
          } else {
            rex = (globalThis['&RegExp'])(...arguments);
          }
        } catch (e) {
          console.warn(e, ...arguments);
          rex = /$RegExp^/;
        }
        return rex;
      }
      assignProto(RegExp, globalThis['&RegExp']);
      Object.setPrototypeOf(RegExp, globalThis['&RegExp']);
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
      assignProto(Map, globalThis['&Map']);
      Object.setPrototypeOf(Map, globalThis['&Map']);


    }

    if (globalThis.Map?.prototype && !globalThis.Map?.prototype?.['&get']) {
      objDefProp(globalThis.Map.prototype, '&get', new Map().get);
      objDefProp(globalThis.Map.prototype, 'get', function get(key) {
        /*if (!this.has(key)) {
          return console.warn(`No element found in Map for key: ${key}`);
        }*/
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
      assignProto(Set, globalThis['&Set']);
      Object.setPrototypeOf(Set, globalThis['&Set']);
    }

    function emptyNodeList() {
      return document?.createDocumentFragment?.()?.querySelectorAll?.('*') ?? [];
    }

    function makeNodes(nodeType) {
      if (globalThis[nodeType]?.prototype?.querySelector && !globalThis[nodeType]?.prototype?.['&querySelector']) {
        objDefProp(globalThis[nodeType].prototype, '&querySelector', globalThis[nodeType].prototype.querySelector);
        objDefEnum(globalThis[nodeType].prototype, 'querySelector', function querySelector() {
          const nul = document.createElement('null');
          const all = newQ(Document)?.all ?? Object(false)
          Object.getOwnPropertyNames(nul).forEach(x => {
            if (typeof nul[x] == 'function') objDefProp(all, x, function() {
              return nul[x](...arguments);
            });
          });
          Object.getOwnPropertyNames(Element.prototype).forEach(x => {
            if (typeof nul[x] == 'function') objDefProp(all, x, function() {
              return nul[x](...arguments);
            });
          });
          Object.getOwnPropertyNames(Node.prototype).forEach(x => {
            if (typeof nul[x] == 'function') objDefProp(all, x, function() {
              return nul[x](...arguments);
            });
          });
          const Null = Object.setPrototypeOf(all, nul);
          objDefProp(Null, 'valueOf', () => null);
          objDefProp(Null, 'toString', () => '');
          objDefProp(Null, 'toLocaleString', () => '');
          objDefProp(Null, Symbol.toPrimitive, () => null);
          objDefProp(Null, Symbol.toStringTag, () => '');
          try {
            return this['&querySelector'](...arguments) ?? Null;
          } catch (e) {
            console.warn(e);
            try {
              return this['&querySelector'](...[...arguments].map(x => String(x?.description ?? x))) ?? Null;
            } catch (e) {
              console.warn(e);
              return Null;
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
            console.warn(e,this,...arguments);
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
          const nul = document.createElement('null');
          const all = newQ(Document)?.all ?? Object(false)
          Object.getOwnPropertyNames(nul).forEach(x => {
            if (typeof nul[x] == 'function') objDefProp(all, x, function() {
              return nul[x](...arguments);
            });
          });
          Object.getOwnPropertyNames(Element.prototype).forEach(x => {
            if (typeof nul[x] == 'function') objDefProp(all, x, function() {
              return nul[x](...arguments);
            });
          });
          Object.getOwnPropertyNames(Node.prototype).forEach(x => {
            if (typeof nul[x] == 'function') objDefProp(all, x, function() {
              return nul[x](...arguments);
            });
          });
          const Null = Object.setPrototypeOf(all, nul);
          objDefProp(Null, 'valueOf', () => null);
          objDefProp(Null, 'toString', () => '');
          objDefProp(Null, 'toLocaleString', () => '');
          objDefProp(Null, Symbol.toPrimitive, () => null);
          objDefProp(Null, Symbol.toStringTag, () => '');
          try {
            return this['&getElementById'](...arguments) ?? Null;
          } catch (e) {
            console.warn(e);
            try {
              return this['&getElementById'](...[...arguments].map(x => String(x?.description ?? x))) ?? Null;
            } catch (e) {
              console.warn(e);
              return Null;
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
          return this.getElementsByTagName?.(query)?.[0] ?? this.querySelector(query);
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
          return this.getElementsByClassName?.(query)?.[0] ?? this.querySelector(`.${query}`);
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
      }
      if (globalThis[nodeType]?.prototype?.createElement && !globalThis[nodeType]?.prototype?.['&createElement']) {
        objDefProp(globalThis[nodeType].prototype, '&createElement', globalThis[nodeType].prototype.createElement);
        objDefEnum(globalThis[nodeType].prototype, 'createElement', function createElement() {
          try {
            return this['&createElement'](...arguments);
          } catch (e) {
            console.warn(e, ...arguments);
            return this['&createElement'](e?.name ?? 'Error');
          }
        });
      }
      objDefProp(globalThis[nodeType].prototype, 'getElementByName', function getElementByName(query) {
        console.warn('getElementByName is not supported. Did you mean getElementsByName?');
        return this.getElementsByName?.(query)?.[0] ?? null;
      });





      if (globalThis[nodeType]?.prototype?.createElementNS && !globalThis[nodeType]?.prototype?.['&createElementNS']) {
        objDefProp(globalThis[nodeType].prototype, '&createElementNS', globalThis[nodeType].prototype.createElementNS);
        objDefEnum(globalThis[nodeType].prototype, 'createElementNS', function createElementNS() {
          try {
            return this['&createElementNS'](...arguments);
          } catch (e) {
            try {
              console.warn(e, ...arguments);
              return this['&createElement'](...arguments);
            } catch (e) {
              console.warn(e, ...arguments);
              return this['&createElement'](e?.name ?? 'Error');
            }
          }
        });
      }
      objDefProp(globalThis[nodeType].prototype, 'getElementByName', function getElementByName(query) {
        console.warn('getElementByName is not supported. Did you mean getElementsByName?');
        return this.getElementsByName?.(query)?.[0] ?? null;
      });


    }

    makeNodes('Document');
    makeNodes('Element');
    makeNodes('DocumentFragment');
    objDefProp(globalThis.window??{}, '&querySelectorAll',function querySelectorAll(){
      return document.querySelectorAll(...arguments);
    });

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
    if (globalThis.document?.write && !globalThis.document?.['&write']) {
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
    if (globalThis?.document?.write && !globalThis?.document?.['&write']) {
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

    if (globalThis.Object.getPrototypeOf && !globalThis.Object['&getPrototypeOf']) {
      objDefProp(globalThis.Object, '&getPrototypeOf', globalThis.Object.getPrototypeOf);
      objDefProp(globalThis.Object, 'getPrototypeOf', function getPrototypeOf(obj) {
        try {
          return globalThis.Object['&getPrototypeOf'](obj);
        } catch (e) {
          console.warn(e);
          return globalThis.Object['&getPrototypeOf'](Object(obj));
        }
      });
    }

    if (globalThis.Node?.prototype?.removeChild && !globalThis.Node?.prototype?.['&removeChild']) {
      objDefProp(globalThis.Node.prototype, '&removeChild', globalThis.Node.prototype.removeChild);
      objDefEnum(globalThis.Node.prototype, 'removeChild', function removeChild(child) {
        try {
          this['&removeChild'](child);
        } catch (e) {
          console.warn(e, this, ...arguments);
          try {
            child?.remove?.();
          } catch (e) {
            console.warn(e, this, ...arguments);
          }
        }
        return child ?? document.createElement(String(child));
      });
    }

    if (globalThis.Node?.prototype?.appendChild && !globalThis.Node?.prototype?.['&appendChild']) {
      objDefProp(globalThis.Node.prototype, '&appendChild', globalThis.Node.prototype.appendChild);
      objDefEnum(globalThis.Node.prototype, 'appendChild', function appendChild(child) {
        try {
          this['&appendChild'](child);
        } catch (e) {
          console.warn(e, this, ...arguments);
        }
        return child ?? document.createElement(String(child));
      });
    }



    globalThis.namespaces ??= {};
    globalThis.namespaces['kid-gloves'] ||= Object(true);

  })();

}