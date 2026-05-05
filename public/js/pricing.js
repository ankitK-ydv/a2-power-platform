// Pricing logic: base package includes 1 to 4 pages.
const packagePrices = {
  landing: 3999,
  wordpress: 7999,
  coding: 11999,
  custom: 29999
};

const includedPages = 4;
const landingIncludedPages = 1;
const extraPagePrice = 1500;

function getSelectedPackage() {
  return document.querySelector('input[name="package"]:checked').value;
}

function getPageCount() {
  const input = document.getElementById('pages-input');
  const pages = parseInt(input.value, 10);
  if (!Number.isFinite(pages) || pages < 1) {
    input.value = 1;
    return 1;
  }
  return pages;
}

function getExtraWorkAmount() {
  const input = document.getElementById('extra-work-input');
  const amount = parseInt(input.value, 10);
  if (!Number.isFinite(amount) || amount < 0) {
    input.value = 0;
    return 0;
  }
  return amount;
}

function calc() {
  const pkg = getSelectedPackage();
  const base = packagePrices[pkg] || packagePrices.wordpress;
  const pages = getPageCount();
  const packageIncludedPages = pkg === 'landing' ? landingIncludedPages : includedPages;
  const extraPages = Math.max(pages - packageIncludedPages, 0);
  const pageCharge = extraPages * extraPagePrice;
  const extraWorkAmount = getExtraWorkAmount();

  const addons = Array.from(document.querySelectorAll('.addons input:checked')).map((input) => input.value);
  let addonsPrice = 0;
  if (addons.includes('SEO')) addonsPrice += 3000;
  if (addons.includes('WhatsApp')) addonsPrice += 1500;
  if (addons.includes('Hosting + Domain')) addonsPrice += 3999;
  if (addons.includes('Blog')) addonsPrice += 2500;

  const total = base + pageCharge + addonsPrice + extraWorkAmount;
  const advance = Math.round(total * 0.4);
  const remaining = total - advance;

  document.getElementById('extra-work-total').innerText = `₹${extraWorkAmount.toLocaleString('en-IN')}`;
  document.getElementById('total').innerText = `₹${total.toLocaleString('en-IN')}`;
  document.getElementById('advance').innerText = `₹${advance.toLocaleString('en-IN')}`;
  document.getElementById('remaining').innerText = `₹${remaining.toLocaleString('en-IN')}`;

  const state = { packageType: pkg, pages, addons, total, extraPages, pageCharge, extraWorkAmount };
  localStorage.setItem('a2_selection', JSON.stringify(state));
}

document.addEventListener('change', calc);
document.addEventListener('input', (event) => {
  if (event.target && (event.target.id === 'pages-input' || event.target.id === 'extra-work-input')) calc();
});
document.addEventListener('DOMContentLoaded', () => {
  calc();
  document.getElementById('pay-advance').addEventListener('click', () => {
    const state = JSON.parse(localStorage.getItem('a2_selection'));
    state.payType = 'advance';
    localStorage.setItem('a2_selection', JSON.stringify(state));
    window.location.href = '/form.html';
  });
  document.getElementById('pay-full').addEventListener('click', () => {
    const state = JSON.parse(localStorage.getItem('a2_selection'));
    state.payType = 'full';
    localStorage.setItem('a2_selection', JSON.stringify(state));
    window.location.href = '/form.html';
  });
});
