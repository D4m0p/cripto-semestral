import json,urllib.request
from eth_account import Account
r=lambda m,p:json.load(urllib.request.urlopen(urllib.request.Request('http://chain1:8545',json.dumps({'jsonrpc':'2.0','method':m,'params':p,'id':1}).encode(),{'content-type':'application/json'})))['result']
a=Account.from_key(open('/tmp/player.key').read().strip()).address
if int(r('eth_getBalance',[a,'latest']),16)<5*10**18:
    o=r('eth_accounts',[])[0]; r('eth_sendTransaction',[{'from':o,'to':a,'value':hex(20*10**18)}])
print(a,int(r('eth_getBalance',[a,'latest']),16)/1e18)
