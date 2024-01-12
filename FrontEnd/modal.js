const modal = document.getElementById("myModal");
const btn = document.getElementById("modal-button");
const span = document.getElementsByClassName("close")[0];

// Ouverture de la modale
btn.onclick = function() {
  modal.style.display = "block";
}

// Fermer la modale
span.onclick = function() {
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Evite l'ouverture automatique
document.addEventListener("DOMContentLoaded", function() {
  modal.style.display = "none";
});
