// navbar background change and snowscraper name visible when scroll
const navbar = document.querySelector('.navbar');
const logo = document.querySelector('.navbar-logo');
const navbarTitle = document.querySelector('.navbar-title');

// Show navbar when window is at 100px
function showNavBar() {
  yPos = window.pageYOffset;
  if (yPos < 100) {
    navbar.style.backgroundColor = 'transparent';
    navbarTitle.style.display = 'none';
    logo.style.opacity = '0.5';
  } else {
    navbar.style.backgroundColor = '#263159';
    navbarTitle.style.display = 'block';
    logo.style.opacity = '1';
  }
}

// when website is loaded / scrolled, call the shownavbar function
window.addEventListener('load', showNavBar);
window.addEventListener('scroll', showNavBar);

//When clicked on shop, it scrolls down to the item categories
function scrollIntoCategory() {
  document
    .querySelector('.shop-category')
    .scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
}

const shopBtn = document.querySelector('#refer-category');
shopBtn.addEventListener('click', scrollIntoCategory);

// clicking logo and name redirect to home page
const navbarLogoSection = document.querySelector('.logo-section');
navbarLogoSection.addEventListener('click', () => {
  window.location.replace('/home-page.html');
});

// Show user name if logged in, if else, show my account
function userLoginStatus() {
  myAccountBtn = document.querySelector('#login');
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = db.collection('users').doc(user.uid);
      currentUser.onSnapshot((doc) => {
        myAccountBtn.innerHTML = doc.data().name;
      });
      //if logged in, show the log out button
      const logoutBtn = document.querySelector('.fa-arrow-right-from-bracket');
      logoutBtn.style.display = 'block';
      //hover event listeners
      // when hover over account name, change to the text log oout
      const loginText = document.querySelector('#login');
      loginText.addEventListener('mouseover', () => {
        loginText.innerHTML = 'Logout';
      });
      // when hover out, changes the text to the user name
      loginText.addEventListener('mouseout', () => {
        currentUser.onSnapshot((doc) => {
          myAccountBtn.innerHTML = doc.data().name;
        });
        //click event listener
        // when clicked log out, log out
        loginText.addEventListener('click', () => {
          firebase
            .auth()
            .signOut()
            .then(() => {
              console.log('logged out');
            })
            .catch((error) => {
              console.log(error);
            });
        });
      });
    } else {
      // change the account name to login if not logged in
      myAccountBtn.innerHTML = 'Login';
      // if not logged in, show the text log in and change the href attribute to login page
      const loginBox = document.querySelector('#refer-login');
      loginBox.setAttribute('href', './login.html');
    }
  });
}

userLoginStatus();
