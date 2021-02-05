
const makeHandle = type => (func) => {
  const get = require('get-parameter-names')
  const names = get(func)
  return async (req, res) => {
    console.log(type === 'query' ? req.query : req.body)

    // 来自req.query或者req.body
    const reqData = req[type]
    // 当参数为body query之类时，返回reqData
    const args = (names[0] === type)
      ? [reqData]
      : names.map(name => reqData[name])

    res.success({ ...await res.tryOrFail(func.apply(null, args)) })
  }
}

const makeGetHandle = makeHandle('query')
const makePostHandle = makeHandle('body')

const makeHandles = (method) =>
  method === 'get'
    ? makeGetHandle()
    : makePostHandle

const makeRouter = (controller) => {
  const express = require('express')
  const router = express.Router()

  Object.keys(controller).forEach(method => {
    Object.keys(controller[method]).forEach(key => {
      router[method]('/' + key, makeHandles(method)(controller[method][key]))
    })
  })
  return router
}

exports.makeGetHandle = makeGetHandle
exports.makePostHandle = makePostHandle

exports.makeRouter = makeRouter
