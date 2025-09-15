const insertButton = document.getElementById("submit-data")
const resetButton = document.getElementById("empty-table")
const table = document.querySelector("table")


insertButton.addEventListener("click", function() {

    const fileInput = document.getElementById("input-image")
    const file = fileInput.files.length > 0 ? fileInput.files[0] : null

    const user = {
        username: document.getElementById("input-username").value, 
        email: document.getElementById("input-email").value,
        admin: document.getElementById("input-admin").checked,
        image: file
    }
    
    let oldUsername = false
    let rivienMaara = table.rows.length
    let i
   

    for (i = 1; i < rivienMaara; i++)
        if (table.rows[i].cells[0].textContent == user.username) {
            table.rows[i].cells[1].textContent = user.email
            table.rows[i].cells[2].textContent = user.admin ? "X" : "-"

            table.rows[i].cells[3].innerHTML = ""
            let img = document.createElement("img")
            if (user.image){
                let img = document.createElement("img")
                img.width = 64
                img.height = 64
                img.src = URL.createObjectURL(user.image)
                table.rows[i].cells[3].innerHTML = `<img src=`+ img.src +`>`
                
            }


            oldUsername = true
        } 
    if (!oldUsername) { 
        let newRow = table.insertRow()
        let username = newRow.insertCell()
        let email = newRow.insertCell()
        let admin = newRow.insertCell()
        let image = newRow.insertCell()

        let img = document.createElement("img")
        img.width = 64
        img.height = 64

        if (user.image){
            img.src = URL.createObjectURL(user.image)
            image.innerHTML = `<img src=`+ img.src +`>`
        }
    
        username.textContent = user.username
        email.textContent = user.email
        admin.textContent = user.admin ? "X" : "-"
        
    }

    })




   

resetButton.addEventListener("click", function() { 
    table.innerHTML = `
        <tr> 
            <th>Username</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Profile</th>
        </tr>
    `
    
})
