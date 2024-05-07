let competitorsList = [];
let kategorie;


function getCompetitors() {
    const queryString = window.location.search;
    console.log(queryString);
    const urlParams = new URLSearchParams(queryString);
    const src = urlParams.get('src');
    const kat = urlParams.get('kat');
    kategorie=kat;

    console.log('SRC:' + src);
    console.log('KAT:' + kat);

    fetchCompetitors(src, kat)
        .then((data) => {
            // Call showTable function with the fetched data
            competitorsList = data;
            if (data.length === 0) {
                alert("Na soutež se nikdo nepřihlásil :(");
            }
            showTable(data);
        })
        .catch((error) => {
            console.log("Error:" + error);
        });
}

async function fetchCompetitors(src, kat) {
    try {
        const response = await fetch(`https://web-3knl.onrender.com/getCompetitors/${src}/${kat}`);
        const data = await response.json();
        console.log('Competitors:', data);
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

function showTable(competitorsList) {
    var table = document.getElementById("competition-table");
    for (var i = 0; i < competitorsList.length; i++) {
        var row = table.insertRow(i + 1);
        var partnerCell = row.insertCell(0);
        var partnerkaCell = row.insertCell(1);
        var klubCell = row.insertCell(2);
        var predikceCell = row.insertCell(3);

        partnerCell.innerHTML = competitorsList[i].name1;
        partnerkaCell.innerHTML = competitorsList[i].name2;
        klubCell.innerHTML = competitorsList[i].club;
    }
}

function predict() {
    let avgPositions = [];
    competitorsList.forEach(async (competitor) => {
        let partnerJmeno = competitor.name1.toString().split(/\s+/);
        let partnerkaJmeno = competitor.name2.toString().split(/\s+/);
        let idtPartner = await getIDT(partnerJmeno[1],partnerJmeno[0]);
        let idtPartnerka = await getIDT(partnerkaJmeno[1],partnerkaJmeno[0]);
        console.log(partnerJmeno,idtPartner);
        console.log(partnerkaJmeno,idtPartnerka);
    });


}

function averagePlacement(kat, souteze) {
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



async function getIDT(firstName, lastName) {
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