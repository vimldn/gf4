import {test} from 'node:test';
import assert from 'node:assert/strict';
import {assess, validBarcode} from './check.ts';
test('absence of allergen data is not proof',()=>{assert.equal(assess({code:'1',allergens_tags:[]}).kind,'uncertain')});
test('a wheat-free label is not gluten-free',()=>{assert.equal(assess({code:'1',labels_tags:['en:wheat-free']}).kind,'uncertain')});
test('recorded gluten-free claim is qualified',()=>{assert.equal(assess({code:'1',labels_tags:['en:gluten-free']}).kind,'labelled')});
test('wheat ingredient is not automatically incompatible with GF-labelled wheat starch',()=>{assert.equal(assess({code:'1',labels_tags:['en:gluten-free'],allergens_tags:['en:wheat'],ingredients_text:'Gluten free wheat starch'}).kind,'labelled')});
test('conflicting gluten evidence remains unresolved',()=>{assert.equal(assess({code:'1',labels_tags:['en:gluten-free'],allergens_tags:['en:gluten']}).kind,'uncertain')});
test('traces must not produce a positive verdict',()=>{assert.equal(assess({code:'1',traces_tags:['en:gluten']}).kind,'uncertain')});
test('known allergens without GF claim are surfaced',()=>{assert.equal(assess({code:'1',allergens_tags:['en:barley']}).kind,'reported')});
test('valid and invalid check digits and leading zeros',()=>{assert.ok(validBarcode('3017620422003'));assert.ok(validBarcode('0000000000000'));assert.ok(!validBarcode('3017620422004'));assert.ok(!validBarcode('123'));});

test('canonical no-gluten label is recognised',()=>{assert.equal(assess({code:'1',labels_tags:['en:no-gluten']}).kind,'labelled')});
test('very-low-gluten is not labelled gluten-free',()=>{assert.equal(assess({code:'1',labels_tags:['en:very-low-gluten']}).kind,'uncertain')});

