# Guía de correcciones: niveles 9, 10 y 13

Esta guía acompaña la parte del proyecto que consiste en **corregir las fallas** de los contratos vulnerables. Los retos del grupo quedaron así: niveles 0 (Interact), 5 (Relottery) y 12 (Replay_Me) para un integrante; niveles 9 (Rich_Club), 10 (Deny_To_Me) y 13 (Guess_my_number) para la otra. Esta guía cubre los tres últimos. Cada nivel tiene una sección con lo que debe aprender, una pista de qué cambiar y cómo comprobar que la corrección funciona. No incluye el código corregido: la idea es que lo escriba y lo explique con sus palabras en la sustentación.

## Cómo trabajar cada nivel

1. Lea el contrato original en `level_up/contracts/` (por ejemplo `rich_club.sol`) y la explicación del nivel en `evidencia/evidencia.md`.
2. Responda por escrito, en dos o tres frases: ¿qué garantía de seguridad debería dar este contrato y cuál no cumple?
3. Escriba la versión corregida en `correcciones/nivel_XX.sol`. Deje un comentario breve que diga qué cambió y por qué.
4. Compile y despliegue las dos versiones, la original y la corregida, en Ganache. La forma más sencilla es [Remix](https://remix.ethereum.org) con el proveedor "Injected Provider (MetaMask)" y la red Ganache Local (chain id 1337).
5. Compruebe que el comportamiento legítimo sigue funcionando en la versión corregida y que la operación indebida ya no es posible. Anote el resultado con una captura.

La plataforma despliega siempre el contrato original; por eso las versiones corregidas se despliegan aparte, con Remix.

## Qué entregar por nivel

- El archivo `correcciones/nivel_XX.sol`.
- Una explicación de media página: el fallo, la corrección y por qué es suficiente.
- La captura o el registro de la prueba, con el contrato original y el corregido.

## Nivel 9: Rich_Club

- **Principio violado:** decidir un privilegio a partir de un dato que puede cambiar dentro de la misma transacción.
- **Qué debe cambiar:** el acceso no puede depender solo del saldo de un token en el instante de la llamada. Piense en qué dato sí es difícil de falsear en una sola transacción.
- **Pista:** compare "saldo ahora" con "saldo registrado antes" o con una condición que exija tiempo.
- **Cómo comprobar:** el uso normal sigue funcionando para quien cumple la condición de la versión corregida, y los intentos de obtener el acceso con un saldo momentáneo se rechazan.

## Nivel 10: Deny_To_Me

- **Principio violado:** una operación importante no debe depender de que un tercero acepte recibir ETH.
- **Qué debe cambiar:** el contrato no debe enviar pagos a direcciones externas dentro del flujo principal. Investigue el patrón de retiro (*pull over push*).
- **Pista:** guarde lo que se debe a cada dirección y deje que cada una lo retire por su cuenta.
- **Cómo comprobar:** el flujo principal ya no se bloquea cuando una dirección rechaza ETH.



## Nivel 13: Guess_my_number

- **Principio violado:** dos fallos distintos. Un `delegatecall` hacia código que el usuario puede invocar libremente, y un secreto guardado en claro.
- **Qué debe cambiar:** quitar la delegación abierta (o limitarla a funciones y destinos fijos) y no guardar el número en claro.
- **Pista:** repase por qué `delegatecall` usa el almacenamiento del contrato que llama y qué implica para el orden de las variables.
- **Cómo comprobar:** no se puede cambiar `owner` mediante llamadas delegadas.





## Para la sustentación

Cada integrante explica sus niveles. Una buena explicación responde, en este orden:

1. ¿Qué debía garantizar el contrato?
2. ¿Qué parte del código lo impedía?
3. ¿Qué cambió en la versión corregida?
4. ¿Cómo se comprobó que el cambio funciona?

## Referencias

- Solidity Docs: [Security Considerations](https://docs.soliditylang.org/en/latest/security-considerations.html).
- SWC Registry: [Smart Contract Weakness Classification](https://swcregistry.io/). Ya no se actualiza, pero sirve para nombrar cada falla con su código.
- OpenZeppelin Contracts: [Access Control](https://docs.openzeppelin.com/contracts/5.x/access-control) y [PullPayment](https://docs.openzeppelin.com/contracts/4.x/api/security#PullPayment) (versión 4.x; en la 5.x ya no existe).
- Consensys: [Smart Contract Best Practices](https://consensysdiligence.github.io/smart-contract-best-practices/).
