document.addEventListener("DOMContentLoaded", async () => {
    const subscriberTableBody = document.querySelector("#subscriberTable tbody");

    // 1. Cargar y mostrar suscriptores
    try {
        const response = await fetch("http://localhost:8080/subscribers");
        const subscribers = await response.json();

        subscribers.forEach(subscriber => {
            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = `${subscriber.firstName ?? ""} ${subscriber.lastName ?? ""}`.trim();

            const emailCell = document.createElement("td");
            emailCell.textContent = subscriber.email ?? "";

            const topicsCell = document.createElement("td");
            topicsCell.textContent = subscriber.topicsOfInterest ?? "";

            const dateCell = document.createElement("td");
            dateCell.textContent = subscriber.subscriptionDate ?? "";

            const actionsCell = document.createElement("td");

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.classList.add("edit-btn");
            editButton.dataset.id = String(subscriber.id ?? "");
            editButton.textContent = "Editar";

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.classList.add("delete-btn");
            deleteButton.dataset.email = subscriber.email ?? "";
            deleteButton.textContent = "Eliminar";

            actionsCell.append(editButton, deleteButton);
            row.append(nameCell, emailCell, topicsCell, dateCell, actionsCell);
            subscriberTableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error al cargar suscriptores:", error);
    }

    // 2. Manejar eliminación de suscriptores
    subscriberTableBody.addEventListener("click", async (event) => {
        if (event.target.classList.contains("delete-btn")) {
            const email = event.target.dataset.email;
            const confirmDelete = confirm(`¿Seguro que quieres eliminar a ${email}?`);

            if (confirmDelete) {
                try {
                    const response = await fetch(`http://localhost:8080/subscribers/cancel?email=${email}`, {
                        method: "DELETE",
                    });

                    if (response.ok) {
                        alert("¡Suscriptor eliminado con éxito!");
                        // Eliminar la fila correspondiente
                        event.target.closest("tr").remove();
                    } else {
                        alert("Error al eliminar el suscriptor.");
                    }
                } catch (error) {
                    console.error("Error al intentar eliminar al suscriptor:", error);
                    alert("No se pudo conectar con el servidor.");
                }
            }
        }

        // 3. Manejar edición de suscriptores
        if (event.target.classList.contains("edit-btn")) {
            const subscriberId = event.target.dataset.id;
            const newTopics = prompt("Ingrese los nuevos temas de interés separados por comas:");

            if (newTopics) {
                try {
                    const response = await fetch(`http://localhost:8080/subscribers/${subscriberId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ topicsOfInterest: newTopics }) // Solo los nuevos temas
                    });

                    if (response.ok) {
                        alert("Temas actualizados.");
                        location.reload(); // Recarga la tabla
                    } else {
                        alert("Error al actualizar los temas.");
                    }
                } catch (error) {
                    console.error("Error al actualizar suscriptor:", error);
                }
            }
        }


    });

    // 4. Configurar gráfico de suscriptores
    const ctx = document.getElementById('myChart').getContext('2d');

    // Simulación de datos para el gráfico (reemplazar con datos reales del backend si es necesario)
    const labels = ["Enero", "Febrero", "Marzo", "Abril", "Mayo"];
    const data = [10, 20, 30, 40, 50]; // Datos de suscriptores por mes

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Suscriptores por mes',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: { enabled: true }
            }
        }
    });
});
