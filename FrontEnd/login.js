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
                window.localStorage.setItem('token', data.token);
                console.log("Authentification réussie");
                window.location.href = "./index.html";
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