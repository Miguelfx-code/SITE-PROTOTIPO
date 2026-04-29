document.addEventListener('DOMContentLoaded', () => {
    const togglePassword = document.querySelector('.toggle-password');
    const password = document.querySelector('#password');
    const dobInput = document.getElementById('config-dob');

    if (togglePassword && password) {
        togglePassword.addEventListener('click', function () {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // Live DOB age calculation
    if (dobInput) {
        dobInput.addEventListener('change', atualizarStatusIdade);
        dobInput.addEventListener('input', atualizarStatusIdade);
    }

    atualizarPontuacaoUI();
    atualizarUsuarioUI();

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.user-nav-info')) {
            fecharTodosMenusUsuario();
        }
    });
});

// Função para calcular idade a partir da data de nascimento
function calcularIdade(dataNasc) {
    if (!dataNasc) return 0;
    const hoje = new Date();
    const nascimento = new Date(dataNasc);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesDiff = hoje.getMonth() - nascimento.getMonth();
    if (mesDiff < 0 || (mesDiff === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return idade;
}

// Atualiza status visual da verificação de idade
function atualizarStatusIdade() {
    const dobInput = document.getElementById('config-dob');
    const statusEl = document.getElementById('dob-status');
    const statusIcon = document.getElementById('status-icon');
    const statusText = document.getElementById('status-text');
    const hiddenAgeVerify = document.getElementById('config-age-verify');

    if (!dobInput || !statusEl || !statusIcon || !statusText || !hiddenAgeVerify) return;

    const dobValue = dobInput.value;
    dataNascimentoUsuario = dobValue;

    if (!dobValue) {
        statusEl.className = 'dob-status neutral';
        statusIcon.innerHTML = '○';
        statusText.textContent = 'Insira sua data de nascimento';
        hiddenAgeVerify.value = 'false';
        return;
    }

    const idade = calcularIdade(dobValue);
    const hoje = new Date();
    const maxDataPermitida = new Date(hoje.getFullYear() - 13, hoje.getMonth(), hoje.getDate());

    if (new Date(dobValue) > maxDataPermitida) {
        statusEl.className = 'dob-status invalid';
        statusIcon.innerHTML = '✗';
        statusText.textContent = `Idade: ${idade} anos (necessário 13+ anos)`;
        hiddenAgeVerify.value = 'false';
    } else {
        statusEl.className = 'dob-status valid';
        statusIcon.innerHTML = '✓';
        statusText.textContent = `Idade: ${idade} anos ✓ (verificado)`;
        hiddenAgeVerify.value = 'true';
    }
}

// Botão Verificar Idade handler
function verificarIdade() {
    atualizarStatusIdade();
    
    if (dataNascimentoUsuario) {
        const idade = calcularIdade(dataNascimentoUsuario);
        if (idade >= 13) {
            document.getElementById('config-age-verify').value = 'true';
            alert('✅ Idade verificada com sucesso! Você tem ' + idade + ' anos.');
        } else {
            document.getElementById('config-age-verify').value = 'false';
            alert('❌ Você deve ter pelo menos 13 anos para usar o app.');
        }
    } else {
        alert('Por favor, insira sua data de nascimento primeiro.');
    }
}

let tipoUsuario = '';
let categoriaAtual = '';
let usuarioAtual = 'Jogador';
let usuarioCadastrado = '';
let usuarioLogado = false;
let iconePerfilUsuario = 'file:///C:/Users/Migas/.cursor/projects/c-Users-Migas-NOVOS-CODIGOS/assets/c__Users_Migas_AppData_Roaming_Cursor_User_workspaceStorage_e36d86c18cbb4faed781dbd99361aa3c_images_image-a3c7f6d1-3153-4b7b-bc89-676d0c9e0980.png';

// Dados de Configuração
let senhaAtual = '12345';
let emailCadastrado = '';
let telefoneCadastrado = '';
let generoCadastrado = '';
let idadeVerificada = false;
let dataNascimentoUsuario = '';
let fotoTemporaria = null;
let tempoInicioQuiz = null;
let tempoTotalQuizSegundos = 0;
let respostasUsuario = [];
let perguntas = [
    {
        id: 1,
        pergunta: 'Qual é o vértice da parábola dada pela função f(x) = x² - 4x + 3?',
        alternativas: ['(2, -1)', '(2, 1)', '(-2, -1)', '(-2, 1)'],
        correta: 0,
        resolucao: [
            { passo: 'Calcule a coordenada x do vértice (x = -b/2a)', cod: 'x = -(-4) / 2(1) \nx = 4 / 2 = 2' },
            { passo: 'Substitua x na função para achar y', cod: 'y = (2)² - 4(2) + 3 \ny = 4 - 8 + 3 = -1' },
            { passo: 'Portanto, o vértice é', cod: '(2, -1)' }
        ]
    },
    {
        id: 2,
        pergunta: 'Quais são as raízes da equação x² - 5x + 6 = 0?',
        alternativas: ['x=2, x=3', 'x=-2, x=-3', 'x=1, x=6', 'x=-1, x=-6'],
        correta: 0,
        resolucao: [
            { passo: 'Encontre dois números que somam 5 (-b/a) e multiplicam 6 (c/a)', cod: '2 + 3 = 5 \n2 * 3 = 6' },
            { passo: 'As raízes são', cod: 'x = 2 e x = 3' }
        ]
    },
    {
        id: 3,
        pergunta: 'Qual é o ponto de interseção da função f(x) = 2x² - 3x + 5 com o eixo y?',
        alternativas: ['(0, 5)', '(0, -5)', '(5, 0)', '(0, 3)'],
        correta: 0,
        resolucao: [
            { passo: 'Para encontrar a interseção com y, faça x = 0', cod: 'f(0) = 2(0)² - 3(0) + 5' },
            { passo: 'O valor será o termo independente (c)', cod: 'y = 5' },
            { passo: 'O ponto é', cod: '(0, 5)' }
        ]
    },
    {
        id: 4,
        pergunta: 'A função f(x) = -x² + 4x - 4 possui concavidade voltada para:',
        alternativas: ['Baixo', 'Cima', 'Esquerda', 'Direita'],
        correta: 0,
        resolucao: [
            { passo: 'Analise o coeficiente "a" (termo que multiplica x²)', cod: 'a = -1' },
            { passo: 'Regra da concavidade', cod: 'Se a < 0, a concavidade é para baixo.' }
        ]
    },
    {
        id: 5,
        pergunta: 'Calcule o discriminante (Δ) da função f(x) = x² - 6x + 9.',
        alternativas: ['0', '36', '-36', '9'],
        correta: 0,
        resolucao: [
            { passo: 'Identifique os coeficientes a, b e c', cod: 'a=1, b=-6, c=9' },
            { passo: 'Use a fórmula de Bhaskara para o delta: Δ = b² - 4ac', cod: 'Δ = (-6)² - 4(1)(9)' },
            { passo: 'Calcule o resultado', cod: 'Δ = 36 - 36 = 0' }
        ]
    },
    {
        id: 6,
        pergunta: 'Quantas raízes reais a função f(x) = x² + x + 1 possui?',
        alternativas: ['Nenhuma', 'Uma', 'Duas', 'Três'],
        correta: 0,
        resolucao: [
            { passo: 'Calcule o discriminante (Δ)', cod: 'Δ = (1)² - 4(1)(1) \nΔ = 1 - 4 = -3' },
            { passo: 'Analise o valor de Δ', cod: 'Como Δ < 0, a equação não possui raízes reais.' }
        ]
    },
    {
        id: 7,
        pergunta: 'Dada f(x) = x² - 8x + 15, qual é o valor mínimo da função?',
        alternativas: ['-1', '1', '-16', '0'],
        correta: 0,
        resolucao: [
            { passo: 'O valor mínimo é o y do vértice. Calcule o x do vértice', cod: 'x_v = -(-8) / 2(1) = 4' },
            { passo: 'Substitua x_v na função para achar o y_v', cod: 'f(4) = (4)² - 8(4) + 15' },
            { passo: 'Calcule', cod: 'f(4) = 16 - 32 + 15 = -1' }
        ]
    },
    {
        id: 8,
        pergunta: 'Se as raízes de f(x) = x² + bx + c são 4 e -1, quais são os valores de b e c?',
        alternativas: ['b = -3, c = -4', 'b = 3, c = 4', 'b = -5, c = 4', 'b = 5, c = -4'],
        correta: 0,
        resolucao: [
            { passo: 'Use a soma das raízes: S = x1 + x2 = -b/a', cod: '4 + (-1) = 3 \nComo a=1, -b = 3 => b = -3' },
            { passo: 'Use o produto das raízes: P = x1 * x2 = c/a', cod: '4 * (-1) = -4 \nComo a=1, c = -4' }
        ]
    },
    {
        id: 9,
        pergunta: 'Qual é a equação do eixo de simetria da parábola f(x) = 3x² - 12x + 1?',
        alternativas: ['x = 2', 'x = -2', 'x = 4', 'x = -4'],
        correta: 0,
        resolucao: [
            { passo: 'O eixo de simetria é a reta vertical que passa pelo vértice, dada por x = -b/2a', cod: 'x = -(-12) / (2 * 3)' },
            { passo: 'Calcule a divisão', cod: 'x = 12 / 6 \nx = 2' }
        ]
    },
    {
        id: 10,
        pergunta: 'Em qual ponto a função f(x) = -2x² + 4x + 6 atinge o seu valor máximo?',
        alternativas: ['(1, 8)', '(1, -8)', '(-1, 8)', '(2, 6)'],
        correta: 0,
        resolucao: [
            { passo: 'O ponto de máximo é o vértice. Encontre o x_v', cod: 'x_v = -4 / (2 * -2) \nx_v = -4 / -4 = 1' },
            { passo: 'Encontre o y_v substituindo x = 1', cod: 'y_v = -2(1)² + 4(1) + 6 \ny_v = -2 + 4 + 6 = 8' },
            { passo: 'Ponto máximo', cod: '(1, 8)' }
        ]
    }
];

let perguntaAtualIndex = 0;
let pontuacaoTotal = 0;
let acertos = 0;
let erros = 0;
let timer;
let tempoRestante = 15;
let selecionadaIndex = null;
let historicoNavegacao = []; // Para o botão VOLTAR
let questaoRespondida = new Set(); // Para não ganhar ponto ao voltar
let questaoPulada = new Set(); // Para não ganhar ponto ao voltar

function iniciarQuiz() {
    const intro = document.getElementById('tela-intro');
    intro.style.animation = 'fadeOutIntro 0.8s ease forwards';
    setTimeout(() => {
        intro.classList.remove('ativa');
        mostrarTela('tela-lobby');
    }, 800);
}

function mostrarTela(id) {
    document.querySelectorAll('.tela').forEach(tela => {
        tela.classList.remove('ativa');
        tela.style.display = 'none';
    });
    const target = document.getElementById(id);
    target.classList.add('ativa');
    target.style.display = (id === 'tela-lobby' || id === 'tela-jogos' || id === 'tela-quiz' || id === 'tela-revisao') ? 'flex' : 'block';
}

function cliqueJogarAgora() {
    if (usuarioLogado) {
        mostrarTela('tela-jogos');
    } else {
        mostrarTela('tela-login');
    }
}

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    if (!username || !password) {
        alert('Por favor, informe usuário e senha.');
        return false;
    }
    usuarioAtual = usuarioCadastrado || username;
    senhaAtual = password;
    usuarioLogado = true;
    atualizarUsuarioUI();
    mostrarTela('tela-lobby');
    return false;
}

function selectUserType(button, type) {
    const parent = button.parentElement;
    parent.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    document.getElementById('reg-user-type').value = type;
}

function handleRegister(event) {
    event.preventDefault();
    const regUsername = document.getElementById('reg-username')?.value?.trim();
    const regEmail = document.getElementById('reg-email')?.value?.trim();
    const regPassword = document.getElementById('reg-password')?.value?.trim();
    const regConfirmPassword = document.getElementById('reg-confirm-password')?.value?.trim();

    if (!regUsername || !regEmail || !regPassword || !regConfirmPassword) {
        alert('Preencha todos os campos para cadastrar.');
        return false;
    }

    if (regPassword !== regConfirmPassword) {
        alert('As senhas não conferem.');
        return false;
    }

    // Conta criada -> login automático
    usuarioCadastrado = regUsername;
    usuarioAtual = regUsername;
    senhaAtual = regPassword;
    emailCadastrado = regEmail;
    usuarioLogado = true;
    atualizarUsuarioUI();

    mostrarTela('tela-lobby');
    return false;
}

function calcularPontosPorAcerto(tempo) {
    // Garante que seja SOMENTE 10, 20 ou 30.
    if (tempo >= 8) return 30;
    if (tempo >= 5) return 20;
    return 10;
}

function atualizarPontuacaoUI() {
    const scoreDisplays = document.querySelectorAll('.pontuacao-total-display');
    scoreDisplays.forEach((el) => {
        el.textContent = String(pontuacaoTotal);
    });
}

function atualizarUsuarioUI() {
    const lobbyUserInfo = document.getElementById('lobby-user-info');
    const lobbyAuthButtons = document.getElementById('lobby-auth-buttons');
    const gamesUserInfo = document.getElementById('games-user-info');
    const userNameEls = document.querySelectorAll('.user-nav-name');
    const userAvatarEls = document.querySelectorAll('.user-nav-avatar');

    userNameEls.forEach((el) => {
        el.textContent = usuarioAtual || 'Jogador';
    });

    userAvatarEls.forEach((el) => {
        el.src = iconePerfilUsuario;
    });

    if (lobbyUserInfo && lobbyAuthButtons) {
        if (usuarioLogado) {
            lobbyUserInfo.classList.remove('hidden');
            lobbyAuthButtons.classList.add('hidden');
        } else {
            lobbyUserInfo.classList.add('hidden');
            lobbyAuthButtons.classList.remove('hidden');
        }
    }

    if (gamesUserInfo) {
        if (usuarioLogado) {
            gamesUserInfo.classList.remove('hidden');
        } else {
            gamesUserInfo.classList.add('hidden');
        }
    }
}

function fecharTodosMenusUsuario() {
    document.querySelectorAll('.user-menu').forEach((menu) => {
        menu.classList.add('hidden');
    });
}

function toggleUserMenu(event, menuId) {
    event.stopPropagation();
    const targetMenu = document.getElementById(menuId);
    if (!targetMenu) return;

    const isOpen = !targetMenu.classList.contains('hidden');
    fecharTodosMenusUsuario();
    if (!isOpen) {
        targetMenu.classList.remove('hidden');
    }
}

function abrirConfiguracoes() {
    fecharTodosMenusUsuario();
    
    // Inicializar os dados na tela
    document.getElementById('config-username').value = usuarioAtual;
    document.getElementById('config-email').value = emailCadastrado;
    document.getElementById('config-phone').value = telefoneCadastrado;
    
    // Inicializar DOB se existir
    const dobInput = document.getElementById('config-dob');
    if (dobInput && dataNascimentoUsuario) {
        dobInput.value = dataNascimentoUsuario;
        setTimeout(atualizarStatusIdade, 100); // Delay para DOM update
    }
    
    // Inicializar gênero
    document.getElementById('config-gender').value = generoCadastrado;
    document.querySelectorAll('.gender-btn').forEach(btn => btn.classList.remove('active'));
    if (generoCadastrado) {
        document.querySelectorAll('.gender-btn').forEach(btn => {
            if (btn.innerText.toLowerCase().includes(generoCadastrado.toLowerCase().substring(0,3))) {
                btn.classList.add('active');
            }
        });
    }

    // Inicializar foto
    fotoTemporaria = null;
    document.getElementById('config-avatar-preview').src = iconePerfilUsuario;

    // Resetar campos de senha
    document.getElementById('config-password-confirm').value = '';
    document.getElementById('password-confirm-group').classList.add('hidden');

    mostrarTela('tela-configuracoes');
}

function fecharConfiguracoes() {
    mostrarTela('tela-lobby');
}

function checkNameChange() {
    const inputNome = document.getElementById('config-username').value.trim();
    const groupSenha = document.getElementById('password-confirm-group');
    
    // Mostra o campo de senha apenas se o nome for diferente do atual
    if (inputNome !== usuarioAtual && inputNome !== '') {
        groupSenha.classList.remove('hidden');
    } else {
        groupSenha.classList.add('hidden');
    }
}

function selectGender(btn, gender) {
    document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('config-gender').value = gender;
}

function previewAvatar(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            fotoTemporaria = e.target.result;
            document.getElementById('config-avatar-preview').src = fotoTemporaria;
        }
        reader.readAsDataURL(file);
    }
}

function salvarConfiguracoes() {
    const inputNome = document.getElementById('config-username').value.trim();
    const inputEmail = document.getElementById('config-email').value.trim();
    const inputPhone = document.getElementById('config-phone').value.trim();
    const dobInput = document.getElementById('config-dob');
    const hiddenAgeVerify = document.getElementById('config-age-verify');
    const inputGender = document.getElementById('config-gender').value;

    // Salvar DOB
    if (dobInput) {
        dataNascimentoUsuario = dobInput.value;
        idadeVerificada = (hiddenAgeVerify.value === 'true');
    }

    // Se o nome foi alterado, validar a senha
    if (inputNome !== usuarioAtual && inputNome !== '') {
        const senhaDigitada = document.getElementById('config-password-confirm').value;
        if (senhaDigitada !== senhaAtual) {
            alert('Senha incorreta! Não foi possível alterar o nome da conta.');
            return; // Impede o salvamento
        }
        usuarioAtual = inputNome;
    }

    // Aplicar as outras mudanças
    emailCadastrado = inputEmail;
    telefoneCadastrado = inputPhone;
    generoCadastrado = inputGender;

    if (fotoTemporaria) {
        iconePerfilUsuario = fotoTemporaria;
    }

    atualizarUsuarioUI();
    alert('Configurações salvas com sucesso!');
    fecharConfiguracoes();
}

function abrirModalSair() {
    fecharTodosMenusUsuario();
    const modal = document.getElementById('logout-confirm-overlay');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function fecharModalSair() {
    const modal = document.getElementById('logout-confirm-overlay');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function confirmarSairConta() {
    fecharModalSair();
    usuarioLogado = false;
    usuarioAtual = 'Jogador';
    fecharTodosMenusUsuario();
    atualizarUsuarioUI();
    mostrarTela('tela-lobby');
}

function showCongrats(pontos) {
    const overlay = document.getElementById('congrats-overlay');
    if (!overlay) return;

    const nameEl = document.getElementById('congrats-username');
    const pointsEl = document.getElementById('congrats-points');

    if (nameEl) nameEl.textContent = usuarioAtual || 'Jogador';
    if (pointsEl) pointsEl.textContent = String(pontos);

    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');

    // Auto-fecha, mas também tem botão "continuar"
    clearTimeout(showCongrats._t);
    showCongrats._t = setTimeout(() => {
        hideCongrats();
    }, 4000);
}

function hideCongrats() {
    const overlay = document.getElementById('congrats-overlay');
    if (!overlay) return;
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden', 'true');
}

function showFail() {
    const overlay = document.getElementById('fail-overlay');
    if (!overlay) return;

    const nameEl = document.getElementById('fail-username');
    const pointsEl = document.getElementById('fail-points');

    if (nameEl) nameEl.textContent = usuarioAtual || 'Jogador';
    if (pointsEl) pointsEl.textContent = '0';

    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');

    clearTimeout(showFail._t);
    showFail._t = setTimeout(() => {
        hideFail();
    }, 4000);
}

function hideFail() {
    const overlay = document.getElementById('fail-overlay');
    if (!overlay) return;
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden', 'true');
}

function irParaJogos(categoria) {
    if (categoria === 'portugues' || categoria === 'ciencias' || categoria === 'historia' || categoria === 'geografia') {
        alert('Recurso em breve!');
        return;
    }
    categoriaAtual = categoria;
    mostrarTela('tela-jogos');
}

function comecarJogo() {
    perguntaAtualIndex = 0;
    pontuacaoTotal = 0;
    acertos = 0;
    erros = 0;
    historicoNavegacao = [];
    tempoInicioQuiz = Date.now();
    tempoTotalQuizSegundos = 0;
    questaoRespondida = new Set();
    questaoPulada = new Set();
    respostasUsuario = new Array(perguntas.length).fill(null);
    atualizarPontuacaoUI();
    mostrarTela('tela-quiz');
    carregarPergunta();
}

function carregarPergunta() {
    clearInterval(timer);
    const pergunta = perguntas[perguntaAtualIndex];
    
    // Atualizar UI
    document.getElementById('pergunta-atual-num').textContent = perguntaAtualIndex + 1;
    document.getElementById('total-perguntas-num').textContent = perguntas.length;
    document.getElementById('texto-pergunta').textContent = pergunta.pergunta;
    document.getElementById('progress-bar-fill').style.width = `${((perguntaAtualIndex + 1) / perguntas.length) * 100}%`;
    
    // Limpar alternativas e botões
    const container = document.getElementById('alternativas-container');
    container.innerHTML = '';
    document.getElementById('btn-revelar').classList.add('hidden');
    document.getElementById('btn-proxima').classList.add('hidden');
    document.getElementById('btn-como-resolver').classList.add('hidden');
    
    selecionadaIndex = null;
    tempoRestante = 15;
    document.getElementById('temporizador').textContent = tempoRestante;

    // OBS: mensagens antes dos itens aparecerem
    const obsWait = document.getElementById('obs-wait');
    if (obsWait) obsWait.classList.remove('hidden');
    
    iniciarTimer();
}

function iniciarTimer() {
    timer = setInterval(() => {
        tempoRestante--;
        document.getElementById('temporizador').textContent = tempoRestante;
        
        // Aos 10 segundos, mostrar alternativas
        if (tempoRestante === 10) {
            mostrarAlternativas();
        }
        
        if (tempoRestante === 0) {
            clearInterval(timer);
            if (selecionadaIndex === null) {
                document.getElementById('btn-revelar').classList.remove('hidden');
            }
        }
    }, 1000);
}

function mostrarAlternativas() {
    const container = document.getElementById('alternativas-container');
    const pergunta = perguntas[perguntaAtualIndex];

    // Quando os itens aparecerem, o aviso deve sumir
    const obsWait = document.getElementById('obs-wait');
    if (obsWait) obsWait.classList.add('hidden');
    
    pergunta.alternativas.forEach((alt, index) => {
        const btn = document.createElement('button');
        btn.className = 'alternativa-btn';
        btn.innerHTML = `<div class="letra-circle">${String.fromCharCode(65 + index)}</div><span>${alt}</span>`;
        btn.onclick = () => selecionarAlternativa(index, btn);
        container.appendChild(btn);
    });
}

function selecionarAlternativa(index, btn) {
    if (document.getElementById('btn-proxima').classList.contains('hidden') === false) return; // Já respondeu
    
    selecionadaIndex = index;
    
    // UI feedback
    document.querySelectorAll('.alternativa-btn').forEach(b => b.classList.remove('selecionada'));
    btn.classList.add('selecionada');
    
    // Mostrar botão de revelar
    const btnReveal = document.getElementById('btn-revelar');
    btnReveal.classList.remove('hidden');
    btnReveal.classList.add('popIn');
}

function revelarRespostas() {
    clearInterval(timer);
    const pergunta = perguntas[perguntaAtualIndex];
    const btns = document.querySelectorAll('.alternativa-btn');
    
    btns.forEach((btn, index) => {
        if (index === pergunta.correta) {
            btn.classList.add('correta');
        } else {
            btn.classList.add('errada');
        }
    });
    
    document.getElementById('btn-revelar').classList.add('hidden');
    document.getElementById('btn-proxima').classList.remove('hidden');
    document.getElementById('btn-como-resolver').classList.remove('hidden');
    
    // Sistema de pontos
    if (!questaoRespondida.has(perguntaAtualIndex) && !questaoPulada.has(perguntaAtualIndex)) {
        // Guarda a resposta do usuário apenas na primeira revelação desta questão
        respostasUsuario[perguntaAtualIndex] = selecionadaIndex;

        if (selecionadaIndex === pergunta.correta) {
            const pontos = calcularPontosPorAcerto(tempoRestante);
            pontuacaoTotal += pontos;
            acertos++;
            showCongrats(pontos);
        } else {
            erros++;
            showFail();
        }
        questaoRespondida.add(perguntaAtualIndex);
        atualizarPontuacaoUI();
    }
}

function formatarTempoTotal(segundos) {
    const total = Math.max(0, Math.floor(segundos));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m} m ${s} s`;
}

function skipQuestion() {
    document.getElementById('skip-alert').classList.remove('hidden');
}

function closeSkipAlert() {
    document.getElementById('skip-alert').classList.add('hidden');
}

function confirmSkip() {
    questaoPulada.add(perguntaAtualIndex);
    closeSkipAlert();
    proximaPergunta();
}

function previousQuestion() {
    if (perguntaAtualIndex > 0) {
        perguntaAtualIndex--;
        carregarPergunta();
    }
}

function proximaPergunta() {
    perguntaAtualIndex++;
    if (perguntaAtualIndex < perguntas.length) {
        carregarPergunta();
    } else {
        finalizarQuiz();
    }
}

function mostrarRevisao() {
    const pergunta = perguntas[perguntaAtualIndex];
    document.getElementById('revision-question-id').textContent = `QUESTÃO ${pergunta.id}`;
    document.getElementById('revision-question-text').textContent = pergunta.pergunta;
    
    const userAns = selecionadaIndex !== null ? pergunta.alternativas[selecionadaIndex] : 'Não respondida';
    const correctAns = pergunta.alternativas[pergunta.correta];
    
    const userBox = document.getElementById('revision-user-answer');
    userBox.textContent = userAns;
    userBox.className = `answer-value ${selecionadaIndex === pergunta.correta ? 'right' : 'wrong'}`;
    
    document.getElementById('revision-correct-answer').textContent = correctAns;
    
    const stepsContainer = document.getElementById('revision-resolution-steps');
    stepsContainer.innerHTML = '';
    
    pergunta.resolucao.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step-item';
        stepDiv.innerHTML = `
            <div class="step-header">PASSO ${index + 1}: ${step.passo}</div>
            <div class="step-code">${step.cod.replace(/\n/g, '<br>')}</div>
        `;
        stepsContainer.appendChild(stepDiv);
    });
    
    mostrarTela('tela-revisao');
}

function finalizarQuiz() {
    // Tempo total do quiz (do clique em iniciar até terminar)
    if (tempoInicioQuiz) {
        tempoTotalQuizSegundos = Math.floor((Date.now() - tempoInicioQuiz) / 1000);
    }

    // Exibir nome e foto do usuário
    const userNameEl = document.getElementById('result-user-name');
    if (userNameEl) userNameEl.textContent = usuarioAtual || 'Jogador';

    const avatarImg = document.getElementById('result-avatar-img');
    const avatarIcon = document.getElementById('result-avatar-icon');
    if (avatarImg && avatarIcon) {
        if (iconePerfilUsuario && iconePerfilUsuario.startsWith('data:image')) {
            avatarImg.src = iconePerfilUsuario;
            avatarImg.style.display = 'block';
            avatarIcon.style.display = 'none';
        } else {
            avatarImg.style.display = 'none';
            avatarIcon.style.display = 'block';
        }
    }

    const desempenhoPercent = perguntas.length
        ? Math.round((acertos / perguntas.length) * 100)
        : 0;

    const pontuacaoEl = document.getElementById('pontuacao-total');
    if (pontuacaoEl) pontuacaoEl.textContent = pontuacaoTotal;

    const perfEl = document.getElementById('performance-percent');
    if (perfEl) perfEl.textContent = desempenhoPercent;

    const tempoEl = document.getElementById('tempo-total');
    if (tempoEl) tempoEl.textContent = formatarTempoTotal(tempoTotalQuizSegundos);

    mostrarTela('tela-final');
}

function refazerQuiz() {
    comecarJogo();
}

function mostrarEstatisticas() {
    const precisionPercent = perguntas.length
        ? Math.round((acertos / perguntas.length) * 100)
        : 0;

    const precisionEl = document.getElementById('precision-percent');
    if (precisionEl) precisionEl.textContent = precisionPercent;

    const acertosEl = document.getElementById('acertos-count');
    if (acertosEl) acertosEl.textContent = acertos;

    const errosEl = document.getElementById('erros-count');
    if (errosEl) errosEl.textContent = erros;

    const lista = document.getElementById('questoes-erradas');
    if (lista) {
        lista.innerHTML = '';

        const incluirQuestoes = perguntas
            .map((p, idx) => ({ p, idx }))
            .filter(({ idx, p }) => {
                const userSel = respostasUsuario[idx];
                const isCorrect = userSel === p.correta;
                const pulou = questaoPulada.has(idx);
                // Inclui se não acertou (inclui pulou/não respondida)
                return pulou || !isCorrect;
            });

        if (incluirQuestoes.length === 0) {
            lista.innerHTML = '<div class="stats-review-item">Nenhum erro encontrado.</div>';
        } else {
            incluirQuestoes.forEach(({ p, idx }) => {
                const userSel = respostasUsuario[idx];
                const pulou = questaoPulada.has(idx);
                const userAns = (userSel !== null && userSel !== undefined)
                    ? p.alternativas[userSel]
                    : (pulou ? 'Pulou' : 'Não respondida');
                const correctAns = p.alternativas[p.correta];

                const item = document.createElement('div');
                item.className = 'stats-review-item';

                const stepsHtml = p.resolucao.map((step, i) => {
                    const codHtml = String(step.cod).replace(/\n/g, '<br>');
                    return `
                        <div style="margin-bottom:10px;">
                            <div style="color:#00ff96;font-weight:1000;margin-bottom:6px;">
                                PASSO ${i + 1}: ${step.passo}
                            </div>
                            <div class="stats-review-steps" style="background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.08);padding:10px;border-radius:12px;">
                                ${codHtml}
                            </div>
                        </div>
                    `;
                }).join('');

                item.innerHTML = `
                    <div class="stats-review-qid">
                        <i class="fas fa-triangle-exclamation"></i>
                        QUESTÃO ${p.id}
                    </div>
                    <div class="stats-review-qtext">${p.pergunta}</div>
                    <div class="stats-review-row">
                        <div class="stats-answer-box wrong">
                            <div class="stats-answer-label">SUA RESPOSTA</div>
                            <div class="stats-answer-value">${userAns}</div>
                        </div>
                        <div class="stats-answer-box correct">
                            <div class="stats-answer-label">RESPOSTA CORRETA</div>
                            <div class="stats-answer-value">${correctAns}</div>
                        </div>
                    </div>
                    <div class="stats-review-steps" style="margin-top:12px;">
                        <div style="color:#ffd700;font-weight:1000;letter-spacing:1px;margin-bottom:10px;text-transform:uppercase;">
                            RESOLUÇÃO PASSO A PASSO
                        </div>
                        ${stepsHtml}
                    </div>
                `;

                lista.appendChild(item);
            });
        }
    }

    mostrarTela('tela-estatisticas');
}

function voltar(tela) {
    mostrarTela(tela);
}

function voltarParaJogos() {
    clearInterval(timer);
    mostrarTela('tela-jogos');
}
