require('./streams')

const {createServer, ServerResponse} = require('http')

const { fs, ops, stat, mkdir, remove, explore, scout } = require('./back-fs')

// aliases for short calls
const {stringify, parse} = JSON,  {assign} = Object


// MIME types for response headers
const utf = '; charset=utf-8',
      typeDict = {
        htm: 'text/html'+utf,
        html: 'text/html'+utf,
        json: 'application/json'+utf,
        css: 'text/css'+utf,
        txt: 'text/plain'+utf,
        ico: 'image/x-icon',
        jpeg: 'image/jpeg',
        jpg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        svg: 'image/svg+xml'+utf,
        mp3: 'audio/mpeg',
        mp4: 'video/mp4',
        js: 'application/javascript'+utf,
      }

ServerResponse.prototype.json = function (obj) {
  this.setHeader('Content-Type', typeDict['json'])
  this.end(stringify(obj))
}


// run server with request handler for client side requests
createServer( async (req, resp)=> {

  let {method} = req,  url = decodeURI(req.url)


  if (method=='GET') {

    try {

      const scope = url.match(/([^?]*)(\?\??)(\d*)$/)

      if (scope) {
        const [, url, qms, depth] = scope
        resp.json(await
          [scout, explore][qms.length-1](__dirname+url, ...depth? [+depth]:[]))
      }

      else {
        let path = process.cwd()+url
        if ((await stat(path).catch(_=> stat(path+='.html'))).isDirectory() &&
          (await stat(path+='/index.html')).isDirectory())  throw 0
        const match = path.match(/\.(\w+)$/), ext = match? match[1] : 'html'

        fs.createReadStream(path).pipe(resp)
        if (typeDict[ext])
          resp.setHeader('Content-Type', typeDict[ext])
      }

    } catch (err) {
      console.log(err);
      
      resp.statusCode = 404
      resp.json('sorry, '+url+' is not available')
    }
  }

  else if (method=='POST') {

    const {op, args} = parse(await req.wait())

    try { 
      await ops[op](...args).then(()=> resp.end('ok')) 
    } catch { 
      assign(resp, {statusCode:400}).end(op+' operation failed') 
    }
  }

  else if (method=='PUT') {
    req.pipeIntoFile(url)
      .then(()=> resp.end('ok'), 
            err => {
              console.log(err)
              assign(resp, {statusCode:409}).end('write error')
            })
  }

  else if (method=='DELETE') {
    remove(__dirname+url).then(()=> resp.end('ok'))
  }

}).listen(3000,
  ()=> (console.clear(), c('Server started at http://localhost:3000')))
