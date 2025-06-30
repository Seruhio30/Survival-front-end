console.log("Archivo JS actualizado cargado");
alert("Archivo JS cargado");
console.log("Archivo JS cargado");


document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded: El DOM está listo");
    alert("Archivo JS cargado");
    console.log("Archivo JS cargado");


    // ✅ ACTUALIZAR INTERESES
    const updateForm = document.getElementById("updateSubscriptionForm");
    console.log("Buscando formulario updateSubscriptionForm:", updateForm);

    if (updateForm) {
        updateForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            console.log("Submit detectado en formulario actualizar intereses");

            const requestData = {
                email: updateForm.email.value,
                terremoto: updateForm.check1.checked,
                inundacion: updateForm.check2.checked,
                huracan: updateForm.check3.checked,
                deslizamiento: updateForm.check4.checked,
            };

            console.log("Datos a enviar para actualización:", requestData);

            try {
                const response = await fetch("http://localhost:8080/subscribers/actualizar", {
                    method: "POST", // CORREGIDO a POST según backend
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestData),
                });

                console.log("Respuesta recibida, status:", response.status);

                if (response.ok) {
                    alert("Intereses actualizados con éxito.");
                    console.log("Intereses actualizados correctamente");
                } else {
                    const text = await response.text();
                    alert("Error: " + text);
                    console.error("Error al actualizar intereses:", text);
                }
            } catch (error) {
                console.error("Error en fetch al actualizar intereses:", error);
            }
        });
    } else {
        console.warn("Formulario actualizar intereses NO encontrado");
    }

    // ✅ CANCELAR SUSCRIPCIÓN
    const cancelForm = document.getElementById("cancelSubscriptionForm");
    console.log("Buscando formulario cancelSubscriptionForm:", cancelForm);

    if (cancelForm) {
        cancelForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            console.log("Submit detectado en formulario cancelar suscripción");

            const requestData = {
                email: cancelForm.email.value,
            };

            console.log("Datos a enviar para cancelar:", requestData);

            try {
                const response = await fetch("http://localhost:8080/subscribers/cancelar", {
                    method: "POST", // CORRECTO usar POST según backend
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestData),
                });

                console.log("Respuesta recibida, status:", response.status);

                if (response.ok) {
                    alert("Suscripción cancelada con éxito.");
                    console.log("Suscripción cancelada correctamente");
                } else {
                    const text = await response.text();
                    alert("Error al cancelar: " + text);
                    console.error("Error al cancelar suscripción:", text);
                }
            } catch (error) {
                console.error("Error en fetch al cancelar suscripción:", error);
            }
        });
    } else {
        console.warn("Formulario cancelar suscripción NO encontrado");
    }
});
