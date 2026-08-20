document.addEventListener("DOMContentLoaded", () => {
  const joinLinks = document.querySelectorAll('a[href$="form.html"]');

  if (!joinLinks.length) {
    return;
  }

  const overlay = document.createElement("div");
  overlay.id = "joinBetaOverlay";
  overlay.hidden = true;

  overlay.innerHTML = `
    <div class="join-beta-modal" role="dialog" aria-modal="true" aria-labelledby="joinBetaTitle">
      <h2 id="joinBetaTitle">Suscripción en fase de pruebas</h2>

      <p>
        Survival72 continúa en desarrollo. Puedes registrarte para ayudarnos
        a probar el sistema, pero algunas funciones de comunicación todavía
        pueden cambiar mientras completamos el despliegue público.
      </p>

      <p>
        Cuando el servicio esté disponible públicamente, recibirás contenido
        práctico de preparación según los temas que hayas seleccionado.
        Solo queremos escribirte cuando tengamos algo que realmente valga la
        pena compartir.
      </p>

      <div class="join-beta-actions">
        <button type="button" id="joinBetaCancel">Volver</button>
        <a href="form.html" id="joinBetaContinue">Continuar al formulario</a>
      </div>
    </div>
  `;

  const style = document.createElement("style");
  style.textContent = `
    #joinBetaOverlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background: rgba(0, 0, 0, 0.65);
    }

    #joinBetaOverlay[hidden] {
      display: none;
    }

    .join-beta-modal {
      width: min(100%, 620px);
      max-height: 90vh;
      overflow-y: auto;
      padding: 1.5rem;
      border-radius: 16px;
      background: #ffffff;
      color: #1f2937;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .join-beta-modal h2 {
      margin-top: 0;
    }

    .join-beta-modal p {
      line-height: 1.6;
    }

    .join-beta-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      justify-content: flex-end;
      margin-top: 1.5rem;
    }

    .join-beta-actions button,
    .join-beta-actions a {
      min-height: 44px;
      padding: 0.7rem 1rem;
      border-radius: 8px;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    .join-beta-actions button {
      border: 1px solid #777;
      background: #ffffff;
      color: #1f2937;
    }

    .join-beta-actions a {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
      background: #0b6e4f;
      color: #ffffff;
    }

    .join-beta-actions button:focus-visible,
    .join-beta-actions a:focus-visible {
      outline: 3px solid #e9b949;
      outline-offset: 3px;
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(overlay);

  const cancelButton = document.getElementById("joinBetaCancel");
  const continueLink = document.getElementById("joinBetaContinue");

  let lastFocusedElement = null;

  joinLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      lastFocusedElement = link;
      continueLink.href = link.href;

      overlay.hidden = false;
      cancelButton.focus();
    });
  });

  function closeModal() {
    overlay.hidden = true;

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  cancelButton.addEventListener("click", closeModal);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !overlay.hidden) {
      closeModal();
    }
  });
});
