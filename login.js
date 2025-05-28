document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;

  const mensagem = document.getElementById('mensagem');

  // Busca usuários do json-server
  fetch(`http://localhost:3000/usuarios?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar usuários');
      }
      return response.json();
    })
    .then(usuarios => {
      if (usuarios.length > 0) {
        const usuarioValido = usuarios[0];



        setTimeout(() => {
          mensagem.innerHTML = '<div class="alert alert-success">Login realizado com sucesso! Redirecionando...</div>';
          localStorage.setItem('usuarioLogado', JSON.stringify(usuarioValido));

          window.location.href = 'index.html';
        }, 2000);
      } else {
        mensagem.innerHTML = '<div class="alert alert-danger">E-mail ou senha incorretos.</div>';
      }
    })
    .catch(error => {
      console.error('Erro:', error);
      mensagem.innerHTML = '<div class="alert alert-danger">Erro ao realizar login. Tente novamente.</div>';
    });
});

