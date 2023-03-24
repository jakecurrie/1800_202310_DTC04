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

showUserName();
