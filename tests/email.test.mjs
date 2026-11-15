import assert from 'node:assert/strict';
import { test } from 'node:test';
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
// Match the application's bundler aliases/extensionless TS imports in the native Node runner.
registerHooks({ resolve(specifier, context, next) {
  let url;
  if (specifier.startsWith('@/')) {
    url = new URL('../' + specifier.slice(2) + '.ts', import.meta.url);
    if (!existsSync(url)) url = new URL('../' + specifier.slice(2) + '/index.ts', import.meta.url);
  } else if (specifier.startsWith('.') && context.parentURL) {
    const candidate = new URL(specifier + '.ts', context.parentURL);
    if (existsSync(candidate)) url = candidate;
  }
  return next(url?.href ?? specifier, context);
}});
const { classifyEmail, normaliseEmail } = await import('../lib/email-domains/index.ts');
const { emailError, validateApplication, prepareRequest, emptyIdentity, PERSONAL_EMAIL_ERROR, DISPOSABLE_EMAIL_ERROR } =
  await import('../app/(standalone)/contact/engagements.ts');

const personal = ['ada@gmail.com', 'ada@googlemail.com', 'ada@yahoo.com', 'ada@yahoo.co.uk', 'ada@ymail.com', 'ada@outlook.com',
  'ada@outlook.fr', 'ada@hotmail.com', 'ada@hotmail.co.uk', 'ada@live.com', 'ada@live.de', 'ada@msn.com', 'ada@icloud.com',
  'ada@me.com', 'ada@aol.com', 'ada@proton.me', 'ada@protonmail.com', 'ada@gmx.de', 'ada@gmx.com', 'ada@mail.com',
  'ada@web.de', 'ada@yandex.ru', 'ada@qq.com', 'ada@163.com', 'ada@naver.com', 'ada@comcast.net', 'ada@btinternet.com',
  'ada@privaterelay.appleid.com', 'ada@duck.com'];
const disposable = ['ada@mailinator.com', 'ada@guerrillamail.com', 'ada@sharklasers.com', 'ada@10minutemail.com',
  'ada@yopmail.com', 'ada@temp-mail.org', 'ada@trashmail.com', 'ada@maildrop.cc', 'ada@getnada.com', 'ada@dispostable.com'];
const organizations = ['ada@jpmorgan.com', 'ada@blackrock.com', 'ada@gs.com', 'ada@ecb.europa.eu', 'ada@sec.gov', 'ada@bankofengland.co.uk',
  'ada@ox.ac.uk', 'ada@mit.edu', 'ada@ethz.ch', 'ada@nus.edu.sg', 'ada@unimelb.edu.au', 'ada@nber.org',
  'ada@kestrel-capital.io', 'ada@northfield.partners', 'ada@quant.firm.ai', 'ada@olive.com', 'ada@golive.com',
  'ada@mygmail-capital.com', 'ada@münchen-capital.de', 'ada@haldane.xyz'];

test('consumer providers are classified personal, including case, whitespace, trailing dot and subdomains', () => {
  for (const email of personal) assert.equal(classifyEmail(email), 'personal', email);
  for (const email of ['  Ada@GMAIL.COM  ', 'ada@Gmail.Com.', 'ada@mail.yahoo.com', 'ADA@HOTMAIL.CO.UK'])
    assert.equal(classifyEmail(email), 'personal', email);
});
test('disposable services are classified separately from personal ones', () => {
  for (const email of disposable) assert.equal(classifyEmail(email), 'disposable', email);
  assert.equal(classifyEmail('ada@x.mailinator.com'), 'disposable');
});
test('institutional, academic, government and unfamiliar corporate domains are organizations', () => {
  for (const email of organizations) assert.equal(classifyEmail(email), 'organization', email);
});
test('normalisation lower-cases and punycodes only the domain; the local part is preserved', () => {
  assert.equal(normaliseEmail('  Ada.Lovelace+Desk@GMAIL.COM. '), 'Ada.Lovelace+Desk@gmail.com');
  assert.equal(normaliseEmail('ada@MÜNCHEN-capital.de'), 'ada@xn--mnchen-capital-gsb.de');
  assert.equal(normaliseEmail('no-at-sign'), undefined);
});
test('business email field: personal and disposable rejected with the required messages', () => {
  for (const email of personal) assert.equal(emailError(email, 'Business email'), PERSONAL_EMAIL_ERROR, email);
  for (const email of disposable) assert.equal(emailError(email, 'Business email'), DISPOSABLE_EMAIL_ERROR, email);
  for (const email of organizations) assert.equal(emailError(email, 'Business email'), undefined, email);
  assert.equal(PERSONAL_EMAIL_ERROR, 'Please use your business email address. Personal email addresses are not accepted.');
});
test('non-business fields accept personal addresses but still refuse disposable ones', () => {
  for (const email of personal) assert.equal(emailError(email, 'Email address'), undefined, email);
  for (const email of disposable) assert.equal(emailError(email, 'Email address'), DISPOSABLE_EMAIL_ERROR, email);
});
test('submission boundary cannot be bypassed and submits the normalised address', () => {
  const identity = { ...emptyIdentity(), name: 'Ada Lovelace', phoneCountry: 'CA', phone: '5062345678', organization: 'Firm', jobTitle: 'PM',
    primaryFunction: 'risk-management', country: 'CA', region: 'CA-BC' };
  const desk = { orgType: 'hedge-fund', seats: '6-15', intendedUse: 'Desk research' };
  const inst = { orgType: 'bank-broker-dealer', seats: '16-50', intendedUse: 'Research', scope: 'Two desks', identity: 'sso' };
  for (const email of ['ada@gmail.com', ' ADA@Gmail.com ', 'ada@gmail.com.', 'ada@mail.yahoo.com', 'ada@mailinator.com']) {
    for (const [mode, plan, answers] of [['tier-2', 'single-desk', desk], ['tier-3', 'dedicated-deployment', inst]]) {
      const result = validateApplication(mode, plan, { ...identity, email }, answers);
      assert.equal(result.ok, false, `${mode} ${email}`);
      assert.ok(result.errors.email, `${mode} ${email}`);
    }
  }
  const ok = validateApplication('tier-2', 'single-desk', { ...identity, email: ' Ada@BlackRock.COM ' }, desk);
  assert.equal(ok.ok, true, JSON.stringify(ok));
  assert.equal(ok.application.contact.email, 'Ada@blackrock.com');
  assert.match(prepareRequest(ok.application).body, /Business email: Ada@blackrock\.com/);
  const prosumer = validateApplication('tier-1', 'standard', { ...identity, email: 'ada@gmail.com' }, { applicant: 'individual', intendedUse: 'Research' });
  assert.equal(prosumer.ok, true, JSON.stringify(prosumer));
  const docs = validateApplication('documentation', '', { ...identity, email: 'ada@yopmail.com' }, { materials: 'Whitepaper', evaluation: 'Review' });
  assert.equal(docs.errors?.email, DISPOSABLE_EMAIL_ERROR);
});
