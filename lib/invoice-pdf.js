const money=c=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(Number(c)/100);
const date=s=>new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(s+'T00:00:00Z'));
export const invoiceNumber=i=>'GB-'+String(i.number).padStart(5,'0');
const green='0.137 0.278 0.208',ink='0.094 0.165 0.125',muted='0.32 0.41 0.36',line='0.86 0.89 0.86',pale='0.91 0.94 0.91';
// Standard PDF fonts use WinAnsi encoding. Preserve Latin-1 and common punctuation.
const extra={'€':128,'‚':130,'ƒ':131,'„':132,'…':133,'†':134,'‡':135,'ˆ':136,'‰':137,'Š':138,'‹':139,'Œ':140,'Ž':142,'‘':145,'’':146,'“':147,'”':148,'•':149,'–':150,'—':151,'˜':152,'™':153,'š':154,'›':155,'œ':156,'ž':158,'Ÿ':159};
function pdfString(s){
 let out='';
 for(const ch of String(s??'').normalize('NFC')){
 const n=extra[ch]??ch.codePointAt(0);
 const b=n>=32&&n<=255?n:63;
 out+='\\'+b.toString(8).padStart(3,'0');
 }
 return '('+out+')';
}
// Conservative width estimate for Helvetica; breaks long uninterrupted strings too.
function width(s,size,bold=false){
 let w=0;
 for(const c of String(s)){w+=/[ilI.,'!:;| ]/.test(c)?.31:/[MW@%&]/.test(c)?.92:/[A-Z0-9]/.test(c)?.68:.60}
 return w*size*(bold?1.05:1);
}
function wrap(s,max,size,bold=false){
 const result=[];
 for(const paragraph of String(s??'').split(/\r\n|\r|\n/)){
 let row='';
 for(const word of paragraph.split(/\s+/)){
 if(!word)continue;
 if(row&&width(row+' '+word,size,bold)>max){result.push(row);row=''}
 if(width(word,size,bold)>max){
 if(row){result.push(row);row=''}
 for(const c of word){if(row&&width(row+c,size,bold)>max){result.push(row);row=''}row+=c}
 }else row+=(row?' ':'')+word;
 }
 result.push(row);
 }
 return result;
}
export function createInvoicePDF(i,remit=''){
 const pages=[];let commands=[],y=0;
 const text=(s,x,top,size=11,bold=false,color=ink,align='left')=>{
 if(align==='right'){
 const str=String(s);
 const widths={36:556,44:278,46:278,45:333,40:333,41:333};
 const advance=/^[\d$,.()\-]+$/.test(str)?[...str].reduce((sum,c)=>sum+(/[0-9]/.test(c)?556:widths[c.charCodeAt(0)]),0)*size/1000:width(str,size,bold);
 x-=advance;
 }
 commands.push('BT /'+(bold?'F2':'F1')+' '+size+' Tf '+color+' rg 1 0 0 1 '+x.toFixed(2)+' '+(792-top).toFixed(2)+' Tm '+pdfString(s)+' Tj ET');
 };
 const rule=(top,x1=48,x2=564,color=line,weight=0.7)=>commands.push(color+' RG '+weight+' w '+x1+' '+(792-top)+' m '+x2+' '+(792-top)+' l S');
 const rect=(x,top,w,h,color)=>commands.push(color+' rg '+x+' '+(792-top-h)+' '+w+' '+h+' re f');
 const start=()=>{
 if(commands.length)pages.push(commands.join('\n'));
 commands=[];
 text('Good Business.',48,68,25,true,green);
 text('INVOICE',564,65,23,false,ink,'right');
 text(invoiceNumber(i),564,83,11,false,muted,'right');
 rule(100,48,564,green,2);y=126;
 };
 const ensure=h=>{if(y+h>728)start()};
 const label=(s,x,top)=>text(s,x,top,9,true,muted);
 function block(s,x,max,size=11,bold=false){
 for(const row of wrap(s,max,size,bold)){ensure(15);text(row,x,y,size,bold);y+=15}
 }
 start();
 label('BILL TO',48,y);label('INVOICE DATE',430,y);
 const billingTop=y;
 text(date(i.issued),430,y+19,11);label('PAYMENT DUE',430,y+45);text(date(i.due),430,y+64,11,true);
 y+=21;block(i.client,48,340,13,true);if(i.address)block(i.address,48,340);if(i.email)block(i.email,48,340);
 y=Math.max(y,billingTop+82)+20;
 function tableHead(){ensure(32);rect(48,y-14,516,29,pale);text('Description',56,y+4,10,true,green);text('Qty',376,y+4,10,true,green,'right');text('Rate',462,y+4,10,true,green,'right');text('Amount',556,y+4,10,true,green,'right');y+=30}
 tableHead();
 for(const item of i.items){
 const rows=wrap(item.description,270,10.5);const h=Math.max(25,rows.length*14+10);
 if(y+h>728){start();tableHead()}
 rows.forEach((s,k)=>text(s,56,y+k*14,10.5));
 text(String(item.quantity),376,y,10.5,false,ink,'right');
 text(money(item.rate_cents),462,y,10.5,false,ink,'right');
 text(money(item.amount_cents),556,y,10.5,true,ink,'right');
 y+=h;rule(y-8);y+=4;
 }
 y+=14;ensure(128);
 for(const [name,value] of [['Subtotal',i.total_cents-i.tax_cents],['Tax',i.tax_cents],['Invoice total',i.total_cents]]){
 if(name==='Invoice total')rule(y-13,316,564,green,1.2);
 text(name,324,y,11,name==='Invoice total',muted);text(money(value),556,y,11,name==='Invoice total',ink,'right');y+=24
 }
 rect(316,y-11,248,38,green);text('Amount due',324,y+12,11,true,'1 1 1');text(money(i.status==='paid'?0:i.total_cents),556,y+12,16,true,'1 1 1','right');y+=52;
 for(const [name,value] of [['REMIT TO',remit],['NOTES / PAYMENT INSTRUCTIONS',i.notes]]){
 if(!value)continue;ensure(46);rule(y-11);label(name,48,y+5);y+=24;block(value,48,510);y+=14
 }
 ensure(55);rule(y-8);text('Thank you for your business!',48,y+10,11,true,green);text('If you have any questions please call 512-923-5223.',48,y+32,10,false,muted);
 pages.push(commands.join('\n'));
 const objects=['','<< /Type /Catalog /Pages 2 0 R >>','','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'];
 const kids=[];
 for(let k=0;k<pages.length;k++){
 const stream=pages[k]+'\nBT /F1 9 Tf '+muted+' rg 1 0 0 1 48 32 Tm '+pdfString(invoiceNumber(i))+' Tj ET\nBT /F1 9 Tf '+muted+' rg 1 0 0 1 520 32 Tm '+pdfString((k+1)+' / '+pages.length)+' Tj ET';
 const p=objects.length,c=p+1;kids.push(p+' 0 R');
 objects.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents '+c+' 0 R >>','<< /Length '+Buffer.byteLength(stream,'ascii')+' >>\nstream\n'+stream+'\nendstream');
 }
 objects[2]='<< /Type /Pages /Count '+pages.length+' /Kids ['+kids.join(' ')+'] >>';
 let output='%PDF-1.4\n';const offsets=[0];
 for(let k=1;k<objects.length;k++){offsets.push(Buffer.byteLength(output,'ascii'));output+=k+' 0 obj\n'+objects[k]+'\nendobj\n'}
 const xref=Buffer.byteLength(output,'ascii');
 output+='xref\n0 '+objects.length+'\n0000000000 65535 f \n'+offsets.slice(1).map(v=>String(v).padStart(10,'0')+' 00000 n \n').join('')+'trailer\n<< /Size '+objects.length+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF\n';
 return Buffer.from(output,'ascii');
}
