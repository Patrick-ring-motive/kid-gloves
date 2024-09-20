
void function KidGloves() {

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
    let sel = 'querySelectorAll';
    if (document['&querySelectorAll']) {
      sel = '&querySelectorAll';
    }
    let x = document[sel](btoa(new Date().getTime()).replace(/[^a-zA-Z]/g, ''));
    for (let i = 0; i < 100; i++) {
      if (!x.length) { break; }
      x = document[sel](btoa(new Date().getTime()).replace(/[^a-zA-Z]/g, ''));
    }
    return x ?? [];
  }


  if (globalThis.Document?.prototype?.querySelector && !globalThis.Document?.prototype?.['&querySelector']) {
    objDefProp(Document.prototype, '&querySelector', Document.prototype.querySelector);
    objDefProp(Document.prototype, 'querySelector', function querySelector() {
      try {
        return this['&querySelector'](...arguments);
      } catch (e) {
        console.warn(e);
        return null;
      }
    });
  }

  if (globalThis.Document?.prototype?.querySelectorAll && !globalThis.Document?.prototype?.['&querySelectorAll']) {
    objDefProp(Document.prototype, '&querySelectorAll', Document.prototype.querySelectorAll);
    objDefProp(Document.prototype, 'querySelectorAll', function querySelectorAll() {
      try {
        return this['&querySelectorAll'](...arguments);
      } catch (e) {
        console.warn(e);
        return emptyNodeList();
      }
    });
  }

  if (globalThis.Document?.prototype?.getElementById && !globalThis.Document?.prototype?.['&getElementById']) {
    objDefProp(Document.prototype, '&getElementById', Document.prototype.getElementById);
    objDefProp(Document.prototype, 'getElementById', function getElementById() {
      try {
        return this['&getElementById'](...arguments);
      } catch (e) {
        console.warn(e);
        return null;
      }
    });
  }


  if (globalThis.Document?.prototype?.getElementsByTagName && !globalThis.Document?.prototype?.['&getElementsByTagName']) {
    objDefProp(Document.prototype, '&getElementsByTagName', Document.prototype.getElementsByTagName);
    objDefProp(Document.prototype, 'getElementsByTagName', function getElementsByTagName() {
      try {
        return this['&getElementsByTagName'](...arguments);
      } catch (e) {
        console.warn(e);
        return this['&getElementsByTagName']('<>');
      }
    });
  }


  if (globalThis.Document?.prototype?.getElementsByClassName && !globalThis.Document?.prototype?.['&getElementsByClassName']) {
    objDefProp(Document.prototype, '&getElementsByClassName', Document.prototype.getElementsByClassName);
    objDefProp(Document.prototype, 'getElementsByClassName', function getElementsByClassName() {
      try {
        return this['&getElementsByClassName'](...arguments);
      } catch (e) {
        console.warn(e);
        return this['&getElementsByTagName']('<>');
      }
    });
  }

  if (globalThis.Document?.prototype?.getElementsByTagNameNS && !globalThis.Document?.prototype?.['&getElementsByTagNameNS']) {
    objDefProp(Document.prototype, '&getElementsByTagNameNS', Document.prototype.getElementsByTagNameNS);
    objDefProp(Document.prototype, 'getElementsByTagNameNS', function getElementsByTagNameNS() {
      try {
        return this['&getElementsByTagNameNS'](...arguments);
      } catch (e) {
        console.warn(e);
        return this['&getElementsByTagNameNS']('<>');
      }
    });
  }

  if (globalThis.Document?.prototype?.getElementsByName && !globalThis.Document?.prototype?.['&getElementsByName']) {
    objDefProp(Document.prototype, '&getElementsByName', Document.prototype.getElementsByName);
    objDefProp(Document.prototype, 'getElementsByName', function getElementsByName() {
      try {
        return this['&getElementsByName'](...arguments);
      } catch (e) {
        console.warn(e);
        return this['&getElementsByTagName']('<>');
      }
    });
  }


  if (globalThis.Element?.prototype?.querySelector && !globalThis.Element?.prototype?.['&querySelector']) {
    objDefProp(Element.prototype, '&querySelector', Element.prototype.querySelector);
    objDefProp(Element.prototype, 'querySelector', function querySelector() {
      try {
        return this['&querySelector'](...arguments);
      } catch (e) {
        console.warn(e);
        return null;
      }
    });
  }

  if (globalThis.Element?.prototype?.querySelectorAll && !globalThis.Element?.prototype?.['&querySelectorAll']) {
    objDefProp(Element.prototype, '&querySelectorAll', Element.prototype.querySelectorAll);
    objDefProp(Element.prototype, 'querySelectorAll', function querySelectorAll() {
      try {
        return this['&querySelectorAll'](...arguments);
      } catch (e) {
        console.warn(e);
        return emptyNodeList();
      }
    });
  }


  if (globalThis.Element?.prototype?.getElementsByTagName && !globalThis.Element?.prototype?.['&getElementsByTagName']) {
    objDefProp(Element.prototype, '&getElementsByTagName', Element.prototype.getElementsByTagName);
    objDefProp(Element.prototype, 'getElementsByTagName', function getElementsByTagName() {
      try {
        return this['&getElementsByTagName'](...arguments);
      } catch (e) {
        console.warn(e);
        return this['&getElementsByTagName']('<>');
      }
    });
  }

  if (globalThis.Element?.prototype?.getElementsByClassName && !globalThis.Element?.prototype?.['&getElementsByClassName']) {
    objDefProp(Element.prototype, '&getElementsByClassName', Element.prototype.getElementsByClassName);
    objDefProp(Element.prototype, 'getElementsByClassName', function getElementsByClassName() {
      try {
        return this['&getElementsByClassName'](...arguments);
      } catch (e) {
        console.warn(e);
        return this['&getElementsByTagName']('<>');
      }
    });
  }

  if (globalThis.Element?.prototype?.getElementsByTagNameNS && !globalThis.Element?.prototype?.['&getElementsByTagNameNS']) {
    objDefProp(Element.prototype, '&getElementsByTagNameNS', Element.prototype.getElementsByTagNameNS);
    objDefProp(Element.prototype, 'getElementsByTagNameNS', function getElementsByTagNameNS() {
      try {
        return this['&getElementsByTagNameNS'](...arguments);
      } catch (e) {
        console.warn(e);
        return this['&getElementsByTagNameNS']('<>');
      }
    });
  }

  if (globalThis.Element?.prototype?.getElementsByName && !globalThis.Element?.prototype?.['&getElementsByName']) {
    objDefProp(Element.prototype, '&getElementsByName', Element.prototype.getElementsByName);
    objDefProp(Element.prototype, 'getElementsByName', function getElementsByName() {
      try {
        return this['&getElementsByName'](...arguments);
      } catch (e) {
        console.warn(e);
        return this['&getElementsByTagName']('<>');
      }
    });
  }

}();
