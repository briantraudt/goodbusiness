import test from 'node:test';
import assert from 'node:assert/strict';
import {invoiceMarkup} from '../public/invoice/invoice-template.js';
const i={number:1,client:'<script>x</script>',email:'a@example.com',address:'123 Main\nAustin TX',issued:'2026-11-25',due:'2026-12-25',items:[{description:'Design & build',quantity:1,rate_cents:1500000,amount_cents:1500000}],total_cents:1500000,tax_cents:0,notes:'',status:'draft'};
test('invoice includes dates, amounts and escaped remittance',()=>{const h=invoiceMarkup(i,'Payee\n<bank>');for(const v of ['GB-00001','Nov 25, 2026','Dec 25, 2026','$15,000.00','Design &amp; build','Payee<br>&lt;bank&gt;','&lt;script&gt;'])assert.ok(h.includes(v),v);assert.ok(!h.includes('<script>'));});
test('paid invoice shows zero due',()=>assert.match(invoiceMarkup({...i,status:'paid'}),/Amount due[\s\S]*?\$0\.00/));
