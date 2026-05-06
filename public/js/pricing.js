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

function formatMoney(amount) {
  return `\u20b9${amount.toLocaleString('en-IN')}`;
}

function isManualPaymentSelected() {
  const toggle = document.getElementById('manual-payment-toggle');
  return Boolean(toggle && toggle.checked);
}

function getSelectedPackage() {
  const selected = document.querySelector('input[name="package"]:checked');
  return selected ? selected.value : '';
}

function selectManualPayment() {
  const toggle = document.getElementById('manual-payment-toggle');
  if (toggle) toggle.checked = true;
  document.querySelectorAll('input[name="package"]').forEach((input) => {
    input.checked = false;
  });
  document.querySelectorAll('.addons input').forEach((input) => {
    input.checked = false;
  });
  calc();
}

function clearManualPayment() {
  const toggle = document.getElementById('manual-payment-toggle');
  if (toggle) toggle.checked = false;
  calc();
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

function getManualAmount() {
  const input = document.getElementById('manual-amount-input');
  const amount = parseInt(input.value, 10);
  if (!Number.isFinite(amount) || amount < 1) {
    return 0;
  }
  return amount;
}

function calc() {
  const manualPayment = isManualPaymentSelected();
  const pkg = getSelectedPackage();
  const base = packagePrices[pkg] || packagePrices.wordpress;
  const pages = getPageCount();
  const packageIncludedPages = pkg === 'landing' ? landingIncludedPages : includedPages;
  const extraPages = manualPayment ? 0 : Math.max(pages - packageIncludedPages, 0);
  const pageCharge = manualPayment ? 0 : extraPages * extraPagePrice;
  const extraWorkAmount = manualPayment ? 0 : getExtraWorkAmount();

  const addons = manualPayment ? [] : Array.from(document.querySelectorAll('.addons input:checked')).map((input) => input.value);
  let addonsPrice = 0;
  if (addons.includes('SEO')) addonsPrice += 3000;
  if (addons.includes('WhatsApp')) addonsPrice += 1500;
  if (addons.includes('Hosting + Domain')) addonsPrice += 3999;
  if (addons.includes('Blog')) addonsPrice += 2500;

  const manualAmount = getManualAmount();
  const total = manualPayment ? manualAmount : base + pageCharge + addonsPrice + extraWorkAmount;
  const advance = manualPayment ? total : Math.round(total * 0.4);
  const remaining = manualPayment ? 0 : total - advance;

  document.getElementById('extra-work-total').innerText = formatMoney(extraWorkAmount);
  document.getElementById('total').innerText = formatMoney(total);
  document.getElementById('advance').innerText = formatMoney(advance);
  document.getElementById('remaining').innerText = formatMoney(remaining);
  document.getElementById('advance-label').innerText = manualPayment ? 'Manual payment' : 'Advance (40%)';
  document.getElementById('remaining-label').innerText = manualPayment ? 'Remaining after manual payment' : 'Remaining';

  const state = {
    packageType: manualPayment ? 'manual' : pkg,
    pages: manualPayment ? 1 : pages,
    addons,
    total,
    extraPages,
    pageCharge,
    extraWorkAmount,
    manualPayment,
    manualAmount
  };
  localStorage.setItem('a2_selection', JSON.stringify(state));
}

document.addEventListener('change', (event) => {
  if (event.target && event.target.name === 'package') {
    clearManualPayment();
    return;
  }
  if (event.target && event.target.id === 'manual-payment-toggle') {
    if (event.target.checked) {
      selectManualPayment();
    } else {
      const fallbackPackage = document.querySelector('input[name="package"][value="wordpress"]');
      if (fallbackPackage) fallbackPackage.checked = true;
      calc();
    }
    return;
  }
  calc();
});

document.addEventListener('input', (event) => {
  if (event.target && event.target.id === 'manual-amount-input') {
    selectManualPayment();
    return;
  }
  if (event.target && (event.target.id === 'pages-input' || event.target.id === 'extra-work-input')) calc();
});

document.addEventListener('DOMContentLoaded', () => {
  const manualPanel = document.getElementById('manual-payment-panel');
  const manualButton = document.getElementById('show-manual-payment');
  const manualInput = document.getElementById('manual-amount-input');

  manualButton.addEventListener('click', () => {
    manualPanel.hidden = !manualPanel.hidden;
    if (!manualPanel.hidden) {
      manualInput.focus();
    }
  });

  calc();
  document.getElementById('pay-advance').addEventListener('click', () => {
    const state = JSON.parse(localStorage.getItem('a2_selection'));
    if (state.manualPayment && state.manualAmount < 1) {
      manualPanel.hidden = false;
      manualInput.focus();
      return;
    }
    state.payType = state.manualPayment ? 'full' : 'advance';
    localStorage.setItem('a2_selection', JSON.stringify(state));
    window.location.href = '/form.html';
  });
  document.getElementById('pay-full').addEventListener('click', () => {
    const state = JSON.parse(localStorage.getItem('a2_selection'));
    if (state.manualPayment && state.manualAmount < 1) {
      manualPanel.hidden = false;
      manualInput.focus();
      return;
    }
    state.payType = 'full';
    localStorage.setItem('a2_selection', JSON.stringify(state));
    window.location.href = '/form.html';
  });
});
