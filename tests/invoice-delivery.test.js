import test from 'node:test';
import assert from 'node:assert/strict';
import {createInvoicePDF} from '../lib/invoice-pdf.js';
import {invoiceEmail} from '../lib/invoice-email.js';
const i={number:1103,client:'Example & Co',email:'a@example.com',address:'123 Main\nAustin TX',issued:'2026-11-25',due:'2026-12-25',items:[{description:'Design & build',quantity:1,rate_cents:1500000,amount_cents:1500000}],total_cents:1500000,tax_cents:0,notes:'',status:'draft'};
test('PDF has valid header, xref pointer and page objects',()=>{const p=createInvoicePDF(i,'Payee\nAddress').toString('ascii');assert.ok(p.startsWith('%PDF-1.4'));assert.ok(p.endsWith('%%EOF\n'));const x=Number(p.match(/startxref\n(\d+)/)[1]);assert.equal(p.slice(x,x+4),'xref');assert.match(p,/\/Count 1/);});
test('long invoice paginates',()=>{const p=createInvoicePDF({...i,items:Array.from({length:50},()=>i.items[0])},'Payee').toString('ascii');assert.ok(Number(p.match(/\/Count (\d+)/)[1])>1)});
test('email uses requested subject, escapes client and describes PDF',()=>{const e=invoiceEmail(i);assert.equal(e.subject,'Good Business Invoice #GB-01103');assert.ok(e.html.includes('Example &amp; Co'));assert.ok(e.text.includes('attached PDF'));assert.ok(e.text.includes('$15,000.00'));});
