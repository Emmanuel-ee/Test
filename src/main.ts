import * as myFunctions from "./index";

const lookupButton = document.getElementById('lookupButton') as HTMLButtonElement;
const searchTypeSelect = document.getElementById('searchType') as HTMLSelectElement;
const searchInput = document.getElementById('searchInput') as HTMLInputElement;
const resultsDiv = document.getElementById('results') as HTMLDivElement;

lookupButton.addEventListener('click', async () => {
    const searchType = searchTypeSelect.value;
    const searchTerm = searchInput.value;

    if (searchTerm) {
        try {
            let addresses: myFunctions.DisplayResult[] = [];
            if (searchType === 'postcode') {
                addresses = await myFunctions.getAddressByPostCode(searchTerm);
            } else if (searchType === 'query') {
                addresses = await myFunctions.getAddressByQuery(searchTerm);
            }
            displayResults(addresses);
        } catch (error) {
            console.error("Error:", error);
            resultsDiv.innerHTML = `<p>Error fetching data. Please try again later.</p>`;
        }
    } else {
        resultsDiv.innerHTML = `<p>Please enter a ${searchType === 'postcode' ? 'postcode' : 'query'}.</p>`;
    }
});

function displayResults(addresses: myFunctions.DisplayResult[]) {
    resultsDiv.innerHTML = '';

    if (addresses.length === 0) {
        resultsDiv.innerHTML = `<p>No addresses found.</p>`;
        return;
    }

    addresses.forEach(address => {
        const matchInfo = address.MATCH ? `<p><strong>Match:</strong> ${address.MATCH}</p>` : '';
        const addressInfo = `
            <div class="address">
                <p><strong>Address:</strong> ${address.ADDRESS}</p>
                <p><strong>UPRN:</strong> ${address.UPRN}</p>
                <p><strong>Post Town:</strong> ${address.POST_TOWN}</p>
                <p><strong>Postcode:</strong> ${address.POSTCODE}</p>
                <p><strong>Country:</strong> ${address.COUNTRY}</p>
                <p><strong>Last Update Date:</strong> ${address.LAST_UPDATE_DATE}</p>
                <p><strong>Entry Date:</strong> ${address.ENTRY_DATE}</p>
                <p><strong>Days Difference:</strong> ${address.DIFFERENCE_BETWEEN_LASTUPDATE_AND_ENTRYDATE}</p>
                ${matchInfo}
            </div>
        `;
        resultsDiv.innerHTML += addressInfo;
    });
}
