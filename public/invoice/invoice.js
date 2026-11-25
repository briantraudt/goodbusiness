const $=id=>document.getElementById(id),form=$('invoiceForm'),f=form.elements;
let token='',invoices=[],editing=null,busy=false,remitTo='',pendingSend=null,pendingDelete=null;
const money=c=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(c/100),number=i=>'GB-'+String(i.number).padStart(5,'0');
const today=()=>new Date().toLocaleDateString('en-CA',{timeZone:'America/Chicago'});
const el=(tag,text)=>{const x=document.createElement(tag);if(text!==undefined)x.textContent=text;return x};
const notice=t=>$('notice').textContent=t;
async function api(body){const response=await fetch('/api/invoices',{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{})});const result=await response.json();if(response.status===401&&token)logout();if(!response.ok)throw Error(result.error||'Request failed');return result}
function logout(){pendingDelete=null;if($('deleteDialog').open)$('deleteDialog').close();pendingSend=null;if($('sendDialog').open)$('sendDialog').close();remitTo='';$('remitText').value='';$('remitPanel').hidden=true;token='';invoices=[];editing=null;form.reset();$('lines').replaceChildren();$('history').replaceChildren();$('clients').replaceChildren();$('print').replaceChildren();$('workspace').hidden=true;$('editor').hidden=true;$('logout').hidden=true;$('login').hidden=false}
async function run(fn){if(busy)return;busy=true;notice('');const buttons=[...document.querySelectorAll('button')];buttons.forEach(x=>x.disabled=true);try{await fn()}catch(e){notice(e.message)}finally{busy=false;buttons.forEach(x=>x.disabled=false)}}
$('loginForm').onsubmit=e=>{e.preventDefault();run(async()=>{const d=Object.fromEntries(new FormData(e.target));const result=await api({action:'login',...d});token=result.token;e.target.reset();await refresh();$('login').hidden=true;$('workspace').hidden=false;$('logout').hidden=false})};
$('logout').onclick=logout;
async function loadRemit(){const result=await api({action:'get_remit'});remitTo=result.remit_to;return remitTo}
$('remitToggle').onclick=()=>run(async()=>{await loadRemit();$('remitText').value=remitTo;$('remitPanel').hidden=false;$('remitText').focus()});
$('remitCancel').onclick=()=>{$('remitPanel').hidden=true;$('remitText').value=remitTo};
$('remitForm').onsubmit=e=>{e.preventDefault();run(async()=>{const result=await api({action:'save_remit',remit_to:$('remitText').value});remitTo=result.remit_to;$('remitText').value=remitTo;$('remitPanel').hidden=true;notice('Remit To saved.')})};
function add(item={description:'',quantity:1,rate_cents:0}){const row=el('div');row.className='line';for(const [name,type,value] of [['description','text',item.description],['quantity','number',item.quantity],['rate','number',item.rate_cents/100]]){const i=el('input');i.name=name;i.type=type;i.value=value;i.placeholder=name==='rate'?'Rate ($)':name==='quantity'?'Qty':'Description';i.setAttribute('aria-label',i.placeholder);i.required=true;if(type==='number'){i.min=name==='quantity'?'.001':'0';i.step=name==='quantity'?'any':'.01'}row.append(i)}const amount=el('span');row.append(amount);const remove=el('button','×');remove.type='button';remove.className='secondary';remove.setAttribute('aria-label','Remove item');remove.onclick=()=>{row.remove();if(!$('lines').children.length)add();calculate()};row.append(remove);$('lines').append(row);calculate()}
function items(){return [...$('lines').children].map(row=>({description:row.children[0].value,quantity:Number(row.children[1].value),rate:Number(row.children[2].value)}))}
function calculate(){let subtotal=0;[...$('lines').children].forEach(row=>{const n=Math.round(Number(row.children[1].value)*Math.round(Number(row.children[2].value)*100));subtotal+=n;row.children[3].textContent=money(n)});$('total').textContent=money(subtotal+Math.round(subtotal*Number(f.tax.value||0)/100))}
form.oninput=calculate;
f.client.onchange=()=>{const c=invoices.find(i=>i.client===f.client.value);if(c&&!editing){f.email.value=c.email;f.address.value=c.address}};
function open(i){editing=i?.id||null;form.reset();$('lines').replaceChildren();$('editorTitle').textContent=i?'Edit '+number(i):'New invoice';f.issued.value=i?.issued||today();const d=new Date();d.setDate(d.getDate()+30);f.due.value=i?.due||d.toLocaleDateString('en-CA',{timeZone:'America/Chicago'});if(i){for(const k of ['client','email','address','notes'])f[k].value=i[k];const sub=i.total_cents-i.tax_cents;f.tax.value=sub?Math.round(i.tax_cents/sub*10000)/100:0;i.items.forEach(add)}else add();$('editor').hidden=false;calculate();$('editor').scrollIntoView({behavior:'smooth'})}
$('new').onclick=()=>open();$('cancel').onclick=()=>{$('editor').hidden=true;editing=null};$('add').onclick=()=>add();
form.onsubmit=e=>{e.preventDefault();run(async()=>{const d=Object.fromEntries(new FormData(form));await api({...d,action:'save',id:editing,items:items()});$('editor').hidden=true;$('remitPanel').hidden=true;editing=null;form.reset();$('lines').replaceChildren();window.scrollTo({top:0,behavior:'instant'});try{await refresh()}catch(err){notice('Draft saved. Refresh the page to update invoice history.')}})};
function action(label,fn){const b=el('button',label);b.className='secondary';b.onclick=fn;return b}
const deleteDialog=$('deleteDialog');
function openDelete(i){
 if(busy||deleteDialog.open)return;
 pendingDelete=i;
 $('deleteNumber').textContent=number(i);
 $('deleteClient').textContent=i.client;
 $('deleteAmount').textContent=money(i.total_cents);
 $('deleteError').hidden=true;
 $('deleteConfirm').textContent='Delete invoice';
 deleteDialog.showModal();
}
$('deleteCancel').onclick=()=>{if(!busy)deleteDialog.close()};
deleteDialog.addEventListener('cancel',e=>{if(busy)e.preventDefault()});
deleteDialog.addEventListener('close',()=>{pendingDelete=null;$('deleteError').hidden=true});
$('deleteForm').onsubmit=e=>{
 e.preventDefault();if(busy||!pendingDelete)return;
 const i=pendingDelete;
 run(async()=>{
 $('deleteConfirm').textContent='Deleting…';$('deleteError').hidden=true;
 try{await api({action:'delete',id:i.id})}catch(err){if(deleteDialog.open){$('deleteError').textContent=err.message;$('deleteError').hidden=false;$('deleteConfirm').textContent='Delete invoice';return}throw err}
 if(editing===i.id){editing=null;form.reset();$('editor').hidden=true}
 deleteDialog.close();
 try{await refresh()}catch(err){notice('Invoice removed. Refresh the page to update invoice history.')}
 });
};
const sendDialog=$('sendDialog');
function openSend(i){
 if(busy||sendDialog.open)return;
 pendingSend=i;
 $('sendTitle').textContent=i.status==='draft'?'Send invoice':'Resend invoice';
 $('sendConfirm').textContent=$('sendTitle').textContent;
 $('sendRecipient').textContent=i.email;
 $('sendBcc').textContent=i.email.toLowerCase()==='brian@goodbusinesshq.com'?'Same as recipient — no duplicate copy':'brian@goodbusinesshq.com';
 $('sendClient').textContent=i.client;
 $('sendNumber').textContent=number(i);
 $('sendAmount').textContent=money(i.total_cents);
 $('sendSubject').textContent='Good Business Invoice #'+number(i);
 $('sendAttachment').textContent='Good-Business-Invoice-'+number(i)+'.pdf';
 $('sendError').hidden=true;
 sendDialog.showModal();
}
$('sendCancel').onclick=()=>{if(!busy)sendDialog.close()};
sendDialog.addEventListener('cancel',e=>{if(busy)e.preventDefault()});
sendDialog.addEventListener('close',()=>{pendingSend=null;$('sendError').hidden=true});
$('sendForm').onsubmit=e=>{
 e.preventDefault();if(!pendingSend||busy)return;
 const i=pendingSend;
 run(async()=>{
 $('sendError').hidden=true;$('sendConfirm').textContent='Sending…';
 try{await api({action:'send',id:i.id,confirmed_email:i.email})}
 catch(err){if(sendDialog.open){$('sendError').textContent=err.message;$('sendError').hidden=false;$('sendConfirm').textContent=$('sendTitle').textContent;return}throw err}
 sendDialog.close();
 try{await refresh()}catch(err){notice('Refresh the page to update invoice history.')}
 });
};
async function downloadPDF(i){
 const response=await fetch('/api/invoices',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({action:'pdf',id:i.id})});
 if(response.status===401)logout();
 if(!response.ok){const error=await response.json().catch(()=>({}));throw Error(error.error||'Could not create PDF.')}
 if(!response.headers.get('Content-Type')?.includes('application/pdf'))throw Error('Invalid PDF response.');
 const url=URL.createObjectURL(await response.blob()),a=el('a');
 a.href=url;a.download='Good-Business-Invoice-'+number(i)+'.pdf';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
}
async function refresh(){invoices=await api();$('outstanding').textContent=money(invoices.filter(i=>i.status==='sent').reduce((s,i)=>s+i.total_cents,0));$('paid').textContent=money(invoices.filter(i=>i.status==='paid').reduce((s,i)=>s+i.total_cents,0));$('drafts').textContent=invoices.filter(i=>i.status==='draft').length;$('clients').replaceChildren(...[...new Set(invoices.map(i=>i.client))].map(x=>{const o=el('option');o.value=x;return o}));const rows=invoices.map(i=>{const tr=el('tr');const status=i.status==='sent'&&i.due<today()?'Overdue':i.status;[number(i),i.client,i.due,money(i.total_cents),status].forEach(x=>tr.append(el('td',x)));const sentCell=el('td'),sent=el('span');const wasSent=Boolean(i.sent_at)||i.status==='sent'||i.status==='paid';sent.className='sent-indicator'+(wasSent?'':' pending');const check=el('input');check.type='checkbox';check.checked=wasSent;check.disabled=true;check.setAttribute('aria-label',wasSent?'Invoice sent':'Invoice not sent');sent.append(check,el('span',wasSent?'Sent':'Not sent'));if(i.sent_at)sent.title='Sent '+new Date(i.sent_at).toLocaleString();sentCell.append(sent);tr.append(sentCell);const td=el('td');td.className='row';if(i.status==='draft')td.append(action('Edit',()=>open(i)));td.append(action('PDF',()=>run(()=>downloadPDF(i))));if(i.status!=='paid')td.append(action(i.status==='draft'?'Send':'Resend',()=>openSend(i)));if(i.status==='sent')td.append(action('Mark paid',()=>{if(confirm('Mark '+number(i)+' paid?'))run(async()=>{await api({action:'paid',id:i.id});await refresh()})}));const del=action('Delete',()=>openDelete(i));del.className='delete-action';td.append(del);tr.append(td);return tr});$('history').replaceChildren(...rows);if(!rows.length){const tr=el('tr'),td=el('td','No invoices yet. Create your first invoice.');td.colSpan=7;tr.append(td);$('history').append(tr)}}
