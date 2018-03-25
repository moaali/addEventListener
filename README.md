## Description
Small library used to extend native [`addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) to convert it from this:

```javascript
addEventListener(type, listener);
addEventListener(type, listener[, options]);
addEventListener(type, listener[, useCapture]);
addEventListener(type, listener[, useCapture, wantsUntrusted]);
```
to that
```javascript
addEventListener(type, listener);
addEventListener(type, listener[, options]);
addEventListener(type, listener[, useCapture]);
addEventListener(type, listener[, useCapture, wantsUntrusted]);
addEventListener([{}, ..., {}]);
addEventListener([{}, ..., {}][, options]);
addEventListener([{}, ..., {}][, useCapture]);
addEventListener([{}, ..., {}][, useCapture, wantsUntrusted]);
addEventListener(['type', ..., 'typeN'], listener);
addEventListener(['type', ..., 'typeN'], listener[, options]);
addEventListener(['type', ..., 'typeN'], listener[, useCapture]);
addEventListener(['type', ..., 'typeN'], listener[, useCapture, wantsUntrusted]);
addEventListener(['type', ..., 'typeN'], [listener, ..., listenerN]);
addEventListener(['type', ..., 'typeN'], [listener, ..., listenerN][, options]);
addEventListener(['type', ..., 'typeN'], [listener, ..., listenerN][, useCapture]);
addEventListener(['type', ..., 'typeN'], [listener, ..., listenerN][, useCapture, wantsUntrusted]);
addEventListener(type, [listener, ..., listenerN]);
addEventListener(type, [listener, ..., listenerN][, options]);
addEventListener(type, [listener, ..., listenerN][, useCapture]);
addEventListener(type, [listener, ..., listenerN][, useCapture, wantsUntrusted]);
```

<br>

## License
🍟 MIT
