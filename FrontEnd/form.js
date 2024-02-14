import { fetchAndDisplayWorks } from './index.js';

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
        //Récupère la photo sélectionnée dans les fichiers
        const selectedPhoto = event.target.files[0];
        //Vérifie si une photo a été sélectionnée
        if (selectedPhoto) {
            const photoUrl = URL.createObjectURL(selectedPhoto); //Crée une URL objet pour la photo 
            photoPreview.src = photoUrl; //Affiche son apercu en lui assignant l'URL créée
            photoPreview.style.display = 'block';
            photoIcon.style.display = 'none'; //Masque le reste du contenu
            choosePhotoButton.style.display = 'none';
            photoLabel.style.backgroundColor = '#E8F1F6';
        } else {
            // Si aucune photo n'est sélectionnée, réinitialise les éléments d'aperçu et les styles
            photoPreview.src = '';
            photoPreview.style.display = 'none';
            photoIcon.style.display = 'block';
            choosePhotoButton.style.display = 'block';
            photoLabel.style.backgroundColor = '';
        }
    });


    uploadForm.addEventListener('submit', function (event) {
        event.preventDefault(); //Empeche rechargement par défaut de la page

        const formData = new FormData(uploadForm); //Crée un objet FormData contenant les données du formulaire
        // Appelle la fonction pour télécharger l'image
        uploadImage(formData);
    });

    closeButton.addEventListener("click", () => {
        window.parent.location.href = 'index.html';
    });

    returnButton.addEventListener("click", () => {
        fetchAndDisplayWorks ();
    // Redirection vers la page précédente
  //  window.location.href = 'index.html';
    // Après la redirection, déplacez le curseur vers l'élément #portfolio-edit-button
    //window.location.hash = '#portfolio-edit-button';
});
});
