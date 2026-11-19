(function(){
  var root=document.documentElement; root.classList.remove('no-js');
  // --- Время Астаны (Asia/Almaty, UTC+5), не часовой пояс устройства ---
  var override=null;
  function astanaMinutes(){
    if(override!==null) return override;
    try{
      var p=new Intl.DateTimeFormat('ru-RU',{timeZone:'Asia/Almaty',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
      var h=0,mi=0; p.forEach(function(x){if(x.type==='hour')h=+x.value; if(x.type==='minute')mi=+x.value;});
      return (h%24)*60+mi;
    }catch(e){ var d=new Date(); return ((d.getUTCHours()+5)%24)*60+d.getUTCMinutes(); }
  }
  var OPEN=7*60+30, PROMO=14*60, CLOSE=22*60;
  var st=document.querySelector('.st-text');
  function apply(){
    var t=astanaMinutes(), s=(t<OPEN||t>=CLOSE)?'night':(t>=PROMO?'afternoon':'morning');
    if(root.getAttribute('data-state')!==s) root.setAttribute('data-state',s);
    if(st) st.textContent = s==='night' ? 'Закрыто · откроемся в 7:30' : 'Открыто · ежедневно 7:30–22:00';
  }
  apply(); setInterval(apply,60000);

  // --- Вкладки меню ---
  var tabs=[].slice.call(document.querySelectorAll('.tab'));
  function select(tab,focus){
    tabs.forEach(function(t){
      var on=t===tab; t.setAttribute('aria-selected',on); t.tabIndex=on?0:-1;
      document.getElementById(t.getAttribute('aria-controls')).hidden=!on;
    });
    // если начало меню ушло выше экрана, ставим строку вкладок на её место под шапкой
    var tw=document.querySelector('.tabs-wrap'), pn=document.querySelector('.panels');
    if(tw&&pn){
      var top=parseFloat(getComputedStyle(tw).top)||0, th=tw.offsetHeight;
      document.documentElement.style.setProperty('--tabs',th+'px');
      var y=pn.getBoundingClientRect().top+window.scrollY-top-th;
      if(window.scrollY>y+1) window.scrollTo({top:y,behavior:'instant'});
    }
    if(focus) tab.focus();
    tab.scrollIntoView({block:'nearest',inline:'center',behavior:'smooth'});
  }
  (function(){var tw=document.querySelector('.tabs-wrap'); if(tw) document.documentElement.style.setProperty('--tabs',tw.offsetHeight+'px');})();
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){select(t)});
    t.addEventListener('keydown',function(e){
      var k=e.key, n=null;
      if(k==='ArrowRight') n=tabs[(i+1)%tabs.length];
      else if(k==='ArrowLeft') n=tabs[(i-1+tabs.length)%tabs.length];
      else if(k==='Home') n=tabs[0]; else if(k==='End') n=tabs[tabs.length-1];
      if(n){e.preventDefault(); select(n,true);}
    });
  });
  [].forEach.call(document.querySelectorAll('[data-tab]'),function(a){
    a.addEventListener('click',function(){var t=document.getElementById('tab-'+a.getAttribute('data-tab')); if(t) select(t);});
  });

  // --- Зерно домой: выбор «в зёрнах / помолом» → текст сообщения WhatsApp ---
  var segs=[].slice.call(document.querySelectorAll('.seg [role=radio]')), wa=document.getElementById('beans-wa'), msg=document.getElementById('beans-msg');
  function pick(b,focus){
    segs.forEach(function(x){var on=x===b; x.setAttribute('aria-checked',on); x.tabIndex=on?0:-1;});
    var text='Хочу Brazilian Profile 1.0 '+b.getAttribute('data-v');
    if(wa) wa.href='https://wa.me/77713505757?text='+encodeURIComponent(text);
    if(msg) msg.textContent=text;
    if(focus) b.focus();
  }
  segs.forEach(function(b,i){
    b.addEventListener('click',function(){pick(b)});
    b.addEventListener('keydown',function(e){
      var k=e.key, n=null;
      if(k==='ArrowRight'||k==='ArrowDown') n=segs[(i+1)%segs.length];
      else if(k==='ArrowLeft'||k==='ArrowUp') n=segs[(i-1+segs.length)%segs.length];
      else if(k===' '||k==='Enter'){e.preventDefault(); pick(b); return;}
      if(n){e.preventDefault(); pick(n,true);}
    });
  });

  // --- Появление блоков при скролле ---
  var rv=document.querySelectorAll('.rv');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{rootMargin:'0px 0px -8% 0px'});
    [].forEach.call(rv,function(el){io.observe(el)});
  } else [].forEach.call(rv,function(el){el.classList.add('in')});
})();
