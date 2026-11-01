import { schemas, highlightSchema, validateReferences, type AcademicData } from './schema';
import { highlights } from './research';
import { site } from './site';
const files = {
  people: import.meta.glob('./people/*.json',{eager:true,import:'default'}),
  projects: import.meta.glob('./projects/*.json',{eager:true,import:'default'}),
  publications: import.meta.glob('./publications/*.json',{eager:true,import:'default'}),
  activities: import.meta.glob('./activities/*.json',{eager:true,import:'default'}),
};
function load<T>(kind:keyof typeof files,schema:{parse:(v:unknown)=>T}):T[]{
  return Object.entries(files[kind]).map(([path,raw])=>{try{return schema.parse(raw);}catch(error){throw new Error(`Invalid academic content in ${path}: ${error}`);}});
}
export const academic:AcademicData={people:load('people',schemas.people),projects:load('projects',schemas.projects),publications:load('publications',schemas.publications),activities:load('activities',schemas.activities)};
highlightSchema.array().parse(highlights);
validateReferences(academic,highlights.map(h=>h.id),site.featuredPersonId,site.about.awardIds);
export const primaryPerson=academic.people.find(p=>p.id===site.featuredPersonId)!;
export const displayGroup=(p:AcademicData['publications'][number])=>p.status==='published'?'published':'preprints';
export const publicationDate=(p:AcademicData['publications'][number])=>p.publicationDate||p.acceptanceDate||p.preprintDate||String(p.year);
export function newestFirst<T extends {id:string}>(records:T[],date:(r:T)=>string|null){return [...records].sort((a,b)=>(date(b)||'').localeCompare(date(a)||'')||a.id.localeCompare(b.id));}
export const personPublications=(id:string)=>academic.publications.filter(p=>p.authors.some(a=>a.personId===id));
export const personProjects=(id:string)=>academic.projects.filter(p=>p.participants.some(a=>a.personId===id));
export const personActivities=(id:string)=>newestFirst(academic.activities.filter(a=>a.participants.some(p=>p.personId===id)),a=>a.date);
export const projectPublications=(id:string)=>academic.publications.filter(p=>p.projectIds.includes(id));
export const projectActivities=(id:string)=>academic.activities.filter(a=>a.projectIds.includes(id));
export const highlightPublications=(id:string)=>newestFirst(academic.publications.filter(p=>p.highlightIds.includes(id)),publicationDate);
export const orderedHighlights=[...highlights].sort((a,b)=>a.order-b.order);
export const publicationUrl=(p:AcademicData['publications'][number])=>p.doi?`https://doi.org/${p.doi}`:p.arxiv?`https://arxiv.org/abs/${p.arxiv}`:p.url!;
export function formatDate(date:string|null){if(!date)return 'Date not recorded';const [y,m,d]=date.split('-');return d?`${d}/${m}/${y}`:m?`${m}/${y}`:y;}
export const activityLabel=(type:string)=>({'invited-talk':'Invited talk',talk:'Talk',poster:'Poster',seminar:'Seminar','academic-visit':'Academic visit',workshop:'Workshop','academic-service':'Academic service',other:'Academic activity'}[type]||type);
