# express-router-maker

可以在RESTful风格中，简化express的router的书写，同时也更适应函数式编程的风格。

## Router Maker

### Example

```js
const makeRouter = require('express-router-maker')

const routerMap = {
  GET: {  // or get
    '/GET_Path': (arg1, arg2) => {
      // do sth
      return sth;
    }
  },
  POST: { // or post
    '/POST_Path': POSTHandleFunction
  }
}

const router = makeRouter(routerMap)
```
我们只需要像上面这样，写HTTP方法、路径和路径对应的处理函数(handle function)。
通过makeRouter，会等效于下面这些

```js
const express = require('express')
const router = express.Router()

router.get('/GET_Path', (req, res) => {
  // `处理函数`中的`参数`(arg1, arg2) 会自动地从`req.query`或者`req.body`中获取同名的值
  // 然后用这些参数执行`处理函数`
  // 最后用res.json返回执行 `处理函数` 的结果
})
router.post('/postPath', (req, res) => {
  // 同上
})

```
### Description
源码在 `src/router-maker.js`

该工具可以根据一个特定对象`routerMap（见Example的第一段代码）`生成对应的`router`, 从而简化 router 的书写。

routerMap的属性名只能是`HTTP 方法`，比如`GET`，`POST`等，而routerMap的属性值同样都是对象。这些对象就表示具体的路由，以路径为`Name`、函数为`Value`。

其中每个函数的参数将会从`request`的`query`或者`body`中提取，每个函数的返回值，将会被`res.json()`发送。

发生错误时，会自动使用`res.fail()`发送错误信息。（见下一节的`Response Decorator`）


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

