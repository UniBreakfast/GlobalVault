const Stream = require('stream')

const { fs, stat, mkdir } = require('./back-fs')


// wait for a stream to get the string
Stream.prototype.wait = function (parts=[]) {
  return new Promise((resolve, reject)=>
    this.on('error', reject).on('data', part => parts.push(part))
      .on('end', ()=> resolve(Buffer.concat(parts).toString('utf8'))))
}


Stream.prototype.pipeIntoFile = function (path) {
  path = path.replace(/^\/|\/$/g, '')
  const dir = path.replace(/(^|\/)[^\/]*$/, '')
  return new Promise(async (resolve, reject)=> {
    try {
      const stats = await stat(path).catch(_=>{})
      if (stats && stats.isDirectory()) throw 0
      if (dir) await mkdir(dir)
      this.on('end', resolve).on('error', reject)
        .pipe(fs.createWriteStream(path))
    } catch (err) { reject(err) }
  })
}
    