
    const competitions = [
        ['Jarní cena NKC Nové Strašecí ', ' Nové Strašecí'],
        ['Jarní cena NKC Nové Strašecí TPV ', ' Nové Strašecí'],
        // Add more competitions as needed
    ];
    console.log(competitions);
    generateRows(competitions);

    function generateRows(competitions) {
        const rowData = [];
        competitions.forEach(competition => {
            const name = competition[0];
            const place = competition[1];
            const links = [];
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

