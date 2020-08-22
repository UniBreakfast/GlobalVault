GlobalVault.defaultWays.toSave = (name, value, varNames) =>
  fs.write(`vaults/${name}.json`, value).then(resp => 
    console.log(resp.ok? `${name} saved${varNames? 
      ' '+varNames.join(', ') : ''}` : `unable to save ${name} variable`))

GlobalVault.defaultWays.toLoad = name => 
  fetch(`vaults/${name}.json`).then(resp => resp.ok? resp.json() : null)