// Continuous, nonatomic traffic assignment on a directed graph.
export function network(slope=.01,fixed=45,shortcut=0){return [
{id:'SA',from:'S',to:'A',a:slope,b:0},{id:'AT',from:'A',to:'T',a:0,b:fixed},
{id:'SB',from:'S',to:'B',a:0,b:fixed},{id:'BT',from:'B',to:'T',a:slope,b:0},
{id:'AB',from:'A',to:'B',a:0,b:shortcut}];}
export function paths(edges,open){const out=[];function visit(node,path,seen){if(node==='T'){out.push(path);return;}for(let i=0;i<edges.length;i++){const e=edges[i];if(e.from===node&&(open||e.id!=='AB')&&!seen.includes(e.to))visit(e.to,[...path,i],[...seen,e.to]);}}visit('S',[],['S']);return out;}
function linear(A,b){const n=b.length,M=A.map((r,i)=>[...r,b[i]]);for(let i=0;i<n;i++){let p=i;for(let j=i+1;j<n;j++)if(Math.abs(M[j][i])>Math.abs(M[p][i]))p=j;if(Math.abs(M[p][i])<1e-10)return null;[M[p],M[i]]=[M[i],M[p]];const d=M[i][i];for(let k=i;k<=n;k++)M[i][k]/=d;for(let j=0;j<n;j++)if(j!==i){const f=M[j][i];for(let k=i;k<=n;k++)M[j][k]-=f*M[i][k];}}return M.map(r=>r[n]);}
export function solve(demand,open,edges=network(),social=false){
 const routes=paths(edges,open),m=routes.length,factor=social?2:1;
 const Q=routes.map(p=>routes.map(r=>factor*p.filter(e=>r.includes(e)).reduce((s,e)=>s+edges[e].a,0)));
 const c=routes.map(p=>p.reduce((s,e)=>s+edges[e].b,0));let best=null,bestValue=Infinity;
 // Enumerate all active faces; each candidate is the stationary point of a convex quadratic.
 for(let mask=1;mask<(1<<m);mask++){const ids=Array.from({length:m},(_,i)=>i).filter(i=>mask&(1<<i));const A=ids.map(i=>[...ids.map(j=>Q[i][j]),-1]);A.push([...ids.map(()=>1),0]);const z=linear(A,[...ids.map(i=>-c[i]),demand]);if(!z||z.slice(0,-1).some(x=>x < -1e-6))continue;const f=Array(m).fill(0);ids.forEach((i,k)=>f[i]=Math.max(0,z[k]));const value=f.reduce((s,x,i)=>s+c[i]*x+.5*x*Q[i].reduce((t,q,j)=>t+q*f[j],0),0);if(value<bestValue){best=f;bestValue=value;}}
 if(!best)throw Error('No feasible assignment');
 const flows=edges.map((_,e)=>routes.reduce((s,p,i)=>s+(p.includes(e)?best[i]:0),0));const edgeTimes=edges.map((e,i)=>e.a*flows[i]+e.b);const times=routes.map(p=>p.reduce((s,e)=>s+edgeTimes[e],0));const total=times.reduce((s,t,i)=>s+t*best[i],0);const min=Math.min(...times);const gap=best.reduce((s,f,i)=>s+f*(times[i]-min),0);
 return {routes,routeFlows:best,flows,edgeTimes,times,total,average:demand?total/demand:0,gap:demand?gap/demand:0};
}
