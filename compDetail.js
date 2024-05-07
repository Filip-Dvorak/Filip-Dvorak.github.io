let competitorsList=[];


function getCompetitors(){
    const queryString = window.location.search;
    console.log(queryString);
    const urlParams = new URLSearchParams(queryString);
    const src = urlParams.get('src');
    const kat = urlParams.get('kat');

    console.log('SRC:' + src);
    console.log('KAT:' + kat);

    fetchCompetitors(src, kat)
        .then((data) => {
            // Call showTable function with the fetched data
            competitorsList=data;
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

function showTable(competitorsList){
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