document.addEventListener('DOMContentLoaded', async () => {
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  const empty = document.getElementById('empty');
  const table = document.getElementById('orders-table');
  const tbody = document.getElementById('orders-body');
  const totalOrders = document.getElementById('total-orders');
  const paidOrders = document.getElementById('paid-orders');
  const pendingOrders = document.getElementById('pending-orders');
  const logoutBtn = document.getElementById('logout-btn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await fetch('/admin/logout', { method: 'POST' });
      window.location.href = '/admin-login.html';
    });
  }

  try {
    const res = await fetch('/api/client/orders');
    if (res.status === 401) {
      window.location.href = '/admin-login.html';
      return;
    }
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch orders');

    loading.style.display = 'none';
    const clients = data.clients || [];
    totalOrders.innerText = clients.length;
    paidOrders.innerText = clients.filter((c) => /paid/i.test(c.paymentStatus || '')).length;
    pendingOrders.innerText = clients.filter((c) => !/paid/i.test(c.paymentStatus || '')).length;

    if (!clients.length) {
      empty.style.display = '';
      return;
    }

    table.style.display = '';

    clients.forEach((c) => {
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
