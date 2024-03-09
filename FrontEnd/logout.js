document.addEventListener('DOMContentLoaded', function() {
    const storedToken = localStorage.getItem('token'); //Récupération du token d'authentification depuis le localStorage
    const logout = document.querySelector(".logout-button");
    const login = document.querySelector(".login-button");  

    // Si token présent (utilisateur connecté), afficher logout à la place de login
    if (storedToken) {
        logout.style.display = "block";
        login.style.display = "none";
    
        } else {
        logout.style.display = "none";
        login.style.display = "block";
        }
    }
);

// Fonction de déconnexion de l'utilisateur
function deconnexion() {
    window.localStorage.clear(); // Efface le token du localStorage
    window.location.href = "./index.html";
  }
  const boutonDeconnexion = document.querySelector('.logout-button');
  boutonDeconnexion.addEventListener("click", function(event) {
    event.preventDefault();
      deconnexion();
  });