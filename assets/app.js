/* ============================================================
   色 · Gradient Gallery — app.js
   sources: webgradients 180 精选 · 智能随机 · 图片提取
   ============================================================ */
'use strict';

/* ---------------- 工具：颜色数学 ---------------- */
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const hex2rgb=h=>{h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return[(n>>16)&255,(n>>8)&255,n&255]};
const rgb2hex=(r,g,b)=>'#'+[r,g,b].map(v=>clamp(Math.round(v),0,255).toString(16).padStart(2,'0')).join('');
const rgb2hsl=(r,g,b)=>{r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let h=0,s=0,l=(mx+mn)/2;const d=mx-mn;if(d){s=l>.5?d/(2-mx-mn):d/(mx+mn);switch(mx){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;default:h=(r-g)/d+4}h/=6}return[h*360,s,l]};
const hsl2rgb=(h,s,l)=>{h=((h%360)+360)%360/360;s=clamp(s,0,1);l=clamp(l,0,1);const hue=p=>{p=(p+1)%1;if(p<1/6)return p*6;if(p<1/2)return 1;if(p<2/3)return(2/3-p)*6;return 0};const a=s*Math.min(l,1-l);const f=n=>{const k=(n+h*12)%12;return l-a*Math.max(-1,Math.min(k-3,9-k,1))};return[Math.round(f(0)*255),Math.round(f(8)*255),Math.round(f(4)*255)]};
const lum=rgb=>{const[r,g,b]=rgb.map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*r+.7152*g+.0722*b};
const pick=arr=>arr[Math.floor(Math.random()*arr.length)];
const rand=(a,b)=>a+Math.random()*(b-a);
const hashCode=s=>{let h=0;for(let i=0;i<s.length;i++){h=(h<<5)-h+s.charCodeAt(i);h|=0}return Math.abs(h)};

/* ---------------- 中文诗意命名 ---------------- */
const HUE_BANDS=[
  [12,['绯红','丹粉','胭脂']],
  [28,['珊瑚橘','朱砂','绯赤']],
  [42,['杏黄','琥珀','姜糖']],
  [62,['鹅黄','缃色','秋香']],
  [95,['松花','嫩柳','豆青']],
  [145,['竹青','苍翠','黛绿']],
  [178,['青碧','湖光','玉髓']],
  [205,['浅青','天青','雨过青']],
  [238,['黛蓝','远峰','群青']],
  [278,['靛青','藕荷','丁香']],
  [318,['紫棠','藤萝','雾紫']],
  [345,['品红','桃夭','樱粉']],
  [360,['绯霞','丹粉','藕粉']],
];
const NEUTRAL_NAMES=['砚灰','月白','霜痕','玄青','素雪','鸦青'];
const PREFIX=['暮霭','晨雾','夜航','初雪','潮汐','星野','山岚','薄暮','流萤','长夜','月下','苔痕','风信','烬余','琉璃','极光','海雾','霜白','露华','松间','云岫','烟青','鹤汀','鹿鸣'];
const FAMILY=[[15,'霞'],[35,'杏'],[55,'金'],[90,'柳'],[150,'碧'],[205,'蓝'],[250,'黛'],[305,'紫'],[345,'樱'],[360,'绯']];

function colorName(rgb){
  const[h,s,l]=rgb2hsl(...rgb);
  if(s<.14)return pick(NEUTRAL_NAMES);
  for(const[max,names]of HUE_BANDS){if(h<=max)return names[Math.floor(Math.random()*names.length)]}
  return '绛紫';
}
function paletteName(rgbs){
  // 主色 = 饱和度最高的色相中位数
  const colored=rgbs.filter(c=>rgb2hsl(...c)[1]>.14);
  const base=colored.length?colored[Math.floor(colored.length/2)]:rgbs[0];
  const[h]=rgb2hsl(...base);
  let fam='黛';
  for(const[max,f]of FAMILY){if(h<=max){fam=f;break}}
  return pick(PREFIX)+fam;
}

/* ---------------- 智能随机配色 ---------------- */
let hueCursor=Math.random()*360;
const nextHue=()=>{hueCursor=(hueCursor+137.508)%360;return hueCursor};

function makeColor(baseH,offsetH,{sat,light}){
  const[h,s,l]=hsl2rgb((baseH+offsetH)%360,sat,light);
  return[h,s,l];
}
function generatePalette(){
  const mode=pick(['duo','duo','triadic','triadic','analogous','complementary','sunset','aurora','mono']);
  const base=nextHue();
  const sat=rand(.58,.9),light=rand(.5,.74);
  let cols=[],deg;
  switch(mode){
    case 'duo':{
      const off=Math.random()<.5?rand(130,180):rand(-180,-130);
      cols=[makeColor(base,0,{sat,light:rand(.58,.72)}),makeColor(base,off,{sat:rand(.5,.8),light:rand(.5,.66)})];
      deg=pick([45,90,120,135]);
      break;
    }
    case 'triadic':{
      cols=[makeColor(base,0,{sat,light}),makeColor(base,120,{sat:rand(.5,.78),light:rand(.55,.7)}),makeColor(base,240,{sat:rand(.5,.78),light:rand(.55,.7)})];
      deg=pick([-60,45,90,120,135]);
      break;
    }
    case 'analogous':{
      const a=rand(-26,-8),b=rand(10,28);
      cols=[makeColor(base,a,{sat:rand(.5,.78),light:rand(.6,.75)}),makeColor(base,0,{sat,light}),makeColor(base,b,{sat:rand(.5,.78),light:rand(.55,.7)})];
      deg=pick([0,45,90]);
      break;
    }
    case 'complementary':{
      cols=[makeColor(base,0,{sat,light:rand(.55,.7)}),makeColor(base,180,{sat:rand(.55,.82),light:rand(.5,.68)}),makeColor(base,-8,{sat:rand(.4,.6),light:rand(.72,.85)})];
      deg=pick([90,120,135]);
      break;
    }
    case 'sunset':{
      cols=[makeColor(base,-30,{sat:.85,light:.62}),makeColor(base,10,{sat:.82,light:.6}),makeColor(base,50,{sat:.72,light:.55})];
      deg=120;
      break;
    }
    case 'aurora':{
      cols=[makeColor(base,-40,{sat:.7,light:.6}),makeColor(base,0,{sat:.8,light:.55}),makeColor(base,50,{sat:.75,light:.5})];
      deg=-45;
      break;
    }
    case 'mono':{
      cols=[makeColor(base,0,{sat:.8,light:.78}),makeColor(base,0,{sat:.75,light:.6}),makeColor(base,0,{sat:.85,light:.44})];
      deg=pick([0,90]);
      break;
    }
  }
  cols=cols.map(c=>c.map(Math.round));
  return cols;
}

/* ---------------- 配色对象 ---------------- */
function buildPalette(colors,{name,deg,source,id}={}){
  const hexes=colors.map(c=>rgb2hex(...c));
  const names=colors.map(c=>colorName(c));
  const css=`linear-gradient(${deg}deg, ${hexes.map((h,i)=>`${h} ${Math.round(i*100/(hexes.length-1))}%`).join(', ')})`;
  return{
    id:id||`c${Date.now()}${Math.floor(Math.random()*999)}`,
    name:name||paletteName(colors),
    deg:deg??135,
    colors:colors.map((c,i)=>({hex:hexes[i],rgb:c,name:names[i]})),
    hexes,css,source:source||'random'
  };
}
const presetFromWebg=g=>{
  const colors=g[2].map(s=>hex2rgb(s[0]));
  const deg=g[1];
  return buildPalette(colors,{name:paletteName(colors),deg,source:'webgradients',id:'wg'+g[0]});
};

/* ---------------- 随机获取当前配色 ---------------- */
function randomPalette(){
  if(Math.random()<.4){
    const g=WEBGRADIENTS[Math.floor(Math.random()*WEBGRADIENTS.length)];
    return presetFromWebg(g);
  }
  const colors=generatePalette();
  return buildPalette(colors,{deg:pick([-60,-20,45,90,120,135])});
}

/* ---------------- 星星 ---------------- */
const STAR_SVG='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c.9 6.1 4.9 10.1 12 12-7.1 1.9-11.1 5.9-12 12-.9-6.1-4.9-10.1-12-12C7.1 10.1 11.1 6.1 12 0z"/></svg>';
function spawnStars(container,count,sizeRange,line){
  if(!container)return;
  container.innerHTML='';
  const W=container.clientWidth||420,H=container.clientHeight||480;
  for(let i=0;i<count;i++){
    const s=document.createElement('div');
    s.className='star4'+(line?' line':'');
    const sz=rand(sizeRange[0],sizeRange[1]);
    s.style.setProperty('--s',sz+'px');
    s.style.setProperty('--t',rand(2.4,5.2).toFixed(2)+'s');
    s.style.setProperty('--d',rand(0,4).toFixed(2)+'s');
    s.style.left=(line?rand(2,98):rand(2,96))+'%';
    s.style.top=line?'auto':rand(3,92)+'%';
    if(line)s.style.top=rand(18,78)+'%';
    s.innerHTML=STAR_SVG;
    container.appendChild(s);
  }
}

/* ---------------- DOM ---------------- */
const $=s=>document.querySelector(s);
const artA=$('#artLayerA'),artB=$('#artLayerB'),gradBar=$('#gradBar');
const heroGlow=$('#heroGlow'),paletteEl=$('#palette');
const gallery=$('#gallery'),favGallery=$('#favGallery');
const favWrap=$('#favWrap'),galleryWrap=$('#galleryWrap');
let current=null,autoTimer=null,autoOn=false;
let favs=[];

/* 渐变动画样式 */
(()=>{const st=document.createElement('style');st.textContent=
`@keyframes gradMove{from{background-position:0% 0%}to{background-position:100% 100%}}`;
document.head.appendChild(st);})();

function paintHero(p){
  current=p;
  // 交叉渐隐
  const incoming=artA.classList.contains('is-current')?artB:artA;
  const outgoing=artA.classList.contains('is-current')?artA:artB;
  incoming.style.backgroundImage=p.css;
  incoming.style.animation=`gradMove ${rand(10,16).toFixed(1)}s ease-in-out infinite alternate`;
  incoming.classList.add('is-current');
  outgoing.classList.remove('is-current');
  // 渐变条
  gradBar.querySelector('.gradbar-in')?.remove();
  const bar=document.createElement('div');
  bar.className='gradbar-in';
  bar.style.cssText=`position:absolute;inset:0;border-radius:inherit;background-image:${p.css};background-size:220% 220%;animation:gradMove ${rand(9,14).toFixed(1)}s ease-in-out infinite alternate;`;
  gradBar.prepend(bar);
  spawnStars($('#starsLine'),14,[5,9],true);
  // 光晕
  const c0=p.colors[0].hex,c1=p.colors[p.colors.length-1].hex;
  heroGlow.style.background=`radial-gradient(circle at 50% 42%, ${c0}44, ${c1}2e 60%, transparent 75%)`;
  // 色板
  paletteEl.innerHTML='';
  p.colors.forEach((c,i)=>{
    const w=document.createElement('div');
    w.className='swatch';
    w.innerHTML=`<span class="dot" style="background:${c.hex}"></span><span class="cn">${c.name}</span><span class="hex">${c.hex.toUpperCase()}</span>`;
    w.onclick=()=>copyText(c.hex,`已复制 ${c.hex.toUpperCase()}`);
    paletteEl.appendChild(w);
  });
  // 收藏态
  updateFavButtons();
}

function updateFavButtons(){
  const on=favs.some(f=>f.id===current.id);
  $('#btn-togglefav').querySelector('.heart').classList.toggle('on',on);
}

/* ---------------- 收藏 ---------------- */
function loadFavs(){try{favs=JSON.parse(localStorage.getItem('color.favs')||'[]')}catch(e){favs=[]}}
function saveFavs(){localStorage.setItem('color.favs',JSON.stringify(favs))}
function toggleFav(){
  const i=favs.findIndex(f=>f.id===current.id);
  if(i>=0){favs.splice(i,1);toast('已取消收藏')}
  else{favs.unshift(current);toast('已收藏 · ♥')}
  saveFavs();updateFavButtons();renderFavs();$('#fav-count').textContent=favs.length||'';
}
function isFav(id){return favs.some(f=>f.id===id)}
function favCardBtn(p){
  const b=document.createElement('button');
  b.className='fav-ico'+(isFav(p.id)?' on':'');
  b.title=isFav(p.id)?'取消收藏':'收藏';
  b.innerHTML='<svg viewBox="0 0 24 24"><path d="M12 21s-6.7-4.35-9.33-8.11C.9 10.3 1.6 6.6 4.6 5.1a5.4 5.4 0 0 1 7.4 2.07A5.4 5.4 0 0 1 19.4 5.1c3 1.5 3.7 5.2 1.93 7.79C18.7 16.65 12 21 12 21z"/></svg>';
  b.onclick=e=>{
    e.stopPropagation();
    const i=favs.findIndex(f=>f.id===p.id);
    if(i>=0){favs.splice(i,1);toast('已取消收藏')}
    else{favs.unshift(p);toast('已收藏 · ♥')}
    saveFavs();renderFavs();renderGallery();$('#fav-count').textContent=favs.length||'';
    updateFavButtons();
  };
  return b;
}
function renderFavs(){
  $('#favMeta').textContent=favs.length?`${favs.length} 组`:'';
  favGallery.innerHTML='';
  if(!favs.length){favGallery.innerHTML='<div class="empty">还没有收藏 · 点击 ♥ 保存喜欢的一组配色</div>';return}
  favs.forEach(p=>favGallery.appendChild(buildCard(p)));
}

/* ---------------- 画廊 ---------------- */
function buildGalleryList(){
  const list=[];
  const used=new Set();
  const uniq=p=>{
    let q=p,guard=0;
    while(used.has(q.name)&&guard++<8){
      q=buildPalette(q.colors.map(c=>c.rgb),{deg:q.deg,source:q.source,name:paletteName(q.colors.map(c=>c.rgb))});
    }
    used.add(q.name);
    return q;
  };
  // webgradients 精选（种子化，避免每次全变）
  const wg=[...WEBGRADIENTS].sort((a,b)=>hashCode(a[0])-hashCode(b[0])).slice(0,14);
  wg.forEach(g=>list.push(uniq(presetFromWebg(g))));
  // 智能随机补足
  for(let i=0;i<10;i++)list.push(uniq(randomPalette()));
  return list;
}
function buildCard(p){
  const c=document.createElement('div');
  c.className='card';
  c.innerHTML=`<div class="bg" style="background-image:${p.css};background-size:220% 220%;animation:gradMove ${rand(9,15).toFixed(1)}s ease-in-out infinite alternate"></div>
  <div class="stars"></div>
  <div class="meta"><span class="cn">${p.name}</span><span class="idx">${p.hexes.length}色</span></div>`;
  spawnStars(c.querySelector('.stars'),4,[5,9],false);
  c.appendChild(favCardBtn(p));
  c.onclick=()=>{paintHero(p);toast(`已载入「${p.name}」`);scrollTo({top:0,behavior:'smooth'})};
  return c;
}
let galleryCache=null;
function renderGallery(){
  galleryCache=galleryCache||buildGalleryList();
  gallery.innerHTML='';
  galleryCache.forEach(p=>gallery.appendChild(buildCard(p)));
  $('#galleryMeta').textContent=`${galleryCache.length} 组灵感`;
}

/* ---------------- 随机触发 ---------------- */
function doRandom(){
  const btn=$('#btn-random');
  btn.classList.remove('is-shuffling');void btn.offsetWidth;btn.classList.add('is-shuffling');
  paintHero(randomPalette());
  spawnStars($('#stars'),26,[7,20],false);
}

/* ---------------- 复制 ---------------- */
function copyText(txt,msg){
  const done=()=>toast(msg||'已复制');
  if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(txt).then(done).catch(()=>fallbackCopy(txt,done))}
  else fallbackCopy(txt,done);
}
function fallbackCopy(txt,done){
  const ta=document.createElement('textarea');ta.value=txt;ta.style.cssText='position:fixed;opacity:0';
  document.body.appendChild(ta);ta.select();
  try{document.execCommand('copy');done()}catch(e){toast('复制失败')}
  ta.remove();
}
function copyCSS(){
  const c=current||randomPalette();
  const stops=c.colors.map((x,i)=>`${x.hex} ${Math.round(i*100/(c.colors.length-1))}%`).join(', ');
  const css=`/* ${c.name} */\nbackground-image: linear-gradient(${c.deg}deg, ${stops});`;
  copyText(css,'已复制 CSS');
}

/* ---------------- 图片提色 ---------------- */
async function extractFromImage(file){
  const url=URL.createObjectURL(file);
  const img=await new Promise((res,rej)=>{const im=new Image();im.onload=()=>res(im);im.onerror=rej;im.src=url});
  const S=110;
  const cv=document.createElement('canvas');cv.width=S;cv.height=S;
  const ctx=cv.getContext('2d',{willReadFrequently:true});
  ctx.drawImage(img,0,0,S,S);
  const data=ctx.getImageData(0,0,S,S).data;
  URL.revokeObjectURL(url);
  const pts=[];
  for(let i=0;i<data.length;i+=4){
    const a=data[i+3];
    if(a<40)continue;
    const r=data[i],g=data[i+1],b=data[i+2];
    const L=lum([r,g,b]);
    if(L<.03||L>.97)continue; // 去纯黑纯白
    pts.push([r,g,b]);
  }
  if(pts.length<30)return null;
  const K=5;
  const cluster=kmeans(pts,K,12);
  // 按亮度排序，去重
  let colors=cluster.map(c=>({l:lum(c),rgb:[Math.round(c[0]),Math.round(c[1]),Math.round(c[2])]}))
    .sort((a,b)=>a.l-b.l)
    .map(o=>o.rgb);
  colors=dedupe(colors);
  // 优雅化：略提饱和度
  colors=colors.map(c=>{const[h,s,l]=rgb2hsl(...c);return hsl2rgb(h,Math.min(1,s*1.15+0.02),clamp(l,0.3,0.82))});
  return colors.slice(0,5);
}
function kmeans(pts,K,iters){
  // 初始化：取分散种子
  const seeds=[pts[Math.floor(Math.random()*pts.length)]];
  for(let k=1;k<K;k++){
    let best=-1,bd=-1;
    for(const p of pts){
      let md=1e9;
      for(const s of seeds){const d=(p[0]-s[0])**2+(p[1]-s[1])**2+(p[2]-s[2])**2;if(d<md)md=d}
      if(md>bd){bd=md;best=p}
    }
    seeds.push(best);
  }
  let centers=seeds;
  for(let it=0;it<iters;it++){
    const sums=Array.from({length:K},()=>[0,0,0,0]);
    for(const p of pts){
      let bi=0,bd=1e9;
      for(let k=0;k<K;k++){const d=(p[0]-centers[k][0])**2+(p[1]-centers[k][1])**2+(p[2]-centers[k][2])**2;if(d<bd){bd=d;bi=k}}
      sums[bi][0]+=p[0];sums[bi][1]+=p[1];sums[bi][2]+=p[2];sums[bi][3]++;
    }
    for(let k=0;k<K;k++){if(sums[k][3])centers[k]=[sums[k][0]/sums[k][3],sums[k][1]/sums[k][3],sums[k][2]/sums[k][3]]}
  }
  return centers;
}
function dedupe(colors){
  const out=[];
  for(const c of colors){
    if(out.every(o=>Math.abs(o[0]-c[0])+Math.abs(o[1]-c[1])+Math.abs(o[2]-c[2])>90))out.push(c);
  }
  while(out.length<2){out.push([Math.round(rand(40,215)),Math.round(rand(40,215)),Math.round(rand(40,215))])}
  return out;
}
function showExtract(colors,thumbUrl){
  $('#extractResult').classList.remove('hidden');
  $('#exThumb').src=thumbUrl;
  const sw=$('#exSwatches');
  sw.innerHTML='';
  colors.forEach(c=>{
    const hex=rgb2hex(...c);
    const w=document.createElement('div');
    w.className='swatch sm';
    w.innerHTML=`<span class="dot" style="background:${hex}"></span><span class="cn">${colorName(c)}</span><span class="hex">${hex.toUpperCase()}</span>`;
    w.onclick=()=>copyText(hex,`已复制 ${hex.toUpperCase()}`);
    sw.appendChild(w);
  });
  const bar=$('#exBar');
  bar.innerHTML=colors.map(c=>`<span style="background:${rgb2hex(...c)}"></span>`).join('');
  window._extractColors=colors;
}

/* ---------------- 自动播放 ---------------- */
function toggleAuto(){
  autoOn=!autoOn;
  $('#btn-auto').classList.toggle('on',autoOn);
  if(autoOn){autoTimer=setInterval(()=>{if(!document.hidden)paintHero(randomPalette())},6000);toast('自动播放 · 每 6 秒换一组')}
  else{clearInterval(autoTimer);toast('已暂停')}
}

/* ---------------- Toast ---------------- */
let toastTimer;
function toast(msg){
  const t=$('#toast');t.textContent=msg;t.classList.add('show');
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),1600);
}

/* ---------------- 事件绑定 ---------------- */
function bind(){
  $('#btn-random').onclick=doRandom;
  $('#btn-togglefav').onclick=toggleFav;
  $('#btn-copy').onclick=copyCSS;
  $('#btn-auto').onclick=toggleAuto;
  $('#btn-fav').onclick=()=>{
    const show=favWrap.classList.toggle('hidden');
    galleryWrap.classList.toggle('hidden',!show);
    $('#btn-fav').classList.toggle('on',show);
    if(show)renderFavs();
  };
  $('#btn-upload').onclick=()=>{$('#uploadMask').classList.remove('hidden')};
  $('#btn-closeupload').onclick=closeUpload;
  $('#uploadMask').addEventListener('click',e=>{if(e.target.id==='uploadMask')closeUpload()});
  const dz=$('#dropzone');
  dz.onclick=()=>$('#fileInput').click();
  dz.addEventListener('dragover',e=>{e.preventDefault();dz.classList.add('drag')});
  dz.addEventListener('dragleave',()=>dz.classList.remove('drag'));
  dz.addEventListener('drop',e=>{e.preventDefault();dz.classList.remove('drag');const f=e.dataTransfer.files[0];if(f&&f.type.startsWith('image/'))handleFile(f)});
  $('#fileInput').addEventListener('change',e=>{const f=e.target.files[0];if(f)handleFile(f)});
  $('#btn-extract-again').onclick=()=>{const f=$('#fileInput').files[0];if(f)handleFile(f)};
  $('#btn-useextract').onclick=()=>{
    if(!window._extractColors)return;
    const colors=window._extractColors;
    const p=buildPalette(colors,{deg:pick([-45,45,90,120]),source:'image',name:paletteName(colors)+'·映'});
    paintHero(p);closeUpload();toast(`已载入图片配色「${p.name}」`);
  };
  document.addEventListener('keydown',e=>{
    if(e.code==='Space'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)&&$('#uploadMask').classList.contains('hidden')){
      e.preventDefault();doRandom();
    }
    if(e.code==='Escape')closeUpload();
  });
}
function closeUpload(){$('#uploadMask').classList.add('hidden')}
async function handleFile(f){
  const url=URL.createObjectURL(f);
  try{
    const colors=await extractFromImage(f);
    if(!colors){toast('没提取到足够颜色，换张图试试');return}
    showExtract(colors,url);
  }catch(e){toast('图片处理失败，请换一张');console.warn(e)}
}

/* ---------------- 启动 ---------------- */
function init(){
  loadFavs();
  $('#fav-count').textContent=favs.length||'';
  paintHero(randomPalette());
  spawnStars($('#stars'),26,[7,20],false);
  renderGallery();
  bind();
  // 首帧后重布星，确保容器尺寸正确
  requestAnimationFrame(()=>spawnStars($('#stars'),26,[7,20],false));
}
document.addEventListener('DOMContentLoaded',init);
