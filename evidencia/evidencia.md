# Evidencia de la prueba de los 18 niveles

Entorno local: Ganache (cadena 1337) y aplicación Level Up. Jugador de prueba `0x9400f8e959374b73c710C7FafB2e55A19b3C5fAc`. Cada nivel se desplegó desde la aplicación, se resolvió con transacciones del jugador y se validó con `validateFlag` en el contrato base.

| Nivel | Reto | Puntos | Contrato | Validado |
|---|---|---|---|---|
| 0 | Interact | 25 | `0x0E7fE86d0E8f57C332FD02C58BF6Ff4113dda390` | Sí |
| 1 | Questions | 50 | `0x030285AB68aF36f9BD99F5A7B75ce75781810591` | Sí |
| 2 | Ownership | 100 | `0x996A7d505dB29DF78Ae1A72205955cCe0aa7FEE2` | Sí |
| 3 | Safeguarding | 75 | `0x70F52e894bc9Ba0807D43837fD93cF79F8BC1c2d` | Sí |
| 4 | Origin | 150 | `0x2FC2Da7071139BaF1bB293779B2797E04A3032DD` | Sí |
| 5 | Relottery | 250 | `0xEa192ba78A778f68a9d48EF5bC9722ac960d39a7` | Sí |
| 6 | Overworld | 100 | `0x5CA6b0C09f8240000FB253d64680DB4434BFCEfd` | Sí |
| 7 | Blockchain_Tour | 75 | `0xE3c87B8f95345CAF16125a0396C5211640797780` | Sí |
| 8 | Snippet_Delegated | 200 | `0x30438A89Ba80d4E6c63aB68d362CCaD7fb1888c2` | Sí |
| 9 | Rich_Club | 250 | `0xBcc9bFa0fe3b2445644530a6Eb1481DCB97bFfE8` | Sí |
| 10 | Deny_To_Me | 200 | `0x7e1C8B417C6A2386Db80474466D9F0C76E786048` | Sí |
| 11 | Forensic_Ouch | 150 | `0x688BfF92bE218bc26a42FF00582dD63aDe4cd3E0` | Sí |
| 12 | Replay_Me | 250 | `0x9Db7414734A6CBA021685D5a4E8629514E168E03` | Sí |
| 13 | Guess_my_number | 200 | `0xd0200233Bf1cF8d01A767Fc4185154D95Af395C9` | Sí |
| 14 | Pay_me | 50 | `0xA3768999F2867e32780aD9030FEa9925aD54717d` | Sí |
| 15 | Dex_knowledge | 150 | `0xeF49cA7A778924D9B4527eA8Ca4d65617EC89CA2` | Sí |
| 16 | Gas_knowledge | 75 | `0x0f38F570F48aB91e85B6F1c843Dd96cFBDC9cc40` | Sí |
| 17 | Send_to_me | 100 | `0x4e787A0cd3387562131376E3a173423c5C400e13` | Sí |

**Total de puntos:** 2450 (máximo posible).

## Nivel 0: Interact (25 puntos)

**Tipo de fallo:** Tutorial

El contrato entrega la flag con `getFlag()`; sirve para aprender el flujo: desplegar, consultar y validar.

- Contrato del reto: `0x0E7fE86d0E8f57C332FD02C58BF6Ff4113dda390`
- Flag obtenida: `57246293100111435626315339879288739952`

| # | Transacción | Hash | Bloque | Gas | Estado |
|---|---|---|---|---|---|
| 1 | validateFlag(contrato, flag) | `0xade4c56e2c2268582412de91c09d66640d7dcc215d7ace12df571c0eeb3b5a77` | 107 | 58844 | OK |

Validación en el contrato base (`checkFlag`): **True**

## Nivel 1: Questions (50 puntos)

**Tipo de fallo:** Lógica deducible desde el propio contrato

Las funciones `misterio*`, `checkHash` y `entrypoint*` revelan los valores que pide `finalChoice(32, 659)`. Todo en un contrato público es legible.

- Contrato del reto: `0x030285AB68aF36f9BD99F5A7B75ce75781810591`
- Flag obtenida: `293413422063513091946941073101578135342`

| # | Transacción | Hash | Bloque | Gas | Estado |
|---|---|---|---|---|---|
| 1 | validateFlag(contrato, flag) | `0xda3587001f427a8ca522b35650a8a9e77be4ba3cafe55b2578f35ac65b0bcbe1` | 110 | 58856 | OK |

Validación en el contrato base (`checkFlag`): **True**

## Nivel 2: Ownership (100 puntos)

**Tipo de fallo:** Datos `private` legibles en la cadena

`private` solo impide el acceso desde otros contratos. El número de la propiedad está en el slot 1 y se lee con `eth_getStorageAt`. Con `darAlta()` y `cambioPropiedad(n)` el jugador pasa a ser `owner` y llama a `getFlag()`.

- Contrato del reto: `0x996A7d505dB29DF78Ae1A72205955cCe0aa7FEE2`
- Flag obtenida: `221802269127747826203948297248158244131`
- Observación: numero secreto leido del slot 1: 2

| # | Transacción | Hash | Bloque | Gas | Estado |
|---|---|---|---|---|---|
| 1 | darAlta() | `0xe3c4b4cf8a5aaba4ebfda4b600411acfb5794e52a49cf1188bc76cf598b0389d` | 113 | 43496 | OK |
| 2 | cambioPropiedad(2) | `0x02d0e16fe2fe6cc8293b58d5c7ab36ae203af842f6a8f0c2d98e783b3fb72dad` | 114 | 33260 | OK |
| 3 | validateFlag(contrato, flag) | `0x582a1f3d4519ceea0c932a85c50f8db61e016f93a852593208209e900c4b4153` | 115 | 58856 | OK |

Validación en el contrato base (`checkFlag`): **True**

## Nivel 3: Safeguarding (75 puntos)

**Tipo de fallo:** Control de acceso defectuoso

`safeguard()` asigna `owner = msg.sender` a quien envíe el mensaje "secret", que está en el código y se puede leer en el bytecode. Falta una verificación de quién llama.

- Contrato del reto: `0x70F52e894bc9Ba0807D43837fD93cF79F8BC1c2d`
- Flag obtenida: `35813582608173166724363504644592126111`

| # | Transacción | Hash | Bloque | Gas | Estado |
|---|---|---|---|---|---|
| 1 | safeguard(x, secret) | `0xffd0faaafa56c4cdbfd001f9e00060d2749cb50ce23cacac83f3a394f7ff8eb2` | 119 | 44623 | OK |
| 2 | validateFlag(contrato, flag) | `0x441d700206a6c0aee8fc101a191fc3916f1f343c33b43e9d2c2138800603ebdd` | 120 | 58844 | OK |

Validación en el contrato base (`checkFlag`): **True**

## Nivel 4: Origin (150 puntos)

**Tipo de fallo:** `tx.origin` en vez de `msg.sender`

`transfer()` autoriza con `tx.origin == owner`. Un contrato atacante cuya función `attack()` es ejecutada por el dueño (el servidor) llama a `transfer()`, vacía el saldo y queda como `winner`; desde ese contrato se lee `getFlag()`.

- Contrato del reto: `0x2FC2Da7071139BaF1bB293779B2797E04A3032DD`
- Flag obtenida: `41274064292323631194460780304000612558`
- Observación: servidor: Transaction done! Parece que ha ido bien. ¿Has conseguido cambiar algo en el Con

| # | Transacción | Hash | Bloque | Gas | Estado |
|---|---|---|---|---|---|
| 1 | despliegue de contrato | `0xc1a24cc6a865403d9f692cf38ad99ff29c04791e22933e878c2ad72ec503e0dc` | 123 | 461683 | OK |
| 2 | validateFlag(contrato, flag) | `0x5af60b04f423a346779d748c03fc554c604b1435c4456178a327b187731facd4` | 125 | 58844 | OK |

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

## Nivel 6: Overworld (100 puntos)

**Tipo de fallo:** Desbordamiento aritmético (Solidity 0.6)

`balances` es `uint8` y la versión 0.6 no revisa el desbordamiento. `burning(1)` desde 0 resta 1 y deja 255, valor exigido por `getFlag()`; la validación `!= 255` solo mira la suma previa.

- Contrato del reto: `0x5CA6b0C09f8240000FB253d64680DB4434BFCEfd`
- Flag obtenida: `321387877240652859954804032119608252921`
- Observación: mytokens = 255

| # | Transacción | Hash | Bloque | Gas | Estado |
|---|---|---|---|---|---|
| 1 | burning(1) | `0x700fcb593bf7998d058672859d1b079a015efb869b3d119157a1f2b262d049e1` | 135 | 59184 | OK |
| 2 | validateFlag(contrato, flag) | `0xb51487db66c6a915fa5a678bbb831904032444c179e9429576440448c67050d5` | 136 | 58844 | OK |

Validación en el contrato base (`checkFlag`): **True**

## Nivel 7: Blockchain_Tour (75 puntos)

**Tipo de fallo:** Datos públicos en el historial de transacciones

El servidor guarda la flag llamando a `set_flag(string)`; el argumento queda en la entrada (calldata) de la transacción del bloque `blocknumber()` y se decodifica con el ABI.

- Contrato del reto: `0xE3c87B8f95345CAF16125a0396C5211640797780`
- Flag obtenida: `252443767635918682398563968723815780725`

| # | Transacción | Hash | Bloque | Gas | Estado |
|---|---|---|---|---|---|
| 1 | validateFlag(contrato, flag) | `0xb103bd31312968429cee4d7e2b418127d7691f50ba1d6eb7920014c9b8e5d1d9` | 140 | 58856 | OK |

Validación en el contrato base (`checkFlag`): **True**

## Nivel 8: Snippet_Delegated (200 puntos)

**Tipo de fallo:** `delegatecall` con almacenamiento compartido

`execution_function` ejecuta código de `functions` sobre el almacenamiento del contrato Snippet. Con `setOwner()`, `addPower()`, ajustes de `stamina` y `addStaminaToPower()` se obtiene `owner = jugador` y `power = 9`.

- Contrato del reto: `0x30438A89Ba80d4E6c63aB68d362CCaD7fb1888c2`
- Flag obtenida: `323695747090177282415127437994788065953`
- Observación: stamina inicial = 7
- Observación: power = 9

| # | Transacción | Hash | Bloque | Gas | Estado |
|---|---|---|---|---|---|
| 1 | execution_function(b'@\xca\xae\x06') | `0x1ece979b0a48bf156cb37ff659e7671020c7a66f0f4074532251c21188184f8b` | 144 | 32999 | OK |
| 2 | execution_function(b'Q\xf2\xe6J') | `0x218da4fda2b3c319714ebf1e5aaf7e62ba9524be7d8f82b1fab4e2a0a5fff128` | 145 | 33478 | OK |
| 3 | execution_function(b'\x94\x99D:') | `0x8d2629333a7195a99d9d761c6a77813d0e665bd4acec05104edee234296349fe` | 146 | 33522 | OK |
| 4 | execution_function(b'\x94\x99D:') | `0xc94b3ad2e86836dfaa3976808090aeb5276b822d968d0951efe89735b2e16bba` | 147 | 33522 | OK |
| 5 | execution_function(b'\x94\x99D:') | `0xa37fdf985111b828454b30c563b380b34f945d6f6c547cfbd16d0a1e76cea535` | 148 | 33522 | OK |
| 6 | execution_function(b'\xcf^\x974') | `0xfeec90b407947aed2e6f195a6db15d43ba1643a023e31ac6a8a64346b331c8b0` | 149 | 33754 | OK |
| 7 | validateFlag(contrato, flag) | `0x7fabe87f46da5f3d4e1f847a924553d6c1c307245857b1898ff63753497312a7` | 150 | 58856 | OK |

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

## Nivel 11: Forensic_Ouch (150 puntos)

**Tipo de fallo:** Datos `private` y análisis forense

El índice secreto está en el slot 3. Las opciones y nombres están en la transacción de despliegue. Con `nostradamus(opción, nombre)` el jugador se vuelve `owner`.

- Contrato del reto: `0x688BfF92bE218bc26a42FF00582dD63aDe4cd3E0`
- Flag obtenida: `165780648192695748749593731007271495490`
- Observación: indice secreto leido del slot 3: 1

| # | Transacción | Hash | Bloque | Gas | Estado |
|---|---|---|---|---|---|
| 1 | nostradamus(fd459d96, loveisintheair) | `0xb8655e15096faeff3eb6f95c415bd85b01f2920edcd6df137abed2bdb9171cd5` | 165 | 37451 | OK |
| 2 | validateFlag(contrato, flag) | `0x7ce6ed404fdbc9a39ad636a067deace60ba9e15cad3ee4ead116acdc7aa46377` | 166 | 58844 | OK |

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

## Nivel 14: Pay_me (50 puntos)

**Tipo de fallo:** Control de acceso por pago

`payMe()` convierte en `owner` a quien pague un monto dentro del rango (1e6 a 1e9 wei). Se pagan 1e8 wei.

- Contrato del reto: `0xA3768999F2867e32780aD9030FEa9925aD54717d`
- Flag obtenida: `224545436284535728012554405144146672530`

| # | Transacción | Hash | Bloque | Gas | Estado |
|---|---|---|---|---|---|
| 1 | payMe() | `0xf763785f43f770e0ba932771b7f87a7d779f39b7ff0d1f55fb13e48f2c6b059e` | 179 | 26322 | OK |
| 2 | validateFlag(contrato, flag) | `0xbcf34ae473bb2d5784d12e008e478c442ea1c5cec566ec4676e1f1ecf1253fd3` | 180 | 58856 | OK |

Validación en el contrato base (`checkFlag`): **True**

## Nivel 15: Dex_knowledge (150 puntos)

**Tipo de fallo:** Funciones de acuñación sin restricción

`mintA` y `mintB` permiten crear tokens a cualquiera. Se acuñan, se aprueba y se hace un `swapAforB`, y se acuña A hasta igualar saldos (20 y 20).

- Contrato del reto: `0xeF49cA7A778924D9B4527eA8Ca4d65617EC89CA2`
- Flag obtenida: `107783868199018496326562527485511404551`
- Observación: A = 20  B = 20

| # | Transacción | Hash | Bloque | Gas | Estado |
|---|---|---|---|---|---|
| 1 | mintA(10) | `0xe4cfb5d2e7cab87ae71a28d4c5b2d97f92fa6393ab8ae8eb86216fed210d6490` | 185 | 57173 | OK |
| 2 | approve(0xeF49cA7A778924D9B4527eA8Ca4d65617EC89C, 10) | `0xebd429361e15965cf938944006bba427ec1084e9f37baf71a8f642cfc9332acb` | 186 | 46851 | OK |
| 3 | swapAforB(10) | `0xe34f0a3ac55da58e6ac5b1dec25c92f930e97f2c5047adbcf401b25787e0bf9b` | 187 | 103375 | OK |
| 4 | mintA(20) | `0xfb7cf6e6b17d94fbf73e1d5a0f6af7bd0c1cd39074302fc502c18e26874536ed` | 188 | 57173 | OK |
| 5 | validateFlag(contrato, flag) | `0xe5cd6d087bd21fcdee3df4df78ab653db28df73fae125a367f21fe4c1c4a59d0` | 189 | 58856 | OK |

Validación en el contrato base (`checkFlag`): **True**

## Nivel 16: Gas_knowledge (75 puntos)

**Tipo de fallo:** Dependencia del precio de gas

`add(40, 60)` exige `tx.gasprice` mayor que el doble del precio del despliegue. Se envía con 5 gwei y el jugador queda como `owner`.

- Contrato del reto: `0x0f38F570F48aB91e85B6F1c843Dd96cFBDC9cc40`
- Flag obtenida: `105230478578315709399940067705856846182`

| # | Transacción | Hash | Bloque | Gas | Estado |
|---|---|---|---|---|---|
| 1 | add(40, 60) | `0x31849b6831ab754ef4d87d5e923467c8f6396d627dd0a53a6a5f4a88f32b8c6c` | 192 | 29747 | OK |
| 2 | validateFlag(contrato, flag) | `0x2614e1e2403b5052429930bb306490a48ea0d45ba3363a47b8a7ff7c614c093d` | 193 | 58856 | OK |

Validación en el contrato base (`checkFlag`): **True**

## Nivel 17: Send_to_me (100 puntos)

**Tipo de fallo:** Envío forzado de ETH

El contrato no tiene función para recibir ETH. Un contrato auxiliar que ejecuta `selfdestruct(objetivo)` le fuerza saldo de 10 wei y `getFlag()` responde.

- Contrato del reto: `0x4e787A0cd3387562131376E3a173423c5C400e13`
- Flag obtenida: `92037292474580768689779843617325319613`
- Observación: balance del contrato = 10

| # | Transacción | Hash | Bloque | Gas | Estado |
|---|---|---|---|---|---|
| 1 | despliegue de contrato | `0x0d5d7f2811c41d395ab0c52f26ca5025fbdfcce8f16da8979bd0af493d1da7e0` | 196 | 64323 | OK |
| 2 | validateFlag(contrato, flag) | `0x2a6d4be572455722668643a2fce4afd5282e9b5c2850ffc35e8a3a0a13879aa5` | 197 | 58844 | OK |

Validación en el contrato base (`checkFlag`): **True**

## Capturas

- `capturas/01_player_2450_puntos.jpg`: página Player del jugador de prueba, con 2450 puntos y las 18 instancias con flag.
- `capturas/02_marcador_global.jpg`: marcador global de la plataforma.
- `capturas/03_resaltado_solidity.jpg`: página de un reto con el código del contrato resaltado como Solidity.
- `capturas/04_aviso_jugador_registrado.jpg`: aviso de la página de registro cuando la cuenta ya es jugador.
- `capturas/05_portada_tema_noche.jpg` y `capturas/06_portada_tema_dia.jpg`: portada rediseñada en los dos temas.
