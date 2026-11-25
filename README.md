# Semestral de Criptografía: plataforma de retos de seguridad en contratos inteligentes

Universidad Tecnológica de Panamá, Facultad de Ingeniería de Sistemas Computacionales.
Asignatura: Criptografía. Profesor: Mgtr. José Moreno.

Este repositorio documenta el despliegue de la plataforma [Level Up](https://github.com/Telefonica/level_up) (Telefónica), la resolución de sus 18 retos y la evidencia de cada uno.

## Estructura

| Carpeta | Contenido |
|---|---|
| `config/` | `compose.yaml` con los ajustes necesarios para levantar la plataforma con Podman o Docker. |
| `soluciones/` | Script que despliega y resuelve cada nivel, y los contratos atacantes en Solidity. |
| `evidencia/` | Registro de la prueba (contrato, transacciones, flag y validación por nivel) y capturas. |

## Puesta en marcha

1. Clonar Level Up y reemplazar su `compose.yaml` por `config/compose.yaml`:
   ```bash
   git clone https://github.com/Telefonica/level_up
   cp config/compose.yaml level_up/compose.yaml
   cd level_up
   docker compose up -d
   ```
   La aplicación queda en `http://localhost:5000` y la cadena Ganache en `http://localhost:8545` (chain id 1337).
2. En MetaMask agregar la red "Ganache Local" (RPC `http://localhost:8545`, chain id 1337) y fondear la cuenta con ETH de prueba desde la cuenta dueña de Ganache.
3. Registrar al jugador desde la página (`Player` → `Crear player`) y resolver los niveles.

### Ajustes hechos al `compose.yaml`

- La imagen de Ganache se escribe completa (`docker.io/trufflesuite/ganache:v7.7.4`). Podman no resuelve nombres cortos de imágenes.
- Se agrega la variable `LEVEL_NFT=1004`. Sin ella la aplicación termina con `KeyError: '1000'` al arrancar.

### Problemas encontrados

- **Reinicio de Ganache.** Ganache no guarda su estado: al reiniciar la cadena queda vacía, pero la aplicación conserva `contract-address.json` con direcciones que ya no existen y `/player` falla. Se resuelve con `docker compose down` y luego `docker compose up -d`, volviendo a fondear la cuenta.
- **Error 4100 de MetaMask.** `eth_sendTransaction` devolvía "The requested account and/or method has not been authorized by the user" aunque el sitio estaba conectado. Se corrigió revocando el permiso del sitio en MetaMask y volviendo a conectarlo.
- **`/player` sin dirección.** La página falla si se abre sin `?user_address=`; hay que entrar desde el menú con MetaMask conectado.

## Soluciones

`soluciones/solve.py` usa `web3.py`, despliega cada nivel por la ruta normal de la aplicación (`POST /deploy`), lo resuelve con transacciones de un jugador de prueba y valida la flag con `validateFlag`.

```bash
cd soluciones
npm install solc@0.8.19 && node compile.js      # genera attackers.json
# copiar a la aplicación (ajustar el nombre del contenedor) y ejecutar
docker cp solve.py attackers.json fund.py <contenedor>:/tmp/
docker cp player.key <contenedor>:/tmp/player.key   # llave de prueba, 0x + 64 hex
docker exec <contenedor> python /tmp/fund.py
docker exec <contenedor> python /tmp/solve.py        # todos los niveles, o: solve.py 4 9 12
```

## Resumen de fallos por nivel

| Nivel | Reto | Fallo |
|---|---|---|
| 0 | Interact | Tutorial |
| 1 | Questions | Lógica deducible desde el contrato |
| 2 | Ownership | Dato `private` legible con `getStorageAt` |
| 3 | Safeguarding | Control de acceso defectuoso |
| 4 | Origin | `tx.origin` en lugar de `msg.sender` |
| 5 | Relottery | Dato `private` legible |
| 6 | Overworld | Desbordamiento aritmético (Solidity 0.6) |
| 7 | Blockchain_Tour | Dato en el calldata de una transacción |
| 8 | Snippet_Delegated | `delegatecall` con almacenamiento compartido |
| 9 | Rich_Club | Préstamo relámpago (flash loan) |
| 10 | Deny_To_Me | Denegación de servicio por receptor que revierte |
| 11 | Forensic_Ouch | Dato `private` y análisis forense |
| 12 | Replay_Me | Reutilización de firma |
| 13 | Guess_my_number | `delegatecall` y dato `private` |
| 14 | Pay_me | Control de acceso por pago |
| 15 | Dex_knowledge | Acuñación de tokens sin restricción |
| 16 | Gas_knowledge | Dependencia del precio de gas |
| 17 | Send_to_me | Envío forzado de ETH con `selfdestruct` |

El detalle de cada uno, con hashes de transacción y flags, está en [`evidencia/evidencia.md`](evidencia/evidencia.md).

## Referencias

- Telefónica. *Level_Up!* https://github.com/Telefonica/level_up
- *Level_Up! Configuración paso a paso de la plataforma de pentesting en Web3.* https://www.elladodelmal.com/2023/06/levelup-configuracion-paso-paso-de-la.html
