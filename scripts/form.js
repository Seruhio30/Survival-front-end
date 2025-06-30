document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("subscriptionForm");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const data = {
            nombre: form.nombre.value.trim(),
            apellido: form.apellido.value.trim(),
            email: form.email.value.trim(),
            ciudad: form.ciudad.value.trim() || "No especificada",
            terremoto: form.terremoto.checked,
            huracan: form.huracan.checked,
            inundacion: form.inundacion.checked,
            deslizamiento: form.deslizamiento.checked
        };
        console.log("Enviando:", data);

        try {
            const res = await fetch("http://localhost:8080/subscribers/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const mensaje = await res.text();
            alert(mensaje);

            if (res.ok) {
                form.reset();
                window.location.href = "thanks.html";
            }
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo completar la suscripción.");
        }
    });
});
