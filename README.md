# express-router-maker

## 介绍

这是一个用于简化express中router的工具

## Router Maker

源码在 `src/router-maker.js`

该工具可以根据一个特定对象生成对应 router, 从而简化 router 的书写。

该对象的属性只能是`HTTP 方法`，比如`GET`，`POST`等。

这些属性都是对象，以路径为`Key`、函数为`Value`。

其中每个函数的参数将会从`request`的`query`或者`body`中提取。

每个函数的返回值，将会被`res.json()`发送。

发生错误时，会自动使用`res.fail()`发送错误信息。（见下一节的`Response Decorator`）

### 示例

```js
module.exports = {
  get: {
    '/getPath': getHandleFunctionA
  },
  post: {
    '/postPath': HandleFunctionB
  }
}
```

```js
router.get('/getPath', (req, res) => {
  // 根据 getHandleFunctionA 的参数，获取req中的请求值
  // 执行 getHandleFunctionA
  // 用res.json 返回执行 getHandleFunctionA 的结果
})
router.post('/postPath', (req, res) => {
  // 同上
})

```

## Response Decorator

源码在 `src/response-decorator.js`

这其实算是一个express的中间件

用于向response添加一下函数:

+ `success`

  ```js
  // 发送成功数据
  res.success = (data = {}) => {
    res.json({ success: true, ...data })
  }
  ```

+ `fail`

  ```js
  // 返回失败信息
  res.fail = (error = '') => {
    res.json({ success: false, error })
  }
  ```  

+ `tryOrFail`:

  尝试运行fn, fn可以是同步函数，异步函数，以及Promise。

  发生错误时，会自动返回请求。并进行输出

  ```js
  res.tryOrFail = async (fn) => {
    try {
      //运行fn
    } catch (e) {
      res.fail()
    }
  }
  ```

+ `tryOrFailSync`：`tryOrFail`的同步版本

