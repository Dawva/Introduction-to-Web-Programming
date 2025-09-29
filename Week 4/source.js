const button = document.getElementById("submit-data")
const text = document.getElementById("input-show")
const container = document.getElementById("container")
button.addEventListener("click", fetchData)
async function fetchData(){
    const name = text.value.toLowerCase()
    try{
        let URL = `https://api.tvmaze.com/search/shows?q=${name}`
        const response = await fetch(URL)
        const data = await response.json()
        container.innerHTML = ""
        writeData(data)
    }
    catch{
        console.log("Show not found")
    }
        }
    

function writeData(data) {
    data.forEach(movie => {
        
        const div = document.createElement("div")
        div.className = "show-data"
        const img = document.createElement("img")
        const div2 = document.createElement("div")
        div2.className= "show-info"
        const title = document.createElement("h1")
        const sum = document.createElement("div")
        
    

        
    

        title.textContent = movie.show.name

        image = movie.show.image.medium
        img.src = image

        
        sum.innerHTML = movie.show.summary
       

        div.appendChild(img)
        div.appendChild(div2)
        div2.appendChild(title)
        div2.appendChild(sum)
        console.log("5")

        container.appendChild(div)





    })
}