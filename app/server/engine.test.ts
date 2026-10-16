import test from 'node:test'; import assert from 'node:assert/strict'; import { rmSync } from 'node:fs'; import { createDb } from './db.js'; import { toolRunner } from './tools.js'; import { ollamaStatus } from './providers.js'
const path='/tmp/angel-one-test.db'; try{rmSync(path)}catch{};const db=createDb(path),tools=toolRunner(db)
test('searches seeded local records with citations',()=>{const r:any=tools.search_teachings({query:'prayer'});assert.equal(r[0].id,'demo-teach-002');assert.match(r[0].source_label,/ORIGINAL DEMO/)});
test('queues local audio and saves reminders',()=>{assert.equal((tools.queue_media({media_id:'demo-media-001'}) as any).queued.id,'demo-media-001');assert.equal((tools.create_study_reminder({title:'Study',datetime:'2026-10-17T09:00'}) as any).title,'Study')});
test('local diagnostics return an explicit Ollama state',async()=>{const status=await ollamaStatus();assert.equal(typeof status.running,'boolean');assert.ok(Array.isArray(status.models))});
