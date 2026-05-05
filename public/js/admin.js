document.addEventListener('DOMContentLoaded', async () => {
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  const table = document.getElementById('orders-table');
  const tbody = document.getElementById('orders-body');

  try {
    const res = await fetch('/api/client/orders');
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch orders');

    loading.style.display = 'none';
    table.style.display = '';

    data.clients.forEach((c) => {
      const tr = document.createElement('tr');
      function td(text) {
        const d = document.createElement('td');
        d.innerText = text || '';
        return d;
      }

      tr.appendChild(td(c.orderId));
      tr.appendChild(td(c.name));
      tr.appendChild(td(c.businessName));
      tr.appendChild(td(c.phone));
      tr.appendChild(td(c.packageType || c.websiteType));
      tr.appendChild(td((c.addons || []).join(', ') || '-'));
      tr.appendChild(td(c.referenceWebsite || '-'));
      tr.appendChild(td(c.extraRequirements || '-'));
      tr.appendChild(td(c.totalPrice != null ? 'Rs. ' + c.totalPrice : '-'));
      tr.appendChild(td(c.advancePaid != null ? 'Rs. ' + c.advancePaid : '-'));
      tr.appendChild(td(c.remainingAmount != null ? 'Rs. ' + c.remainingAmount : '-'));
      tr.appendChild(td(c.paymentStatus));
      tr.appendChild(td(c.projectStatus));
      tr.appendChild(td(new Date(c.createdAt).toLocaleString()));
      tbody.appendChild(tr);
    });
  } catch (err) {
    loading.style.display = 'none';
    error.innerText = err.message || 'Error';
  }
});
