// Fonction pour récupérer les données de l'API
function fetchData(apiEndpoint) {
    return fetch(apiEndpoint)
        .then(response => response.json())
        .catch(error => {
            console.error('Erreur lors de la récupération des données:', error);
        });
}

// Récupération des 2 API (works/catégories)
const worksPromise = fetchData("http://localhost:5678/api/works");
const categoriesPromise = fetchData("http://localhost:5678/api/categories");

// Utilisation de Promise.all pour attendre que les 2 appels soient terminés
Promise.all([worksPromise, categoriesPromise])
    .then(([worksData, categoriesData]) => {
        const categoriesById = categoriesData.reduce((acc, category) => {
            acc[category.id] = category;
            return acc;
        }, {});
        displayWorksWithCategories(worksData, categoriesById);
    })
    .catch(error => {
        console.error('Une erreur s\'est produite:', error);
    });


// Fonction pour afficher les travaux filtrés
const displayFilteredWorks = (filteredWorks, categoriesById) => {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';

    filteredWorks.forEach(work => {
        gallery.appendChild(createWorkElement(work, categoriesById));
    });
};

// Fonction pour créer un élément de travail
const createWorkElement = (work, categoriesById) => {
    const workContainer = document.createElement('div');
    workContainer.classList.add('work');

    const titleElement = document.createElement('h2');
    titleElement.textContent = work.title;

    const imageElement = document.createElement('img');
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;

    const categoryElement = document.createElement('p');
    const category = categoriesById[work.categoryId];
    categoryElement.textContent = `Category: ${category ? category.name : 'Unknown'}`;

    workContainer.appendChild(titleElement);
    workContainer.appendChild(imageElement);
    workContainer.appendChild(categoryElement);

    return workContainer;
};

// Fonction pour afficher les travaux avec les catégories sur la page
const displayWorksWithCategories = (works, categoriesById) => {
    const gallery = document.querySelector('.gallery');
    const categoriesContainer = document.querySelector('.categories');
    const categoriesList = document.createElement('ul'); 

    gallery.innerHTML = '';
    categoriesContainer.innerHTML = '';
    categoriesContainer.appendChild(categoriesList);

    const createCategoryElement = (category) => {
        const categoryElement = document.createElement('li');
        categoryElement.textContent = category.name;

        categoryElement.addEventListener('click', () => {
            const filteredWorks = works.filter(work => work.categoryId === category.id);
            displayFilteredWorks(filteredWorks, categoriesById);
        });

        categoriesList.appendChild(categoryElement);
    };

    const allCategoryElement = document.createElement('li');
    allCategoryElement.textContent = 'Tous';

    allCategoryElement.addEventListener('click', () => {
        displayFilteredWorks(works, categoriesById);
    });

    categoriesList.appendChild(allCategoryElement);

    Object.values(categoriesById).forEach(createCategoryElement);

    works.forEach(work => {
        gallery.appendChild(createWorkElement(work, categoriesById));
    });
};

// Fonction pour changer le contenu de la page si l'utilisateur est connecté
const adminLog = () => {
    const logout = document.querySelector(".logout-button");
    const login = document.querySelector(".login-button");
    const barAdmin = document.querySelector(".black-bar");
    const btnModifier = document.querySelector(".modal-button");
    const editButton = document.querySelector(".modal");
    const categories = document.querySelector("#categories");

    if (localStorage.getItem('token')) {
        logout.style.display = "block";
        login.style.display = "none";
        barAdmin.style.display = "block";
        btnModifier.style.display = "block";
        editButton.style.display = "block";
        categories.style.display = "none";
    } else {
        logout.style.display = "none";
        login.style.display = "block";
        barAdmin.style.display = "none";
        btnModifier.style.display = "none";
        editButton.style.display = "none";
        categories.style.display = "block";
    }
};

adminLog();