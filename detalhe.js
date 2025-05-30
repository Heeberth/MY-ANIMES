const apiKey = '2c636bf15fffecab0a02a33f3d068656';

// Função para obter o ID do filme a partir da URL
function getFilmeId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Buscar os detalhes do filme na API do TMDB
async function buscarDetalhesFilme(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=pt-BR`;

    const resposta = await fetch(url);
    if (!resposta.ok) throw new Error('Erro ao buscar detalhes do filme');

    return await resposta.json();
}

// Buscar o trailer do filme (YouTube)
async function buscarTrailer(filmeId) {
    const url = `https://api.themoviedb.org/3/movie/${filmeId}/videos?api_key=${apiKey}&language=pt-BR`;

    const resposta = await fetch(url);
    if (!resposta.ok) return null;

    const dados = await resposta.json();

    // Procura um vídeo do tipo "Trailer" hospedado no YouTube
    const trailer = dados.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
}

// Exibir os dados do filme na página
function mostrarDetalhes(filme) {
    const tituloElem = document.getElementById('filmeTitle');
    const anoElem = document.getElementById('filmeYear');
    const descricaoElem = document.getElementById('filmeDescription');
    const btnTrailer = document.getElementById('watchTrailerBtn');
    const imagem = document.getElementById('imagem');

    tituloElem.textContent = filme.title;
    anoElem.textContent = filme.release_date
        ? `Ano: ${filme.release_date.split('-')[0]}`
        : 'Ano: N/A';
    descricaoElem.textContent = filme.overview || 'Sem descrição disponível.';

    const baseUrl = 'https://image.tmdb.org/t/p/w500';
    if (filme.poster_path) {
        imagem.src = baseUrl + filme.poster_path;
        imagem.alt = filme.title;
    } else {
        imagem.src = 'https://via.placeholder.com/500x750?text=Sem+Imagem';
        imagem.alt = 'Sem imagem disponível';
    }

    btnTrailer.style.display = 'none';

    buscarTrailer(filme.id).then(url => {
        if (url) {
            btnTrailer.style.display = 'inline-block';
            btnTrailer.onclick = () => window.open(url, '_blank');
        }
    });
}

// Inicialização ao carregar a página
window.onload = async () => {
    try {
        const id = getFilmeId();
        if (!id) {
            alert('ID do filme não encontrado na URL');
            return;
        }

        const filme = await buscarDetalhesFilme(id);
        mostrarDetalhes(filme);
    } catch (error) {
        console.error(error);
        alert('Erro ao carregar detalhes do filme.');
    }
};
