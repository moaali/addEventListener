import { forOwn, omit, pick, isEmpty, merge } from 'lodash-es';

(() => {
  const ElementProto = Element.prototype
  const nativeAddEventListener = ElementProto.addEventListener;
  const castArr = input => {
    if (!Array.isArray(input)) {
      return [input];
    }

    return input;
  }

  ElementProto.addEventListener = HTMLDocument.prototype.addEventListener = Window.prototype.addEventListener = function addEventListener(...args) {
    const $this = this;
    const firstArg = args[0];
    const isFirstArgArr = Array.isArray(firstArg);
    const isFirstArgArrOfObj = isFirstArgArr && typeof firstArg[0] === 'object';
    const argsLen = args.length;

    if (argsLen < 2 && !isFirstArgArrOfObj) {
      throw new SyntaxError(`
        "addEventListener" Sould take one of the following forms:
        > addEventListener(type, listener);
        > addEventListener(type, listener[, options]);
        > addEventListener(type, listener[, useCapture]);
        > addEventListener(type, listener[, useCapture, wantsUntrusted]);
        > addEventListener([{}]);
        > addEventListener([{}][, options]);
        > addEventListener([{}][, useCapture]);
        > addEventListener([{}][, useCapture, wantsUntrusted]);
        > addEventListener(['types'], listener);
        > addEventListener(['types'], listener[, options]);
        > addEventListener(['types'], listener[, useCapture]);
        > addEventListener(['types'], listener[, useCapture, wantsUntrusted]);
        > addEventListener(['types'], [listeners]);
        > addEventListener(['types'], [listeners][, options]);
        > addEventListener(['types'], [listeners][, useCapture]);
        > addEventListener(['types'], [listeners][, useCapture, wantsUntrusted]);
        > addEventListener(type, ['listeners']);
        > addEventListener(type, ['listeners'][, options]);
        > addEventListener(type, ['listeners'][, useCapture]);
        > addEventListener(type, ['listeners'][, useCapture, wantsUntrusted]);
      `);
    };

    const restArgsObj = (function restArgs() {
      const getObj = i => ({
        ...(typeof args[i] === 'object' && { options: args[i] }),
        ...(typeof args[i] === 'boolean' && { useCapture: args[i] }),
        ...(typeof args[i + 1] === 'boolean' && { wantsUntrusted: args[i + 1]})
      });

      if (argsLen > 1) {
        if (isFirstArgArrOfObj) {
          return getObj(1);
        };

        return getObj(2);
      }

      return {};
    })();

    const mergeArgs = target => {
      let results;

      if (target.options) {
        if (restArgsObj.options) {
          results = merge(restArgsObj.options, target.options);
        } else {
          results = target.options
        }
      } else if (restArgsObj.options) {
          if (target.useCapture !== 'undefined') {
            restArgsObj.options.capture = target.useCapture;
          }

          results = restArgsObj.options;
      } else {
        results = merge(restArgsObj, target);
      }

      return results;
    };

    const applyFnsOnType = (type, fns, rest) => {
      fns.forEach(fn => {
        nativeAddEventListener.apply($this, [type, fn, rest]);
      });
    }

    if (isFirstArgArrOfObj) {
      const defs = ['useCapture', 'options', 'wantsUntrusted'];

      const mapObj = (obj, checkEvents) => {
        const events = checkEvents && pick(obj, ['events']);
        const defaults = pick(obj, defs);
        const eventsObjPure = omit(obj, defs);

        return {
          events,
          defaults,
          eventsObjPure
        };
      };

      firstArg.forEach(eventsObj => {
        const { eventsObjPure, defaults, events } = mapObj(eventsObj, true);

        if (events && !isEmpty(events)) {
          const types = castArr(eventsObj.events.types);
          const listeners = castArr(eventsObj.events.listeners);

          types.forEach(type => {
            applyFnsOnType(type, listeners, ...Object.values(omit(events, ['types', 'listeners'])));
          });
        };

        forOwn(eventsObjPure, (value, key) => {
          const fns = castArr(value);

          applyFnsOnType(key, fns, ...Object.values(mergeArgs(defaults)));
        });

      });
    } else if (isFirstArgArr) {
      const secondArg = castArr(args[1]);

      firstArg.forEach(type => {
        applyFnsOnType(type, secondArg, ...Object.values(restArgsObj));
      });
    } else if (typeof firstArg === 'string') {
      const secondArg = castArr(args[1]);
      applyFnsOnType(firstArg, secondArg, ...Object.values(restArgsObj));
    }
  }
})();
