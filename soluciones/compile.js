const solc=require('solc'),fs=require('fs');
const src=fs.readFileSync('attackers.sol','utf8');
const out=JSON.parse(solc.compile(JSON.stringify({language:'Solidity',sources:{'a.sol':{content:src}},settings:{outputSelection:{'*':{'*':['abi','evm.bytecode.object']}}}})));
if(out.errors) out.errors.filter(e=>e.severity==='error').forEach(e=>console.log(e.formattedMessage));
const res={};for(const n in out.contracts['a.sol']){const c=out.contracts['a.sol'][n];res[n]={abi:c.abi,bin:'0x'+c.evm.bytecode.object}}
fs.writeFileSync('attackers.json',JSON.stringify(res));console.log(Object.keys(res));
