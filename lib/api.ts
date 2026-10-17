import type { Product } from './check';
async function json(url:string,signal?:AbortSignal){
 const timeout=AbortSignal.timeout(35000);
 const r=await fetch(url,{signal:signal?AbortSignal.any([signal,timeout]):timeout,headers:{Accept:'application/json'}});
 if(!r.ok){const body=await r.json().catch(()=>null);throw new Error(body?.error||(r.status===429?'The source is busy. Please wait a minute and try again.':'The data source is temporarily unavailable. Please try again.'));}
 return r.json();
}
export async function lookup(code:string,signal?:AbortSignal):Promise<Product>{
 const j=await json('/api/product?code='+encodeURIComponent(code),signal);
 if(j.status!==1||!j.product)throw new Error('This barcode is not in Open Food Facts yet. Check the packaging or try searching its name.');
 return {...j.product,code:j.product.code||code};
}
export async function searchFood(query:string,ukOnly:boolean,page=1,signal?:AbortSignal,gfOnly=false):Promise<{products:Product[];more:boolean}>{
 const params=new URLSearchParams({q:query,uk:ukOnly?'1':'0',gf:gfOnly?'1':'0',page:String(page)});
 const j=await json('/api/search?'+params,signal);
 return {products:j.products??[],more:!!j.more};
}
export type Price = {id:number;product_code:string;price:number;currency:string;date:string;price_is_discounted:boolean;discount_type?:string;price_per?:string;location_id:number;location?:{osm_name?:string;osm_brand?:string;osm_address_city?:string;osm_address_postcode?:string;osm_address_country_code?:string;osm_address_country?:string}};
export async function getPrices(code:string,signal?:AbortSignal):Promise<Price[]>{
 const j=await json('/api/prices?code='+encodeURIComponent(code),signal);
 const seen=new Set<number>();
 return (j.items??[]).filter((r:Price)=>{
  if(r.product_code!==code||r.currency!=='GBP'||!Number.isFinite(r.price)||!r.date||r.date>new Date().toISOString().slice(0,10))return false;
  if(r.location?.osm_address_country_code!=='GB'&&r.location?.osm_address_country!=='United Kingdom')return false;
  if(seen.has(r.location_id))return false;seen.add(r.location_id);return true;
 }).slice(0,8);
}

export type ShopProduct={id:string;retailer:string;priceFrom?:boolean;available?:boolean;name:string;barcodes:string[];price:number;unitPrice?:number;unit?:string;image?:string;url:string};
export type ShopSource={id:string;name:string;status:'ok'|'unavailable';count:number;url:string};
export type ShopResults={products:ShopProduct[];sources:ShopSource[];checkedAt:string};
export async function getShopPrices(q:string,signal?:AbortSignal,code?:string):Promise<ShopResults>{return json('/api/shop?q='+encodeURIComponent(q)+(code?'&code='+encodeURIComponent(code):''),signal);}
export function sameBarcode(a:string,b:string){return /^\d{8,14}$/.test(a)&&/^\d{8,14}$/.test(b)&&a.padStart(14,'0')===b.padStart(14,'0');}
