const curve = document.querySelector('.curve');
const snowscraperTitle = document.querySelector(".snow-name");
const mountainLogo = document.querySelector(".logo")
const titleDescription = document.querySelector(".short-description")
const hamburger = document.querySelector(".hamburger")

window.addEventListener('load', () => {
    createTitle("SNOWSCRAPER")
    const snowscraperLetter = document.querySelectorAll(".snow-name-letter")
    let loop = 0
    let interval = setInterval(() => {
        let index = 0,
            length = snowscraperLetter.length;
        for (; index < length; index++) {
            snowscraperLetter[index].style.transform = `translate(0, 70%)`;
            snowscraperLetter[index].style.opacity = `1`;
        }
        if (loop == 10) {    
            titleDescription.style.opacity = '1';
            clearInterval(interval)
        }
        mountainLogo.style.opacity = '0.5';
        loop++
    }, 100);
})

document.addEventListener('scroll', () => {
    const scrollVal = (window.pageYOffset / screen.height) * 100 + 30;
    if (scrollVal < 200) {
        curve.style.borderRadius = `${scrollVal}%`;
    }
})

hamburger.addEventListener('click', (event) => {
    let hamOrX = event.target.getAttribute("class")
    const sideNav = document.querySelector(".side-nav-container")
    if (hamOrX == "fa-solid fa-bars") {
        event.target.className = "fa-solid fa-xmark"
        sideNav.style.boxShadow = "2px 2px 2px 2px rgba(0, 0, 0, 0.281)"
        sideNav.style.left = "0"
    } else {
        event.target.className = "fa-solid fa-bars"
        sideNav.style.boxShadow = "none"
        if (window.innerWidth <= 600) {
            sideNav.style.left = "-50vw"
        } else{
            sideNav.style.left = "-8vw"
        }
        
    }
})

const createWord = (text, index) => {
    const letter = document.createElement("span");

    letter.innerHTML = text;

    letter.classList.add("snow-name-letter");

    letter.style.transitionDelay = `${index * 40}ms`;

    return letter;
}

const addWord = (text, index) => snowscraperTitle.appendChild(createWord(text, index));

const createTitle = text => text.split("").map(addWord);

