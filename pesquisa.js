// script-base.js

// Exemplo: Toggle navbar menu no mobile
document.addEventListener('DOMContentLoaded', () => {
  const toggler = document.querySelector('.navbar-toggler');
  const collapse = document.querySelector('#navbarNav');

  if (toggler && collapse) {
    toggler.addEventListener('click', () => {
      collapse.classList.toggle('show');
    });
  }
});

// script-pesquisa.js

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.querySelector('.search-form');
  const searchInput = searchForm.querySelector('input[type="search"]');

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const query = searchInput.value.trim();

    if (!query) {
      alert('Por favor, digite um termo para pesquisar.');
      return;
    }

    // Aqui você pode adicionar sua lógica de busca, por exemplo:
    // - chamar API
    // - filtrar elementos na página
    // - redirecionar para outra página

    console.log(`Pesquisar por: ${query}`);

    // Exemplo: redirecionar para uma página de resultados
    // window.location.href = `resultados.html?query=${encodeURIComponent(query)}`;
  });
});

// Importante: Certifique-se de importar tmdb.js antes deste script

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.querySelector('.search-form');
  const searchInput = searchForm.querySelector('input[type="search"]');
  const animeGrid = document.querySelector('.anime-grid');

  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const query = searchInput.value.trim();
    if (!query) {
      alert('Digite um termo para pesquisar.');
      return;
    }

    // Limpar resultados antigos
    filmeGrid.innerHTML = '<p>Carregando...</p>';

    // Buscar animes na TMDb
    const resultados = await buscarFilmes(query);

    if (resultados.length === 0) {
      filmeGrid.innerHTML = '<p>Nenhum anime encontrado.</p>';
      return;
    }

    // Montar cards
    filmeGrid.innerHTML = resultados.map(item => {
      const imgSrc = item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : 'images/default-poster.png';

      return `
          <div class="filme-card" data-id="${item.id}">
            <img src="${imgSrc}" alt="${item.name}" />
            <p>${item.name}</p>
          </div>
        `;
    }).join('');

    // Adicionar evento click para ir para detalhes
    filmeGrid.querySelectorAll('.filme-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        window.location.href = `detalhes.html?id=${id}`;
      });
    });
  });
});
