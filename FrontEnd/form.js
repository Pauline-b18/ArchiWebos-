import { fetchAndDisplayWorks, refreshModalContent } from './index.js';

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
        const inputs = uploadForm.querySelectorAll('input, select');
        for (let input of inputs) {
            if (!input.value) {
                return false; // Si un champ est vide, retourne false
            }
        }
        return true; // Si tous les champs sont remplis, retourne true
    }

    // Fonction pour activer ou désactiver le bouton de soumission en fonction de l'état des champs du formulaire
    function toggleSubmitButton() {
        if (checkFormValidity()) {
            submitButton.disabled = false;
            submitButton.classList.remove('disabled');
            submitButton.style.backgroundColor = '#1D6154'; // Changez la couleur en vert
        } else {
            submitButton.disabled = true;
            submitButton.classList.add('disabled');
            submitButton.style.backgroundColor = '#B3B3B3'; // Changez la couleur en gris
        }
    }

    // Écouteurs d'événements pour les champs du formulaire
    uploadForm.addEventListener('input', toggleSubmitButton);

    // Écouteur d'événement pour la soumission du formulaire
    uploadForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Empeche le rechargement par défaut de la page
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
            console.log('Photo téléversée avec succès !');
    
            const iframe = document.querySelector('iframe');
            if (iframe) {
                iframe.remove(); // Supprime complètement l'élément iframe du DOM
            }
    
            //Enregistre dans le stockage local du navigateur que le formulaire a été soumis
            localStorage.setItem('formSubmitted', 'true');
            //Redirection de l'utilisateur
            window.location.href = 'index.html'; //A modifier
        })
        .catch(error => {
            console.error(error.message);
        });
    }
    
   //Fonction pour charger les catégories depuis l'API et les afficher dans le menu déroulant
    function loadCategories() {
    fetch("http://localhost:5678/api/categories")
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des catégories');
        }
        return response.json();
    })
    .then(categories => {
        //Itère sur chaque catégorie dans les données récupérées
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

    returnButton.addEventListener("click", () => {
        window.history.back();
    // Redirection vers la page précédente
  //  window.location.href = 'index.html';
    // Après la redirection, déplacez le curseur vers l'élément #portfolio-edit-button
    //window.location.hash = '#portfolio-edit-button';
});
});