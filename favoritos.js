const container = document.getElementById("listaFavoritos");

async function carregarFavoritos() {
  try {
    const resposta = await fetch('http://localhost:3000/favoritos');
    if (!resposta.ok) throw new Error('Erro ao buscar favoritos');

    const favoritos = await resposta.json();

    if (favoritos.length === 0) {
      container.innerHTML = `<p class="text-center">Você não tem filmes favoritados.</p>`;
      return;
    }

    container.innerHTML = ''; // Limpa lista atual

    favoritos.forEach(filme => {
      container.innerHTML += `
        <div class="col">
          <div class="card bg-secondary text-white h-100" style="max-width: 15rem;">
            <img src="https://image.tmdb.org/t/p/w200${filme.poster_path}" class="card-img-top" alt="${filme.title}">
            <div class="card-body">
              <h6 class="card-title">${filme.title}</h6>
              <button class="btn btn-primary btn-sm" onclick="window.location.href='detalhe.html?id=${filme.filmeId}'">
                Ver Detalhes
              </button>
            </div>
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.error(error);
    container.innerHTML = `<p class="text-center text-danger">Erro ao carregar filmes favoritos.</p>`;
  }
}

function verDetalhes(id) {
  window.location.href = `detalhe.html?id=${id}`;
}

window.onload = () => {
  carregarFavoritos();

  // Adiciona funcionalidade da barra de busca
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');

  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const termo = searchInput.value.trim();
      if (termo) {
        window.location.href = `pesquisa.html?query=${encodeURIComponent(termo)}`;
      }
    });
  }
};
