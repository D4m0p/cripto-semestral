# Evidencia de los retos del grupo

Entorno local: Ganache (cadena 1337) y aplicación Level Up. Jugador de prueba `0x9400f8e959374b73c710C7FafB2e55A19b3C5fAc`. Se documentan los seis retos del grupo: 0, 5 y 12 (integrante 1) y 9, 10 y 13 (integrante 2). Cada uno se desplegó desde la aplicación, se resolvió con transacciones del jugador y se validó con `validateFlag` en el contrato base.

| Nivel | Reto | Puntos | Contrato | Validado |
|---|---|---|---|---|
| 0 | Interact | 25 | `0x0E7fE86d0E8f57C332FD02C58BF6Ff4113dda390` | Sí |
| 5 | Relottery | 250 | `0xEa192ba78A778f68a9d48EF5bC9722ac960d39a7` | Sí |
| 9 | Rich_Club | 250 | `0xBcc9bFa0fe3b2445644530a6Eb1481DCB97bFfE8` | Sí |
| 10 | Deny_To_Me | 200 | `0x7e1C8B417C6A2386Db80474466D9F0C76E786048` | Sí |
| 12 | Replay_Me | 250 | `0x9Db7414734A6CBA021685D5a4E8629514E168E03` | Sí |
| 13 | Guess_my_number | 200 | `0xd0200233Bf1cF8d01A767Fc4185154D95Af395C9` | Sí |

**Total de puntos:** 1175.

## Nivel 0: Interact (25 puntos)

**Tipo de fallo:** Tutorial

El contrato entrega la flag con `getFlag()`; sirve para aprender el flujo: desplegar, consultar y validar.

- Contrato del reto: `0x0E7fE86d0E8f57C332FD02C58BF6Ff4113dda390`
- Flag obtenida: `57246293100111435626315339879288739952`

| # | Transacción | Hash | Bloque | Gas | Estado |
|---|---|---|---|---|---|
| 1 | validateFlag(contrato, flag) | `0xade4c56e2c2268582412de91c09d66640d7dcc215d7ace12df571c0eeb3b5a77` | 107 | 58844 | OK |

Validación en el contrato base (`checkFlag`): **True**

## Nivel 5: Relottery (250 puntos)

**Tipo de fallo:** Datos `private` legibles en la cadena

El número de la lotería está en el slot 3. Se compra un boleto, se acierta con `ganarLottery(n)` y se cobra todo el saldo, requisito de `getFlag()`.

- Contrato del reto: `0xEa192ba78A778f68a9d48EF5bC9722ac960d39a7`
- Flag obtenida: `47906569181034691578563859409566499785`
- Observación: numero secreto leido del slot 3: 33787

| # | Transacción | Hash | Bloque | Gas | Estado |
|---|---|---|---|---|---|
| 1 | pagarBoleto() | `0x30fdfcae4453df5e12eccd848b26ed402f585fbdda2d48cecc7f423437c67d02` | 128 | 66086 | OK |
| 2 | ganarLottery(33787) | `0xa608653edbe96bc86b5dfb7fbb3fffd49abc530eefebe55a7dc44a34611951c3` | 129 | 33793 | OK |
| 3 | validateFlag(contrato, flag) | `0x64f922bac1ac43e893946fe0a35e22cf6d8586771ff05ecdefeb2186c24a25b0` | 130 | 58844 | OK |

Validación en el contrato base (`checkFlag`): **True**

## Nivel 9: Rich_Club (250 puntos)

**Tipo de fallo:** Préstamo relámpago (flash loan)

`getFlag()` solo mira el saldo del token en ese instante. Un contrato pide un `flashLoan` de 2 tokens, llama a `getFlag()` dentro de `executeOperation` y devuelve el préstamo en la misma transacción.

- Contrato del reto: `0xBcc9bFa0fe3b2445644530a6Eb1481DCB97bFfE8`
- Flag obtenida: `236129714664011749584082135376076868255`

| # | Transacción | Hash | Bloque | Gas | Estado |
|---|---|---|---|---|---|
| 1 | despliegue de contrato | `0x898a424f7f8a8109f199a3f05accc91b51dc13cfc020d7e6bc9e44106f0df955` | 154 | 699746 | OK |
| 2 | start(2000000000000000000) | `0x3c11af10e082846f56ee15151db4c2d18bdc2397d3828eb729a455e577626725` | 155 | 149721 | OK |
| 3 | validateFlag(contrato, flag) | `0xe3efc1e5c86271636f38055a230ba31153807f9d83eea913808702dbb4d85100` | 156 | 58856 | OK |

Validación en el contrato base (`checkFlag`): **True**

## Nivel 10: Deny_To_Me (200 puntos)

**Tipo de fallo:** Denegación de servicio por receptor que revierte

`getFlag()` exige que algún pago con `send` falle. Un contrato listado como ganador, cuyo `receive()` siempre revierte, cumple la condición y obtiene la flag.

- Contrato del reto: `0x7e1C8B417C6A2386Db80474466D9F0C76E786048`
- Flag obtenida: `99899102136749379755115977851404361529`
- Observación: minimunFee = 3

| # | Transacción | Hash | Bloque | Gas | Estado |
|---|---|---|---|---|---|
| 1 | despliegue de contrato | `0x2875cf9ab5ad2a1026ac2a59e0e2820640e37da08de244a93aa662b839496efd` | 159 | 618434 | OK |
| 2 | go(0x7e1C8B417C6A2386Db80474466D9F0C76E7860, 1) | `0xc1ce0fa446c830b1b97c4e5e0f26c944859e5394caa5a54a2506aad5fd0038cb` | 160 | 180736 | OK |
| 3 | validateFlag(contrato, flag) | `0x339c698c769629c069e970c19f060da36f927d68404b89308cc76eeb6eccd3c2` | 161 | 58844 | OK |

Validación en el contrato base (`checkFlag`): **True**

## Nivel 12: Replay_Me (250 puntos)

**Tipo de fallo:** Reutilización de firma (replay)

El depósito del servidor deja en la cadena `(hash, v, r, s)`. Nada impide reutilizar esa firma en `extractFunds`: vacía el saldo del contrato y habilita `getFlag()`.

- Contrato del reto: `0x9Db7414734A6CBA021685D5a4E8629514E168E03`
- Flag obtenida: `278006288442971143551211639231510921166`
- Observación: firma reutilizada del deposito del bloque 168

| # | Transacción | Hash | Bloque | Gas | Estado |
|---|---|---|---|---|---|
| 1 | extractFunds(b'?\xbd\xd6\xb9\x1c`\xcb\xf1\xbc\x16B\xd, 28, b'?!\xf6\x81\x90Z$\xb7\x8e\xbbd\x8c>\x94, b'9\xd2+\xee\x87\xd0\x91Gx\x08\xab#n y\x) | `0x5a741ef4f57a9aadf1478aaacbabd4a9a151f35b166a560f5ae5451b30d8cd05` | 170 | 37312 | OK |
| 2 | validateFlag(contrato, flag) | `0x8cea3d8a79670fb76f5939be5799d781ec033a31d93ee12b07f2ccf09aa6d66d` | 171 | 58856 | OK |

Validación en el contrato base (`checkFlag`): **True**

## Nivel 13: Guess_my_number (200 puntos)

**Tipo de fallo:** `delegatecall` y dato `private`

El número secreto está en el slot 1, que el contrato comparte con Numbers vía `delegatecall`. `guess(n)` ejecutado en el contexto de Guess deja al jugador como `owner`.

- Contrato del reto: `0xd0200233Bf1cF8d01A767Fc4185154D95Af395C9`
- Flag obtenida: `320827441580508894202980809510671396282`
- Observación: numero secreto leido del slot 1: 2901

| # | Transacción | Hash | Bloque | Gas | Estado |
|---|---|---|---|---|---|
| 1 | execution_function(b'\x91\x89\xfe\xc1\x00\x00\x00\x00\x00\x) | `0x89bd6adfba4f502af1269b3dcabcbebe18c94eb67c386a5de3da243e4a39d115` | 175 | 35548 | OK |
| 2 | validateFlag(contrato, flag) | `0xdd6753c015a7bc6ac5bf13ce6b23305d2981862e6b41a47dd26ac97a854118dd` | 176 | 58856 | OK |

Validación en el contrato base (`checkFlag`): **True**

## Capturas

- `capturas/04_aviso_jugador_registrado.jpg`: aviso de la página de registro cuando la cuenta ya es jugador.
- `capturas/05_portada_tema_noche.jpg` y `capturas/06_portada_tema_dia.jpg`: portada rediseñada en los dos temas, con los seis retos del grupo.
