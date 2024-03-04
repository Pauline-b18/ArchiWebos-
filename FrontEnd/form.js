document.addEventListener('DOMContentLoaded', function () {
    const uploadForm = document.getElementById("uploadForm");
    const photoInput = document.getElementById("image");
    const photoLabel = document.getElementById("photoLabel");
    const photoIcon = document.getElementById("photo-icon");
    const photoPreview = document.getElementById("photo-preview");
    const choosePhotoButton = document.querySelector(".choose-photo-button");
    const myModal = document.getElementById("myModal");
    const closeButton = document.getElementById("close");
    const submitButton = document.querySelector('.submit-button');
    
    // Fonction pour afficher le message d'erreur
    function displayErrorMessage() {
        const errorMessage = document.getElementById('form-error-message');
        if (!errorMessage) {
            const errorElement = document.createElement('p');
            errorElement.id = 'form-error-message';
            errorElement.textContent = 'Veuillez renseigner tous les champs du formulaire.';
            errorElement.style.color = 'red';
            uploadForm.appendChild(errorElement);
        }
    }

    // Fonction pour changer la couleur du bouton de soumission
    function changeButtonColor() {
        const titleInput = document.getElementById('title');
        const categorySelect = document.getElementById('category');
        const photoInput = document.getElementById('image');

        // Vérifie si tous les champs sont remplis
        if (titleInput.value.trim() && categorySelect.value !== '0' && photoInput.files.length > 0) {
            submitButton.style.backgroundColor = '#1D6154'; // Change la couleur du bouton en vert lorsque tous les champs sont remplis
            // Supprime le message d'erreur s'il est affiché
            const errorMessage = document.getElementById('form-error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        } else {
            submitButton.style.backgroundColor = ''; // Réinitialise la couleur du bouton s'il y a des champs non remplis
        }
    }

    if (uploadForm) {
        // Écouteur d'événement pour la soumission du formulaire
        uploadForm.addEventListener('submit', function (event) {
            event.preventDefault();
            // Vérifie si tous les champs sont remplis avant de soumettre le formulaire
            if (!checkFormValidity()) {
                displayErrorMessage(); // Affiche le message d'erreur si le formulaire est invalide
                return;
            }
            const formData = new FormData(uploadForm); // Crée un objet FormData contenant les données du formulaire
            uploadImage(formData); // Appelle la fonction pour télécharger l'image
        });
        
        // Ajoute des écouteurs d'événements pour chaque champ du formulaire pour vérifier le changement de couleur du bouton de validation
        document.getElementById('title').addEventListener('input', changeButtonColor);
        document.getElementById('category').addEventListener('change', changeButtonColor);
        document.getElementById('image').addEventListener('change', changeButtonColor);
    }

    // Fonction pour vérifier si tous les champs du formulaire sont remplis
    function checkFormValidity() {
        const titleInput = document.getElementById('title');
        const categorySelect = document.getElementById('category');
        const photoInput = document.getElementById('image');

        // Vérifie si tous les champs sont remplis
        return titleInput.value.trim() && categorySelect.value !== '0' && photoInput.files.length > 0;
    }
    

    //Fonction pour envoyer une image vers le serveur
    function uploadImage(formData) {
        const token = localStorage.getItem('token');
    
        if (!token) { //Vérifie si le token est présent
            console.error('Token d\'authentification manquant.');
            return;
        }
    
        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            body: formData, // Utilise les données FormData passées en paramètre
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Ajoute un en-tête 'Authorization' contenant le jeton d'authentification
            }
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

    if (photoInput) {
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
    }    

    if (closeButton) {
        closeButton.addEventListener("click", () => {
            window.parent.location.href = 'index.html';
        });
    }
      
});