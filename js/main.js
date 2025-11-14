// js/main.js
const API_BASE = "http://localhost:4000"; // absolute API base
const PD_ENDPOINT = "REPLACE_WITH_YOUR_PIPEDREAM_URL"; // or leave as-is for now

async function openFees(univId){
  const modal = document.getElementById('feesModal');
  const content = document.getElementById('feesContent');
  content.innerHTML = 'Loading...';
  modal.style.display='flex';
  try{
    const res = await fetch(`${API_BASE}/api/university/${univId}`);
    if(!res.ok) throw new Error('API error: '+res.status);
    const data = await res.json();
    let html = `<h3>${data.name} — Courses & Fee Ranges</h3><ul>`;
    data.courses.forEach(c=>{
      html += `<li><strong>${c.name}</strong>: ₹${c.fee_range.min.toLocaleString()} - ₹${c.fee_range.max.toLocaleString()}</li>`;
    });
    html += `</ul>`;
    content.innerHTML = html;
  }catch(e){
    content.innerHTML = '<div class="error">Could not load fee data. Make sure the API is running.</div>';
    console.error('openFees error:', e);
  }
}

function closeModal(){ document.getElementById('feesModal').style.display='none'; }

async function submitLead(formId){
  const form = document.getElementById(formId);
  const formData = Object.fromEntries(new FormData(form).entries());
  if(!formData.fullname || !formData.email || !formData.phone){
    showMessage(formId,'Please fill name, email and phone','error'); return;
  }
  if(!/^\d{10}$/.test(formData.phone)){ showMessage(formId,'Phone must be 10 digits','error'); return; }

  try{
    // send to Pipedream if set, otherwise send to local API endpoint for testing
    const endpoint = (PD_ENDPOINT && PD_ENDPOINT !== "REPLACE_WITH_YOUR_PIPEDREAM_URL") ? PD_ENDPOINT : `${API_BASE}/api/leads`;
    const res = await fetch(endpoint, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(formData)
    });
    if(!res.ok) throw new Error('Failed to send: '+res.status);
    showMessage(formId,'Lead submitted successfully','success');
    form.reset();
  }catch(e){
    showMessage(formId,'Submission failed — check console and endpoint','error');
    console.error('submitLead error:', e);
  }
}

function showMessage(formId,msg,cls){
  const el = document.querySelector('#'+formId+' .form-message');
  if(!el) return;
  el.textContent = msg;
  el.className = 'form-message '+(cls==='success'?'success':'error');
}
