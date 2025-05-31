const apiKey = '2c636bf15fffecab0a02a33f3d068656';
const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=pt-BR&sort_by=popularity.desc`;
const urlLancamentos = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=pt-BR&page=1`;

const itemPerSlide = 5;
const carouselContent = document.getElementById('carouselContent');

async function buscarFilmes(url) {
  const resposta = await fetch(url);
  const dados = await resposta.json();
  return dados.results;
}

function pegarImagemDoFilme(filme) {
  const baseUrl = 'https://image.tmdb.org/t/p/w300';
  const placeholder = 'https://via.placeholder.com/300x160?text=Sem+Imagem';

  if (filme && filme.poster_path) {
    return baseUrl + filme.poster_path;
  } else {
    return placeholder;
  }
}

function criarSlide(filmes) {
  carouselContent.innerHTML = '';

  for (let i = 0; i < filmes.length; i += itemPerSlide) {
    const slide = document.createElement('div');
    slide.className = 'carousel-item' + (i === 0 ? ' active' : '');

    const row = document.createElement('div');
    row.className = 'row justify-content-center g-3';

    const grupo = filmes.slice(i, i + itemPerSlide);

    grupo.forEach(filme => {
      const imagem = pegarImagemDoFilme(filme);

      const card = document.createElement('div');
      card.className = 'col filme-card';

      card.innerHTML = `
        <a href="detalhe.html?id=${filme.id}" class="text-decoration-none text-white">
          <img src="${imagem}" alt="${filme.title}" class="img-fluid rounded">
          <div class="filme-title text-center mt-2">${filme.title}</div>
        </a>
      `;

      row.appendChild(card);
    });

    slide.appendChild(row);
    carouselContent.appendChild(slide);
  }
}

function criarCardsLancamentos(filmes) {
  const container = document.getElementById('ultimosLancamentos');
  container.innerHTML = '';

  filmes.forEach(filme => {
    const imagem = pegarImagemDoFilme(filme);

    const card = document.createElement('div');
    card.className = 'col-md-4';

    card.innerHTML = `
      <div class="card bg-dark text-white" style="cursor:pointer;">
        <img src="${imagem}" class="card-img-top" alt="${filme.title}">
        <div class="card-body">
          <h5 class="card-title">${filme.title}</h5>
        </div>
      </div>
    `;

    card.querySelector('.card').addEventListener('click', () => {
      window.location.href = `detalhe.html?id=${filme.id}`;
    });

    container.appendChild(card);
  });
}

async function mostrarLancamentos() {
  try {
    const resposta = await fetch(urlLancamentos);
    const dados = await resposta.json();
    criarCardsLancamentos(dados.results);
  } catch (error) {
    console.error('Erro ao buscar lançamentos:', error);
    document.getElementById('ultimosLancamentos').innerHTML = '<p class="text-warning">Erro ao carregar lançamentos.</p>';
  }
}

// Inicia funções ao carregar a página
window.addEventListener('load', () => {
  buscarFilmes(url).then(criarSlide).catch(console.error);
  mostrarLancamentos();
});




// Exemplo de uso:
buscarFilmes(url).then(criarSlide);





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


// parte autor

//link do Instagram dinamicamente
const redes = document.getElementById('redesSociaisAluno');
const instagramUrl = 'https://instagram.com/heberth_sousa';

redes.innerHTML = `
  <a href="${instagramUrl}" target="_blank" rel="noopener noreferrer" class="text-white me-3" style="font-size: 1.5rem;">
    <i class="fab fa-instagram"></i>
  </a>
`;


// Agrupar avaliações por ano a partir da API TMDB
async function gerarGraficoNotasPorAno() {
  try {
    const filmes = await buscarFilmes(url);

    const notasPorAno = {};

    filmes.forEach(filme => {
      const ano = new Date(filme.release_date).getFullYear();
      const nota = filme.vote_average;

      if (!notasPorAno[ano]) {
        notasPorAno[ano] = { soma: 0, total: 0 };
      }

      notasPorAno[ano].soma += nota;
      notasPorAno[ano].total += 1;
    });

    const anos = Object.keys(notasPorAno).sort();
    const medias = anos.map(ano => (notasPorAno[ano].soma / notasPorAno[ano].total).toFixed(2));

    // Criar gráfico
    const ctx = document.getElementById('graficoNotas').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: anos,
        datasets: [{
          label: 'Nota Média',
          data: medias,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 10
          }
        }
      }
    });
  } catch (error) {
    console.error('Erro ao gerar gráfico de notas por ano:', error);
  }
}

// Chamar função após carregar a página
window.addEventListener('load', () => {
  gerarGraficoNotasPorAno();
});
