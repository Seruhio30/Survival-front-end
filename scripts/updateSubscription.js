document.addEventListener("DOMContentLoaded", function () {
    // Actualizar intereses
    const updateForm = document.getElementById("updateSubscriptionForm");
    if (updateForm) {
        updateForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = updateForm.email.value;
            const topicsOfInterest = [
                updateForm.check1.checked ? "Terremotos" : "",
                updateForm.check2.checked ? "Inundaciones" : "",
                updateForm.check3.checked ? "Huracanes" : "",
                updateForm.check4.checked ? "Deslizamientos" : ""
            ].filter(Boolean).join(", ");

            const requestData = { email, topicsOfInterest };

            try {
                const response = await fetch("http://localhost:8080/api/subscribers/update", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestData)
                });

                if (response.ok) {
                    alert("Intereses actualizados con éxito.");
                } else {
                    alert("Hubo un problema al actualizar tus intereses.");
                }
            } catch (error) {
                console.error("Error al actualizar intereses:", error);
            }
        });
    }

    // Cancelar suscripción
    const cancelForm = document.getElementById("cancelSubscriptionForm");
    if (cancelForm) {
        cancelForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = cancelForm.email.value;

            try {
                const response = await fetch(`http://localhost:8080/api/subscribers/cancel?email=${email}`, {
                    method: "DELETE"
                });

                if (response.ok) {
                    alert("Suscripción cancelada con éxito.");
                } else {
                    alert("Hubo un problema al cancelar la suscripción.");
                }
            } catch (error) {
                console.error("Error al cancelar suscripción:", error);
            }
        });
    }
});
