function showInfo() {
    var firstName = document.getElementById("first-name").value;
    var lastName = document.getElementById("last-name").value;
    const loadingSpinner = document.getElementById("loading-spinner");
    var idt = "";

    loadingSpinner.style.display = "block";

    //refresh the table before continuing
    var table = document.getElementById("competition-table");
    var rowCount = table.rows.length;
    for (var i = rowCount - 1; i > 0; i--) {
        table.deleteRow(i);
    }


    getIDT(firstName, lastName)
    .then((profileIDT) => {
        console.log("Profile IDT: ", profileIDT);
        idt = profileIDT;
        return getCompetitions(idt); // Wait for getSouteze to finish before moving on
    })
    .then((souteze) => {
        console.log("Souteze: ", souteze);
        competitions = souteze;
        var infoDisplay = document.getElementById("info-display");
        infoDisplay.innerHTML = "<p><strong>IDT:</strong>" + idt + "</p>" +
                                "<p><strong>Jméno:</strong> " + firstName + "</p>" +
                                "<p><strong>Příjmení:</strong> " + lastName + "</p>";

        loadingSpinner.style.display = "none";
        showAnalytics();
        showTable();
        
    })
    .catch((error) => {
        console.error("Error: ", error);
    });                        
    
   
}

function showAveragePlacement() {
    console.log("showAveragePlacement");
    var averageScoreDisplay = document.getElementById("averageScore-display");
    var kat = document.getElementById("category").value;
    averageScoreDisplay.innerHTML = "<p>Průměrné umístění v "+ kat + ": " + averagePlacement(kat, competitions) + "</p>";
}


function averagePlacement(kat, souteze) {
//TODO - implement the function
    let count = 0;
    let sum = 0;
    for (let i = 0; i < souteze.length; i++){
        if (souteze[i].Kategorie === kat){
            count++;
            sum += souteze[i].PoradiOd;
        }
    }
    return sum / count;
}


function showAnalytics() {
    var analyticInfoSection = document.getElementById("analytics-section");
    analyticInfoSection.style.display = "block"; 
}

 var competitions = [];



function showTable(){
    var table = document.getElementById("competition-table");
    for (var i = 0; i < competitions.length; i++) {
        var row = table.insertRow(i + 1);
        var dateCell = row.insertCell(0);
        var nameCell = row.insertCell(1);
        var placementCell = row.insertCell(2);

        dateCell.innerHTML = competitions[i].Datum;
        nameCell.innerHTML = competitions[i].Nazev;
        placementCell.innerHTML = competitions[i].PoradiOd;
    }
}

async function getIDT(firstName,lastName){
    try {
        const response = await fetch('https://web-3knl.onrender.com/getProfileIDT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                jmeno: firstName,
                prijmeni: lastName,
            })
        });
        const data = await response.json();
        console.log('Profile IDT:', data.profileIDT);
        return data.profileIDT;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getCompetitions(idt){
    try {
        const response = await fetch(`https://web-3knl.onrender.com/getSouteze/${idt}`);
        const data = await response.json();
        console.log('Competitions:', data);
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}