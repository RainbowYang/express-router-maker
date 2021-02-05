# express-router-maker

## 介绍
这是一个用于简化express中router的工具

## Router Maker
源码在 `src/router-maker.js`

可以将一个对象生成对应router。

该对象拥有一些属性，比如GET，POST。

GET下面又会有一些路径和函数组成的K-V对。

其中每个函数的参数 对应 request的query或者body中的值

每个函数的返回值，将会被res.json()发送

```js
{
  get:{
    '/path': FunctionA
  },
  post:{
    '/path': FunctionB
  }
}
```
```js
router.get('/path',(req,res)=>{
  // 根据FunctionA的参数，获取req中的请求值
  // 执行FunctionA
  // 用res.json 返回执行FunctionA的结果
})
router.post('/path',(req,res)=>{

})

```

## Response Decorator
源码在 `src/response-decorator.js`

这其实算是一个express的中间件

用于向response添加一下函数:
+ success

```js
// 发送成功数据
res.success = (data = {}) => {
  res.json({ success: true, ...data })
}
```

+ fail
```js
  // 返回失败信息
  res.fail = (error = '') => {
    res.json({ success: false, error })
  }
```  

+ tryOrFail:
+ tryOrFailSync

