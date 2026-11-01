import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync,readdirSync } from 'node:fs';
import { schemas,validateReferences,academicDate } from '../src/data/schema.ts';
import { highlights } from '../src/data/research.ts';
import { site } from '../src/data/site.ts';
function data(){return Object.fromEntries(Object.entries(schemas).map(([kind,schema])=>[kind,readdirSync(`src/data/${kind}`).filter(f=>f.endsWith('.json')).map(f=>schema.parse(JSON.parse(readFileSync(`src/data/${kind}/${f}`,'utf8'))))]));}
const validate=value=>validateReferences(value,highlights.map(h=>h.id),site.featuredPersonId,site.about.awardIds);
test('current records have valid relationships',()=>assert.doesNotThrow(()=>validate(data())));
test('required academic fields cannot disappear',()=>{const record=data().people[0];delete record.name;assert.equal(schemas.people.safeParse(record).success,false);});
test('invalid real dates are rejected without losing partial dates',()=>{for(const value of ['2025-00','2025-02-30','2025-13','2025-01-00'])assert.equal(academicDate.safeParse(value).success,false,value);for(const value of ['2025','2025-03','2024-02-29'])assert.equal(academicDate.safeParse(value).success,true,value);});
test('unknown project links fail validation',()=>{const value=data();value.publications[0].projectIds=['missing-project'];assert.throws(()=>validate(value),/unknown ID/);});
test('unknown people and highlight references fail validation',()=>{const value=data();value.activities[0].participants[0].personId='missing-person';assert.throws(()=>validate(value),/unknown ID/);const other=data();other.publications[0].highlightIds=['missing-highlight'];assert.throws(()=>validate(other),/unknown ID/);});
test('duplicate works and misassigned author roles fail validation',()=>{const value=data();value.publications[1].doi=value.publications[0].doi;assert.throws(()=>validate(value),/duplicate DOI/);const other=data();other.publications[0].authorRoles=[{personId:'not-an-author',role:'Corresponding author'}];assert.throws(()=>validate(other),/unknown ID/);});
