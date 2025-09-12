const writeTextButton = document.getElementById("my-button");
const changeText = document.getElementById("text");
const list = document.getElementById("my-list");
const addToList = document.getElementById("add-data");
const textToCopy = document.getElementById("copyText");
writeTextButton.addEventListener("click", function() { 
        console.log("hello world");
        changeText.innerText = "Moi maailma";
    })
addToList.addEventListener("click", function() {
    let newText = document.createElement("li");
    newText.innerText = document.getElementById("copyText").value;
    list.appendChild(newText);
})


    