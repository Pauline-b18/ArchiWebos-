// Fonction pour récupérer les données de l'API
function fetchData(apiEndpoint) {
    return fetch(apiEndpoint)
        .then(response => response.json())
        .catch(error => {
            console.error('Erreur lors de la récupération des données:', error);
        });
}


// Appel de la fonction fetchData avec l'URL de l'API works
const worksPromise = fetchData("http://localhost:5678/api/works");

// Appel de la fonction fetchData avec l'URL de l'API des catégories
const categoriesPromise = fetchData("http://localhost:5678/api/categories");

// Utiliser Promise.all pour attendre que les 2 appels soient terminés
Promise.all([worksPromise, categoriesPromise])
    .then(([worksData, categoriesData]) => {
        // Organisation des données des catégories dans un objet
        const categoriesById = {};
        categoriesData.forEach(category => {
            categoriesById[category.id] = category;
        });
        displayWorksWithCategories(worksData, categoriesById);  // Afficher les travaux avec les catégories
    })
    .catch(error => {
        console.error('Une erreur s\'est produite:', error);
    });

    

// Fonction pour afficher les travaux avec les catégories sur la page
function displayWorksWithCategories(works, categoriesById) {
    const gallery = document.querySelector('.gallery');
    const categoriesContainer = document.querySelector('.categories');

    // Parcourir chaque élément du tableau works
    works.forEach(work => {
        // Création d'éléments HTML
        const workContainer = document.createElement('div');
        workContainer.classList.add('work');

        const titleElement = document.createElement('h2');
        titleElement.textContent = work.title;

        const imageElement = document.createElement('img');
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;

        const categoryElement = document.createElement('p');
        // Utilise l'ID de catégorie pour accéder à la catégorie correspondante
        const category = categoriesById[work.categoryId];
        categoryElement.textContent = `Category: ${category ? category.name : 'Unknown'}`;

        // Ajout des éléments à workContainer
        workContainer.appendChild(titleElement);
        workContainer.appendChild(imageElement);
        workContainer.appendChild(categoryElement);

        // Ajout de workContainer à gallery
        gallery.appendChild(workContainer);
    });

    // Afficher les catégories dans le conteneur des catégories
    categoriesContainer.innerHTML = ''; // Effacer le contenu existant ??
    const categoriesList = document.createElement('ul');
    categoriesContainer.appendChild(categoriesList);

    // Création d'un élément li pour "Tous"
    const allCategoryElement = document.createElement('li');
    allCategoryElement.textContent = 'Tous';

    // Ajout de l'événement de clic pour afficher tous les travaux
    allCategoryElement.addEventListener('click', () => {
        gallery.innerHTML = ''; // Effacer la galerie actuelle
        displayFilteredWorks(works, categoriesById); // Afficher tous les travaux
    });

    // Ajout de allCategoryElement à categoriesList
    categoriesList.appendChild(allCategoryElement);

    // Parcourir chaque catégorie
    Object.values(categoriesById).forEach(category => {
        // Création d'éléments HTML pour les catégories
        const categoryElement = document.createElement('li');
        categoryElement.textContent = category.name;

        // Ajout de categoryElement à categoriesList
        categoriesList.appendChild(categoryElement);

        // Gestionnaire d'événements pour filtrer les travaux au clic de la catégorie
        categoryElement.addEventListener('click', () => {
            const filteredWorks = works.filter(work => work.categoryId === category.id); // Filtrer les travaux en fonction de leur ID

            gallery.innerHTML = ''; // Effacer la galerie actuelle

            displayFilteredWorks(filteredWorks, categoriesById); // Afficher les travaux filtrés
        });
    });
}

// Fonction pour afficher les travaux filtrés
function displayFilteredWorks(filteredWorks, categoriesById) {
    const gallery = document.querySelector('.gallery');

    // Parcourir chaque travail filtré
    filteredWorks.forEach(work => {
        // Création d'éléments HTML pour les travaux
        const workContainer = document.createElement('div');
        workContainer.classList.add('work');

        const titleElement = document.createElement('h2');
        titleElement.textContent = work.title;

        const imageElement = document.createElement('img');
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;

        const categoryElement = document.createElement('p');
        // Utiliser l'ID de catégorie pour accéder à la catégorie correspondante
        const category = categoriesById[work.categoryId];
        categoryElement.textContent = `Category: ${category ? category.name : 'Unknown'}`;

        // Ajout des éléments à workContainer
        workContainer.appendChild(titleElement);
        workContainer.appendChild(imageElement);
        workContainer.appendChild(categoryElement);

        // Ajout de workContainer à gallery
        gallery.appendChild(workContainer);
    });
}


//Changer le contenu de la page si l'utilisateur est connecté
function adminLog() {
    const logout = document.querySelector(".logout-button");
    const login = document.querySelector(".login-button");
    
    barAdmin = document.querySelector(".black-bar");
    const btnModifier = document.querySelector(".modal-button");
    const editButton = document.querySelector(".edit-button");
  
    const categories = document.querySelector(".categories");
  
  
    if (localStorage.getItem('token')) {
      logout.style.display = "block";
      login.style.display = "none";
      
      barAdmin.style.display = "block";
      btnModifier.style.display = "block";
      editButton.style.display = "block"
      categories.style.display = "none";
      
      
  
    } else {
      logout.style.display = "none";
      login.style.display = "block";
  
      barAdmin.style.display = "none";
      btnModifier.style.display = "none";
      editButton.style.display = "none"
      categories.style.display = "flex";
  
    }}
  
adminLog();
