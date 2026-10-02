async function carregarPerfis(){
  const grid = document.getElementById('grid');
  let perfis = [];
  if(supabaseClient){
    const {data, error} = await supabaseClient.from('profiles').select('*').eq('status','verificado').order('created_at',{ascending:false});
    if(!error && data && data.length) perfis = data;
  }
  if(!perfis.length){
    // mock 10 fundadores para demo sem banco
    perfis = [
      {nome:"João Pedro - Pedreiro", cidade:"Patos-PB", especialidade:"Casa 120m²", ticket_medio:"R$ 340k - 5 meses", selo:"Fundador Verificado 2025", obras_qtd:18, slug:"joao-pedro-patos"},
      {nome:"Maria Arquiteta", cidade:"Teixeira-PB", especialidade:"Reforma apartamento", ticket_medio:"R$ 95k - 45 dias", selo:"Fundador Verificado 2025", obras_qtd:34, slug:"maria-arquiteta-teixeira"},
      {nome:"Construtora Vale do Espinharas", cidade:"Sousa-PB", especialidade:"Galpão comercial", ticket_medio:"R$ 620k - 7 meses", selo:"Fundador Verificado 2025", obras_qtd:12, slug:"construtora-vale-sousa"},
      {nome:"Carlos Acabamentos", cidade:"Patos-PB", especialidade:"Pintura e porcelanato", ticket_medio:"R$ 18k - 10 dias", selo:"Fundador Verificado 2025", obras_qtd:47, slug:"carlos-acabamentos-patos"},
      {nome:"Ana Engenharia", cidade:"Cajazeiras-PB", especialidade:"Casa alto padrão", ticket_medio:"R$ 780k - 9 meses", selo:"Fundador Verificado 2025", obras_qtd:9, slug:"ana-engenharia-cajazeiras"},
      {nome:"Roberto Elétrica", cidade:"Patos-PB", especialidade:"Elétrica residencial", ticket_medio:"R$ 12k - 5 dias", selo:"Verificado 2025", obras_qtd:88, slug:"roberto-eletrica-patos"},
      {nome:"Sertão Hidráulica", cidade:"Patos-PB", especialidade:"Hidráulica", ticket_medio:"R$ 9k - 4 dias", selo:"Verificado 2025", obras_qtd:62, slug:"sertao-hidraulica-patos"},
      {nome:"Laje Forte", cidade:"Santa Luzia-PB", especialidade:"Laje e estrutura", ticket_medio:"R$ 42k - 15 dias", selo:"Verificado 2025", obras_qtd:21, slug:"laje-forte-santa-luzia"},
      {nome:"Gesso 3D PB", cidade:"Patos-PB", especialidade:"Forro e gesso", ticket_medio:"R$ 7k - 3 dias", selo:"Verificado 2025", obras_qtd:105, slug:"gesso-3d-patos"},
      {nome:"Esquadrias Premium", cidade:"Patos-PB", especialidade:"Portas e janelas", ticket_medio:"R$ 28k - 12 dias", selo:"Verificado 2025", obras_qtd:33, slug:"esquadrias-premium-patos"},
    ];
  }
  grid.innerHTML = "";
  perfis.forEach(p=>{
    const el = document.createElement('div');
    el.className='card';
    el.innerHTML = `
      <div class="card-top"></div>
      <div class="card-body">
        <div class="badge">${p.selo || 'Em verificação'}</div>
        <h3>${p.nome}</h3>
        <div class="meta">${p.especialidade} • ${p.cidade} • ${p.obras_qtd||0} obras</div>
        <div class="obra">${p.ticket_medio || ''}</div>
        <a class="btn" href="perfil/${p.slug}/" style="display:block;text-align:center;text-decoration:none">Ver perfil completo →</a>
      </div>`;
    grid.appendChild(el);
  });
}

async function salvarLead(e){
  e.preventDefault();
  const payload = {
    nome: document.getElementById('f_nome').value,
    whatsapp: document.getElementById('f_what').value,
    especialidade: document.getElementById('f_esp').value,
    cidade: document.getElementById('f_cidade').value,
    crea: document.getElementById('f_crea').value,
    obras_qtd: parseInt(document.getElementById('f_qtd').value||'0'),
    ticket_medio: document.getElementById('f_ticket').value,
    drive_link: document.getElementById('f_drive').value,
  };
  if(!payload.nome || !payload.whatsapp){ alert('Preencha nome e WhatsApp'); return; }
  document.getElementById('ok').style.display='block';
  if(!supabaseClient){
    alert('Sem Supabase configurado: lead salvo local para demo. Configure URL/KEY para salvar na nuvem.');
    carregarPerfis();
    showView('hub');
    return;
  }
  await supabaseClient.from('leads').insert([payload]);
  await supabaseClient.from('profiles').insert([{
    nome: payload.nome,
    slug: payload.nome.toLowerCase().replace(/\s+/g,'-') + '-' + Date.now(),
    especialidade: payload.especialidade,
    cidade: payload.cidade,
    crea: payload.crea,
    obras_qtd: payload.obras_qtd,
    ticket_medio: payload.ticket_medio,
    whatsapp: payload.whatsapp,
    selo: 'Em verificação',
    status: 'pendente'
  }]);
  carregarPerfis();
  showView('hub');
}

function showView(v){
  document.getElementById('view-hub').style.display = v==='hub'?'block':'none';
  document.getElementById('view-form').style.display = v==='form'?'block':'none';
  document.getElementById('btn-hub').classList.toggle('active', v==='hub');
  document.getElementById('btn-form').classList.toggle('active', v==='form');
}

document.addEventListener('DOMContentLoaded', carregarPerfis);
