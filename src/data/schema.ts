import { z } from 'astro/zod';
const text = z.string().trim().min(1);
const id = text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a stable lowercase slug');
export const academicDate = text.regex(/^\d{4}(-\d{2}(-\d{2})?)?$/).refine(value => {
  const [year,month,day] = value.split('-').map(Number);
  return year >= 1900 && year <= 2200 && (month === undefined || month <= 12 && month >= 1) && (day === undefined || month && day >= 1 && day <= new Date(Date.UTC(year,month,0)).getUTCDate());
}, 'Use a real date at its known precision: YYYY, YYYY-MM, or YYYY-MM-DD');
const url = z.string().url().refine(v => /^https?:\/\//.test(v), 'Use an HTTP(S) URL');
const asset = text.regex(/^images\/(people|projects)\/[a-zA-Z0-9/_\-.]+$/, 'Use a path inside public/images/people or public/images/projects').refine(v => !v.split('/').includes('..'));
const participant = z.object({ personId: id, role: text }).strict();
const links = z.array(z.object({label:text,url}).strict());
export const personSchema = z.object({
  id, name:text, chineseName:text.optional(), position:text, affiliation:z.object({school:text.optional(),institution:text}).strict(),
  bio:text, introduction:text, researchInterests:z.array(text), email:z.string().email().nullable(),
  photo:z.object({src:asset,alt:text}).strict().nullable(), profileLinks:links,
  membership:z.object({category:z.enum(['Principal Investigator','Research Staff','Postdoctoral Researcher','PhD Student',"Master's Student",'Undergraduate Student','Collaborator','Alumni']),status:z.enum(['current','alumni','external']),startDate:academicDate.optional(),endDate:academicDate.optional()}).strict().nullable(),
  employment:z.array(z.object({dates:text,position:text,institution:text}).strict()),
  education:z.array(z.object({dates:text,degree:text,institution:text,supervisors:text.optional(),thesis:text.optional()}).strict()),
  awards:z.array(z.object({id,year:z.number().int(),title:text,institution:text}).strict()),
}).strict();
export const projectSchema = z.object({
  id,title:text,description:text.nullable(),fullDescription:text.optional(),startDate:academicDate,endDate:academicDate.nullable(),
  status:z.enum(['planned','ongoing','completed','completed-funding-period']),participants:z.array(participant).min(1),
  funding:z.object({funder:text,reference:text}).strict().nullable(),image:z.object({src:asset,alt:text}).strict().nullable(),url:url.nullable(),highlightIds:z.array(id),
}).strict();
export const publicationSchema = z.object({
  id,title:text,authors:z.array(z.object({name:text,personId:id.optional()}).strict()).min(1),year:z.number().int().min(1900).max(2200),
  status:z.enum(['preprint','submitted','accepted','published']),venue:text,publicationDate:academicDate.nullable(),preprintDate:academicDate.nullable(),acceptanceDate:academicDate.nullable(),
  doi:text.regex(/^10\.\d{4,9}\/\S+$/).nullable(),preprintDoi:text.regex(/^10\.\d{4,9}\/\S+$/).optional(),arxiv:text.regex(/^(\d{4}\.\d{4,5}|[a-z-]+\/\d{7})(v\d+)?$/).nullable(),url:url.nullable(),pdf:url.nullable(),abstract:text.nullable(),
  authorRoles:z.array(z.object({personId:id,role:text}).strict()),projectIds:z.array(id),highlightIds:z.array(id),
}).strict().superRefine((p,ctx) => {
  if(p.status==='published' && !p.publicationDate) ctx.addIssue({code:z.ZodIssueCode.custom,message:'Published records require publicationDate at known precision'});
  if(!p.doi && !p.arxiv && !p.url)ctx.addIssue({code:z.ZodIssueCode.custom,message:'Provide a DOI, arXiv ID, or verified URL'});
});
export const activitySchema = z.object({
  id,type:z.enum(['invited-talk','talk','poster','seminar','academic-visit','workshop','academic-service','other']),title:text,date:academicDate.nullable(),location:text.optional(),organizer:text.optional(),description:text.optional(),participants:z.array(participant).min(1),projectIds:z.array(id),links,
}).strict();
export type Person = z.infer<typeof personSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Publication = z.infer<typeof publicationSchema>;
export type Activity = z.infer<typeof activitySchema>;
export const schemas = { people:personSchema, projects:projectSchema, publications:publicationSchema, activities:activitySchema };
export interface AcademicData { people:Person[];projects:Project[];publications:Publication[];activities:Activity[] }
export function validateReferences(data: AcademicData, highlightIds: string[], featuredPersonId: string, awardIds: string[]) {
  const people=new Set(data.people.map(p=>p.id)), projects=new Set(data.projects.map(p=>p.id)), highlights=new Set(highlightIds);
  const requireId=(set:Set<string>,value:string,context:string)=>{if(!set.has(value))throw new Error(`${context}: unknown ID "${value}"`);};
  const unique=(values:string[],context:string)=>{if(new Set(values).size!==values.length)throw new Error(`${context}: duplicate IDs`);};
  for(const [kind,records] of Object.entries(data)) unique(records.map((r:{id:string})=>r.id),kind);
  unique(highlightIds,'Research highlights');requireId(people,featuredPersonId,'Featured person');
  const featured=data.people.find(p=>p.id===featuredPersonId)!;
  for(const person of data.people)unique(person.awards.map(a=>a.id),`${person.id} awards`);
  for(const awardId of awardIds)requireId(new Set(featured.awards.map(a=>a.id)),awardId,'Displayed award');
  for(const p of data.projects){
    unique(p.participants.map(v=>v.personId),`${p.id} participants`);
    for(const v of p.participants)requireId(people,v.personId,p.id);
    for(const h of p.highlightIds)requireId(highlights,h,p.id);
    if(p.endDate && p.endDate<p.startDate)throw new Error(`${p.id}: endDate precedes startDate`);
  }
  const dois=new Set<string>(),arxivIds=new Set<string>();
  for(const p of data.publications){
    if(p.doi){const d=p.doi.toLowerCase();if(dois.has(d))throw new Error(`${p.id}: duplicate DOI`);dois.add(d);}
    if(p.arxiv){const a=p.arxiv.replace(/v\d+$/,'');if(arxivIds.has(a))throw new Error(`${p.id}: duplicate arXiv work`);arxivIds.add(a);}
    const internalAuthors=p.authors.flatMap(a=>a.personId?[a.personId]:[]);
    unique(internalAuthors,`${p.id} internal authors`);
    for(const person of internalAuthors)requireId(people,person,p.id);
    for(const role of p.authorRoles)requireId(new Set(internalAuthors),role.personId,`${p.id} author role`);
    for(const project of p.projectIds)requireId(projects,project,p.id);
    for(const highlight of p.highlightIds)requireId(highlights,highlight,p.id);
  }
  for(const a of data.activities){for(const p of a.participants)requireId(people,p.personId,a.id);for(const p of a.projectIds)requireId(projects,p,a.id);}
}

export const highlightSchema=z.object({id,title:text,summary:text,paragraphs:z.array(text).min(1),order:z.number().int().positive()}).strict();
