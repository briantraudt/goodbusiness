import {createClient} from '@supabase/supabase-js';
import {createInvoicePDF} from '../lib/invoice-pdf.js';
import {invoiceEmail} from '../lib/invoice-email.js';
const owner='b8edeee8-06f8-4a93-be63-03f4fb5a7f56';
const money=c=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(c/100);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=i=>'GB-'+String(i.number).padStart(5,'0');
const clean=(v,n)=>typeof v==='string'?v.trim().slice(0,n):'';
function validate(b){
 const client=clean(b.client,200),email=clean(b.email,254),issued=clean(b.issued,10),due=clean(b.due,10);
 const date=s=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&!isNaN(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;
 if(!client||!/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(email)||!date(issued)||!date(due)||due<issued||!Array.isArray(b.items)||!b.items.length||b.items.length>50)throw new Error('Invalid client, dates or items.');
 const items=b.items.map(x=>{const description=clean(x.description,500),quantity=Number(x.quantity),rate_cents=Math.round(Number(x.rate)*100);
 if(!description||!Number.isFinite(quantity)||quantity<=0||quantity>100000||!Number.isSafeInteger(rate_cents)||rate_cents<0||rate_cents>100000000)throw new Error('Invalid line item.');
 return {description,quantity,rate_cents,amount_cents:Math.round(quantity*rate_cents)};});
 const subtotal=items.reduce((s,x)=>s+x.amount_cents,0),tax=Number(b.tax||0);
 if(!Number.isFinite(tax)||tax<0||tax>100)throw new Error('Invalid tax rate.');
 const tax_cents=Math.round(subtotal*tax/100);
 return {client,email,issued,due,address:clean(b.address,1000),notes:clean(b.notes,2000),items,tax_cents,total_cents:subtotal+tax_cents};
}
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 try{
 const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)return res.status(503).json({error:'Invoice service is not configured.'});
 const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
 const b=typeof req.body==='string'?JSON.parse(req.body):req.body||{};
 if(req.method==='POST'&&b.action==='login'){
 const auth=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data,error}=await auth.auth.signInWithPassword({email:clean(b.email,254),password:typeof b.password==='string'?b.password:''});
 if(error||data.user?.id!==owner)return res.status(401).json({error:'Invalid credentials.'});
 return res.status(200).json({token:data.session.access_token});
 }
 const token=String(req.headers.authorization||'').replace(/^Bearer /,'');
 if(!token)return res.status(401).json({error:'Sign in required.'});
 const {data,error}=await db.auth.getUser(token);
 if(error||data.user?.id!==owner)return res.status(401).json({error:'Sign in required.'});
 const table=()=>db.from('gb_invoices');
 const settings=()=>db.from('gb_invoice_settings');
 async function getRemit(){const q=await settings().select('remit_to').eq('owner_id',owner).maybeSingle();if(q.error)throw q.error;return q.data?.remit_to||''}
 if(req.method==='POST'&&b.action==='get_remit')return res.status(200).json({remit_to:await getRemit()});
 if(req.method==='POST'&&b.action==='save_remit'){
 if(typeof b.remit_to!=='string'||b.remit_to.length>3000)return res.status(400).json({error:'Remit To must be 3,000 characters or fewer.'});
 const q=await settings().upsert({owner_id:owner,remit_to:b.remit_to.trim()}).select('remit_to').single();
 if(q.error)throw q.error;return res.status(200).json(q.data);
 }
 if(req.method==='GET'){
 const q=await table().select('*').eq('owner_id',owner).order('number',{ascending:false}).limit(500);
 if(q.error)throw q.error;return res.status(200).json(q.data);
 }
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed.'});
 if(b.action==='save'){
 let value;try{value=validate(b)}catch(e){return res.status(400).json({error:e.message})}
 const q=b.id?await table().update(value).eq('id',b.id).eq('owner_id',owner).eq('status','draft').select().single():await table().insert({...value,owner_id:owner}).select().single();
 if(q.error)throw q.error;return res.status(200).json(q.data);
 }
 if(!['send','paid','pdf'].includes(b.action))return res.status(400).json({error:'Unknown action.'});
 const q=await table().select('*').eq('id',b.id).eq('owner_id',owner).single();
 if(q.error)return res.status(404).json({error:'Invoice not found.'});
 const i=q.data;
 if(b.action==='pdf'){
 const pdf=createInvoicePDF(i,i.remit_to??await getRemit());
 res.setHeader('Content-Type','application/pdf');
 res.setHeader('Content-Disposition','attachment; filename="Good-Business-Invoice-'+num(i)+'.pdf"');
 return res.status(200).send(pdf);
 }
 if(b.action==='paid'){
 if(i.status==='draft')return res.status(409).json({error:'Send invoice first.'});
 const p=await table().update({status:'paid'}).eq('id',i.id).eq('owner_id',owner).select().single();if(p.error)throw p.error;return res.status(200).json(p.data);
 }
 if(i.status==='paid')return res.status(409).json({error:'Invoice already paid.'});
 if(b.confirmed_email!==undefined&&b.confirmed_email!==i.email)return res.status(409).json({error:'Recipient has changed. Refresh the invoice and confirm the new email address.'});
 const from=process.env.RESEND_FROM_EMAIL||process.env.SOCIAL_ARB_FROM_EMAIL;
 if(!from||!process.env.RESEND_API_KEY)return res.status(503).json({error:'Email service not configured.'});
 const remit=i.remit_to??await getRemit();
 const pdf=createInvoicePDF(i,remit);
 const email=invoiceEmail(i);
 const sent=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json','Idempotency-Key':'invoice/'+i.id+'/'+(i.sent_at||'initial')},body:JSON.stringify({from,to:[i.email],...(i.email.toLowerCase()==='brian@goodbusinesshq.com'?{}:{bcc:['brian@goodbusinesshq.com']}),...email,attachments:[{filename:'Good-Business-Invoice-'+num(i)+'.pdf',content:pdf.toString('base64')}]})});
 if(!sent.ok)return res.status(502).json({error:'Email could not be sent.'});
 const result=await sent.json();
 const p=await table().update({status:'sent',remit_to:remit,sent_at:new Date().toISOString(),email_id:result.id}).eq('id',i.id).eq('owner_id',owner).neq('status','paid').select().single();
 if(p.error)return res.status(500).json({error:'Email accepted but invoice status could not be updated.'});
 return res.status(200).json(p.data);
 }catch{return res.status(500).json({error:'Invoice operation failed.'})}
}
