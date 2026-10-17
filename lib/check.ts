export type Product = {
 code: string; product_name?: string; product_name_en?: string; brands?: string; quantity?: string;
 image_front_url?: string; image_front_small_url?: string; image_url?: string; image_ingredients_url?: string;
 ingredients_text?: string; ingredients_text_en?: string; allergens_tags?: string[]; traces_tags?: string[];
 labels_tags?: string[]; countries_tags?: string[]; last_modified_t?: number;
};
export type Verdict = {kind:'labelled'|'reported'|'uncertain'; title:string; short:string; explanation:string; reasons:string[]};
export function assess(p:Product):Verdict {
 const tags=p.labels_tags??[];
 const labelled=tags.some(t=>['en:gluten-free','en:no-gluten'].includes(t));
 const allergens=p.allergens_tags??[];
 const relevant=allergens.filter(t=>['en:gluten','en:wheat','en:barley','en:rye','en:oats','en:spelt','en:kamut'].includes(t));
 const traces=(p.traces_tags??[]).filter(t=>['en:gluten','en:wheat','en:barley','en:rye','en:oats'].includes(t));
 const reasons:string[]=[];
 if(labelled)reasons.push('The source records a gluten-free label for this barcode.');
 if(relevant.length)reasons.push('Allergen tags reported: '+relevant.map(cleanTag).join(', ')+'.');
 if(traces.length)reasons.push('Possible traces reported: '+traces.map(cleanTag).join(', ')+'.');
 if(labelled && (allergens.includes('en:gluten')||traces.length))return {kind:'uncertain',title:'Check conflicting information',short:'Check the label',explanation:'A gluten-free label and gluten-related allergen or trace information are both recorded. Check the current pack or manufacturer before choosing it.',reasons};
 if(labelled)return {kind:'labelled',title:'Gluten-free label recorded',short:'GF label recorded',explanation:'Open Food Facts records a gluten-free claim. Match the exact pack and check its current label: this community record is not independent certification.',reasons};
 if(relevant.length)return {kind:'reported',title:'Gluten-related allergens reported',short:'Gluten-related allergens',explanation:'Gluten-related allergen information is recorded, with no gluten-free label recorded. Do not treat this product as confirmed gluten-free.',reasons};
 return {kind:'uncertain',title:'Gluten-free status unconfirmed',short:'Not confirmed',explanation:traces.length?'Possible gluten-related traces are reported and no gluten-free label is recorded. Check the pack or manufacturer.':'No gluten-free label is recorded. Missing allergens or a short ingredient list do not establish that a product is gluten-free.',reasons:reasons.length?reasons:['There is not enough explicit label evidence to confirm this product.']};
}
export function cleanTag(t:string){return t.replace(/^[a-z]{2}:/,'').replaceAll('-',' ')}
export function validBarcode(input:string){const s=input.replace(/[\s-]/g,''); if(![8,12,13,14].includes(s.length)||!/^[0-9]+$/.test(s))return false; const body=s.slice(0,-1).split('').reverse(); const sum=body.reduce((a,x,i)=>a+Number(x)*(i%2===0?3:1),0); return (10-sum%10)%10===Number(s.at(-1));}
