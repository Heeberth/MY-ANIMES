const apiKey = '2c636bf15fffecab0a02a33f3d068656';

function getFilmeId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

async function buscarDetalhesFilme(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=pt-BR`;
    const resposta = await fetch(url);
    if (!resposta.ok) throw new Error('Erro ao buscar detalhes do filme');
    return await resposta.json();
}

async function buscarTrailer(filmeId) {
    const url = `https://api.themoviedb.org/3/movie/${filmeId}/videos?api_key=${apiKey}&language=pt-BR`;
    const resposta = await fetch(url);
    if (!resposta.ok) return null;

    const dados = await resposta.json();
    const trailer = dados.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
}

function mostrarDetalhes(filme) {
    const tituloElem = document.getElementById('filmeTitle');
    const anoElem = document.getElementById('filmeYear');
    const descricaoElem = document.getElementById('filmeDescription');
    const btnTrailer = document.getElementById('watchTrailerBtn');
    const imagem = document.getElementById('imagem');
    const btnFav = document.getElementById('favoritarBtn');

    tituloElem.textContent = filme.title;
    anoElem.textContent = filme.release_date
        ? `Ano: ${filme.release_date.split('-')[0]}`
        : 'Ano: N/A';
    descricaoElem.textContent = filme.overview || 'Sem descrição disponível.';

    const baseUrl = 'https://image.tmdb.org/t/p/w500';
    imagem.src = filme.poster_path ? baseUrl + filme.poster_path : 'https://via.placeholder.com/500x750?text=Sem+Imagem';
    imagem.alt = filme.title;

    btnTrailer.style.display = 'none';

    buscarTrailer(filme.id).then(url => {
        if (url) {
            btnTrailer.style.display = 'inline-block';
            btnTrailer.onclick = () => window.open(url, '_blank');
        }
    });

    verificarFavorito(filme.id, btnFav);
}

async function verificarFavorito(filmeId, btnFav) {
    try {
        const resposta = await fetch(`http://localhost:3000/favoritos?filmeId=${filmeId}`);
        const jaFavoritado = await resposta.json();

        if (jaFavoritado.length > 0) {
            btnFav.innerHTML = '<i class="fas fa-star"></i> Remover dos Favoritos';
            btnFav.classList.replace('btn-warning', 'btn-danger');
            btnFav.dataset.favoritado = 'true';
        } else {
            btnFav.innerHTML = '<i class="far fa-star"></i> Favoritar';
            btnFav.classList.replace('btn-danger', 'btn-warning');
            btnFav.dataset.favoritado = 'false';
        }
    } catch (error) {
        console.error('Erro ao verificar se o filme é favorito:', error);
        alert('Não foi possível verificar os favoritos.');
    }
}

async function favoritarFilme(filme) {
    const btnFav = document.getElementById('favoritarBtn');

    try {
        const resposta = await fetch(`http://localhost:3000/favoritos?filmeId=${filme.id}`);
        const favoritos = await resposta.json();

        if (favoritos.length > 0) {
            const favoritoId = favoritos[0].id;
            await fetch(`http://localhost:3000/favoritos/${favoritoId}`, {
                method: 'DELETE'
            });
            btnFav.innerHTML = '<i class="far fa-star"></i> Favoritar';
            btnFav.classList.replace('btn-danger', 'btn-warning');
            btnFav.dataset.favoritado = 'false';
        } else {
            await fetch(`http://localhost:3000/favoritos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filmeId: filme.id,
                    title: filme.title,
                    release_date: filme.release_date,
                    overview: filme.overview,
                    poster_path: filme.poster_path
                })
            });
            btnFav.innerHTML = '<i class="fas fa-star"></i> Remover dos Favoritos';
            btnFav.classList.replace('btn-warning', 'btn-danger');
            btnFav.dataset.favoritado = 'true';
        }
    } catch (error) {
        console.error('Erro ao favoritar/remover dos favoritos:', error);
        alert('Erro ao atualizar favoritos.');
    }
}

window.onload = async () => {
    try {
        const id = getFilmeId();
        if (!id) {
            alert('ID do filme não encontrado na URL');
            return;
        }

        const filme = await buscarDetalhesFilme(id);
        mostrarDetalhes(filme);

        const btnFav = document.getElementById('favoritarBtn');
        btnFav.addEventListener('click', () => favoritarFilme(filme));
    } catch (error) {
        console.error(error);
        alert('Erro ao carregar detalhes do filme.');
    }

    // ** Aqui adicionamos a funcionalidade da barra de pesquisa **
    const searchForm = document.getElementById('searchFormDetail');
    const searchInput = document.getElementById('searchInputDetail');


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
