document.querySelectorAll('.card-inner').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('expanded'); // Alterna la clase "expanded"
    });
  });
  