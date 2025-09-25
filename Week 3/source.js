const populationURL = "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/vaerak/statfin_vaerak_pxt_11ra.px"
const employmentURL = "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/tyokay/statfin_tyokay_pxt_115b.px"


const fetchStatFinData = async (URL, body) => {
    const response = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    return await response.json();
}

const initializeCode = async() => {
    const populationBody = await (await fetch("./population_query.json")).json();
    const employmentBody = await (await fetch("./employment_query.json")).json();

    const [populationData, employmentData] = await Promise.all([
        fetchStatFinData(populationURL, populationBody),
        fetchStatFinData(employmentURL, employmentBody)
    ]);

    
   

    const municipalityData = populationData.dimension.Alue.category.label;
    const valuesData = populationData.value
    const employment = employmentData.value
    setupTable(municipalityData, valuesData, employment)


   
    
};





function setupTable(municipalityData, valueData, employment) { 
    const municipalities = Object.values(municipalityData)
    const values = Object.values(valueData)
    const employmentNumber = Object.values(employment)
    const dataTable = document.getElementById("dataTable")

    municipalities.forEach((Municipality, index) => {
        let tr = document.createElement("tr")
        let td1 = document.createElement("td")
        let td2 = document.createElement("td")
        let td3 = document.createElement("td")
        let td4 = document.createElement("td")

        let percentage = ((employmentNumber[index]/values[index]) * 100).toFixed(2)


        td1.innerText = Municipality
        td2.innerText = values[index]
        td3.innerText = employmentNumber[index]
        td4.innerText = percentage + "%"

        if (percentage >= 45) {
            tr.classList.add("green");
        } else if (percentage <= 25) {
            tr.classList.add("red");
        }
        
        


        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tr.appendChild(td4)

        dataTable.appendChild(tr)
    })


}
initializeCode();




