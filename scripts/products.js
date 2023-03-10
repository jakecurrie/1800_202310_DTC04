/*-----------------------------------------------------------------------
Hamburger toggle
-----------------------------------------------------------------------*/
$(document).ready(function () {
  $(".menu-icon").click(function () {
    $(".menu").toggle();
  });
});

/*-----------------------------------------------------------------------
Back to top button
-----------------------------------------------------------------------*/
let mybutton = document.getElementById("btn-back-to-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
// When the user clicks on the button, scroll to the top of the document
mybutton.addEventListener("click", backToTop);

function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

/*-----------------------------------------------------------------------
Search bar
-----------------------------------------------------------------------*/

document.getElementById("two").onclick = function () {
  document.getElementById("two").style.pointerEvents = "none";
  document.getElementById("two").style.opacity = "0.5";
  document.querySelector(".responsive-search-bar").style.top = "0px";
};
document.querySelector(".close").onclick = function () {
  document.getElementById("two").style.pointerEvents = "auto";
  document.getElementById("two").style.opacity = "1";
  document.querySelector(".responsive-search-bar").style.top = "-300px";
};
