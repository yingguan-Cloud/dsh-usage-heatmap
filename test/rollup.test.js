import test from 'node:test';
import assert from 'node:assert/strict';
import { dayKey, usageOf, rollupSession, mergeDaily, summarizeDaily } from '../rollup.js';
const instant = Date.parse('2026-11-10T15:59:00Z');
const usage = (input, output, cacheRead=0, cacheWrite=0) => ({inputTokens:input,outputTokens:output,cacheReadTokens:cacheRead,cacheWriteTokens:cacheWrite,reasoningTokens:output});
const event=(seq,type,data,time=instant)=>({seq,type,data,time});
test('timezone buckets are stable at midnight',()=>{
  assert.equal(dayKey(instant),'2026-11-10');
  assert.equal(dayKey(instant+120000),'2026-11-11');
});
test('four token buckets sum without duplicating reasoning',()=>{
  assert.deepEqual(usageOf(usage(50,20,200,10)),{input:50,output:20,cacheRead:200,cacheWrite:10,total:280,reasoning:20});
});
test('total always equals input + output + cacheRead + cacheWrite',()=>{
  const rows=rollupSession({createdAt:instant},[
    event(0,'assistant/message',{turn:1,step:1,usage:usage(1370648,95569,25195608,0)}),
  ]);
  const row=rows[0];
  assert.equal(row.total,row.input+row.output+row.cacheRead+row.cacheWrite);
});
test('one session counts once on each active day, failed attempts and compaction',()=>{
  const rows=rollupSession({createdAt:instant},[
    event(0,'assistant/attempt',{turn:1,step:1,stream:[{type:'chunk',chunk:{type:'usage',usage:usage(10,5)}}]}),
    event(1,'assistant/message',{turn:1,step:1,usage:usage(10,5)}),
    event(2,'compaction/summary',{usage:usage(3,2)}),
    event(3,'tool/result',{message:{}}),
  ]);
  assert.equal(rows.length,1);
  assert.equal(rows[0].sessions,1);
  assert.equal(rows[0].total,20);
});
test('retry begins a new billable attempt instead of overwriting previous attempt',()=>{
  const rows=rollupSession({createdAt:instant},[
    event(0,'assistant/attempt',{turn:2,step:1,stream:[{type:'chunk',chunk:{type:'usage',usage:usage(10,5)}}]}),
    event(1,'llm/retry-started',{turn:2,step:1}),
    event(2,'assistant/message',{turn:2,step:1,usage:usage(30,15)}),
  ]);
  assert.equal(rows[0].total,60);
});
test('fork-inherited events excluded from child but child session is counted',()=>{
  const parent=rollupSession({createdAt:instant},[event(0,'assistant/message',{turn:1,step:1,usage:usage(10,5)})]);
  const child=rollupSession({createdAt:instant+120000},[
    event(0,'assistant/message',{turn:1,step:1,usage:usage(10,5)}),
    event(1,'assistant/message',{turn:2,step:1,usage:usage(20,10)},instant+120000),
  ],1);
  assert.deepEqual(mergeDaily([parent,child],'2026-11-10','2026-11-11').map(x=>[x.date,x.sessions,x.total]),[
    ['2026-11-10',1,15],['2026-11-11',1,30],
  ]);
});
test('period summaries aggregate exact rolling windows',()=>{
  const rows=[
    {date:'2026-11-01',sessions:1,total:10,input:4,output:2,cacheRead:4,cacheWrite:0,reasoning:2},
    {date:'2026-11-02',sessions:2,total:20,input:8,output:4,cacheRead:8,cacheWrite:0,reasoning:4},
  ];
  assert.deepEqual(summarizeDaily(rows),{sessions:3,input:12,output:6,cacheRead:12,cacheWrite:0,total:30,reasoning:6});
});
test('empty day lookup yields a zeroed day instead of undefined',()=>{
  assert.deepEqual(mergeDaily([], '2026-11-10','2026-11-10'), []);
});
