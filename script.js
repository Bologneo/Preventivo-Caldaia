function showPreventivoPage() {
  document.querySelector('.container').classList.add('hidden');
  document.getElementById('preventivo-page').classList.remove('hidden');
}

function showHomePage() {
  document.getElementById('preventivo-page').classList.add('hidden');
  document.querySelector('.container').classList.remove('hidden');
}

function updateCaldaiaPrice() {
  const caldaiaPrice = document.getElementById('caldaia').value;
  document.getElementById('caldaia-price').textContent = caldaiaPrice ? `€ ${caldaiaPrice}` : '';
}

function updateAccessorioPrice(selectElement) {
  const price = selectElement.value;
  const priceElement = selectElement.nextElementSibling;
  const editPriceElement = selectElement.nextElementSibling.nextElementSibling;

  if (price === 'edit') {
      priceElement.textContent = '';
      editPriceElement.classList.remove('hidden');
  } else {
      priceElement.textContent = price ? `€ ${price}` : '';
      editPriceElement.classList.add('hidden');
      editPriceElement.value = ''; // Resetta il campo editabile
  }

  updateAccessorioTotal(editPriceElement.nextElementSibling);
}

function updateEditablePrice(inputElement) {
  const priceElement = inputElement.previousElementSibling;
  const price = inputElement.value;
  priceElement.textContent = price ? `€ ${price}` : '';
  updateAccessorioTotal(inputElement.nextElementSibling);
}

function updateAccessorioTotal(inputElement) {
  const quantity = inputElement.value;
  const priceElement = inputElement.previousElementSibling.previousElementSibling;
  const price = priceElement.textContent.replace('€ ', '');
  const totalElement = inputElement.nextElementSibling;
  totalElement.textContent = price && quantity ? `€ ${price * quantity}` : '';
}

function addAccessorio() {
  const container = document.getElementById('accessori-container');
  const newAccessorio = container.children[0].cloneNode(true);
  newAccessorio.querySelector('select').value = '';
  newAccessorio.querySelector('.accessorio-price').textContent = '';
  newAccessorio.querySelector('.edit-price').classList.add('hidden');
  newAccessorio.querySelector('.edit-price').value = '';
  newAccessorio.querySelector('input[placeholder="Quantità"]').value = '';
  newAccessorio.querySelector('.accessorio-total').textContent = '';
  container.appendChild(newAccessorio);
}

function updateValvolaPrice(selectElement) {
  const price = selectElement.value;
  const priceElement = selectElement.nextElementSibling;
  priceElement.textContent = price ? `€ ${price}` : '';
  updateValvolaTotal(selectElement.nextElementSibling.nextElementSibling);
}

function updateValvolaTotal(inputElement) {
  const quantity = inputElement.value;
  const priceElement = inputElement.previousElementSibling;
  const price = priceElement.textContent.replace('€ ', '');
  const totalElement = inputElement.nextElementSibling;
  totalElement.textContent = price && quantity ? `€ ${price * quantity}` : '';
}

function addValvola() {
  const container = document.getElementById('valvole-container');
  const newValvola = container.children[0].cloneNode(true);
  newValvola.querySelector('select').value = '';
  newValvola.querySelector('.valvola-price').textContent = '';
  newValvola.querySelector('input[placeholder="Quantità"]').value = '';
  newValvola.querySelector('.valvola-total').textContent = '';
  container.appendChild(newValvola);
}

function calcolaPreventivo() {
  const riepilogoContent = document.getElementById('riepilogo-content');
  riepilogoContent.innerHTML = '';

  const caldaia = document.getElementById('caldaia');
  if (caldaia.value) {
      riepilogoContent.innerHTML += `<div>${caldaia.options[caldaia.selectedIndex].text}: € ${caldaia.value}</div>`;
  }

  const accessori = document.querySelectorAll('#accessori-container .accessorio');
  accessori.forEach(accessorio => {
      const select = accessorio.querySelector('select');
      const quantity = accessorio.querySelector('input[placeholder="Quantità"]').value;
      const editPriceElement = accessorio.querySelector('.edit-price');
      let price = select.value;
      if (select.value === 'edit') {
          price = editPriceElement.value;
      }
      if (price && quantity) {
          riepilogoContent.innerHTML += `<div>${select.options[select.selectedIndex].text} (x${quantity}): € ${price * quantity}</div>`;
      }
  });

  const valvole = document.querySelectorAll('#valvole-container .valvola');
  valvole.forEach(valvola => {
      const select = valvola.querySelector('select');
      const quantity = valvola.querySelector('input').value;
      if (select.value && quantity) {
          riepilogoContent.innerHTML += `<div>${select.options[select.selectedIndex].text} (x${quantity}): € ${select.value * quantity}</div>`;
      }
  });

  const totale = Array.from(riepilogoContent.querySelectorAll('div')).reduce((total, div) => {
      const amount = parseFloat(div.textContent.split('€ ')[1]);
      return total + amount;
  }, 0);

  document.getElementById('totale').textContent = `€ ${totale.toFixed(2)}`;
document.getElementById('totale-netto').textContent = `€ ${(totale * 0.35).toFixed(2)}`;
document.getElementById('rata50').textContent = `€ ${((totale * 0.5) / 36).toFixed(2)}`;
document.getElementById('rata35').textContent = `€ ${((totale * 0.65) / 24).toFixed(2)}`;

  document.getElementById('riepilogo').classList.remove('hidden');
}


function creaPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const titolo = "ECCO IL TUO PREVENTIVO";
  doc.text(titolo, 10, 10);

  const riepilogoContent = document.getElementById('riepilogo-content').innerText;
  const lines = riepilogoContent.split('\n');
  let y = 20;
  lines.forEach(line => {
      doc.text(line, 10, y);
      y += 10;
  });

  const totale = document.getElementById('totale').textContent;
  const totaleNetto = document.getElementById('totale-netto').textContent;
  const rata50 = document.getElementById('rata50').textContent;
  const rata35 = document.getElementById('rata35').textContent;

  doc.text(`TOTALE: ${totale}`, 10, y + 10);
  doc.text(`TOT AL NETTO DELLA DETRAZIONE 65%: ${totaleNetto}`, 10, y + 20);
  doc.text(`Anticipo 50% con 36 rate: ${rata50}`, 10, y + 30);
  doc.text(`Anticipo 35% con 24 rate: ${rata35}`, 10, y + 40);

  doc.save('preventivo.pdf');
}
function creaPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  const titolo = "ECCO IL TUO PREVENTIVO";
  doc.text(titolo, 10, 10);
  
  const riepilogoContent = document.getElementById('riepilogo-content').innerText;
  const lines = riepilogoContent.split('\n');
  let y = 20;
  lines.forEach(line => {
      doc.text(line, 10, y);
      y += 10;
  });

  const totale = document.getElementById('totale').textContent;
  const totaleNetto = document.getElementById('totale-netto').textContent;
  const rata50 = document.getElementById('rata50').textContent;
  const rata35 = document.getElementById('rata35').textContent;
  
  doc.text(`TOTALE: ${totale}`, 10, y + 10);
  doc.text(`TOT AL NETTO DELLA DETRAZIONE 65%: ${totaleNetto}`, 10, y + 20);
  doc.text(`Anticipo 50% con 36 rate: ${rata50}`, 10, y + 30);
  doc.text(`Anticipo 35% con 24 rate: ${rata35}`, 10, y + 40);

  doc.save('preventivo.pdf');
}