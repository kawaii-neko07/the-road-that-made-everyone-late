import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
test('Discovery, shortcut, reset and motion controls stay connected',async()=>{
 const html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 const ids=[...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
 const el=Object.fromEntries(ids.map(id=>[id,{value:'',innerHTML:'',textContent:'',hidden:false,setAttribute(){},addEventListener(){}}]));
 el.demand.value=4000;el.slope.value=.01;el.fixed.value=45;el.cost.value=0;
 const mode={value:'equilibrium',checked:true};
 globalThis.document={getElementById:id=>{assert.ok(el[id],`Missing ${id}`);return el[id]},querySelector:()=>mode,querySelectorAll:()=>Object.values(el)};
 globalThis.matchMedia=()=>({matches:true,addEventListener(){}});
 try{
 await import('../dist/app.js');
 assert.equal(el.comparisonSection.hidden,true);assert.equal(el.choice.hidden,true);assert.match(el.average.innerHTML,/65,0/);assert.equal(el.traffic.innerHTML,'');assert.doesNotMatch(el.verdict.textContent,/80,0/);
 el.shortcut.onclick();assert.equal(el.comparisonSection.hidden,false);assert.equal(el.choice.hidden,false);assert.match(el.average.innerHTML,/80,0/);assert.match(el.verdict.textContent,/15,0/);
 el.motion.onclick();assert.match(el.traffic.innerHTML,/animateMotion/);el.motion.onclick();assert.equal(el.traffic.innerHTML,'');
 el.shortcut.onclick();assert.match(el.average.innerHTML,/65,0/);assert.equal(el.comparisonSection.hidden,false);
 el.reset.onclick();assert.equal(el.comparisonSection.hidden,true);assert.equal(el.theory.hidden,true);assert.match(el.average.innerHTML,/65,0/);
 assert.match(el.edgeSummary.innerHTML,/S → A/);
 }finally{delete globalThis.document;delete globalThis.matchMedia;}
});
