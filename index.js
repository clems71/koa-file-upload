'use strict'

let _ = require('lodash')
let formidable = require('koa-formidable')
let koa = require('koa')
let router = require('koa-router')()

function createApp () {
  let app = koa()

  router.post('/files', function * () {
    if (!this.is('multipart/form-data')) {
      this.throw(415)
    }

    let form = yield formidable.parse({
      uploadDir: `${__dirname}/uploads`,
      hash: 'sha1',
      maxFieldsSize: 250 * 1024 * 1024 // 250MB
    }, this)

    let file = _.values(form.files)[0]

    this.body = {
      url: `https://cdn.domain.com/${file.hash}`
    }
  })

  app
    .use(router.routes())
    .use(router.allowedMethods())

  return app
}

function main (port) {
  let app = createApp()
  console.log(`web server started on port ${port}`)
  app.listen(port)
}

main(10000)
