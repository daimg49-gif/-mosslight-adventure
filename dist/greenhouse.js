import * as T from './vendor/three.module.js';
import {journal,catalog} from './journal.js';
export function createGreenhouse(camera,keys){
 const scene=new T.Scene();scene.background=new T.Color('#dce9d8');scene.fog=new T.Fog('#dce9d8',19,40);const cube=new T.BoxGeometry(1,1,1),leafG=new T.SphereGeometry(1,9,6),batches=new Map(),dummy=new T.Object3D();let seed=117;
 function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
 const mat=(c,e={})=>new T.MeshStandardMaterial({color:c,roughness:.82,...e});const frame=mat('#718577'),stone=mat('#c7c8af'),wood=mat('#b49768'),terra=mat('#be9272'),soil=mat('#625b45'),greens=['#69916a','#85a473','#a1b57e'].map(c=>mat(c));const flowerM=[mat('#e6b7ac'),mat('#e9d9a5'),mat('#c4c2db')];const brass=mat('#b99e69',{metalness:.55,roughness:.35});const glass=mat('#d0e4dc',{transparent:true,opacity:.12,roughness:.12,side:T.DoubleSide,depthWrite:false});const obstacles=[],sway=[];
 function add(g,m,x,y,z,sx=1,sy=1,sz=1){const o=new T.Mesh(g,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=m!==glass;o.receiveShadow=true;scene.add(o);return o;}
 const box=(m,x,y,z,w,h,d)=>add(cube,m,x,y,z,w,h,d);
 function inst(g,m,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0){const key=g.uuid+m.uuid;let b=batches.get(key);if(!b){b={g,m,items:[]};batches.set(key,b);}dummy.position.set(x,y,z);dummy.rotation.set(rx,ry,rz);dummy.scale.set(sx,sy,sz);dummy.updateMatrix();b.items.push(dummy.matrix.clone());}
 function beam(a,b,r,m=frame){const av=new T.Vector3(...a),bv=new T.Vector3(...b),v=bv.clone().sub(av),p=av.add(bv).multiplyScalar(.5),o=add(new T.CylinderGeometry(r,r,v.length(),8),m,p.x,p.y,p.z);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return o;}
 scene.add(new T.HemisphereLight('#fff8d8','#91a080',2));const sun=new T.DirectionalLight('#ffecc5',3.1);sun.position.set(-5,9,4);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-8,right:8,top:8,bottom:-8,far:30});sun.shadow.normalBias=.025;scene.add(sun);
 // Glass walls and pitched roof: the structural mullions cast the shadows.
 box(stone,0,-.12,0,8,.2,8);for(let x=-3.6;x<4;x+=.6)for(let z=-3.6;z<4;z+=.6)inst(cube,stone,x,.004,z,.585,.04,.585);
 for(let x of [-4,4]){box(stone,x,.3,0,.18,.6,8);box(glass,x,2.4,0,.02,3.6,8);for(let z=-4;z<=4;z+=1.33)box(frame,x,2.4,z,.08,3.8,.075);for(let y of [.62,2.1,4.2])box(frame,x,y,0,.09,.07,8);}
 for(let z of [-4,4]){box(stone,0,.3,z,8,.6,.18);box(glass,0,2.4,z,8,3.6,.02);for(let x=-4;x<=4;x+=1.33)box(frame,x,2.4,z,.075,3.8,.08);box(frame,0,4.2,z,8,.09,.09);}
 for(let z=-4;z<=4;z+=1.33){beam([-4,4.2,z],[0,5.8,z],.05);beam([0,5.8,z],[4,4.2,z],.05);}beam([0,5.8,-4],[0,5.8,4],.06);for(let side of [-1,1]){const r=box(glass,side*2,5,0,4.31,.02,8);r.rotation.z=-side*Math.atan(.4);}
 // The visible door back to the cottage.
 box(wood,0,1.45,3.93,1.45,2.9,.1);box(glass,0,1.94,3.85,1.17,1.53,.015);for(let x of [-.67,.67])box(frame,x,1.45,3.81,.07,2.9,.09);box(frame,0,1.14,3.81,1.4,.08,.09);add(new T.SphereGeometry(.045,10,8),brass,.5,1.17,3.75);
 // Planting beds leave a broad central walking aisle.
 for(let x of [-2.7,2.7]){box(wood,x,.16,-1.2,1.65,.32,4.2);box(soil,x,.33,-1.2,1.52,.03,4.03);obstacles.push({x,z:-1.2,w:1.7,d:4.25});for(let k=0;k<7;k++)box(wood,x-.76,.19,-3.1+k*.58,.04,.28,.5);}
 function plant(x,z,h=1){for(let k=0;k<10;k++){const a=k*2.399,y=.4+k*.07*h;beam([x,.32,z],[x+Math.sin(a)*.38*h,y+.35*h,z+Math.cos(a)*.38*h],.012,greens[0]);for(let j=0;j<5;j++){let s=j/5;inst(leafG,greens[k%3],x+Math.sin(a)*s*.55*h,y+.27*h,z+Math.cos(a)*s*.55*h,.18*h,.024*h,.07*h,.2,a,.15);}}}
 for(let x of [-2.7,2.7])for(let z of [-2.8,-1.65,-.55,.55])plant(x,z,.85+rand()*.45);
 // A low fern beside the path, detailed enough to read from miniature height.
 plant(-1.42,1.56,.9);add(new T.CylinderGeometry(.21,.16,.26,16),terra,-1.42,.13,1.56);obstacles.push({x:-1.42,z:1.56,w:.45,d:.45});
 // Low flowers lean over the aisle: tiny players can look up under petals.
 const flowers=[];for(const [x,z] of [[1.2,1.9],[1.52,1.64],[-1.4,-2.95]]){const g=new T.Group();g.position.set(x,0,z);scene.add(g);const stalk=new T.Mesh(new T.CylinderGeometry(.015,.021,.55,7),greens[0]);stalk.position.y=.275;g.add(stalk);for(let k=0;k<7;k++){const a=k/7*6.28,o=new T.Mesh(leafG,flowerM[flowers.length%3]);o.position.set(Math.cos(a)*.14,.54,Math.sin(a)*.14);o.scale.set(.22,.045,.11);o.rotation.y=-a;g.add(o);}const center=new T.Mesh(new T.SphereGeometry(.063,12,8),brass);center.position.y=.55;g.add(center);sway.push(g);flowers.push(g);}
 // An archway with climbing ivy and suspended terracotta pots.
 for(let x of [-1.7,1.7])beam([x,0,-2.9],[x,3,-2.9],.04);beam([-1.7,3,-2.9],[1.7,3,-2.9],.04);for(let i=0;i<90;i++){const t=i/89;inst(leafG,greens[i%3],-1.7+t*3.4,3+Math.sin(t*8)*.15,-2.9,.12,.025,.055,.1,t*10,.5);}
 for(let x of [-2,2]){beam([x,5,-1.3],[x,2.58,-1.3],.008,brass);add(new T.CylinderGeometry(.22,.16,.29,16),terra,x,2.45,-1.3);for(let i=0;i<35;i++){const t=i/35;inst(leafG,greens[i%3],x+Math.sin(t*13)*.18,2.42-t*.8,-1.3+Math.cos(t*13)*.12,.1,.025,.06,t,t*10,.3);}}
 // A leaf holding clear droplets, with fine embossed veins.
 const dewLeaf=add(leafG,greens[1],-.8,.31,-.4,.5,.025,.19);dewLeaf.rotation.z=.17;for(let i=0;i<8;i++)beam([-.8+i*.035,.34,-.4],[-.8+i*.035-.12,.34,-.4+(i%2?-.13:.13)],.003,greens[2]);const dewM=mat('#c8ece8',{metalness:.12,roughness:.02,transparent:true,opacity:.66});const drops=[];for(let i=0;i<5;i++)drops.push(add(new T.SphereGeometry(.032+i*.006,20,14),dewM,-.65-i*.065,.365,-.4+(i%2)*.035));
 // Copper watering can and the shallow water tray.
 add(new T.CylinderGeometry(.25,.27,.45,24),brass,1.44,.24,-1.04);beam([1.61,.27,-1.04],[2.04,.46,-1.04],.043,brass);add(new T.TorusGeometry(.26,.025,8,24),brass,1.22,.31,-1.04).rotation.y=Math.PI/2;obstacles.push({x:1.44,z:-1.04,w:.57,d:.57});add(new T.CylinderGeometry(.48,.48,.045,32),stone,.91,.039,-1.83);const water=add(new T.CircleGeometry(.44,48),mat('#91b8ac',{roughness:.14,metalness:.25}),.91,.065,-1.83);water.rotation.x=-Math.PI/2;const ripples=[];for(let i=0;i<3;i++){const r=add(new T.TorusGeometry(.17,.003,4,40),mat('#d7e6ca',{transparent:true,opacity:.4}),.91,.07,-1.83);r.rotation.x=Math.PI/2;ripples.push(r);}
 // The seed tray and soil particles: small-scale texture is modeled geometry.
 box(wood,-.35,.055,-2.78,.75,.08,.45);const seedMat=mat('#b7986d');for(let i=0;i<7;i++)add(leafG,seedMat,-.58+i*.067,.123,-2.78+(i%2)*.1,.045,.035,.025).rotation.z=i;for(let i=0;i<240;i++){let x=(rand()-.5)*7.5,z=(rand()-.5)*7.5;inst(leafG,soil,x,.04,z,.008,.004,.009);}
 // Outside foliage provides depth through the glass, without loading assets.
 for(let i=0;i<36;i++){const a=i/36*6.28,r=7+rand()*2;inst(leafG,greens[i%3],Math.sin(a)*r,1+rand()*2,Math.cos(a)*r,1.1,.8,1.1);}
 for(const b of batches.values()){const m=new T.InstancedMesh(b.g,b.m,b.items.length);b.items.forEach((v,i)=>m.setMatrixAt(i,v));m.castShadow=true;m.receiveShadow=true;m.computeBoundingSphere();scene.add(m);}
 const landmarks=[{id:'fern',x:-1.42,z:1.56},{id:'dew',x:-.8,z:-.4},{id:'flower',x:1.2,z:1.9},{id:'water',x:1.44,z:-1.04},{id:'seed',x:-.35,z:-2.78}];let small=false,yaw=0,pitch=-.06,pos=new T.Vector3(0,1.62,3.2),transition=null,tour=0;
 const views=[{x:0,z:3.2,yaw:0},{x:-.72,z:1.8,yaw:1.3},{x:-.8,z:.15,yaw:0},{x:.63,z:2.23,yaw:-1},{x:.8,z:-.57,yaw:-.9},{x:-.35,z:-2.15,yaw:0}];
 function valid(x,z){const r=small?.06:.18;if(Math.abs(x)>3.7-r||Math.abs(z)>3.68-r)return false;return !obstacles.some(o=>Math.abs(x-o.x)<o.w/2+r&&Math.abs(z-o.z)<o.d/2+r);}
 function sync(){camera.position.copy(pos);camera.rotation.order='YXZ';camera.rotation.set(pitch,yaw,0);}
 function enter(mini){small=mini;pos.set(0,small?.2:1.62,3.2);yaw=0;pitch=-.06;keys.clear();transition=null;camera.fov=small?62:58;camera.near=.018;camera.updateProjectionMatrix();sync();}
 function setSmall(v){if(v===small)return;small=v;if(!valid(pos.x,pos.z))pos.set(0,pos.y,3.2);transition={from:pos.y,to:small?.2:1.62,t:0};camera.fov=small?62:58;camera.updateProjectionMatrix();}
 function context(){if(Math.hypot(pos.x,pos.z-3.86)<1.05)return {id:'return',label:'回到客廳'};const near=landmarks.map(l=>({...l,d:Math.hypot(pos.x-l.x,pos.z-l.z)})).sort((a,b)=>a.d-b.d)[0];return near.d<(small?.8:1.3)?{id:near.id,label:'記錄 '+catalog.find(c=>c.id===near.id).title}:null;}
 function inspect(){const c=context();if(c&&c.id!=='return'){journal.record(c.id);return catalog.find(x=>x.id===c.id).text;}return '玻璃溫室裡有五種值得近看的小景。沿著中間步道前進，或縮小後到葉子與花朵旁觀察。';}
 function update(dt,time){if(transition){transition.t=Math.min(1,transition.t+dt/1.1);const t=transition.t;pos.y=T.MathUtils.lerp(transition.from,transition.to,t*t*(3-2*t));if(t===1)transition=null;}const f=Number(keys.has('forward'))-Number(keys.has('back')),s=Number(keys.has('right'))-Number(keys.has('left')),v=(small?.58:1.55)*dt/(Math.hypot(f,s)||1),dx=(-Math.sin(yaw)*f+Math.cos(yaw)*s)*v,dz=(-Math.cos(yaw)*f-Math.sin(yaw)*s)*v;if(valid(pos.x+dx,pos.z))pos.x+=dx;if(valid(pos.x,pos.z+dz))pos.z+=dz;sway.forEach((g,i)=>g.rotation.z=Math.sin(time*.7+i)*.035);ripples.forEach((r,i)=>{const t=(time*.3+i/3)%1;r.scale.setScalar(.2+t*2.2);r.material.opacity=(1-t)*.4;});drops.forEach((d,i)=>d.material.opacity=.63+Math.sin(time+i)*.025);sync();}
 return {scene,enter,setSmall,update,keys,context,inspect,valid,look:(dx,dy)=>{yaw-=dx*.004;pitch=T.MathUtils.clamp(pitch-dy*.003,-1.1,1.1);},tour:()=>{tour=(tour+1)%views.length;const v=views[tour];pos.set(v.x,small?.2:1.62,v.z);yaw=v.yaw;pitch=small?-.08:-.45;return ['溫室入口','葉下森林','露珠圓頂','花瓣帳篷','銅壺水盤','種子小港'][tour];},get small(){return small;},get position(){return pos;}};
}
