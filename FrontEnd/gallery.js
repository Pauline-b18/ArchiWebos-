//récupération de données//
fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(data => {
        // appel la fonction pour afficher les données
        displayWorks(data);
    })
    .catch(error => console.error('Erreur lors de la récupération des données:', error));

// fonction pour afficher les données sur la page
function displayWorks(works) {
    const gallery = document.querySelector('.gallery');

    // Parcours chaque élément du tableau
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
        categoryElement.textContent = `Category: ${work.category.name}`;

        // Ajout des éléments à workContainer
        workContainer.appendChild(titleElement);
        workContainer.appendChild(imageElement);
        workContainer.appendChild(categoryElement);

        // Ajout de workContainer à gallery
        gallery.appendChild(workContainer);
    });
}
