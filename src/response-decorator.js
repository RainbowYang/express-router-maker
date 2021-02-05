module.exports = (req, res, next) => {
  // 发送成功数据
  res.success = (data = {}) => {
    res.json({ success: true, ...data })
  }

  // 返回失败信息
  res.fail = (error = '') => {
    res.json({ success: false, error })
  }

  // 当产生错误时，请求直接返回
  // 可以接收一个普通函数或者异步函数，或者一个Promise
  res.tryOrFail = async (fn) => {
    try {
      let result = fn
      while (result instanceof Function) {
        result = result()
      }
      while (result instanceof Promise) {
        result = await result
      }
      while (result instanceof Array) {
        result = await Promise.all(result)
      }

      return result
    } catch (e) {
      res.fail(e)
      console.log(e)
      throw e
    }
  }

  res.tryOrFailSync = (fn) => {
    try {
      return typeof fn == 'function' ? fn() : fn
    } catch (e) {
      res.fail(e)
      console.log(e)
      throw e
    }
  }

  next()
}
