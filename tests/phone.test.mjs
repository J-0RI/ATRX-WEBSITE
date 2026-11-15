import assert from 'node:assert/strict';
import { test } from 'node:test';
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
// Match the application's bundler aliases/extensionless TS imports in the native Node runner.
registerHooks({ resolve(specifier, context, next) {
  let url;
  if (specifier.startsWith('@/')) url = new URL('../' + specifier.slice(2) + '.ts', import.meta.url);
  else if (specifier.startsWith('.') && context.parentURL) {
    const candidate = new URL(specifier + '.ts', context.parentURL);
    if (existsSync(candidate)) url = candidate;
  }
  return next(url?.href ?? specifier, context);
}});
const { editPhoneInput: edit, formatPhoneInput: format, changePhoneCountry: change, resolvePhone } = await import('../lib/phone.ts');
const { validateApplication, emptyIdentity } = await import('../app/(standalone)/contact/engagements.ts');
const initial = (country = '') => ({ phoneCountry: country, phone: '', explicit: false });
const type = (country, digits) => {
  let state = initial(country), display = '', caret = 0;
  const steps = [];
  for (const digit of digits) {
    ({state, display, caret} = edit(state, display.slice(0,caret)+digit+display.slice(caret),caret+1,'insertText'));
    steps.push(display);
  }
  return {state,display,steps};
};
test('Canada progressively formats inside the field',()=>{
  assert.deepEqual(type('CA','5062345678').steps,['5','50','(506)','(506) 2','(506) 23','(506) 234','(506) 234-5','(506) 234-56','(506) 234-567','(506) 234-5678']);
});
for (const [country,raw,expected] of [['GB','07700900123','07700 900123'],['NG','08031234567','0803 123 4567'],['FR','0612345678','06 12 34 56 78'],['IN','9876543210','98765 43210']]) {
 test(`${country} partial and complete formatting preserves all digits`,()=>{
   const result=type(country,raw); assert.equal(result.display,expected);
   result.steps.forEach((v,i)=>assert.equal(v.replace(/\D/g,''),raw.slice(0,i+1)));
   assert.ok(result.steps.slice(0,-1).some(v=>/\s/.test(v)));
 });
}
for (const [raw,code,expected] of [['+2348031234567','NG','803 123 4567'],['+447700900123','+44','7700 900123'],['+33612345678','FR','6 12 34 56 78'],['+919876543210','IN','98765 43210'],['+15062345678','CA','(506) 234-5678']]) {
 test(`${raw} paste and sequential typing override another code without duplication`,()=>{
  for(const result of [edit(initial('DE'),raw),type('DE',raw)]) {
   assert.equal(result.state.phoneCountry,code);assert.equal(result.display,expected);assert.ok(!result.display.includes('+'));
  }
 });
}
test('prefix alone detects immediately; incomplete prefixes stay editable',()=>{
 assert.equal(edit(initial('CA'),'+234').state.phoneCountry,'NG');
 assert.equal(edit(initial('CA'),'+23').display,'+23');
 assert.equal(edit(initial('NG'),'+1').state.phoneCountry,'+1');
 assert.equal(edit(initial('CA'),'+1').state.phoneCountry,'CA');
});
test('manual country choice preserves digits and prevents automatic reselection',()=>{
 const canadian=type('','+15062345678').state;
 const selected=change(canadian,'US'); assert.equal(selected.phone,canadian.phone);
 assert.equal(edit(selected,format('US',selected.phone)).state.phoneCountry,'US');
 const nigeria=change(selected,'NG');assert.equal(nigeria.phone,selected.phone);
 assert.equal(edit(nigeria,'506234567').state.phoneCountry,'NG');
});
test('backspace and delete across punctuation remove adjacent digits',()=>{
 const state=type('CA','5062345678').state;
 const backward=edit(state,'(506) 2345678',9,'deleteContentBackward');
 assert.equal(backward.state.phone,'506235678');assert.equal(backward.caret,8);
 const forward=edit(state,'(506) 2345678',9,'deleteContentForward');
 assert.equal(forward.state.phone,'506234678');
 assert.equal(edit(type('CA','506').state,'(506',4,'deleteContentBackward').state.phone,'50');
});
test('middle insertion and selected replacement preserve caret and remaining digits',()=>{
 const state=type('CA','5062345678').state;
 const insertion=edit(state,'(506) 9234-5678',7,'insertText');
 assert.equal(insertion.state.phone,'50692345678');assert.equal(insertion.display.slice(0,insertion.caret).replace(/\D/g,''),'5069');
 const replace=edit(state,'(506) 999-5678',9,'insertText',true);
 assert.equal(replace.state.phone,'5069995678');assert.equal(replace.caret,9);
});
test('clear and punctuation-only selection never reset country or reinsert digits',()=>{
 const state=type('CA','5062345678').state;
 assert.deepEqual(edit(state,'',0,'deleteContentBackward',true).state,initial('CA'));
 assert.equal(edit(state,'506) 234-5678',0,'deleteContentBackward',true).state.phone,state.phone);
});
test('E.164 normalization and strict rejection remain independent of formatting',()=>{
 assert.equal(resolvePhone('NG',edit(initial(),'+2348031234567').state.phone).phone.e164,'+2348031234567');
 assert.equal(resolvePhone('CA','(506) 234-5678').phone.e164,'+15062345678');
 for(const invalid of ['506','abc5062345678','5062345678 ext 123','++15062345678']) assert.equal(resolvePhone('CA',invalid).ok,false);
 assert.equal(edit(initial('CA'),'abc5062345678').state.phone,'abc5062345678');
});
test('submission rejects invalid phones and preserves geographic country',()=>{
 const identity={...emptyIdentity(),name:'Test Applicant',email:'test@example.com',country:'CA',region:'CA-BC',...edit(initial('CA'),'+2348031234567').state};
 const good=validateApplication('tier-1','execution-access',identity,{intendedUse:'Evaluate research integration.'});
 assert.equal(good.ok,true,JSON.stringify(good));assert.equal(identity.country,'CA');assert.equal(identity.region,'CA-BC');
 const bad=validateApplication('tier-1','execution-access',{...identity,phone:'123'},{intendedUse:'Evaluate research integration.'});
 assert.equal(bad.ok,false);assert.ok(bad.errors.phone);
});

test('first national entry formats without assigning any default country', () => {
 const result = type('', '6393829640');
 assert.deepEqual(result.steps, ['6','63','639','639 3','639 38','639 382','639 382 9','639 382 96','639 382 964','639 382 9640']);
 assert.equal(result.state.phoneCountry, '');
 assert.equal(resolvePhone(result.state.phoneCountry, result.state.phone).field, 'phoneCountry');
 const selected = change(result.state, 'CA');
 assert.equal(format(selected.phoneCountry, selected.phone), '(639) 382-9640');
 assert.equal(selected.phone, '6393829640');
});
test('fresh empty state processes direct paste and restored values without previous selection', () => {
 for (const raw of ['+2348031234567', '+234 803 123 4567']) {
  const result = edit(initial(), raw, raw.length, 'insertFromPaste');
  assert.equal(result.state.phoneCountry, 'NG');
  assert.equal(result.display, '803 123 4567');
 }
 assert.equal(edit(initial(), '6393829640').display, '639 382 9640');
 assert.equal(edit(initial(), '+2').state.phoneCountry, '');
 assert.equal(edit(initial(), '+2').display, '+2');
 assert.equal(edit(initial(), '+1').state.phoneCountry, '+1');
});
test('neutral grouping supports separator deletion, middle edits and clearing', () => {
 const state = type('', '6393829640').state;
 const backspace = edit(state, '639382 9640', 3, 'deleteContentBackward');
 assert.equal(backspace.state.phone, '633829640');
 assert.equal(backspace.caret, 2);
 const middle = edit(state, '639 582 9640', 5, 'insertText', true);
 assert.equal(middle.state.phone, '6395829640');
 assert.equal(middle.caret, 5);
 assert.deepEqual(edit(state, '', 0, 'deleteContentBackward', true).state, initial());
});
test('explicit prefixes identify calling context on replacement', () => {
 const state = type('', '6393829640').state;
 for (const [number, country] of [['+2348031234567','NG'],['+33612345678','FR'],['+919876543210','IN']]) {
  assert.equal(edit(state, number, number.length, 'insertFromPaste', true).state.phoneCountry, country);
 }
 assert.equal(edit(initial('NG'), '8031234567').state.phoneCountry, 'NG');
 assert.equal(edit(initial(), '').state.phoneCountry, '');
});

test('national numbers from different plans never assign a default country', () => {
 for (const number of ['6393829640', '08031234567', '07700900123', '0612345678', '9876543210']) {
  assert.equal(type('', number).state.phoneCountry, '');
  assert.equal(edit(initial(), number, number.length, 'insertFromPaste').state.phoneCountry, '');
 }
});
