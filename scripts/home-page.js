// navbar background change and snowscraper name visible when scroll
const navbar = document.querySelector('.navbar');
const logo = document.querySelector('.navbar-logo');
const navbarTitle = document.querySelector('.navbar-title');

window.addEventListener('scroll', () => {
  yPos = window.scrollY;
  if (yPos < 100) {
    navbar.style.backgroundColor = 'transparent';
    navbarTitle.style.display = 'none';
    logo.style.opacity = '0.5';
  } else {
    navbar.style.backgroundColor = '#263159';
    navbarTitle.style.display = 'block';
    logo.style.opacity = '1';
  }
});

// clicking logo and name redirect to home page
const navbarLogoSection = document.querySelector('.logo-section');

navbarLogoSection.addEventListener('click', () => {
  window.location.replace('/home-page.html');
});
