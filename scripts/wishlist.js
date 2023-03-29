const navbarLogoSection = document.querySelector('.logo-section');
navbarLogoSection.addEventListener('click', () => {
  window.location.replace('/home-page.html');
});

function showUserName() {
  myAccountBtn = document.querySelector('#login');
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      currentUser = db.collection('users').doc(user.uid);
      userNameContainer = document.querySelector('.user-name');
      currentUser
        .get()
        .then((userDoc) => {
          let userName = userDoc.data().name;
          userNameContainer.innerHTML = userName;
          myAccountBtn.innerHTML = userDoc.data().name;
        })
        .catch((error) => {
          console.log(error);
        });
      //if logged in, show the log out button
      const logoutBtn = document.querySelector('.fa-arrow-right-from-bracket');
      logoutBtn.style.display = 'block';
      //hover event listeners
      // when hover over account name, change to the text log out
      const loginText = document.querySelector('#login');
      loginText.addEventListener('mouseover', () => {
        loginText.innerHTML = 'Logout';
      });
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
      userNameContainer = document.querySelector('.title-welcome');
      userNameContainer.innerHTML = 'Log in to see your wishlist!';
      // if not logged in, show the text log in and change the href attribute to login page
      myAccountBtn.innerHTML = 'Login';
      const loginBox = document.querySelector('#refer-login');
      loginBox.setAttribute('href', './login.html');
    }
  });
}

function userLoginStatus() {
  myAccountBtn = document.querySelector('#login');
  myAccountBtnMobile = document.querySelector('#login-mobile');
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = db.collection('users').doc(user.uid);
      currentUser.onSnapshot((doc) => {
        myAccountBtn.innerHTML = doc.data().name;
        myAccountBtnMobile.innerHTML = 'Logout';
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
      myAccountBtnMobile.innerHTML = 'Login';
      // if not logged in, show the text log in and change the href attribute to login page
      const loginBox = document.querySelector('#refer-login');
      const loginBoxMobile = document.querySelector('.refer-login-mobile');
      loginBox.setAttribute('href', './login.html');
      loginBoxMobile.setAttribute('href', './login.html');
    }
  });
}

userLoginStatus();

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
hamburger.addEventListener('click', (event) => {
  let hamOrX = event.target.getAttribute('class');
  const sideNav = document.querySelector('.navbar-features-mobile');
  if (hamOrX == 'fa-solid fa-bars') {
    event.target.className = 'fa-solid fa-xmark';
    sideNav.style.boxShadow = '2px 2px 2px 2px rgba(0, 0, 0, 0.281)';
    sideNav.style.right = '0';
  } else {
    event.target.className = 'fa-solid fa-bars';
    sideNav.style.boxShadow = 'none';
    sideNav.style.right = '-125px';
  }
});

showUserName();
