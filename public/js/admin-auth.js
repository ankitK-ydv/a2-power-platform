document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('login-form');
  const msg = document.getElementById('msg');
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    msg.innerText = 'Logging in...';
    const password = document.getElementById('password').value;
    try{
      const res = await fetch('/admin/login', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({password})});
      const data = await res.json();
      if(data.success){
        window.location.href = '/admin.html';
      } else {
        msg.innerText = data.message || 'Login failed';
      }
    }catch(err){
      msg.innerText = 'Error';
    }
  });
});
