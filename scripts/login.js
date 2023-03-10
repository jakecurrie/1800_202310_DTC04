const logInPage = document.querySelector('.login-box');
const signUp = document.querySelector('.register-click');
const registerPage = document.querySelector('.register-box');
const logIn = document.querySelector('.login-click');

const loginButton = document.querySelector('.login-btn');
const signUpButton = document.querySelector('.register-btn');

//when clicked 'register' or 'log in' it switches box
signUp.addEventListener('click', () => {
    logInPage.style.left = '-100%';
    registerPage.style.left = '0%';
});

logIn.addEventListener('click', () => {
    logInPage.style.left = '0%';
    registerPage.style.left = '-100%';
});

//create user through firebase
function createUser(email, password, name) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
      // Signed in 
    const user = userCredential.user;
    //add users name and email to the database
    db.collection("users").doc(user.uid).set({
        name: name,
        email: user.email
    })
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage)
  });
}

//login through firebase 
function login(email, password) {
    const emailBorder = document.querySelector('#login-email');
    const passwordBorder = document.querySelector('#login-password');

    firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    console.log("UR SIGNED IN")
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    //const errorMessage = error.message;
    // if email is incorrect
    if (errorCode == 'auth/invalid-email') {
        emailBorder.style.borderBottom = 'solid 2px red'
        passwordBorder.style.borderBottom = 'solid 1px black'
    // if password is incorrect
    } if (errorCode == 'auth/wrong-password') {
        passwordBorder.style.borderBottom = 'solid 2px red'
        emailBorder.style.borderBottom = 'solid 1px black'
    // if both are incorrect
    } if (errorCode == 'auth/user-not-found') {
        emailBorder.style.borderBottom = 'solid 2px red'
        passwordBorder.style.borderBottom = 'solid 2px red'
    }
  });
}

//when click login, it calls the login function
const loginEmailInput = document.querySelector('#login-email');
const loginPasswordInput = document.querySelector('#login-password');
loginButton.addEventListener('click', () => {
    login(loginEmailInput.value, loginPasswordInput.value);
});

//when press enter key, it calls the createUser function
const bothLoginInputBox = document.querySelectorAll('.login-input')
.forEach((el) => {
    el.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' ){
            login(loginEmailInput.value, loginPasswordInput.value);
        } 
    })    
});

//when click register button, it calls the createUser function
const registerEmailInput = document.querySelector('#register-email');
const registerPasswordInput = document.querySelector('#register-password');
const registerNameInput = document.querySelector('#register-name');
signUpButton.addEventListener('click', () => {
    createUser(registerEmailInput.value, registerPasswordInput.value, registerNameInput.value);
});

//when press enter key, it calls the createUser function
const bothRegisterInputBox = document.querySelectorAll('.register-input')
.forEach((el) => {
    el.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' ){
            createUser(registerEmailInput.value, registerPasswordInput.value, registerNameInput.value);
        } 
    })    
});
