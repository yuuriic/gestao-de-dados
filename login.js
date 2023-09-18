document.getElementById('login_form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o redirecionamento padrão do formulário

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Aqui você pode verificar o email e a senha.

    if (email === 'teste@teste.com' && password === 'senha123') {
        alert('Login bem-sucedido!');
        // Redirecione para a página de destino após o login bem-sucedido, se necessário.
        window.location.href = "home.html";
    } else {
        alert('Credenciais inválidas. Tente novamente.');
    }
});