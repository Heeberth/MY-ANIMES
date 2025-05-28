const apiKey = '2c636bf15fffecab0a02a33f3d068656';
const url = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=16&language=pt-BR&sort_by=popularity.desc`;
const itemPerSlide = 5;
const carouselContent = document.getElementById('carouselContent');


async function buscarFilmes(url) {
  const resposta = await fetch(url);
  const dados = await resposta.json();
  return dados.results;
}

function criarSlide(animes) {
  carouselContent.innerHTML = '';  // Limpa slides antigos

  for (let i = 0; i < animes.length; i += itemPerSlide) {

    const slide = document.createElement('div');

    slide.className = 'carousel-item' + (i === 0 ? ' active' : ''); //faz mover

    const row = document.createElement('div');
    row.className = 'row justify-content-center g-3';

    const grupo = animes.slice(i, i + itemPerSlide);

    console.log(animes);
    
    grupo.forEach(anime => {
      
      const imagem = anime.poster_path
        ? `https://image.tmdb.org/t/p/w300${anime.poster_path}`
        : 'https://via.placeholder.com/300x160?text=Sem+Imagem';

      const card = document.createElement('div');

      card.className = 'col anime-card';

      card.innerHTML = `
        <img src="${imagem}" alt="${anime.name}" class="img-fluid rounded">
        <div class="anime-title text-center mt-2">${anime.name}</div>
      `;
      row.appendChild(card);
    });

    slide.appendChild(row);
    carouselContent.appendChild(slide);
  }
}




// INICIALIZA
buscarFilmes(url)
  .then(criarSlide)
  .catch(error => console.error('Erro ao buscar animes:', error));


fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log(data.results);
  })
  .catch(error => console.error('Erro ao buscar Filmes:', error));