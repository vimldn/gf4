import {test} from 'node:test';
import assert from 'node:assert/strict';
import {api} from './api.mjs';
test('one unavailable retailer does not erase prices from the other four',async()=>{
 const original=globalThis.fetch;globalThis.fetch=async u=>String(u).includes('sainsburys')?new Response('Unavailable',{status:403}):Response.json({resources:{results:{products:[{id:1,title:'Test GF bread',handle:'test-bread',price:'4.50',price_min:'4.50',price_max:'5.50',available:true}]}}});
 try{const r=await api(new Request('https://test/api/shop?q=bread'));assert.equal(r.status,200);const j=await r.json();assert.equal(j.products.length,4);assert.equal(j.sources.filter(s=>s.status==='unavailable').length,1);assert.equal(j.sources[0].httpStatus,403);assert.ok(j.products.every(p=>p.price===4.5&&p.priceFrom));assert.equal(new Set(j.products.map(p=>p.id)).size,4);}finally{globalThis.fetch=original;}
});
test('all sources failing is explicit, not an empty successful comparison',async()=>{
 const original=globalThis.fetch;globalThis.fetch=async()=>new Response('No',{status:503});try{const j=await (await api(new Request('https://test/api/shop?q=bread'))).json();assert.equal(j.products.length,0);assert.equal(j.sources.filter(s=>s.status==='unavailable').length,5);}finally{globalThis.fetch=original;}
});
test('Shopify exact variant matching uses that variant price in pounds',async()=>{
 const original=globalThis.fetch;globalThis.fetch=async u=>String(u).includes('/products/')?Response.json({title:'GF Bread',variants:[{id:2,barcode:'3017620422003',price:475,available:true},{id:3,barcode:'3017620422004',price:150}]}):Response.json({resources:{results:{products:[{id:1,handle:'test-bread',title:'Bread',price:'1.50'}]}}});
 try{const j=await (await api(new Request('https://test/api/shop?q=bread&code=3017620422003&retailer=justnatural'))).json();assert.equal(j.products.length,1);assert.equal(j.products[0].price,4.75);assert.deepEqual(j.products[0].barcodes,['3017620422003']);}finally{globalThis.fetch=original;}
});
test('broad shop search does not show cakes for a pasta query',async()=>{
 const original=globalThis.fetch;globalThis.fetch=async()=>Response.json({resources:{results:{products:[{id:1,title:'Gluten Free Cake',handle:'cake',price:'5.00'},{id:2,title:'Gluten Free Pasta',handle:'pasta',price:'2.00'}]}}});try{const j=await (await api(new Request('https://test/api/shop?q=gluten%20free%20pasta&retailer=justnatural'))).json();assert.deepEqual(j.products.map(p=>p.name),['Gluten Free Pasta']);}finally{globalThis.fetch=original;}
});
