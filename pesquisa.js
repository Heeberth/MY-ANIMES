document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.querySelector('.search-form');
  const searchInput = searchForm?.querySelector('input[type="search"]');
  const filmeGrid = document.querySelector('.filme-grid');
  const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'; // para usar a mesma base do TMDB.js


  const apiKey = '2c636bf15fffecab0a02a33f3d068656';

  async function buscarFilmes(query) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=pt-BR&query=${encodeURIComponent(query)}`;
    const resposta = await fetch(url);
    const dados = await resposta.json();
    return dados.results;
  }



  async function executarBusca(query) {
    if (!query) return;

    if (filmeGrid) {
      filmeGrid.innerHTML = '<p>Carregando...</p>';
    }

    try {
      const resultados = await buscarFilmes(query);

      if (!filmeGrid) return;

      if (resultados.length === 0) {
        filmeGrid.innerHTML = '<p>Nenhum filme encontrado.</p>';
        return;
      }

      filmeGrid.innerHTML = resultados.map(item => {
        const imgSrc = item.poster_path
          ? `${TMDB_IMAGE_BASE}${item.poster_path}`
          : 'https://via.placeholder.com/300x160?text=Sem+Imagem';

        const title = item.title || 'Sem título';

        return `
          <div class="filme-card" data-id="${item.id}" style="cursor:pointer;">
            <img src="${imgSrc}" alt="${title}" class="img-fluid rounded" />
            <p>${title}</p>
          </div>
        `;
      }).join('');

      filmeGrid.querySelectorAll('.filme-card').forEach(card => {
        card.addEventListener('click', () => {
          const id = card.getAttribute('data-id');
          window.location.href = `detalhe.html?id=${id}`;
        });
      });

    } catch (error) {
      if (filmeGrid) filmeGrid.innerHTML = '<p>Erro ao buscar resultados.</p>';
      console.error('Erro na pesquisa:', error);
    }
  }

  // ✅ SUBMISSÃO DO FORMULÁRIO (busca manual)
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (!query) {
        alert('Digite um termo para pesquisar.');
        return;
      }
      window.location.href = `pesquisa.html?query=${encodeURIComponent(query)}`;
    });
  }

  // ✅ BUSCA AUTOMÁTICA SE TIVER ?query= NA URL
  const urlParams = new URLSearchParams(window.location.search);
  const urlQuery = urlParams.get('query');
  if (urlQuery) {
    if (searchInput) searchInput.value = urlQuery; // preencher campo
    executarBusca(urlQuery);
  }
});
