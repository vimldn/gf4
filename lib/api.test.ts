import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sameBarcode,getPrices} from './api.ts';
test('price matches require exact barcode with only equivalent leading zeros',()=>{assert.ok(sameBarcode('012345678905','0012345678905'));assert.ok(!sameBarcode('012345678905','012345678906'));assert.ok(!sameBarcode('abc','abc'));});
test('observations exclude wrong barcode, country, currency, invalid prices and duplicate locations',async()=>{
 const saved=globalThis.fetch;globalThis.fetch=async()=>Response.json({items:[
 {id:1,product_code:'12345678',currency:'GBP',price:2,date:'2026-01-02',location_id:1,location:{osm_address_country_code:'GB'}},
 {id:2,product_code:'12345678',currency:'GBP',price:1,date:'2026-01-01',location_id:1,location:{osm_address_country_code:'GB'}},
 {id:3,product_code:'12345678',currency:'GBP',price:1,date:'2026-01-01',location_id:2,location:{osm_address_country_code:'FR'}},
 {id:4,product_code:'99999999',currency:'GBP',price:1,date:'2026-01-01',location_id:3,location:{osm_address_country_code:'GB'}},
 {id:5,product_code:'12345678',currency:'EUR',price:1,date:'2026-01-01',location_id:4,location:{osm_address_country_code:'GB'}},
 {id:6,product_code:'12345678',currency:'GBP',price:null,date:'2026-01-01',location_id:5,location:{osm_address_country_code:'GB'}}
 ]});try{const p=await getPrices('12345678');assert.deepEqual(p.map(x=>x.id),[1]);}finally{globalThis.fetch=saved;}
});
