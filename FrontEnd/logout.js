function deconnexion() {
    window.localStorage.clear();
    window.location.href = "./index.html";
  }
  
  const boutonDeconnexion = document.querySelector('.logout-button');
  boutonDeconnexion.addEventListener("click", function(event) {
    event.preventDefault();
      deconnexion();
  });