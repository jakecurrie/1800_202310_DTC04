const logInPage = document.querySelector('.login-box');
const signUp = document.querySelector('.register-click');
const registerPage = document.querySelector('.register-box');
const logInClick = document.querySelector('.login-click');
const forgorPage = document.querySelector('.forgor-box');
const forgorClick = document.querySelector('.forgot-btn');
const forgorLoginClick = document.querySelector('.login-click-forgor');

const loginButton = document.querySelector('.login-btn');
const signUpButton = document.querySelector('.register-btn');

//when clicked 'register' or 'log in' it switches box
signUp.addEventListener('click', () => {
  registerPage.style.left = '0%';
  logInPage.style.left = '105%';
  forgorPage.style.left = '105%';
});

logInClick.addEventListener('click', () => {
  logInPage.style.left = '0%';
  forgorPage.style.left = '105%';
  registerPage.style.left = '105%';
});

forgorClick.addEventListener('click', () => {
  forgorPage.style.left = '0%';
  logInPage.style.left = '105%';
  registerPage.style.left = '105%';
});

forgorLoginClick.addEventListener('click', () => {
  logInPage.style.left = '0%';
  forgorPage.style.left = '105%';
  registerPage.style.left = '105%';
});

//create user through firebase
const registerEmailInput = document.querySelector('#register-email');
const registerPasswordInput = document.querySelector('#register-password');
const registerNameInput = document.querySelector('#register-name');
function createUser(email, password, name) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      //add users name and email to the database
      db.collection('users').doc(user.uid).set({
        name: name,
        email: user.email,
      });
      //When successfully registered, login and redirect to home page
      console.log('REGISTERED');
      login(registerEmailInput.value, registerPasswordInput.value);
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode == 'auth/invalid-email') {
        registerEmailInput.style.borderBottom = 'solid 2px red';
        registerPasswordInput.style.borderBottom = 'solid 1px black';
        // if password is incorrect
      }
      if (errorCode == 'auth/weak-password') {
        registerPasswordInput.style.borderBottom = 'solid 2px red';
        registerEmailInput.style.borderBottom = 'solid 1px black';
        // if both are incorrect
      }
      if (errorCode == 'auth/email-already-in-use') {
        registerEmailInput.style.borderBottom = 'solid 2px red';
        registerPasswordInput.style.borderBottom = 'solid 2px red';
      }
    });
}

//login through firebase
const loginEmailInput = document.querySelector('#login-email');
const loginPasswordInput = document.querySelector('#login-password');
function login(email, password) {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      window.location.href = './home-page.html';
    })
    .catch((error) => {
      const errorCode = error.code;
      //const errorMessage = error.message;
      // if email is incorrect
      if (errorCode == 'auth/invalid-email') {
        loginEmailInput.style.borderBottom = 'solid 2px red';
        loginPasswordInput.style.borderBottom = 'solid 1px black';
        // if password is incorrect
      }
      if (errorCode == 'auth/wrong-password') {
        loginPasswordInput.style.borderBottom = 'solid 2px red';
        loginEmailInput.style.borderBottom = 'solid 1px black';
        // if both are incorrect
      }
      if (errorCode == 'auth/user-not-found') {
        loginEmailInput.style.borderBottom = 'solid 2px red';
        loginPasswordInput.style.borderBottom = 'solid 2px red';
      }
    });
}

//when click login, it calls the login function
loginButton.addEventListener('click', () => {
  login(loginEmailInput.value, loginPasswordInput.value);
});

//when press enter key, it calls the createUser function
const bothLoginInputBox = document
  .querySelectorAll('.login-input')
  .forEach((el) => {
    el.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        login(loginEmailInput.value, loginPasswordInput.value);
      }
    });
  });

//when click register button, it calls the createUser function
signUpButton.addEventListener('click', () => {
  createUser(
    registerEmailInput.value,
    registerPasswordInput.value,
    registerNameInput.value
  );
});

//when press enter key, it calls the createUser function
const bothRegisterInputBox = document
  .querySelectorAll('.register-input')
  .forEach((el) => {
    el.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        createUser(
          registerEmailInput.value,
          registerPasswordInput.value,
          registerNameInput.value
        );
      }
    });
  });

// function to send email if forgot password
function forgotPassword() {
  const forgotEmailInput = document.querySelector('#forgot-email');
  firebase
    .auth()
    .sendPasswordResetEmail(forgotEmailInput.value)
    .then(() => {
      forgotEmailInput.style.borderBottom = 'solid 2px black';
      // move to login box
      logInPage.style.left = '0%';
      forgorPage.style.left = '105%';
      registerPage.style.left = '105%';
      // show the Email Sent! box for 3 seconds
      const successMessage = document.querySelector('.success-div');
      successMessage.style.opacity = '1';
      let count = 0;
      setInterval(() => {
        count += 1;
        if (count == 5) {
          successMessage.style.opacity = '0';
          clearInterval();
        }
      }, 1000);
    })
    .catch((error) => {
      let errorCode = error.code;
      if (errorCode == 'auth/invalid-email') {
        forgotEmailInput.style.borderBottom = 'solid 2px red';
        // if password is incorrect
      }
      // ..
    });
}

// when click forgot button, call the forgotpassword function
const forgotButton = document.querySelector('#forgot-btn');
forgotButton.addEventListener('click', () => {
  forgotPassword();
});

// when click enter while on the forgot password box
// run the forgot password function
document
  .querySelector('.forgot-input')
  .addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      forgotPassword();
    }
  });

const queryString = window.location.search;
const urlParam = new URLSearchParams(queryString);
const origin = urlParam.get('from');

// when click on back, it goes back to the original page it was in using query
const backBtn = document.querySelector('.back-arrow');
backBtn.addEventListener('click', () => {
  
  if (origin === 'wishlist') {
    window.location.href = 'wishlist.html'
  } 
  if (origin === 'homepage') {
    window.location.href = 'home-page.html'
  }
  else {
    let productQuery = queryString.replace("?from=", "")
    window.location.href = `products.html?category=${productQuery}`
  }

})