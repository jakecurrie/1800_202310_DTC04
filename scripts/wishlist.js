const navbarLogoSection = document.querySelector('.logo-section');
navbarLogoSection.addEventListener('click', () => {
  window.location.replace('/home-page.html');
});

function showUserName() {
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
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      userNameContainer = document.querySelector('.title-welcome');
      userNameContainer.innerHTML = 'Log in to see your wishlist!';
      console.log('Signed out!');
    }
  });
}

// Show user name if logged in, if else, show my account
function userLoginStatus() {
  myAccountBtn = document.querySelector('#login');
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = db.collection('users').doc(user.uid);
      currentUser.onSnapshot((doc) => {
        myAccountBtn.innerHTML = doc.data().name;
      });
      const logoutBtn = document.querySelector('.fa-arrow-right-from-bracket');
      logoutBtn.style.display = 'block';
      //hover event listeners
      const loginText = document.querySelector('#login');
      loginText.addEventListener('mouseover', () => {
        loginText.innerHTML = 'Logout';
      });
      loginText.addEventListener('mouseout', () => {
        currentUser.onSnapshot((doc) => {
          myAccountBtn.innerHTML = doc.data().name;
        });
        //click event listener
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
      myAccountBtn.innerHTML = 'Login';
      const loginBox = document.querySelector('#refer-login');
      loginBox.setAttribute('href', './login.html');
    }
  });
}

userLoginStatus();
showUserName();
