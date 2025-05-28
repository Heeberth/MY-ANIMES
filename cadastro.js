document.getElementById('cadastroForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  const usuario = { nome, email, senha };

  const mensagem = document.getElementById('mensagem');

  const apiUrl = 'http://localhost:3000/usuarios';

  // Envia os dados para o json-server
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(usuario)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao cadastrar usuário');
      }
      return response.json();
    })
    .then(data => {
      mensagem.innerHTML = '<div class="sucesso">Cadastro realizado com sucesso! Redirecionando para login...</div>';
      document.getElementById('cadastroForm').reset();

      // Redireciona após 2 segundos
      setTimeout(() => {
        window.location.href = 'login.html';

      }, 200);
    })
    .catch(error => {
      console.error('Erro:', error);
      mensagem.innerHTML = '<div class="erro">Ocorreu um erro ao realizar o cadastro. Tente novamente.</div>';
    });
});

