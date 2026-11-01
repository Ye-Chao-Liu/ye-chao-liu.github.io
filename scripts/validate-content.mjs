import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { schemas,highlightSchema,validateReferences } from '../src/data/schema.ts';
import { highlights } from '../src/data/research.ts';
import { site } from '../src/data/site.ts';
const root=resolve(import.meta.dirname,'..');
const data={};
for(const kind of Object.keys(schemas)){
 const dir=resolve(root,'src/data',kind);
 const records=readdirSync(dir).filter(f=>f.endsWith('.json')).map(file=>{
   const record=schemas[kind].parse(JSON.parse(readFileSync(resolve(dir,file),'utf8').replace(/^\uFEFF/,'')));
   if(record.id!==basename(file,'.json'))throw new Error(`${kind}/${file}: ID must match filename`);
   return record;
 });
 Object.assign(data,{[kind]:records});
}
highlightSchema.array().parse(highlights);
validateReferences(data,highlights.map(h=>h.id),site.featuredPersonId,site.about.awardIds);
for(const record of [...data.people,...data.projects]){
 const image='photo' in record?record.photo:record.image;
 if(image&&!existsSync(resolve(root,'public',image.src)))throw new Error(`${record.id}: missing image ${image.src}`);
}
console.log(`Academic content valid: ${data.people.length} people, ${data.projects.length} projects, ${data.publications.length} publications, ${data.activities.length} activities; references and assets checked.`);
