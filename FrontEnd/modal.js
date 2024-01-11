//Récupération de la modale
const modal = document.getElementById("myModal");

//Récup bouton pour l'ouvrir
const btn = document.getElementById("modal-button");

//Récup de l'icone pour la fermer
const span = document.getElementsByClassName("close")[0];

//Quand l'utilisateur clique sur le bouton, ouverture de la modale
btn.onclick = function() {
  modal.style.display = "block";
}

//Fermture de la modale quand l'utilisateur clic sur la croix
span.onclick = function() {
  modal.style.display = "none";
}