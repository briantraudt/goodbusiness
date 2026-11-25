import {invoiceNumber} from './invoice-pdf.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function invoiceEmail(i){
 const number=invoiceNumber(i);
 const amount=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(i.total_cents/100);
 const due=new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(i.due+'T00:00:00Z'));
 const subject='Good Business Invoice #'+number;
 const text='Hello,\n\nPlease find attached your Good Business invoice #'+number+' for '+i.client+'.\n\nAmount due: '+amount+'\nPayment due: '+due+'\n\nPayment instructions are included in the attached PDF.\n\nThank you for your business!\n\nIf you have any questions please call 512-923-5223 or reply to this email.';
 const html='<div style="font:15px/1.65 Arial,sans-serif;color:#182a20;max-width:580px;margin:0 auto;padding:24px 8px"><div style="font-size:24px;font-weight:800;letter-spacing:-1px;color:#234735;border-bottom:2px solid #234735;padding-bottom:14px;margin-bottom:24px">Good Business.</div><p>Hello,</p><p>Please find attached your Good Business invoice <strong>#'+esc(number)+'</strong> for '+esc(i.client)+'.</p><div style="background:#f3f5f1;padding:16px 20px;border-radius:8px;margin:22px 0"><div style="font-size:12px;color:#52685b">Amount due</div><div style="font-size:24px;font-weight:700;color:#234735">'+esc(amount)+'</div><div style="margin-top:8px">Payment due: '+esc(due)+'</div></div><p>Payment instructions are included in the attached PDF.</p><p>Thank you for your business!</p><p>If you have any questions please call 512-923-5223 or reply to this email.</p></div>';
 return {subject,text,html};
}
