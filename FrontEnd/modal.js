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

// Fonction pour ouvrir la modal
function openModal() {
  modal.style.display = "block";


  // Appel de la fonction fetchWorksForModal
  getWorksDataForModal();
}

// Fonction pour fermer la modal
function closeModal() {
  modal.style.display = "none";
}
