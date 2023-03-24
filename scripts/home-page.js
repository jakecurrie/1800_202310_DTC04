// navbar background change and snowscraper name visible when scroll
const navbar = document.querySelector(".navbar");
const logo = document.querySelector(".navbar-logo");
const navbarTitle = document.querySelector(".navbar-title");

// Show navbar when scrolled
window.addEventListener("scroll", () => {
  yPos = window.scrollY;
  if (yPos < 100) {
    navbar.style.backgroundColor = "transparent";
    navbarTitle.style.display = "none";
    logo.style.opacity = "0.5";
  } else {
    navbar.style.backgroundColor = "#263159";
    navbarTitle.style.display = "block";
    logo.style.opacity = "1";
  }
});

//When clicked on shop, it scrolls down to the item categories
function scrollIntoCategory() {
  document.querySelector(".shop-category").scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
}

const shopBtn = document.querySelector('#refer-category');
shopBtn.addEventListener('click', scrollIntoCategory);


// clicking logo and name redirect to home page
const navbarLogoSection = document.querySelector(".logo-section");

navbarLogoSection.addEventListener("click", () => {
  window.location.replace("/home-page.html");
});

function userLoginStatus() {
  myAccountBtn = document.querySelector("#login");
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid);
      currentUser.onSnapshot((doc) => {
        myAccountBtn.innerHTML = doc.data().name;
      });
    } else {
      myAccountBtn.innerHTML = "Login";
    }
  });
}

userLoginStatus();
