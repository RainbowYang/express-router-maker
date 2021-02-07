const makeRouterHandle = (type) => (fn) => {
  const get = require('get-parameter-names')
  const names = get(fn)

  return async (req, res) => {
    console.log(type === 'query' ? req.query : req.body)

    if (!res.tryOrFail) {
      require('./response-decorator')(null, res)
    }

    // 来自req.query或者req.body
    const allArgs = req[type]
    // 当参数名为body query之类时，返回所有来自req的参数
    const args = (names[0] === type)
      ? [allArgs]
      : names.map(name => allArgs[name])

    try {
      res.success(await res.tryOrFail(() => fn.apply(null, args)))
    } catch (e) {
      // 错误已在res.tryOrFail中处理
    }
  }
}

const makeGetHandle = makeRouterHandle('query')
const makePostHandle = makeRouterHandle('body')

const makeHandleOf = (method) =>
  // 除了GET之外，都按照Post处理，通过body获取参数
  method === 'get'
    ? makeGetHandle
    : makePostHandle

const makeRouter = (controller, router) => {
  if (!router) {
    const express = require('express')
    router = express.Router()
  }

  Object.keys(controller).forEach(method => {
    method = method.toLowerCase()
    Object.keys(controller[method]).forEach(path => {
      const handleFunction = controller[method][path]
      router[method](path, makeHandleOf(method)(handleFunction))
    })
  })

  return router
}

exports.makeGetHandle = makeGetHandle
exports.makePostHandle = makePostHandle

exports.makeRouter = makeRouter


