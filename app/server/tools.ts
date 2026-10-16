import type Database from 'better-sqlite3'; import { randomUUID } from 'node:crypto'
export function toolRunner(db: Database.Database) { return {
  get_daily_devotional:(a:{date?:string})=>db.prepare('SELECT * FROM devotionals WHERE date=?').get(a.date||'2026-10-16')||{error:'No local demo devotional for this date.'},
  search_teachings:(a:{query:string;filters?:string})=>db.prepare("SELECT * FROM teachings WHERE lower(title || ' ' || tags || ' ' || description) LIKE ?").all(`%${a.query.toLowerCase()}%`),
  get_teaching_details:(a:{id:string})=>db.prepare('SELECT * FROM teachings WHERE id=?').get(a.id)||{error:'Teaching not found.'},
  search_scripture:(a:{reference_or_topic:string})=>({source:'KJV public domain reference',reference:a.reference_or_topic,note:'Angel One does not quote unverified Scripture text. Consult a trusted KJV source for exact text.'}),
  get_related_teachings:(_a:{devotional_id:string})=>db.prepare('SELECT * FROM teachings LIMIT 2').all(),
  list_media:(a:{query?:string})=>db.prepare("SELECT * FROM media WHERE lower(title || ' ' || kind) LIKE ?").all(`%${(a.query||'').toLowerCase()}%`),
  queue_media:(a:{media_id:string})=>{const m=db.prepare('SELECT * FROM media WHERE id=?').get(a.media_id);if(!m)return{error:'Media not found.'};db.prepare('INSERT INTO media_queue VALUES (?,?,CURRENT_TIMESTAMP)').run(randomUUID(),a.media_id);return{queued:m}},
  create_study_reminder:(a:{title:string;datetime:string})=>{const id=randomUUID();db.prepare('INSERT INTO reminders VALUES (?,?,?)').run(id,a.title,a.datetime);return{id,...a,note:'Saved locally; notification scheduling is not enabled.'}}
} }
export type ToolName=keyof ReturnType<typeof toolRunner>
