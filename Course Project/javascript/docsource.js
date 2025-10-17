const switchMode = document.getElementById("switchMode")
const header = document.querySelector(".header");
const innerheader = document.querySelector(".innerheader");
let lightMode = false;

switchMode.addEventListener("click", () => {
    lightMode = !lightMode;
    if (lightMode) {
        document.body.style.backgroundImage = 'url("../images/lightbg.png")';
        header.style.backgroundColor = "#888888";
        innerheader.style.background = "#888888";
    }
    else {
        document.body.style.backgroundImage = 'url("../images/background.png")';
        header.style.backgroundColor = "#232426";
        innerheader.style.background = "#232426";
    }
})