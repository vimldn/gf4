
const SHOPS=[
 {id:'sainsburys',name:'Sainsbury’s',base:'https://www.sainsburys.co.uk',type:'sainsburys'},
 {id:'justnatural',name:'Just Natural',base:'https://www.justnatural.co.uk',type:'shopify'},
 {id:'yesyoucan',name:'YesYouCan',base:'https://buyglutenfree.co.uk',type:'shopify'},
 {id:'carlabakes',name:'Carla Bakes',base:'https://carlabakes.co.uk',type:'shopify'},
 {id:'marleys',name:'Marley’s Bakery',base:'https://marleysbakery.co.uk',type:'shopify'}
];
function exactCode(a,b){return /^\d{8,14}$/.test(a)&&/^\d{8,14}$/.test(b)&&a.padStart(14,'0')===b.padStart(14,'0');}
async function sourceJSON(url,signal){
 const r=await fetch(url,{headers:{Accept:'application/json','User-Agent':'AriGlutenFree/1.1'},signal});
 if(!r.ok){const e=new Error('Shop did not respond');e.httpStatus=r.status;throw e;}
 if(!(r.headers.get('content-type')||'').includes('json'))throw new Error('Shop returned a non-JSON response');
 return r.json();
}
function relevantProduct(p,q){
 const normalise=v=>String(v||'').normalize('NFKD').replace(/\p{Diacritic}/gu,'').toLowerCase().replace(/[’']/g,'').replace(/[^\p{L}\p{N}]+/gu,' ');
 const terms=normalise(q).split(' ').filter(t=>t&&!['gluten','free','from','the','and'].includes(t));
 const haystack=normalise([p.title,p.vendor,p.type,...(p.tags||[])].join(' '));
 return terms.every(t=>haystack.includes(t));
}
async function fetchShop(shop,q,code){
 const signal=AbortSignal.timeout(15000);let products=[];
 if(shop.type==='sainsburys'){
  const u=new URL(shop.base+'/groceries-api/gol-services/product/v1/product');u.search=new URLSearchParams({'filter[keyword]':q,page_number:'1',page_size:'24',sort_order:'FAVOURITES_FIRST'}).toString();
  const j=await sourceJSON(u,signal);if(!Array.isArray(j.products))throw new Error('Invalid shop response');
  products=j.products.filter(p=>Number.isFinite(p.retail_price?.price)).map(p=>({id:shop.id+':'+p.product_uid,retailer:shop.name,name:p.name,barcodes:(p.eans??[]).map(String),price:p.retail_price.price,unitPrice:p.unit_price?.price,unit:p.unit_price?.measure,image:p.image,url:shopUrl(p),available:p.is_available}));
 }else{
  const u=new URL(shop.base+'/search/suggest.json');u.search=new URLSearchParams({q,'resources[type]':'product','resources[limit]':'6','resources[options][unavailable_products]':'hide'}).toString();
  const j=await sourceJSON(u,signal);const raw=j.resources?.results?.products;if(!Array.isArray(raw))throw new Error('Invalid shop response');const hits=code?raw:raw.filter(p=>relevantProduct(p,q));
  if(code){
   const detailed=await Promise.allSettled(hits.slice(0,3).map(async p=>{
    if(!/^[a-zA-Z0-9_-]+$/.test(p.handle))return [];
    const d=await sourceJSON(shop.base+'/products/'+p.handle+'.js',signal);
    return (d.variants??[]).filter(v=>v.barcode&&exactCode(String(v.barcode),code)&&Number.isFinite(v.price)).map(v=>({id:shop.id+':'+v.id,retailer:shop.name,name:d.title+(v.public_title?' — '+v.public_title:''),barcodes:[String(v.barcode)],price:v.price/100,image:p.image,url:shop.base+'/products/'+p.handle+'?variant='+v.id,available:v.available}));
   }));products=detailed.flatMap(r=>r.status==='fulfilled'?r.value:[]);
  }else products=hits.filter(p=>p.price!==null&&p.price!==''&&Number.isFinite(Number(p.price))).map(p=>({id:shop.id+':'+p.id,retailer:shop.name,name:p.title,barcodes:[],price:Number(p.price),priceFrom:Number(p.price_max)>Number(p.price_min),image:p.image,url:shop.base+'/products/'+encodeURIComponent(p.handle),available:p.available}));
 }
 return code?products.filter(p=>p.barcodes.some(b=>exactCode(b,code))):products.slice(0,6);
}
async function shopSearch(url){
 const q=(url.searchParams.get('q')||'').trim().slice(0,100);const code=url.searchParams.get('code')||'';
 if(q.length<2)return {products:[],sources:[],checkedAt:new Date().toISOString()};
 const selected=url.searchParams.get('retailer');const shops=selected?SHOPS.filter(s=>s.id===selected):SHOPS;
 const results=await Promise.allSettled(shops.map(async shop=>({shop,products:await fetchShop(shop,q,code)})));
 const sources=results.map((r,i)=>({id:shops[i].id,name:shops[i].name,status:r.status==='fulfilled'?'ok':'unavailable',count:r.status==='fulfilled'?r.value.products.length:0,httpStatus:r.status==='rejected'?r.reason?.httpStatus:undefined,url:shops[i].base+(shops[i].type==='sainsburys'?'/gol-ui/SearchResults/':'/search?q=')+encodeURIComponent(q)}));
 // Interleave retailers so the first shop cannot crowd out the others.
 const batches=results.map(r=>r.status==='fulfilled'?r.value.products:[]);const products=[];for(let i=0;i<6;i++)for(const batch of batches)if(batch[i])products.push(batch[i]);
 return {products,sources,checkedAt:new Date().toISOString()};
}
const PRODUCT_FIELDS='code,product_name,product_name_en,brands,quantity,image_front_url,image_front_small_url,image_url,image_ingredients_url,ingredients_text,ingredients_text_en,allergens_tags,traces_tags,labels_tags,countries_tags,last_modified_t';
const response=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
function normalise(p){const name=typeof p.product_name==='string'?p.product_name:p.product_name?.en||Object.values(p.product_name??{})[0]||'';return {...p,code:String(p.code),product_name:name,brands:Array.isArray(p.brands)?p.brands.join(', '):p.brands};}

function shopUrl(p){try{const raw=p.full_url?.startsWith('://')?'https'+p.full_url:p.full_url;const u=new URL(raw);if(u.protocol==='https:'&&u.hostname==='www.sainsburys.co.uk')return u.href;}catch{}return 'https://www.sainsburys.co.uk/gol-ui/product/'+encodeURIComponent(String(p.product_uid));}
export async function api(request){
 const url=new URL(request.url);if(request.method!=='GET')return response({error:'Only GET is supported.'},405);
 try{
  let target;const path=url.pathname;
  if(path==='/api/shop'){return response(await shopSearch(url));
  }else if(path==='/api/search'){
   let q=(url.searchParams.get('q')||'').slice(0,100).normalize('NFKD').replace(/\p{Diacritic}/gu,'').replace(/[^\p{L}\p{N}\s'’-]/gu,' ').trim();
   if(!q)return response({error:'Enter a food name or brand.'},400);
   const gf=url.searchParams.get('gf')==='1'||/gluten[ -]?free/i.test(q);
   if(gf){q=q.replace(/gluten[ -]?free/gi,'').trim();q+=' (labels_tags:"en:no-gluten" OR labels_tags:"en:gluten-free")';}
   if(url.searchParams.get('uk')!=='0')q+=' countries_tags:"en:united-kingdom"';
   target=new URL('https://search.openfoodfacts.org/search');target.searchParams.set('q',q);target.searchParams.set('page_size','18');target.searchParams.set('page',String(Math.max(1,Math.min(50,Number(url.searchParams.get('page'))||1))));target.searchParams.set('fields',PRODUCT_FIELDS);
  }else if(path==='/api/product'||path==='/api/prices'){
   const code=url.searchParams.get('code')||'';if(!/^\d{8}$|^\d{12,14}$/.test(code))return response({error:'Invalid barcode.'},400);
   target=path==='/api/product'?new URL('https://world.openfoodfacts.org/api/v2/product/'+code+'.json?fields='+PRODUCT_FIELDS):new URL('https://prices.openfoodfacts.org/api/v1/prices');
   if(path==='/api/prices'){target.search=new URLSearchParams({product_code:code,currency:'GBP',order_by:'-date',size:'100',duplicate_of__isnull:'true'}).toString();}
  }else return response({error:'Not found.'},404);
  const r=await fetch(target,{headers:{Accept:'application/json','User-Agent':'AriGlutenFree/1.0 (https://ari-gluten-free.vim1.chatgpt.site)'},signal:AbortSignal.timeout(20000)});
  if(!r.ok)return response({error:r.status===429?'The source is busy. Wait a minute and try again.':'The food data source is temporarily unavailable. Please try again.'},r.status===429?429:502);
  const j=await r.json();

  if(path==='/api/search')return response({products:(j.hits??[]).map(normalise).filter(p=>p.code&&p.product_name),count:j.count??0,more:(j.page??1)<(j.page_count??1)});
  if(path==='/api/product')return response({...j,product:j.product?normalise(j.product):undefined});
  return response({items:j.items??[]});
 }catch(e){return response({error:e.name==='TimeoutError'?'The source took too long to respond. Please try again.':'The data source could not be reached. Please try again.'},502);}
}
