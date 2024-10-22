import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', () => {
  feather.replace();
  loadTaxPayers();

  const addForm = document.getElementById('addTaxPayerForm');
  const searchButton = document.getElementById('searchButton');
  const refreshButton = document.getElementById('refreshButton');

  addForm.addEventListener('submit', addTaxPayer);
  searchButton.addEventListener('click', searchTaxPayer);
  refreshButton.addEventListener('click', loadTaxPayers);
});

async function addTaxPayer(event) {
  event.preventDefault();
  showLoading();

  const tid = document.getElementById('tid').value;
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const address = document.getElementById('address').value;

  try {
    await backend.addTaxPayer(tid, firstName, lastName, address);
    document.getElementById('addTaxPayerForm').reset();
    await loadTaxPayers();
  } catch (error) {
    console.error('Error adding TaxPayer:', error);
  }

  hideLoading();
}

async function searchTaxPayer() {
  showLoading();
  const searchTid = document.getElementById('searchTid').value;
  const searchResult = document.getElementById('searchResult');

  try {
    const result = await backend.searchTaxPayer(searchTid);
    if (result.length > 0) {
      const taxPayer = result[0];
      searchResult.innerHTML = `
        <h3>Search Result:</h3>
        <p>TID: ${taxPayer.tid}</p>
        <p>Name: ${taxPayer.firstName} ${taxPayer.lastName}</p>
        <p>Address: ${taxPayer.address}</p>
      `;
    } else {
      searchResult.innerHTML = '<p>No TaxPayer found with the given TID.</p>';
    }
  } catch (error) {
    console.error('Error searching TaxPayer:', error);
    searchResult.innerHTML = '<p>Error occurred while searching.</p>';
  }

  hideLoading();
}

async function loadTaxPayers() {
  showLoading();
  const taxPayerList = document.getElementById('taxPayerList');

  try {
    const taxPayers = await backend.getAllTaxPayers();
    taxPayerList.innerHTML = '';
    taxPayers.forEach(taxPayer => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${taxPayer.tid}</strong> - ${taxPayer.firstName} ${taxPayer.lastName}, ${taxPayer.address}
      `;
      taxPayerList.appendChild(li);
    });
  } catch (error) {
    console.error('Error loading TaxPayers:', error);
    taxPayerList.innerHTML = '<li>Error occurred while loading TaxPayers.</li>';
  }

  hideLoading();
}

function showLoading() {
  document.getElementById('loadingSpinner').style.display = 'flex';
}

function hideLoading() {
  document.getElementById('loadingSpinner').style.display = 'none';
}
