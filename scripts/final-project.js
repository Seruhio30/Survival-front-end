// console.log("El archivo JavaScript se ha cargado correctamente.");

// document.addEventListener("DOMContentLoaded", function() {
//     initializeYear();
//     initializeLastModified();
//     setupHamburgerMenu();
//     setupCardFlip();
//     setupScrollButton();
//     initializeStoredData();

//     const form = document.getElementById("subscriptionForm");

//     if (form) {
//         form.addEventListener("submit", async (event) => {
//             event.preventDefault();
//             console.log("El formulario fue enviado");

//             const subscriberData = {
//                 firstName: form.fname.value,
//                 lastName: form.lname.value,
//                 email: form.email.value,
//                 topicsOfInterest: [
//                     form.check1.checked ? "Terremotos" : "",
//                     form.check2.checked ? "Inundaciones" : "",
//                     form.check3.checked ? "Huracanes" : "",
//                     form.check4.checked ? "Deslizamientos" : ""
//                 ].filter(Boolean).join(", ")
//             };
//             console.log("Datos que se envían:", subscriberData);
//             try {
//                 const response = await fetch("http://localhost:8080/api/subscribers/subscribe", {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify(subscriberData)
//                 });

//                 if (response.ok) {
//                     alert("¡Suscripción completada con éxito!");
//                     window.location.href = "thanks.html"; // Redirigir a la página de agradecimiento
//                     form.reset();
//                 } else {
//                     alert("Hubo un problema con la suscripción.");
//                 }
                
//             } catch (error) {
//                 console.error("Error al enviar la suscripción:", error);
//             }
//         });
//     } else {
//         console.log("Formulario de suscripción no encontrado en esta página.");
//     }
// });


// function initializeYear() {
//     const currentYearElement = document.getElementById("currentyear");
//     if (currentYearElement) {
//         currentYearElement.textContent = new Date().getFullYear();
//     }
// }

// function initializeLastModified() {
//     const lastModifiedElement = document.getElementById("lastModified");
//     if (lastModifiedElement) {
//         lastModifiedElement.textContent = document.lastModified;
//     }
// }

// function setupHamburgerMenu() {
//     const hamButton = document.querySelector('#hamburger');
//     const navigation = document.querySelector('#nav-menu');

//     if (hamButton && navigation) {
//         hamButton.addEventListener('click', () => {
//             navigation.classList.toggle('open');
//             hamButton.classList.toggle('open');
//         });

//         document.addEventListener('click', (event) => {
//             if (!navigation.contains(event.target) && !hamButton.contains(event.target)) {
//                 navigation.classList.remove('open');
//                 hamButton.classList.remove('open');
//             }
//         });
//     }
// }

// function setupCardFlip() {
//     document.querySelectorAll('.card').forEach(card => {
//         card.addEventListener('click', () => {
//             card.querySelector('.card-inner').classList.toggle('is-flipped');
//         });
//     });
// }

// function setupScrollButton() {
//     const scrollButton = document.getElementById("more-info");
//     if (scrollButton) {
//         scrollButton.addEventListener('click', function () {
//             window.location.href = 'secondaryPage.html#backPack72';
//         });
//     }
// }

// function initializeStoredData() {
//     const userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
//     const theme = userPreferences.theme || 'light';

//     document.body.classList.toggle('dark-theme', theme === 'dark');

//     const saveButton = document.getElementById('save-preferences');
//     if (saveButton) {
//         saveButton.addEventListener('click', () => {
//             const newTheme = document.querySelector('input[name="theme"]:checked').value;
//             localStorage.setItem('userPreferences', JSON.stringify({ theme: newTheme }));
//             document.body.classList.toggle('dark-theme', newTheme === 'dark');
//         });
//     }
// }
