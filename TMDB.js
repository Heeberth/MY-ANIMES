const TMDB_API_KEY = '2c636bf15fffecab0a02a33f3d068656';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

async function buscarAnimes(query) {
  const url = `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Erro na busca');
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error('Erro na API TMDb:', error);
    return [];
  }
}

async function obterDetalhesAnime(id) {
  const url = `${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&language=pt-BR`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Erro ao obter detalhes');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erro na API TMDb:', error);
    return null;
  }
}
