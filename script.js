const W=[["apple","maçã","🍎"],["banana","banana","🍌"],["orange","laranja","🍊"],["grape","uva","🍇"],["watermelon","melancia","🍉"],["strawberry","morango","🍓"],["dog","cachorro","🐶"],["cat","gato","🐱"],["bird","pássaro","🐦"],["fish","peixe","🐟"],["horse","cavalo","🐴"],["rabbit","coelho","🐰"],["lion","leão","🦁"],["monkey","macaco","🐵"],["duck","pato","🦆"],["pig","porco","🐷"],["car","carro","🚗"],["bus","ônibus","🚌"],["bike","bicicleta","🚲"],["train","trem","🚆"],["plane","avião","✈️"],["boat","barco","⛵"],["sun","sol","☀️"],["moon","lua","🌙"],["star","estrela","⭐"],["cloud","nuvem","☁️"],["rain","chuva","🌧️"],["tree","árvore","🌳"],["flower","flor","🌸"],["house","casa","🏠"],["book","livro","📚"],["ball","bola","⚽"],["milk","leite","🥛"],["cake","bolo","🎂"],["pizza","pizza","🍕"],["bread","pão","🍞"],["egg","ovo","🥚"],["heart","coração","❤️"],["hand","mão","✋"],["clock","relógio","⏰"],["shoe","sapato","👟"],["hat","chapéu","🎩"],["key","chave","🔑"]];
const $=s=>document.querySelector(s),home=$("#home"),app=$("#app");
const rand=n=>Math.floor(Math.random()*n);
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=rand(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const ls={get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};let user=null,stars=0;
function addStars(n){stars+=n;$("#stars").textContent=stars;if(user){const u=ls.get("ef_users",{});if(u[user]){u[user].stars=stars;ls.set("ef_users",u)}}}
function speak(t){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang="en-US";u.rate=.8;speechSynthesis.speak(u)}catch(e){}}
let ac;function sfx(ok){try{ac=ac||new AudioContext();(ok?[523,659,784]:[220,180]).forEach((f,i)=>{const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime+i*.1;o.type="triangle";o.frequency.value=f;o.connect(g);g.connect(ac.destination);g.gain.setValueAtTime(.15,t);g.gain.exponentialRampToValueAtTime(.001,t+.25);o.start(t);o.stop(t+.3)})}catch(e){}}
function confetti(){const e=["🎉","⭐","🎈","✨","🌟"];for(let i=0;i<36;i++){const s=document.createElement("span");s.className="cf";s.textContent=e[rand(5)];s.style.left=rand(100)+"vw";s.style.animationDelay=Math.random()*.8+"s";document.body.appendChild(s);setTimeout(()=>s.remove(),3600)}}
function show(html){home.hidden=true;app.hidden=false;app.innerHTML='<button class="btn back">← Início</button>'+html;app.querySelector(".back").onclick=goHome;scrollTo(0,0)}
function goHome(){app.hidden=true;app.innerHTML="";home.hidden=false;try{speechSynthesis.cancel()}catch(e){}}
function end(emoji,title,txt,again){show(`<div class="card end"><div class="big">${emoji}</div><h2>${title}</h2><p>${txt}</p><button class="go again">Jogar de novo</button></div>`);app.querySelector(".again").onclick=again;confetti()}

function quiz(mode){
  const tr=mode==="tr",q=shuffle(W).slice(0,8);let i=0,ok=0;
  (function step(){
    const w=q[i],ans=tr?w[1]:w[0],opts=shuffle([w,...shuffle(W.filter(x=>x!==w)).slice(0,3)]);
    show(`<div class="card"><div class="bar"><i style="width:${i/8*100}%"></i></div>
      <p class="ask">${tr?"O que significa em português?":"Como se diz em inglês?"}</p>
      <div class="big ${tr?"":"pic"}">${tr?`<button class="say" aria-label="Ouvir a palavra">🔊</button><span>${w[0]}</span>`:w[2]}</div>
      <div class="opts">${opts.map(o=>`<button class="opt">${tr?o[1]:o[0]}</button>`).join("")}</div>
      <p class="fb" aria-live="polite"></p><button class="go" hidden>Próxima</button></div>`);
    if(tr){app.querySelector(".say").onclick=()=>speak(w[0]);speak(w[0])}
    const bs=[...app.querySelectorAll(".opt")],fb=app.querySelector(".fb"),go=app.querySelector(".go");
    bs.forEach(b=>b.onclick=()=>{
      bs.forEach(x=>{x.disabled=true;if(x.textContent===ans)x.classList.add("right")});
      if(b.textContent===ans){ok++;addStars(1);sfx(1);fb.textContent="Muito bem! 🎉 "+w[0]+" = "+w[1]}
      else{b.classList.add("bad");sfx(0);fb.textContent=`Quase! A resposta é "${ans}".`}
      if(!tr)speak(w[0]);
      go.hidden=false;go.textContent=i===7?"Ver resultado":"Próxima";go.focus();
      go.onclick=()=>{i++;i<8?step():end(ok>=7?"🏆":ok>=4?"🌟":"💪",ok>=7?"Incrível!":ok>=4?"Muito bem!":"Quase lá!",`Você acertou ${ok} de 8 e ganhou ${ok} ⭐`,()=>quiz(mode))}
    });
  })();
}

function wordsearch(){
  const N=9,D=[[0,1],[1,0],[1,1]],g=Array.from({length:N},()=>Array(N).fill("")),placed=[];
  shuffle(W.filter(x=>x[0].length<=7)).slice(0,6).forEach(w=>{
    const t=w[0].toUpperCase();
    for(let k=0;k<200;k++){
      const[d0,d1]=D[rand(3)],r=rand(N-d0*(t.length-1)),c=rand(N-d1*(t.length-1));
      if([...t].every((ch,j)=>!g[r+d0*j][c+d1*j]||g[r+d0*j][c+d1*j]===ch)){[...t].forEach((ch,j)=>g[r+d0*j][c+d1*j]=ch);placed.push({t,e:w[2]});break}
    }
  });
  const A="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  show(`<div class="card"><p class="ask">Ache as palavras: arraste do começo ao fim de cada uma</p>
    <div class="wsw"><div class="grid" id="grid">${g.map(r=>r.map(c=>`<b>${c||A[rand(26)]}</b>`).join("")).join("")}</div>
    <ul class="wl">${placed.map(p=>`<li data-w="${p.t}">${p.e} ${p.t.toLowerCase()}</li>`).join("")}</ul></div></div>`);
  const grid=$("#grid"),cell=(r,c)=>grid.children[r*N+c],found=new Set();
  [...grid.children].forEach((b,i)=>{b.dataset.r=Math.floor(i/N);b.dataset.c=i%N});
  let a=null,cells=[];
  const at=e=>{const el=document.elementFromPoint(e.clientX,e.clientY);return el&&el.parentNode===grid?el:null};
  const clear=()=>cells.forEach(([r,c])=>cell(r,c).classList.remove("sel"));
  function paint(r,c){
    const dr=r-a[0],dc=c-a[1],n=Math.max(Math.abs(dr),Math.abs(dc));
    if(dr&&dc&&Math.abs(dr)!==Math.abs(dc))return;
    clear();cells=Array.from({length:n+1},(_,j)=>[a[0]+Math.sign(dr)*j,a[1]+Math.sign(dc)*j]);
    cells.forEach(([r,c])=>cell(r,c).classList.add("sel"));
  }
  grid.onpointerdown=e=>{const el=at(e);if(el){a=[+el.dataset.r,+el.dataset.c];cells=[];paint(a[0],a[1])}};
  grid.onpointermove=e=>{if(!a)return;const el=at(e);if(el)paint(+el.dataset.r,+el.dataset.c)};
  window.onpointerup=()=>{
    if(!a)return;
    const word=cells.map(([r,c])=>cell(r,c).textContent).join(""),rev=[...word].reverse().join("");
    const m=placed.find(p=>!found.has(p.t)&&(p.t===word||p.t===rev));
    clear();
    if(m){
      cells.forEach(([r,c])=>{const b=cell(r,c);b.classList.add("ok","ok"+found.size%6)});
      found.add(m.t);app.querySelector(`li[data-w="${m.t}"]`).classList.add("done");
      addStars(2);sfx(1);speak(m.t.toLowerCase());
      if(found.size===placed.length)setTimeout(()=>end("🏆","Você achou todas!",`Ganhou ${placed.length*2} ⭐ neste caça-palavras`,wordsearch),900);
    }else if(cells.length>1)sfx(0);
    a=null;cells=[];
  };
}

function memory(){
  const p=shuffle(W.filter(x=>x[0].length<=10)).slice(0,6),cs=shuffle(p.flatMap(w=>[[w,"e"],[w,"w"]]));
  let open=[],moves=0,done=0,lock=false;
  show(`<div class="card"><p class="ask">Vire duas cartas: a figura e a palavra em inglês têm que combinar</p><p class="fb" id="mv" aria-live="polite">Jogadas: 0</p><div class="mem">${cs.map(([w,t])=>`<button class="mc" aria-label="Carta"><span class="front">❓</span><span class="back ${t}">${t==="e"?w[2]:w[0]}</span></button>`).join("")}</div></div>`);
  const bs=[...app.querySelectorAll(".mc")];
  bs.forEach((b,i)=>b.onclick=()=>{
    if(lock||b.classList.contains("up"))return;
    b.classList.add("up");open.push(i);
    if(open.length<2)return;
    const[x,y]=open;open=[];moves++;$("#mv").textContent="Jogadas: "+moves;
    if(cs[x][0]===cs[y][0]){
      bs[x].classList.add("match");bs[y].classList.add("match");done++;sfx(1);speak(cs[x][0][0]);
      if(done===6){const s=moves<=8?5:moves<=12?3:2;addStars(s);setTimeout(()=>end("🏆","Você achou todos os pares!",`Foram ${moves} jogadas e você ganhou ${s} ⭐`,memory),1000)}
    }else{lock=true;setTimeout(()=>{bs[x].classList.remove("up");bs[y].classList.remove("up");lock=false},900)}
  });
}


/* ===== Monte a frase ===== */
const S=[["O gato bebe leite.","The cat drinks milk.","🐱🥛"],["Eu tenho um cachorro.","I have a dog.","🐶"],["O sol é amarelo.","The sun is yellow.","☀️"],["Eu gosto de maçã.","I like apples.","🍎"],["O pássaro está na árvore.","The bird is in the tree.","🐦🌳"],["Eu como pão.","I eat bread.","🍞"],["A bola é vermelha.","The ball is red.","⚽"],["Eu vejo uma estrela.","I see a star.","⭐"],["O peixe nada na água.","The fish swims in the water.","🐟"],["Ela lê um livro.","She reads a book.","📚"],["Nós vamos de ônibus.","We go by bus.","🚌"],["O coelho pula muito.","The rabbit jumps a lot.","🐰"],["Eu amo minha casa.","I love my house.","🏠"],["O pato é pequeno.","The duck is small.","🦆"],["Ele bebe leite de manhã.","He drinks milk in the morning.","🥛"],["A lua brilha à noite.","The moon shines at night.","🌙"],["Eu tenho um bolo.","I have a cake.","🎂"],["O leão é forte.","The lion is strong.","🦁"],["Eu ando de bicicleta.","I ride a bike.","🚲"],["A flor é bonita.","The flower is pretty.","🌸"],["Eu como pizza com meu amigo.","I eat pizza with my friend.","🍕"],["O trem é rápido.","The train is fast.","🚆"]];
function sentence(){
  const q=shuffle(S).slice(0,6);let i=0,ok=0;
  (function step(){
    const[pt,en,em]=q[i],d=en.replace(/[.?!]$/,"").split(" ").map((w,j)=>(j||w==="I")?w:w.toLowerCase());
    let o;do{o=shuffle(d.map((_,k)=>k))}while(d.length>1&&o.every((v,k)=>d[v]===d[k]));
    show(`<div class="card"><div class="bar"><i style="width:${i/6*100}%"></i></div>
      <p class="ask">Monte a frase em inglês</p>
      <div class="big pic sen">${em}</div><p class="pt">${pt}</p>
      <div class="slot" aria-label="Sua frase"></div>
      <div class="bank">${o.map(k=>`<button class="chip">${d[k]}</button>`).join("")}</div>
      <p class="fb" aria-live="polite"></p>
      <div class="row"><button class="btn clr">Limpar</button><button class="btn chk">Conferir ✔</button></div>
      <button class="go" hidden>Próxima</button></div>`);
    const q$=x=>app.querySelector(x),bank=q$(".bank"),slot=q$(".slot"),fb=q$(".fb"),chk=q$(".chk"),clr=q$(".clr"),go=q$(".go");
    let tries=0,done=false;
    const reset=()=>{[...slot.children,...bank.children].forEach(c=>c.classList.remove("good","bad"));fb.textContent=""};
    q$(".card").onclick=e=>{const c=e.target.closest(".chip");if(!c||done)return;speak(c.textContent);reset();(c.parentNode===bank?slot:bank).appendChild(c)};
    clr.onclick=()=>{if(done)return;reset();[...slot.children].forEach(c=>bank.appendChild(c))};
    chk.onclick=()=>{
      if(done)return;
      const w=[...slot.children].map(c=>c.textContent);
      if(w.length<d.length){fb.textContent="Use todas as palavras para formar a frase!";return}
      if(w.join(" ")===d.join(" ")){
        done=true;[...slot.children].forEach(c=>c.classList.add("good"));
        const pts=tries?1:2;if(!tries)ok++;addStars(pts);sfx(1);speak(en);
        fb.textContent=`🎉 ${en} (+${pts} ⭐)`;chk.hidden=clr.hidden=true;go.hidden=false;go.textContent=i===5?"Ver resultado":"Próxima";go.focus();
        go.onclick=()=>{i++;i<6?step():end(ok>=5?"🏆":ok>=3?"🌟":"💪",ok>=5?"Você é demais!":ok>=3?"Muito bem!":"Continue praticando!",`Você montou ${ok} de 6 frases de primeira`,sentence)};
      }else{
        tries++;sfx(0);[...slot.children].forEach((c,j)=>c.classList.add(c.textContent===d[j]?"good":"bad"));
        slot.classList.remove("shake");void slot.offsetWidth;slot.classList.add("shake");
        fb.textContent="Quase! Verde está no lugar certo, vermelho precisa mudar."+(tries>1?` Dica: começa com "${d[0]}".`:"");
      }
    };
  })();
}

/* ===== contas (guardadas só neste navegador) ===== */
const AV=["🦊","🐼","🐸","🦄","🐯","🐵"],COL=["#ff5e5b","#ff9a2e","#ffc928","#2fbf71","#3aa8ff","#b565f0"];
let mode="in",pick=AV[0];
document.querySelectorAll(".logo").forEach(l=>{let i=0;l.innerHTML="English Fun".split(" ").map(w=>`<span class="lw">${[...w].map(c=>`<span class="l" style="--c:${COL[i%6]};--i:${i++}">${c}</span>`).join("")}</span>`).join("")});
$(".avl").innerHTML=AV.map(a=>`<button type="button" class="avb" aria-label="Escolher ${a}">${a}</button>`).join("");
const avb=[...document.querySelectorAll(".avb")],setPick=a=>{pick=a;avb.forEach(b=>b.classList.toggle("on",b.textContent===a))};
setPick(pick);avb.forEach(b=>b.onclick=()=>setPick(b.textContent));
document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{mode=t.dataset.t;document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("on",x===t));$("#avs").hidden=mode==="in";$("#sub").textContent=mode==="in"?"Entrar":"Criar minha conta";$("#err").textContent=""});
async function hash(p,salt){try{const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(salt+p));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}catch(e){let h=0;for(const c of salt+p)h=(h*31+c.charCodeAt(0))|0;return"f"+h}}
function start(n,a){$("#av").textContent=a;$("#nm").textContent=n;$("#stars").textContent=stars;$("#who").hidden=false;$("#auth").hidden=true;$("#hi").textContent=`Hello, ${n}!`;goHome()}
function enter(k){const u=ls.get("ef_users",{})[k];user=k;stars=u.stars||0;ls.set("ef_session",k);start(u.name,u.av)}
$("#f").onsubmit=async e=>{
  e.preventDefault();
  const n=$("#un").value.trim(),p=$("#pw").value,k=n.toLowerCase(),us=ls.get("ef_users",{}),err=$("#err");
  if(!/^[\p{L}\d_]{3,12}$/u.test(n)){err.textContent="Use de 3 a 12 letras ou números, sem espaços.";return}
  if(p.length<4){err.textContent="A senha precisa ter pelo menos 4 caracteres.";return}
  const h=await hash(p,k);
  if(mode==="up"){
    if(us[k]){err.textContent="Esse nome já existe. Escolha outro ou entre na sua conta.";return}
    us[k]={name:n,av:pick,h,stars:0};ls.set("ef_users",us);
  }else if(!us[k]||us[k].h!==h){err.textContent="Nome ou senha incorretos. Confira e tente de novo.";return}
  err.textContent="";e.target.reset();enter(k);
};
$("#guest").onclick=()=>{user=null;stars=0;ls.set("ef_session",null);start("Visitante","🙂")};
$("#out").onclick=()=>{ls.set("ef_session",null);user=null;stars=0;home.hidden=true;app.hidden=true;app.innerHTML="";$("#who").hidden=true;$("#auth").hidden=false;try{speechSynthesis.cancel()}catch(e){}};
document.querySelectorAll(".tile").forEach(t=>t.onclick=()=>({tr:()=>quiz("tr"),pic:()=>quiz("pic"),ws:wordsearch,mem:memory,sen:sentence})[t.dataset.g]());
{const s=ls.get("ef_session",null);ls.get("ef_users",{})[s]?enter(s):$("#auth").hidden=false}

