// Variable globale pour stocker les données des works
let worksDataForModal = null;

// Récupération de l'API works pour la modale
function fetchWorksForModal(apiEndpoint) {
    return fetch(apiEndpoint)
        .then(response => response.json())
        .catch(error => {
            console.error('Erreur lors de la récupération des données pour la modal:', error);
        });
}

// Fonction pour afficher les works dans la modal
function displayWorksInModal(works) {
    const openModal = document.getElementById("openmodal");
    openModal.innerHTML = ''; // Efface le contenu existant de la modal

    openModal.classList.add("modal-gallery");
    works.forEach(work => {
        // Création d'éléments HTML pour les works dans la modal
        const workElement = document.createElement('div');
        workElement.classList.add('work-modal');

        const imageElement = document.createElement('img');
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;

        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa-solid', 'fa-trash-can', 'delete-icon');

        const imageContainer = document.createElement('div');
        imageContainer.appendChild(imageElement);
        imageContainer.appendChild(deleteIcon);

        workElement.appendChild(imageContainer);
        openModal.appendChild(workElement);
    });
}

// Fonction pour vérifier si les données des works pour la modal ont déjà été récupérées
function getWorksDataForModal() {
    if (worksDataForModal === null) {
        // Si les données n'ont pas été récupérées, effectuez la requête à l'API
        const worksForModalPromise = fetchWorksForModal("http://localhost:5678/api/works");

        //utilisation de  Promise pour attendre que l'appel soit terminé
        worksForModalPromise.then(worksForModalData => {
            //Stocker les données des works pour utilisation future
            worksDataForModal = worksForModalData;
            //Afficher les works dans la modal
            displayWorksInModal(worksForModalData);
        });
    } else {
        // Si les données ont déjà été récupérées, les utiliser directement dans la modal
        displayWorksInModal(worksDataForModal);
    }
}

const modal = document.getElementById("myModal");
const btn = document.getElementById("modal-button");
const span = document.getElementsByClassName("close")[0];

// Ajout des Eventlistener
btn.addEventListener("click", openModal); // ouvre la modal lorsqu'on clique sur le bouton
span.addEventListener("click", closeModal); // ferme la modal lorsqu'on clique sur le span
window.addEventListener("click", function(event) { // ferme la modal lorsqu'on clique en dehors de celle-ci
  if (event.target == modal) {
    closeModal();
  }
});
document.addEventListener("DOMContentLoaded", function() { // évite l'ouverture automatique
  closeModal();
});

// Fonction pour créer dynamiquement la section "Ajout photo" avec son formulaire
function createDynamicPhotoSection() {
  const modalContent = document.querySelector('.modal-content');

  // Création de la section "Ajout photo"
  const ajoutPhotoHeading = document.createElement('h3');
  ajoutPhotoHeading.textContent = 'Ajout photo';

  const customFileUploadDiv = document.createElement('div');
  customFileUploadDiv.classList.add('custom-file-upload');

  const imgFormDiv = document.createElement('div');
  imgFormDiv.classList.add('img-form');

  const iconImgDiv = document.createElement('div');
  iconImgDiv.classList.add('icon-img');

  const imageIcon = document.createElement('i');
  imageIcon.classList.add('fa-regular', 'fa-image');

  const photoLabel = document.createElement('label');
  photoLabel.htmlFor = 'photo';

  const photoInput = document.createElement('input');
  photoInput.type = 'file';
  photoInput.id = 'photo';
  photoInput.name = 'photo';
  photoInput.accept = 'image/*';
  photoInput.required = true;

  const formatDiv = document.createElement('div');
  formatDiv.classList.add('format');
  formatDiv.textContent = 'jpg, png: 4mo max';

  iconImgDiv.appendChild(imageIcon);
  photoLabel.appendChild(photoInput);

  imgFormDiv.appendChild(iconImgDiv);
  imgFormDiv.appendChild(photoLabel);
  imgFormDiv.appendChild(formatDiv);

  customFileUploadDiv.appendChild(imgFormDiv);

  // Création du formulaire
  const workForm = document.createElement('form');
  workForm.id = 'work-form';

  const titreTravauxDiv = document.createElement('div');
  titreTravauxDiv.classList.add('titre-travaux');

  const titreLabel = document.createElement('label');
  titreLabel.htmlFor = 'titre-work';
  titreLabel.textContent = 'Titre';

  const titreInput = document.createElement('input');
  titreInput.type = 'text';
  titreInput.id = 'titre-work';
  titreInput.name = 'titre';
  titreInput.required = true;

  titreTravauxDiv.appendChild(titreLabel);
  titreTravauxDiv.appendChild(titreInput);

  const categorieTravauxDiv = document.createElement('div');
  categorieTravauxDiv.classList.add('categorie-travaux');

  const categorieLabel = document.createElement('label');
  categorieLabel.htmlFor = 'categorie-work';
  categorieLabel.textContent = 'Catégorie';

  const categorieSelect = document.createElement('select');
  categorieSelect.id = 'categorie-work';
  categorieSelect.name = 'categorie-work';
  categorieSelect.required = true;

  categorieTravauxDiv.appendChild(categorieLabel);
  categorieTravauxDiv.appendChild(categorieSelect);

  const errorPostParagraph = document.createElement('p');
  errorPostParagraph.classList.add('error-post');

  const lineDiv = document.createElement('div');
  lineDiv.classList.add('line');

  const submitButton = document.createElement('button');
  submitButton.id = 'submit';
  submitButton.type = 'submit';
  submitButton.classList.add('validation');
  submitButton.textContent = 'Valider';

  workForm.appendChild(titreTravauxDiv);
  workForm.appendChild(categorieTravauxDiv);
  workForm.appendChild(errorPostParagraph);
  workForm.appendChild(lineDiv);
  workForm.appendChild(submitButton);

  // Ajouter les éléments à la modal
  modalContent.appendChild(ajoutPhotoHeading);
  modalContent.appendChild(customFileUploadDiv);
  modalContent.appendChild(workForm);
}


// Modifier la fonction openModal pour organiser les éléments dans la modale
function openModal() {
  modal.style.display = 'block';

  // Appel des 2 fonctions
  getWorksDataForModal();

}

// Fonction pour fermer la modal
function closeModal() {
  modal.style.display = "none";
}
