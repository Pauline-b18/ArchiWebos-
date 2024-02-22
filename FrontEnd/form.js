document.addEventListener('DOMContentLoaded', function () {
    const uploadForm = document.getElementById("uploadForm");
    const categorySelect = document.getElementById("category");
    const photoInput = document.getElementById("image");
    const photoLabel = document.getElementById("photoLabel");
    const photoIcon = document.getElementById("photo-icon");
    const photoPreview = document.getElementById("photo-preview");
    const choosePhotoButton = document.querySelector(".choose-photo-button");
    const myModal = document.getElementById("myModal");
    const returnButton = document.getElementById("returnButton");
    const closeButton = document.getElementById("close");
    const formContent = document.getElementById("form-content");
    const submitButton = document.querySelector('.submit-button'); // Sélectionnez le bouton de soumission

    
    // Fonction pour vérifier si tous les champs du formulaire sont remplis
    function checkFormValidity() {
        const titleInput = document.getElementById('title');
        const categorySelect = document.getElementById('category');
        const photoInput = document.getElementById('image');
        const errorMessage = document.getElementById('form-error-message');
    
        // Vérifie si l'un des trois champs est vide
        if (!titleInput.value.trim() || categorySelect.value === '0' || !photoInput.files.length) {
            errorMessage.textContent = 'Veuillez renseigner tous les champs du formulaire.';
            errorMessage.style.display = 'block';
            return false; // Retourne false car un champ est vide
        } else {
            // Si tous les champs sont remplis, masque le message d'erreur s'il existe
            errorMessage.textContent = '';
            errorMessage.style.display = 'none';
            return true; // Retourne true car tous les champs sont remplis
        }
    }

    // Eventlistener pour les champs du formulaire
    uploadForm.addEventListener('input', () => {
        // La propriété disabled est définie par le résultat de la vérification de la validité du formulaire
        submitButton.disabled = !checkFormValidity();
        // La classe 'disabled' est ajoutée/retirée en fonction de la validité du formulaire
        submitButton.classList.toggle('disabled', !checkFormValidity());
        // La couleur de fond est définie en vert si le formulaire est valide, sinon elle reste grise
        submitButton.style.backgroundColor = checkFormValidity() ? '#1D6154' : '#B3B3B3';
    });

    // Écouteur d'événement pour la soumission du formulaire
    uploadForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Empêche le rechargement par défaut de la page

        // Fonction pour vérifier si tous les champs du formulaire sont remplis
        function checkFormValidity() {
            const titleInput = document.getElementById('title');
            const categorySelect = document.getElementById('category');
            const photoInput = document.getElementById('image');

            // Vérifie si l'un des trois champs est vide
            if (!titleInput.value.trim() || categorySelect.value === '0' || !photoInput.files.length) {
                const errorMessage = document.getElementById('title-error-message');
                if (!errorMessage) {
                    const errorElement = document.createElement('p');
                    errorElement.id = 'title-error-message';
                    errorElement.textContent = 'Veuillez renseigner tous les champs du formulaire.';
                    errorElement.style.color = 'red';
                    // Ajoute l'erreur après le champ du titre
                    titleInput.parentNode.insertBefore(errorElement, titleInput.nextSibling);
                }
                return false; // Retourne false car un champ est vide
            } else {
                // Si tous les champs sont remplis, supprime le message d'erreur s'il existe
                const errorMessage = document.getElementById('title-error-message');
                if (errorMessage) {
                    errorMessage.parentNode.removeChild(errorMessage);
                }
                return true; // Retourne true car tous les champs sont remplis
            }
        }

        // Vérifie si tous les champs sont remplis avant de soumettre le formulaire
        if (checkFormValidity()) {
            const formData = new FormData(uploadForm); // Crée un objet FormData contenant les données du formulaire
            // Appelle la fonction pour télécharger l'image
            uploadImage(formData);
        }
    });

    //Fonction pour envoyer une image vers le serveur
    function uploadImage(formData) {
        const token = localStorage.getItem('token');
    
        if (!token) { //Vérifie si le token est présent
            console.error('Token d\'authentification manquant.');
            return;
        }
    
        const headers = new Headers();
        headers.append('Authorization', `Bearer ${token}`); //Ajoute le token d'authentification au headers de la requête
    
        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            body: formData, // Utilise les données FormData passées en paramètre
            headers: headers,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors du téléversement de la photo');
            }
            return response.json();
        })
        .then(data => {
            // Ferme la modalité en changeant son style pour le rendre invisible
            myModal.style.display = 'none';
            //Enregistre dans le stockage local du navigateur que le formulaire a été soumis
            localStorage.setItem('formSubmitted', 'true');
            //Redirection de l'utilisateur depuis la fenêtre parent
            window.parent.location.href = 'index.html';
        })
        .catch(error => {
            console.error(error.message);
        });
    }
    
   //Fonction pour charger les catégories depuis l'API et les afficher dans le menu déroulant
   function loadCategories() {
    const categorySelect = document.getElementById("category");
    if (!categorySelect) {
        console.error("L'élément categorySelect est introuvable.");
        return;
    }

    fetch("http://localhost:5678/api/categories")
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des catégories');
            }
            return response.json();
        })
        .then(categories => {
            categorySelect.innerHTML = "";

            // Ajoute l'option "Sélectionner une catégorie"
            const defaultOption = document.createElement('option');
            defaultOption.value = '0'; // La valeur vide
            defaultOption.textContent = 'Sélectionner une catégorie';
            categorySelect.appendChild(defaultOption);

            // Itère sur chaque catégorie dans les données récupérées
            categories.forEach(category => {
                const option = document.createElement("option"); // Crée un élément <option> pour chaque catégorie
                option.value = category.id; // Définit la valeur de l'option comme l'ID de la catégorie
                option.textContent = category.name; // Définit le texte de l'option comme le nom de la catégorie
                categorySelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error(error.message);
        });
}


    loadCategories();

    photoInput.addEventListener('change', (event) => {
        const selectedPhoto = event.target.files[0];

        // Vérification de la taille de l'image
        const maxSize = 4 * 1024 * 1024; // 4 Mo
        if (selectedPhoto.size > maxSize) {
            alert("La photo est trop volumineuse. Veuillez sélectionner une photo de moins de 4 Mo.");
            photoInput.value = '';
            return;
        }
    
        // Vérification du format de l'image
        const validFormats = ['image/jpeg', 'image/png'];
        if (!validFormats.includes(selectedPhoto.type)) {
            alert("Le format de la photo n'est pas supporté. Veuillez sélectionner une photo au format JPEG ou PNG.");
            photoInput.value = '';
            return;
        }
    
        // Si l'image valide toutes les conditions, affiche l'aperçu de l'image
        const photoUrl = URL.createObjectURL(selectedPhoto);
        photoPreview.src = photoUrl;
        photoPreview.style.display = 'block';
        photoIcon.style.display = 'none';
        choosePhotoButton.style.display = 'none';
        photoLabel.style.backgroundColor = '#E8F1F6';
    });

    closeButton.addEventListener("click", () => {
        window.parent.location.href = 'index.html';
    });

      
});