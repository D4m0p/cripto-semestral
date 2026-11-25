/*
 * Utilidades de billetera compartidas por todas las páginas.
 * - Avisos visibles (en lugar de errores solo en la consola).
 * - Detección de MetaMask ausente, red incorrecta y solicitudes rechazadas.
 * - Espera a que un contrato recién desplegado sea visible para MetaMask.
 */
(function () {
  const CHAIN_ID = 1337;
  const CHAIN_HEX = "0x539";
  const LU = (window.LU = {});

  function box() {
    return document.getElementById("lu-alert");
  }

  // kind: success | info | warning | danger. actions: [{label, onClick}]
  LU.alert = function (kind, message, actions) {
    const el = box();
    if (!el) return;
    el.replaceChildren();
    const div = document.createElement("div");
    div.className = "alert alert-" + kind + " d-flex flex-wrap align-items-center justify-content-between gap-2 text-start";
    div.setAttribute("role", "alert");
    const span = document.createElement("span");
    span.textContent = message;
    div.appendChild(span);
    if (actions && actions.length) {
      const group = document.createElement("span");
      group.className = "d-flex gap-2";
      actions.forEach(function (a) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "btn btn-sm btn-outline-" + (kind === "danger" ? "danger" : "dark");
        b.textContent = a.label;
        b.addEventListener("click", a.onClick);
        group.appendChild(b);
      });
      div.appendChild(group);
    }
    el.appendChild(div);
  };

  LU.clear = function () {
    const el = box();
    if (el) el.replaceChildren();
  };

  LU.hasWallet = function () {
    return typeof window.ethereum !== "undefined";
  };

  // Traduce los errores de MetaMask / ethers a un mensaje comprensible.
  LU.friendlyError = function (e) {
    const code = e && (e.code !== undefined ? e.code : e.error && e.error.code);
    const msg = String((e && (e.reason || e.message)) || e || "");
    if (code === 4001 || code === "ACTION_REJECTED") {
      return "Usted rechazó la solicitud en MetaMask. Puede intentarlo de nuevo.";
    }
    if (code === 4100) {
      return "MetaMask no autorizó la operación para este sitio. En MetaMask abra \"Sitios conectados\", desconecte este sitio y vuelva a conectarlo.";
    }
    if (code === -32002) {
      return "Ya hay una solicitud pendiente en MetaMask. Ábrala desde el ícono de la extensión y confírmela o recházela.";
    }
    if (code === "INSUFFICIENT_FUNDS" || /insufficient funds/i.test(msg)) {
      return "La cuenta no tiene saldo suficiente en esta red para pagar el gas.";
    }
    if (/already registered/i.test(msg)) {
      return "Esta cuenta ya está registrada como jugador.";
    }
    if (/not registered|player not found/i.test(msg)) {
      return "Esta cuenta no está registrada como jugador.";
    }
    if (code === "NETWORK_ERROR" || /network|failed to fetch/i.test(msg)) {
      return "No se pudo comunicar con la red. Verifique que Ganache esté en ejecución y que MetaMask use la red Ganache Local.";
    }
    return "Ocurrió un error: " + (msg.length > 200 ? msg.slice(0, 200) + "..." : msg);
  };

  LU.switchNetwork = async function () {
    try {
      await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: CHAIN_HEX }] });
    } catch (e) {
      if (e && e.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: CHAIN_HEX,
            chainName: "Ganache Local",
            rpcUrls: ["http://localhost:8545"],
            nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
          }],
        });
      } else {
        throw e;
      }
    }
  };

  // Conecta la billetera y valida la red. Devuelve { provider, address } o null
  // (tras mostrar el aviso correspondiente).
  LU.connect = function () {
    // Si ya hay una conexión en curso se reutiliza, para no pedirle a MetaMask dos veces.
    if (!LU._pending) {
      LU._pending = LU._connect().finally(function () { LU._pending = null; });
    }
    return LU._pending;
  };

  LU._connect = async function () {
    if (!LU.hasWallet()) {
      LU.alert("warning", "No se detectó MetaMask en este navegador. Instálelo y recargue la página para jugar.");
      return null;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let address;
    try {
      await provider.send("eth_requestAccounts", []);
      address = await provider.getSigner().getAddress();
    } catch (e) {
      LU.alert("warning", LU.friendlyError(e), [{ label: "Conectar", onClick: function () { location.reload(); } }]);
      return null;
    }
    const chain = parseInt(await window.ethereum.request({ method: "eth_chainId" }), 16);
    if (chain !== CHAIN_ID) {
      LU.alert("warning", "MetaMask está en otra red (chain id " + chain + "). Esta plataforma usa Ganache Local (chain id " + CHAIN_ID + ").", [
        {
          label: "Cambiar de red",
          onClick: async function () {
            try {
              await LU.switchNetwork();
              location.reload();
            } catch (e) {
              LU.alert("danger", LU.friendlyError(e));
            }
          },
        },
      ]);
      return { provider: provider, address: address, wrongChain: true };
    }
    LU.clear();
    return { provider: provider, address: address, wrongChain: false };
  };

  // Tras desplegar, MetaMask puede tardar un instante en ver el contrato nuevo.
  // Sin esta espera, la primera llamada devuelve datos vacíos (CALL_EXCEPTION).
  LU.waitForCode = async function (address, tries) {
    tries = tries || 20;
    for (let i = 0; i < tries; i++) {
      try {
        const code = await window.ethereum.request({ method: "eth_getCode", params: [address, "latest"] });
        if (code && code !== "0x") return true;
      } catch (e) { /* se reintenta */ }
      await new Promise(function (r) { setTimeout(r, 500); });
    }
    return false;
  };
})();
