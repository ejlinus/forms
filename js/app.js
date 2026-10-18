(() => {
  const $ = (id) => document.getElementById(id);
  const state = { data: null, category: null };
  const esc = (s) => String(s ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const norm = s => String(s ?? '').toLowerCase().replace(/\s+/g,'');
  const show = el => el.classList.remove('hidden');
  const hide = el => el.classList.add('hidden');
  const match = (f,q) => [f.name,f.form_number,f.category,f.law].some(v => norm(v).includes(q));
  const formatDate = v => {
    const s=String(v||'').trim();
    if(!s || /관리자 업데이트 전|미검증/i.test(s)) return '-';
    const m=s.match(/^(\d{4})[-./]?(\d{2})[-./]?(\d{2})/);
    return m ? `${m[1]}. ${m[2]}. ${m[3]}.` : s;
  };

  function buttons(f){
    const direct=!!f.direct_download;
    const hwp=f.hwp_url ? (direct ? `<a class="link-btn hwp" href="${esc(f.hwp_url)}" download>HWP</a>` : `<a class="link-btn hwp" href="${esc(f.hwp_url)}" target="_blank" rel="noopener noreferrer">HWP</a>`) : `<span class="link-btn disabled">HWP</span>`;
    const pdf=f.pdf_url ? (direct ? `<a class="link-btn pdf" href="${esc(f.pdf_url)}" download>PDF</a>` : `<a class="link-btn pdf" href="${esc(f.pdf_url)}" target="_blank" rel="noopener noreferrer">PDF</a>`) : '';
    return `${hwp}${pdf}`;
  }

  function renderDashboard(){
    const forms=state.data.forms||[], cats=state.data.categories||[];
    $('categorySummary').textContent=`총 ${cats.length}개 업무`;
    $('dashboard').innerHTML=cats.map((c,i)=>{
      const count=forms.filter(f=>f.category===c.name).length;
      const iconMap={"전입신고":"<svg class=\"category-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.55\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 11.5 12 4l9 7.5\"/><path d=\"M5.5 10.5V20h13v-9.5\"/><circle cx=\"12\" cy=\"12.5\" r=\"2\"/><path d=\"M8.5 18c.4-2 1.6-3 3.5-3s3.1 1 3.5 3\"/></svg>","정정 / 거주불명":"<svg class=\"category-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.55\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m4 16.5 11.8-11.8 3.5 3.5L7.5 20H4z\"/><path d=\"m13.8 6.7 3.5 3.5M4 22h16\"/></svg>","주민등록신고서":"<svg class=\"category-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.55\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 3.5h8l5 5V21H6z\"/><path d=\"M14 3.5V9h5M9 13h7M9 16.5h7\"/><circle cx=\"9.5\" cy=\"9.5\" r=\"1\"/></svg>","해외체류신고":"<svg class=\"category-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.55\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m3 11 18-7-6 18-3.5-7.5z\"/><path d=\"m11.5 14.5 4-4\"/></svg>","등초본 및 전입세대확인서":"<svg class=\"category-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.55\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 3.5h8l5 5V21H6z\"/><path d=\"M14 3.5V9h5M9 13h7M9 16.5h7\"/></svg>","주민등록번호 변경":"<svg class=\"category-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.55\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"2.8\" y=\"4.2\" width=\"14.2\" height=\"15.2\" rx=\"1.8\"/><circle cx=\"7.4\" cy=\"9\" r=\"1.8\"/><path d=\"M4.8 14.4c.8-2 4.4-2 5.2 0M12 8h2.5M12 11h2.5\"/><path d=\"m15.2 17.8 4.9-4.9 1.6 1.6-4.9 4.9-2.2.6z\"/></svg>","주민등록증":"<svg class=\"category-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.55\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"2.5\" y=\"5\" width=\"19\" height=\"14\" rx=\"2\"/><circle cx=\"8\" cy=\"10\" r=\"2\"/><path d=\"M5 15c.5-1.5 1.5-2.2 3-2.2s2.5.7 3 2.2M14 9h4M14 12h4M14 15h3\"/></svg>","인감":"<svg class=\"category-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.55\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 11V6a3 3 0 0 1 6 0v5\"/><path d=\"M7 11h10l1 4H6z\"/><rect x=\"4\" y=\"15\" width=\"16\" height=\"4\" rx=\"1\"/><path d=\"M7 21h10\"/></svg>","가족관계":"<svg class=\"category-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.55\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"7\" r=\"3\"/><circle cx=\"5\" cy=\"10\" r=\"2.2\"/><circle cx=\"19\" cy=\"10\" r=\"2.2\"/><path d=\"M6.5 20v-2a5.5 5.5 0 0 1 11 0v2zM1.5 19v-1a3.5 3.5 0 0 1 4-3.5M22.5 19v-1a3.5 3.5 0 0 0-4-3.5\"/></svg>","외국인정보공동이용시스템":"<svg class=\"category-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.55\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"4\" y=\"2.5\" width=\"16\" height=\"19\" rx=\"2\"/><circle cx=\"12\" cy=\"11\" r=\"5\"/><path d=\"M7 11h10M12 6a8 8 0 0 1 0 10M12 6a8 8 0 0 0 0 10M8 4.5h8\"/></svg>","주택임대차계약신고 및 확정일자":"<svg class=\"category-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.55\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2.5 10.5 12 3l9.5 7.5\"/><path d=\"M5 9.5V21h14V9.5\"/><path d=\"M9 21v-6h3\"/><path d=\"M15.8 12.2c-.9 0-1.6.7-1.6 1.6 0 .5.2.9.5 1.2l-1.5 2.1 1.4 1 1.5-2.1c.5 0 1-.2 1.3-.6.6-.8.4-1.8-.4-2.4-.4-.5-.8-.8-1.2-.8z\"/><path d=\"M13.5 18.2 12.8 20\"/></svg>","민원처리운영창구(정부24)":"<svg class=\"category-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.55\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"5\" y=\"3\" width=\"14\" height=\"18\" rx=\"1\"/><path d=\"M9 7h2M14 7h1M9 11h2M14 11h1M9 15h2M14 15h1M10 21v-3h4v3\"/></svg>"};
      return `<button class="category-card" type="button" data-category="${esc(c.name)}"><span class="category-no">${String(i+1).padStart(2,'0')}</span>${iconMap[c.name]||''}<h3>${esc(c.name)}</h3><p>${esc(c.description||'업무 관련 서식')}</p><span class="category-count">${count}개 서식　›</span></button>`;
    }).join('');
    document.querySelectorAll('.category-card').forEach(b=>b.addEventListener('click',()=>openCategory(b.dataset.category)));
  }

  function renderSearchResults(query){
    const q=norm(query), forms=(state.data.forms||[]).filter(f=>match(f,q));
    $('resultsTitle').textContent=`'${query.trim().replace(/\s+/g,' ')}' 검색결과`;
    $('resultsCount').textContent=`${forms.length}건`;
    $('searchFormList').innerHTML=forms.length ? forms.map(f=>`<div class="result-row"><div><div class="form-name">${esc(f.name)}</div></div><div class="form-law">${esc(f.form_number)}<small>${esc(f.law)}</small></div><div><span class="category-badge">${esc(f.category)}</span></div><div class="result-download"><div class="form-actions">${buttons(f)}</div></div></div>`).join('') : `<div class="empty">입력하신 조건에 맞는 서식이 없습니다.</div>`;
    hide($('dashboardSection')); hide($('categoryResults')); show($('searchResults'));
    $('searchGuide').classList.add('hidden');
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function doSearch(){
    const q=$('search').value.trim();
    if(!q){show($('searchGuide'));hide($('searchResults'));hide($('categoryResults'));show($('dashboardSection'));return;}
    state.category=null; renderSearchResults(q);
  }

  function openCategory(category){
    state.category=category;
    const forms=(state.data.forms||[]).filter(f=>f.category===category);
    $('categoryResultsTitle').textContent=category; $('categoryResultsCount').textContent=`${forms.length}개 서식`;
    $('categoryFormList').innerHTML=forms.length ? forms.map(f=>`<article class="form-card"><div><div class="form-name">${esc(f.name)}</div><div class="form-meta">${esc(f.law)} · ${esc(f.form_number)}</div></div><div class="form-actions">${buttons(f)}</div></article>`).join('') : `<div class="empty">해당 업무의 서식이 없습니다.</div>`;
    hide($('dashboardSection')); hide($('searchResults')); show($('categoryResults'));
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function back(){
    state.category=null; $('search').value=''; show($('searchGuide')); hide($('searchResults')); hide($('categoryResults')); show($('dashboardSection')); renderDashboard();
  }

  async function load(){
    try{
      let data=null;
      // 로컬 파일(file://)로 열어도 동작하도록, index.html에 내장된 데이터를 먼저 사용합니다.
      const embedded=$('formsData');
      if(embedded&&embedded.textContent.trim()){
        try{data=JSON.parse(embedded.textContent);}
        catch(e){console.warn('Embedded forms data parse failed.',e);}
      }
      // 내장 데이터가 없을 때만 웹서버의 forms.json을 조회합니다.
      if(!data){
        try{const r=await fetch('./data/forms.json',{cache:'no-store'});if(r.ok)data=await r.json();}
        catch(_){}
      }
      if(!data)throw new Error('forms.json 및 index.html 내장 데이터가 없습니다.');
      state.data=data;
      const metaDate=document.querySelector('meta[name="site-updated-at"]')?.getAttribute('content')||'';
      $('updatedAt').textContent=formatDate(data.updated_at) !== '-' ? formatDate(data.updated_at) : formatDate(metaDate);
      renderDashboard();
    }catch(e){$('updatedAt').textContent='-';show($('loadError'));console.error(e);}
  }

  $('searchBtn').addEventListener('click',doSearch);
  $('search').addEventListener('keydown',e=>{if(e.key==='Enter')doSearch();});
  $('clearSearch').addEventListener('click',()=>{ $('search').value=''; $('search').focus(); back(); });
  $('backToDashboard').addEventListener('click',back);
  load();
})();
