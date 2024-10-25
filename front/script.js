var time = Date.now()

var items = [
  {name: 'Good item name', value: 42},
  {name: 'worse_name', value: {x: 13}}
]

var options = {refresh: true, listScroll: false}


function save(name, value, varNames) {
  fs.write(`vaults/${name}.json`, value).then(resp => 
    console.log(resp.ok? `${name} saved${varNames? 
      ' '+varNames.join(', ') : ''}` : `unable to save ${name} variable`))
}

function load(name) {
  return fetch(`vaults/${name}.json`).then(resp => resp.ok? resp.json() : null)
}

const itemsVaultLS = new GlobalVault('items')
const itemsVault = new GlobalVault('items', save, load)

const shallowVault = new GlobalVault(['time', 'items', 'options'], save, load)

const deepVault = 
  new GlobalVault({vault: ['time', 'items', 'options']}, save, load)

const mixedVaultLS = 
  new GlobalVault([{vault: ['time', 'items']}, 'options'])
const mixedVault = 
  new GlobalVault([{vault: ['time', 'items']}, 'options'], save, load)