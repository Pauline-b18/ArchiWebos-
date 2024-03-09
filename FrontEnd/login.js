function ajoutListenerLogin() {
    const formLogin = document.querySelector(".form-login");
    formLogin.addEventListener("submit", function (event) {
        event.preventDefault(); // empêcher le comportement par défaut (rechargement de page)

        const login = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
        };
        // Création de la charge utile au format JSON
        const chargeUtile = JSON.stringify(login); //L'objet "login" est converti en chaine JSON

        // Appel de la fonction fetch avec les informations nécessaires
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin':'*' },
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
            if (data.token) {
                // Authentification réussie, stocker le token dans localStorage
                window.localStorage.setItem('token', data.token);
                window.location.href = "./index.html";
            } else {
                alert("Erreur dans l'identifiant ou le mot de passe");
            }
        })
        .catch(error => {
            alert("Erreur dans l’identifiant ou le mot de passe");
        });
    });
}

// Appel de la fonction ajoutListenerLogin
ajoutListenerLogin();