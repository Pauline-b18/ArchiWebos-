document.addEventListener('DOMContentLoaded', function () {
    const uploadForm = document.getElementById("uploadForm");
    const categorySelect = document.getElementById("category");
    const photoInput = document.getElementById("image");
    const photoIcon = document.getElementById("photo-icon");
    const photoPreview = document.getElementById("photo-preview");
    const photoLabel = document.getElementById("photoLabel");
    const fileName = document.getElementById("fileName");
    const customFileButton = document.querySelector(".custom-file-button");
    const myModal = document.getElementById("myModal");
    const returnButton = document.getElementById("returnButton");
    const closeButton = document.getElementById("close");
    const formContent = document.getElementById("form-content");

    async function uploadImage(formData) {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token d\'authentification manquant.');
            return;
        }

        const headers = new Headers();
        headers.append('Authorization', `Bearer ${token}`);

        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                body: formData,
                headers: headers,
            });

            const data = await response.json();
            console.log('Photo téléversée avec succès !');

            const iframe = document.querySelector('iframe');
            if (iframe) {
                iframe.style.display = 'none'; // Vous pouvez également utiliser iframe.remove() pour le supprimer complètement
            }

            // Marquer la soumission du formulaire
            localStorage.setItem('formSubmitted', 'true');

            // Rediriger l'utilisateur vers index.html après la soumission réussie
            window.location.href = 'index.html';

        } catch (error) {
            console.error(error.message);
        }
    }

    async function loadCategories() {
        try {
            const response = await fetch("http://localhost:5678/api/categories");
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des catégories');
            }
            const categories = await response.json();
            categories.forEach(category => {
                const option = document.createElement("option");
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        } catch (error) {
            console.error(error.message);
        }
    }

    