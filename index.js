const routerMaker = require('./src/router-maker')
const { makeRouter, combineRouter } = routerMaker

const responseDecorator = require('./src/response-decorator')

module.exports = {
  makeRouter,
  combineRouter,
  responseDecorator,
}
