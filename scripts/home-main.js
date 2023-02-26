const curve = document.querySelector('.curve');
const snowscraperTitle = document.querySelector(".snow-name");
const mountainLogo = document.querySelector(".logo")
const titleDescription = document.querySelector(".short-description")

document.addEventListener('scroll', () => {
    const scrollVal = (window.pageYOffset / screen.height) * 100 + 30;
    if (scrollVal < 200) {
        console.log(scrollVal)
        curve.style.borderRadius = `${scrollVal}%`;
    }
})

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

const createWord = (text, index) => {
    const letter = document.createElement("span");

    letter.innerHTML = text;

    letter.classList.add("snow-name-letter");

    letter.style.transitionDelay = `${index * 40}ms`;

    return letter;
}

const addWord = (text, index) => snowscraperTitle.appendChild(createWord(text, index));

const createTitle = text => text.split("").map(addWord);

