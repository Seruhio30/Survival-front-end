document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");
    const messageElement = document.getElementById("message");
    const emailInput = document.getElementById("email");
    const unsubscribeForm = document.getElementById("unsubscribeForm");

    if (!email) {
        messageElement.textContent = "No se encontró información para cancelar la suscripción.";
        unsubscribeForm.style.display = "none"; // Oculta el formulario si no hay email
        return;
    }

    // Prellenar el campo de correo
    emailInput.value = email;

    // Manejo del envío del formulario
    unsubscribeForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evita que se recargue la página

        const confirmDelete = confirm(`¿Estás seguro que deseas cancelar tu suscripción para el correo ${email}?`);

        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:8080/api/subscribers/cancel?email=${email}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    messageElement.textContent = "Tu suscripción ha sido cancelada con éxito. Lamentamos verte partir.";
                    unsubscribeForm.style.display = "none"; // Oculta el formulario tras la cancelación
                } else {
                    messageElement.textContent = "Hubo un problema al cancelar tu suscripción. Por favor, inténtalo más tarde.";
                }
            } catch (error) {
                console.error("Error al procesar la cancelación:", error);
                messageElement.textContent = "Ocurrió un error al intentar procesar tu solicitud.";
            }
        }
    });
});
