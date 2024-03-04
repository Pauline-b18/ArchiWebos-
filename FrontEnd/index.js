// Attend que le DOM soit complètement chargé pour exécuter le code
document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('gallery'); //Endroit où les images seront affichées
    const filtersContainer = document.getElementById('filters'); // Conteneur filtres

    if (filtersContainer) {
        // Définit les catégories de filtres avec l'ID et noms
        const categories = [
            { id: -1, name: 'Tous' },
            { id: 1, name: 'Objets' },
            { id: 2, name: 'Appartements' },
            { id: 3, name: 'Hôtels & restaurants' }
        ];
        // Création des boutons filtres en utilisant les catégories
        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category.name; // Texte du bouton en fonction du nom de la catégorie
            button.setAttribute('data-category', category.id); // Attribut pour stocker l'ID de catégorie
            filtersContainer.appendChild(button);
        });
    } 
    // Fonction pour filtrer et afficher les images en fonction de la catégorie
    function filterAndDisplayImages(categoryId, data) {
        if (gallery) {
            gallery.innerHTML = '';
        }
        // Filtre en fonction de la catégorie sélectionnée avec l'utilisation de la méthode filter()
        const filteredImages = data.filter(image => categoryId === -1 || image.categoryId === categoryId); //s'affiche si -1 (tous) et si correspond à la catégorie sélectionnée
        // Parcours les images filtrées et les affiche
        filteredImages.forEach(image => {
            const figure = document.createElement('figure'); 
            const img = document.createElement('img'); 
            const figcaption = document.createElement('figcaption'); 
            img.src = image.imageUrl; // URL de la source de l'image
            img.alt = image.title; // Texte alternatif de l'image
            figcaption.textContent = image.title; // Texte en légendre (titre)
            figure.appendChild(img); 
            figure.appendChild(figcaption); 
            if (gallery) {
                gallery.appendChild(figure);
            }
        });
    }
    // Appel à l'API pour récupérer les données des travaux de la galerie
    fetch('http://localhost:5678/api/works', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        filterAndDisplayImages(-1, data); // Affiche toutes les images par défaut
        
        const filtersContainer = document.getElementById('filters'); 

        if (filtersContainer) {
            const filterButtons = filtersContainer.querySelectorAll('button'); // Sélectionne tous les boutons de filtres
            // Ajoute d'un Eventlistener pour chaque bouton de filtre
            filterButtons.forEach(button => {
                button.addEventListener('click', function(event) {
                    event.preventDefault(); // Empeche le rechargement par défaut
                    // Récupère l'ID de la catégorie à partir de l'attribut 'data-category' du bouton
                    const categoryId = parseInt(button.getAttribute('data-category'));
                    filterAndDisplayImages(categoryId, data); // Filtre et affiche les images
                });
            });
        }
    })
    .catch(error => {
        console.error(error.message);
    });
});

/////////////////////////////////// PARTIE ADMINISTRATEUR ET MODAL ////////////////////////////////////

function deleteAndUpdateModal(modalContent, imageContainer, imageData) {
    const confirmDelete = confirm('Souhaitez-vous supprimer cette image ?');
    if (confirmDelete) {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token d\'authentification manquant.');
            return;
        }

        fetch(`http://localhost:5678/api/works/${imageData.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` //Ajoute un en-tête 'Authorization' contenant le jeton d'authentification
            }
        })
        .then(() => {
            imageContainer.style.display = 'none';
            // Enlève également l'image de la page d'accueil
            const homeFigures = document.querySelectorAll('.gallery figure');
            homeFigures.forEach(homeFigure => { //parcours chaque figure
                const image = homeFigure.querySelector('img');
                if (image && image.src === imageData.imageUrl) { //Vérifie si l'élement img existe et si son URL correspond à celui de l'image supprimée
                    homeFigure.parentNode.removeChild(homeFigure); //Si c'est le cas, supprime complètement la figure parente de l'image de la page d'accueil.
                }
            });
        })
        .catch(error => {
            console.error('Erreur lors de la suppression de l\'image :', error);
        });
    }
}

// Fonction pour créer et rafraîchir le contenu de la modal
function refreshModalContent() {
    fetch('http://localhost:5678/api/works', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        const modalContent = document.querySelector('.modal-content');
        modalContent.innerHTML = ''; // Supprime le contenu

        // Ajout du titre de la modal
        const modalTitle = document.createElement('h1');
        modalTitle.className = 'modal-title';
        modalTitle.textContent = 'Galerie photo';
        modalContent.appendChild(modalTitle);

        // Ajout de l'icône de fermeture
        const closeSpan = document.createElement('span');
        closeSpan.className = 'close';
        closeSpan.id = 'close';
        const closeIcon = document.createElement('i');
        closeIcon.className = 'fa-solid fa-xmark';
        closeSpan.appendChild(closeIcon);
        modalContent.appendChild(closeSpan);

        // Ajout du bouton "Ajouter une image"
        const buttonAddImg = document.createElement('button');
        buttonAddImg.textContent = 'Ajouter une image';
        buttonAddImg.classList.add('button-add-img');
        modalContent.appendChild(buttonAddImg);

        const imageBlockContainer = document.createElement('div');
        imageBlockContainer.classList.add('image-block-container');

        
        data.forEach(imageData => {
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('image-container');

            const imageElement = document.createElement('img');
            imageElement.src = imageData.imageUrl;
            imageElement.classList.add('modal-image');
            imageContainer.appendChild(imageElement);
            
            // Suppression des travaux
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('icon-button');
            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'fa-solid fa-trash-can';
            deleteButton.appendChild(deleteIcon);
            deleteButton.addEventListener('click', () => {
                deleteAndUpdateModal(modalContent, imageContainer, imageData);
            });

            imageContainer.appendChild(deleteButton);
            imageBlockContainer.appendChild(imageContainer);
        });

        modalContent.appendChild(imageBlockContainer);

        const grayBorder = document.createElement('div');
        grayBorder.classList.add('gray-border');
        modalContent.appendChild(grayBorder);

        // Ajout du gestionnaire d'événements pour le bouton "Ajouter une image"
        buttonAddImg.addEventListener('click', () => {
            const iframe = document.createElement('iframe');
            iframe.src = 'modal.html';
            iframe.style.width = '100%';
            iframe.style.height = '100%';

            modalContent.innerHTML = ''; // Efface le contenu actuel de la modal
            modalContent.appendChild(iframe); // Ajoute l'iframe à la modal

            // Attend que le contenu de l'iframe soit chargé
            iframe.onload = function() {
                // Récupère le document à l'intérieur de l'iframe
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                // Récupère le bouton de retour à l'intérieur de l'iframe
                const returnButton = iframeDocument.getElementById('returnButton');
                
                // Ajoute un gestionnaire d'événements au bouton de retour
                returnButton.addEventListener('click', () => {
                    refreshModalContent(); // Rafraîchit le contenu de la modal
                });
            };
        });
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des données de la galerie :', error);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const storedToken = localStorage.getItem('token');
    const barAdmin = document.querySelector(".black-bar");
        if (storedToken && barAdmin) {
            barAdmin.style.display = "block";

        } else if (barAdmin) {
            barAdmin.style.display = "none";
        }
    const filtersContainer = document.getElementById('filters');
    const modal = document.createElement('div');
    modal.id = 'myModal';
    modal.className = 'modal';
    const modalContent = document.createElement('div');
    modalContent.id = 'modalContent';
    modalContent.className = 'modal-content';
    modal.appendChild(modalContent);
    document.body.appendChild(modal); // Ajout de la modal dans le DOM

    if (storedToken) {
        if (filtersContainer) {
            filtersContainer.style.display = "none";
        }
        // Création bouton modifier
        function createEditButtonPortfolio() {
            const editButtonPortfolio = document.createElement('button');
            editButtonPortfolio.className = 'edit-button';
            editButtonPortfolio.id = 'portfolio-edit-button';
            const icon = document.createElement('i');
            icon.className = 'fa-regular fa-pen-to-square';
            editButtonPortfolio.appendChild(icon);
            editButtonPortfolio.appendChild(document.createTextNode(' modifier'));
            return editButtonPortfolio;
        }

        const portfolioSection = document.getElementById('portfolio');
        const portfolioEditButton = createEditButtonPortfolio();
        if (portfolioSection && portfolioEditButton) {
            portfolioSection.insertBefore(portfolioEditButton, portfolioSection.firstElementChild);
        }

        // Partie qui gère l'ouverture de la modal
        const openModalButton = document.getElementById('portfolio-edit-button');
        const overlay = document.createElement('div'); // fond gris derrière la modal
        overlay.id = 'overlay';
        overlay.className = 'overlay';
        document.body.appendChild(overlay); // overlay placé dans le body, sous la modal

        function openModal() {
            modal.style.display = 'block';
            overlay.style.display = 'block';
            refreshModalContent(); // Appel de la fonction pour rafraîchir le contenu de la modal
        }

        if (openModalButton) {
            openModalButton.addEventListener('click', openModal); //Appel de la fonction openModal lors du clic sur le bouton
        }

        // Partie qui gère la fermeture de la modal 

        function closeModal() {
            modal.style.display = 'none';
            overlay.style.display = 'none';
            resetModalPage();
            window.parent.location.href = 'index.html';
        }
    
        document.addEventListener('click', (event) => {
            if (event.target === modal || event.target.closest('.close')) { //La modal se ferme si on appuie sur l'icone croix
                closeModal(); 
            }
        });
    
        window.addEventListener('keydown', (event) => { //La modal se ferme si on appuie sur la touche "echappe"
            if (event.key === 'Escape') {
                closeModal();
            }
        });
    
        overlay.addEventListener('click', (event) => { //La modal se ferme si on clique en dehors (sur l'overlay)
            if (event.target === overlay) {
                closeModal();
            }
        });

        function resetModalPage() { 
            const modalContent = document.querySelector('.modal-content');
            modalContent.innerHTML = ''; //Supprime le contenu
        }

    } else {
        barAdmin.style.display = "none";
    }
});
