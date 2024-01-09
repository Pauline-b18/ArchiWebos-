setupGallery();

function ajoutListenerLogin() {
    const formLogin = document.querySelector(".form-login");
    formLogin.addEventListener("submit", function (event) {
        event.preventDefault(); // empêcher le comportement par défaut

        const login = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value,
        };
        // Création de la charge utile au format JSON
        const chargeUtile = JSON.stringify(login);

        // Appel de la fonction fetch avec les informations nécessaires
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: chargeUtile
        })
        .then(response => {
            // Vérifier si la requête a fonctionné (statut 200)
            if (!response.ok) {
                throw new Error(`Erreur HTTP! Statut: ${response.status}`);
            }

            // Si la requête est réussie, analyse de la réponse JSON
            return response.json();
        })
        .then(data => {
            console.log(data);  // Afficher la réponse dans la console
            if (data.token) {
                // Authentification réussie, stocker le token dans localStorage
                localStorage.setItem('token', data.token);
                console.log("Authentification réussie");

                // délai avant les modifications sur le DOM
            setTimeout(() => {
                // Redirection vers la page index.html
                window.location.href = "./index.html";
                // Modifications sur la page index.html
                const blackBar = document.querySelector('.black-bar');
                const logoutButton = document.querySelector('.logout-button');
                const loginButton = document.querySelector('.login-button');
                const editButton = document.querySelector('.edit-button');
                const categoriesContainer = document.querySelector('.categories');

                // Affichage de la black-bar
                blackBar.style.display = 'block';

                // Affichage du bouton logout et masquage du bouton login
                logoutButton.style.display = 'block';
                loginButton.style.display = 'none';

                // Affichage du bouton d'édition
                editButton.style.display = 'block';

                // Masquage des filtres
                categoriesContainer.style.display = 'none';
            }, 1000);
                
            } else {
                alert("Erreur dans l'identifiant ou le mot de passe");
            }
        })
        .catch(error => {
            console.error("Erreur lors de l'authentification", error);
            alert("Erreur dans l’identifiant ou le mot de passe");
        });
    });
}

// Appel de la fonction ajoutListenerLogin
ajoutListenerLogin();
