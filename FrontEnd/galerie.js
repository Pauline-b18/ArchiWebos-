// Fonction pour récupérer les projets depuis l'API
const apiUrl = "http://localhost:5678/api/works";

// appel de la fonction pour récupérer les projets au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    apiUrl();
});
