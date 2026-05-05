document.addEventListener('DOMContentLoaded', () => {
  const selection = JSON.parse(localStorage.getItem('a2_selection') || '{}');
  const msg = document.getElementById('msg');

  if (!selection.packageType) {
    msg.innerText = 'Please choose a package first.';
    document.getElementById('client-form').style.display = 'none';
    return;
  }

  document.getElementById('websiteType').value = selection.packageType || '';
  document.getElementById('pages').value = selection.pages || 1;
  document.getElementById('pages').readOnly = true;

  document.getElementById('client-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const brief = {
      name: document.getElementById('name').value,
      businessName: document.getElementById('businessName').value,
      phone: document.getElementById('phone').value,
      websiteType: document.getElementById('websiteType').value,
      pages: Number(document.getElementById('pages').value) || selection.pages || 1,
      referenceWebsite: document.getElementById('referenceWebsite').value,
      extraRequirements: document.getElementById('extraRequirements').value
    };

    const updatedSelection = { ...selection, pages: brief.pages };
    localStorage.setItem('a2_selection', JSON.stringify(updatedSelection));
    localStorage.setItem('a2_projectBrief', JSON.stringify(brief));
    window.location.href = '/checkout.html';
  });
});
