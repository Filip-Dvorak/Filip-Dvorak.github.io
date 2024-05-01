
const loadingSpinner = document.getElementById("loading-spinner");
loadingSpinner.style.display = "block";
async function populateCompetitionsArray(){
    try {
        const response = await fetch('https://web-3knl.onrender.com/getNadchazejiciSouteze');
        const data = await response.json();
        console.log('Loaded comps:', data);
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}
populateCompetitionsArray().then(data => {
    const competitions = data;
    console.log(competitions);
    generateRows(data);
    loadingSpinner.style.display = "none";
})





    function generateRows(competitions) {
        const rowData = [];
        competitions.forEach(competition => {
            const name = competition.nazev;
            const place = competition.misto;
            const links = competition.kategorie;
            rowData.push({Name: name, Place: place, links: links});
        });

// Populate table rows with data
        const tbody = document.querySelector('#myTable tbody');
        rowData.forEach(rowData => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>${rowData.Name}</td>
            <td>${rowData.Place}</td>
        `;
            tr.addEventListener('click', () => toggleRowExpansion(tr, rowData.links));
            tbody.appendChild(tr);
        });
    }

// Function to toggle row expansion
    function toggleRowExpansion(row, links) {
        const nextRow = row.nextSibling;
        if (nextRow && nextRow.classList.contains('expandable-row')) {
            // Remove expandable row if already present
            nextRow.remove();
        } else {
            // Create expandable row
            const expandableRow = document.createElement('tr');
            expandableRow.className = 'expandable-row';
            expandableRow.innerHTML = `
                <td colspan="2">
                    <ul>${links.map(link => `<li>${link}</li>`).join('')}</ul>
                </td>
            `;
            row.parentNode.insertBefore(expandableRow, nextRow);
        }
    }

