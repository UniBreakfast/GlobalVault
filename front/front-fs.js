const {stringify} = JSON


// methods to work with file system on a non-restricted server
const fs = {
  write: (path, body)=> fetch(path.replace(/^\\*([^/])/,'/$1'),
    {method: 'PUT', body: typeof body=='object'? 
      stringify(body,'',2) : body||''}),

  mkdir: path => fetch(path,
    {method: 'POST', body: stringify({op: 'mkdir', args: [path]})}),

  copy: (from, to, name)=> fetch(from,
    {method: 'POST', body: stringify({op: 'copy', args: [from, to, name]})}),

  move: (from, to, name)=> fetch(from,
    {method: 'POST', body: stringify({op: 'move', args: [from, to, name]})}),

  dup: (path, name)=> fetch(path,
    {method: 'POST', body: stringify({op: 'dup', args: [path, name]})}),

  rename: (path, name)=> fetch(path,
    {method: 'POST', body: stringify({op: 'rename', args: [path, name]})}),

  del: path => path && fetch(path, {method: 'DELETE'}),

  explore: (path='', depth='')=> fetch(path+'??'+depth).then(r => r.json()),

  recon: (path='', depth='')=> fetch(path+'?'+depth).then(r => r.json()),
}
