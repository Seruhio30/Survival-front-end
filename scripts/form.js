document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("subscriptionForm");

    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            console.log("El formulario fue enviado");

            const subscriberData = {
                firstName: form.fname.value,
                lastName: form.lname.value,
                email: form.email.value,
                topicsOfInterest: [
                    form.check1.checked ? "Terremotos" : "",
                    form.check2.checked ? "Inundaciones" : "",
                    form.check3.checked ? "Huracanes" : "",
                    form.check4.checked ? "Deslizamientos" : ""
                ].filter(Boolean).join(", ")
            };
            console.log("Datos que se envían:", subscriberData);
            try {
                const response = await fetch("http://localhost:8080/api/subscribers/subscribe", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(subscriberData)
                });

                if (response.ok) {
                    alert("¡Suscripción completada con éxito!");
                    window.location.href = "thanks.html"; // Redirigir a la página de agradecimiento
                    form.reset();
                } else {
                    alert("Hubo un problema con la suscripción.");
                }
                
            } catch (error) {
                console.error("Error al enviar la suscripción:", error);
            }
        });
    } else {
        console.log("Formulario de suscripción no encontrado en esta página.");
    }
});
