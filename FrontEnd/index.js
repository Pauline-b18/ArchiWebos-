// Attend que le DOM soit complètement chargé pour exécuter le code
document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('gallery'); //Endroit où les images seront affichées
    const filtersContainer = document.getElementById('filters'); // Conteneur filtres
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
    // Fonction pour filtrer et afficher les images en fonction de la catégorie
    function filterAndDisplayImages(categoryId, data) {
        gallery.innerHTML = '';
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
            gallery.appendChild(figure);
        });
    }
    // Appel à l'API pour récupérer les données des travaux de la galerie
    fetch('http://localhost:5678/api/works', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        filterAndDisplayImages(-1, data); // Affiche toutes les images par défaut
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
    })
    .catch(error => {
        console.error('Une erreur s\'est produite:', error);
    });
});

/////////////////////////////////// PARTIE ADMINISTRATEUR ET MODAL ////////////////////////////////////
function refreshModalContent() {
    fetch('http://localhost:5678/api/works', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        const modalContent = document.querySelector('.modal-content');
        const imageBlockContainer = document.createElement('div');
        imageBlockContainer.classList.add('image-block-container');

        data.forEach(imageData => {
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('image-container');

            const imageElement = document.createElement('img');
            imageElement.src = imageData.imageUrl;
            imageElement.classList.add('modal-image');
            imageContainer.appendChild(imageElement);
            
            //Suppression des travaux
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('icon-button');
            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'fa-solid fa-trash-can';
            deleteButton.appendChild(deleteIcon);
            deleteButton.addEventListener('click', () => {
                const confirmDelete = confirm('Souhaitez-vous supprimer cette image ?');
                if (confirmDelete) {
                    const token = localStorage.getItem('token');
                    if (!token) { //Vérifie si le token est présent
                        console.error('Token d\'authentification manquant.');
                        return;
                    }
                    
                    const headers = new Headers();
                    headers.append('Authorization', `Bearer ${token}`); //Ajoute le token d'authentification au headers de la requête

                    fetch(`http://localhost:5678/api/works/${imageData.id}`, {
                        method: 'DELETE',
                        headers: headers,
                    })
                    .then(() => {
                        modalContent.removeChild(imageContainer);
                    })
                    .catch(error => {
                        console.error('Erreur lors de la suppression de l\'image :', error);
                    });
                }
            });

            imageContainer.appendChild(deleteButton);
            imageBlockContainer.appendChild(imageContainer);
        });

        modalContent.appendChild(imageBlockContainer);

        const grayBorder = document.createElement('div');
        grayBorder.classList.add('gray-border');
        modalContent.appendChild(grayBorder);
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des données de la galerie :', error);
    });
    //test
    // Effacer le contenu de form-content
    const formContent = document.getElementById('form-content');
    formContent.innerHTML = '';

    // Charger à nouveau le contenu de la modal
    loadModalContent();

    //fin test
}

document.addEventListener('DOMContentLoaded', function () {
    const storedToken = localStorage.getItem('token');
    const barAdmin = document.querySelector(".black-bar");
    const filtersContainer = document.getElementById('filters');

    if (storedToken) {
        barAdmin.style.display = "block";
        filtersContainer.style.display = "none";

        //Création bouton modifier
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
        const portfolioEditButton = createEditButtonPortfolio(); // a modif
        portfolioSection.insertBefore(portfolioEditButton, portfolioSection.firstElementChild);

        // Création de la modal
        const modal = document.createElement('div');
        modal.id = 'myModal';
        modal.className = 'modal';

        const modalContent = document.createElement('div');
        modalContent.id ='modalContent';
        modalContent.className = 'modal-content';

        const closeSpan = document.createElement('span');
        closeSpan.className = 'close';
        closeSpan.id = 'close';
        const closeIcon = document.createElement('i');
        closeIcon.className = 'fa-solid fa-xmark';
        closeSpan.appendChild(closeIcon);
        modalContent.appendChild(closeSpan);

        const modalTitle = document.createElement('h1');
        modalTitle.className = 'modal-title';
        modalTitle.textContent = 'Galerie photo';
        modalContent.appendChild(modalTitle);

        modal.appendChild(modalContent);

        //Bouton ajouter une image
        const buttonAddImg = document.createElement('button');
        buttonAddImg.textContent = 'Ajouter une image';
        buttonAddImg.classList.add('button-add-img');
        modalContent.appendChild(buttonAddImg);

        //Au clic du bouton ajouter une image, ouverture de la fenêtre formulaire
        buttonAddImg.addEventListener('click', () => {
            //Récupération des catégories pour le formulaire
            fetch('http://localhost:5678/api/categories', {
                method: 'GET',
            })
                .then(response => response.json())
                .then(categories => {
                    const categorySelect = document.getElementById('category');
                    categories.forEach(category => {
                        const option = document.createElement('option'); //Création du menu déroulant
                        option.value = category.id;
                        option.textContent = category.name;
                        categorySelect.appendChild(option);
                    });
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des catégories :', error);
                });
        });

        modalContent.appendChild(buttonAddImg);
        modal.appendChild(modalContent);
        document.body.appendChild(modal); //modal placé dans le body, sous le main-container

        // Partie qui gère l'ouverture de la modal
        const openModalButton = document.getElementById('portfolio-edit-button');
        const closeModal = document.getElementById('close');
        const overlay = document.createElement('div'); // fond gris derrière la modal
        overlay.id = 'overlay';
        overlay.className = 'overlay';
        document.body.appendChild(overlay); // overlay placé dans le body, sous la modal

        function openModal() {
            modal.style.display = 'block';
            overlay.style.display = 'block';
            refreshModalContent(); // Appel de la fonction pour rafraîchir le contenu de la modal
            // Utilisation de history.pushState pour modifier l'URL sans recharger la page
        }
        openModalButton.addEventListener('click', openModal); // Appel de la fonction openModal lors du clic sur le bouton

        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
            overlay.style.display = 'none';
            resetModalPage();
            window.parent.location.href = 'index.html';
        });

        window.addEventListener('keydown', (event) => { //La modal se ferme si on appuie sur "echappe"
            if (event.key === 'Escape') {
                modal.style.display = 'none';
                overlay.style.display = 'none';
                resetModalPage();
                window.parent.location.href = 'index.html';
            }
        });
    
        overlay.addEventListener('click', (event) => { //La modal se ferme si on clique en dehors (sur l'overlay)
            if (event.target === overlay) {
                modal.style.display = 'none';
                overlay.style.display = 'none';
                resetModalPage();
                window.parent.location.href = 'index.html';
            }
        });
//
//
        function resetModalPage() { 
            const modalContent = document.querySelector('.modal-content');
        
            const closeSpan = document.createElement('span');
            closeSpan.className = 'close';
            closeSpan.id = 'close';
            const closeIcon = document.createElement('i');
            closeIcon.className = 'fa-solid fa-xmark';
            closeSpan.appendChild(closeIcon);
            modalContent.appendChild(closeSpan);
        
            const modalTitle = document.createElement('h1');
            modalTitle.className = 'modal-title';
            modalTitle.textContent = 'Galerie photo';
            modalContent.appendChild(modalTitle);
        
            const buttonAddImg = document.createElement('button');
            buttonAddImg.className = 'button-add-img';
            buttonAddImg.id = 'buttonAddImg';
            buttonAddImg.textContent = 'Ajouter une image';
            modalContent.appendChild(buttonAddImg);
        
        }
        
        buttonAddImg.addEventListener('click', () => {
            fetch('modal.html') 
               .then(response => response.text())
               .then(html => {
                   // Remplace le contenu actuel de la modal par le contenu de modal.html
                   modalContent.innerHTML = html;
                   // Eventlistener sur le bouton de retour pour recharger le contenu de la modal
                   const returnButton = document.getElementById('returnButton');
                    returnButton.addEventListener('click', refreshModalContent);
               })
               .catch(error => {
                   console.error('Une erreur s\'est produite lors du chargement du formulaire :', error);
               });
               
        });
        

    } else {
        barAdmin.style.display = "none";
    }
});