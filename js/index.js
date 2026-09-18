// Seleciona o elemento no HTML onde o texto da pergunta vai aparecer
const perguntaCard = document.getElementById("text-question");

// Seleciona o contêiner dos botões onde as alternativas serão inseridas
const containerAlternativas = document.getElementById("container-alternativas");

// Seleciona o contêiner principal da tela de perguntas
const telaPergunta = document.getElementById("tela-pergunta");

// Seleciona o contêiner da tela final de sucesso/conclusão
const telaSucesso = document.getElementById("tela-sucesso");

// Registra apenas as respostas corretas da tentativa atual
let acertos = [];

// Registra cada resposta errada da tentativa atual
let erros = [];

// Armazena a contagem de erros ocorridos apenas na pergunta atual
let errosPerguntaAtual = 0;

// Variável que guarda todo o array de perguntas vindo do arquivo JSON
let dadosQuiz = [];

// Índice da pergunta atual exibida na tela (começa em 0 para a primeira questão)
let indiceAtual = 0;

// Seleciona a tag main (que tem a classe .content no seu HTML)
const mainContent = document.querySelector(".content");

// Fazer referencial ao elemento HMTL modal
const modalEsgotado = document.getElementById("modal-esgotado");

//faz referencia ao button dentro do modal para fazer a função de fecha-lo
const btnModalEsgotado = document.getElementById("btn-modal-esgotado");

//faz referencia ao elemento do botão para inicar o jogo
const btnIniciar = document.getElementById("btn-iniciar-quiz");

//faz referencia a tela de inicio do quiz
const telaInicial = document.getElementById("tela-boas-vindas");

btnIniciar.addEventListener("click", () => {
  // Inicia uma tentativa com os contadores e a sequência de perguntas zerados
  acertos = [];
  erros = [];
  errosPerguntaAtual = 0;
  indiceAtual = 0;

  // Abre diretamente a primeira pergunta do quiz
  telaInicial.classList.add("d-none");
  telaPergunta.classList.remove("d-none");
  carregarQuiz();
});

// Fecha o aviso e continua a tentativa, mesmo após esgotar as chances da questão
btnModalEsgotado.addEventListener("click", () => {
  // Evita avançar mais de uma pergunta por cliques repetidos no aviso
  if (modalEsgotado.classList.contains("d-none")) {
    return;
  }

  modalEsgotado.classList.add("d-none");
  avancarProximaPergunta();
});

// Função assíncrona responsável por baixar os dados do quiz
async function carregarQuiz() {
  // Bloco try para capturar eventuais falhas de conexão ou leitura do arquivo
  try {
    // Faz a requisição para buscar o arquivo quiz.json
    const resposta = await fetch('./data/quiz.json');
    // Converte a resposta recebida para o formato de objeto/array JavaScript
    dadosQuiz = await resposta.json();
    // Chama a função para desenhar a primeira pergunta na tela
    exibirPergunta();
  } catch (error) {
    // Exibe no console uma mensagem caso ocorra erro ao carregar o arquivo
    console.error("Erro ao carregar o JSON:", error);
  }
}

// Função responsável por renderizar a pergunta atual na tela
function exibirPergunta() {
  // Zera o contador de erros locais para iniciar a nova pergunta
  errosPerguntaAtual = 0;

  // Pega o objeto da pergunta correspondente ao índice atual
  const perguntaAtiva = dadosQuiz[indiceAtual];

  // Cria uma cópia da lista de alternativas dessa pergunta
  let alternativas = [...perguntaAtiva.respostas];

  // Embaralha a ordem das alternativas aleatoriamente
  alternativas.sort(() => Math.random() - 0.5);

  // Insere o texto da pergunta no elemento HTML designado
  perguntaCard.innerText = perguntaAtiva.pergunta;

  // Limpa o contêiner removendo botões de perguntas anteriores
  containerAlternativas.innerHTML = "";

  // Variável que guardará a div de agrupamento dos botões (2 em 2)
  let divGrupo;

  // Percorre todas as alternativas embaralhadas para criar os elementos visuais
  alternativas.forEach((alternativa, index) => {
    // Cria uma nova div agrupadora a cada 2 alternativas (índices 0 e 2)
    if (index % 2 === 0) {
      // Cria o elemento div no documento
      divGrupo = document.createElement("div");
      // Adiciona a classe CSS para estilização do grupo
      divGrupo.classList.add("grupo-botoes");
      // Insere o grupo recém-criado dentro do contêiner principal
      containerAlternativas.appendChild(divGrupo);
    }

    // Cria a tag button correspondente à alternativa
    const botao = document.createElement("button");
    // Define o atributo id do botão com o id vindo do JSON (ex: "correta")
    botao.id = alternativa.id;
    // Define o texto que aparecerá escrito dentro do botão
    botao.innerText = alternativa.texto;
    // Adiciona a classe CSS para o estilo visual padrão do botão
    botao.classList.add("button-awnser");

    // Adiciona o evento de clique que dispara a validação da resposta
    botao.addEventListener("click", () => {
      // Chama a função de validação enviando texto, id e o próprio elemento do botão
      validar_resposta(alternativa.texto, alternativa.id, botao);
    });

    // Insere o botão criado dentro da div do grupo atual
    divGrupo.appendChild(botao);
  });
}
// Função acionada ao clicar em qualquer uma das alternativas
function validar_resposta(response_question, id_pergunta, botao) {
  // Uma alternativa desativada não pode alterar o resultado novamente
  if (botao.disabled) {
    return;
  }

  const botoes = document.querySelectorAll(".button-awnser");
  
  // Verifica se o id da resposta clicada não é "correta"
  if (id_pergunta !== "correta") {
    // Adiciona a classe blocked para alterar o estilo do botão com erro
    botao.classList.remove("button-awnser");
    botao.classList.add("button-awnser-blocked");
    // Desativa o botão clicado para não permitir novos cliques nele
    botao.disabled = true;
    
    // Conta cada resposta errada, mesmo que a questão seja acertada depois
    errosPerguntaAtual++;
    erros.push(response_question);
    
    // --- ADICIONA AS ANIMAÇÕES DE ERRO ---
    mainContent.classList.add("animacao-tremer");
    document.body.classList.add("animacao-fundo-erro");

    // Remove as duas classes após 2 segundos
    setTimeout(() => {
      mainContent.classList.remove("animacao-tremer");
      document.body.classList.remove("animacao-fundo-erro");
    }, 2000);

    // Verifica se o usuário atingiu o limite de 2 erros na mesma questão
    if (errosPerguntaAtual === 2) {
      btnModalEsgotado.innerText = indiceAtual < dadosQuiz.length - 1
        ? "Próxima pergunta"
        : "Ver resultado";
      modalEsgotado.classList.remove("d-none");
      
      // Desativa todos os outros botões
      botoes.forEach((b) => {
        b.disabled = true;
      });
    }
    return; // Interrompe a execução aqui se errou
  }

  // ==========================================
  // SE CHEGOU AQUI, A RESPOSTA FOI CORRETA!
  // ==========================================
  
  acertos.push(response_question);

  //Muda a cor do botão que o usuário clicou para indicar o acerto!
  botao.classList.remove("button-awnser");
  botao.classList.add("button-awnser-correct");

  // Faz o fundo da tag <body> ficar verde (animacao-fundo-acerto)
  document.body.classList.add("animacao-fundo-acerto");

  // Remove a classe do fundo depois que a animação terminar
  setTimeout(() => {
    document.body.classList.remove("animacao-fundo-acerto");
  }, 2000);

  // dispara os confetes
  confetti();

  // Desabilita todos os botões para o usuário não clicar duas vezes
  botoes.forEach((b) => {
    b.disabled = true;
  });
  
  // Aguarda 2 segundos (para o usuário ver o confete e a cor verde) e avança
  setTimeout( () => {
    avancarProximaPergunta();
  }, 2000);
}


// Função responsável pelo fluxo de avançar a pergunta ou finalizar o quiz
function avancarProximaPergunta() {
  // 1. Inicia a animação de saída (a pergunta atual desliza e some)
  mainContent.classList.add("esconder-pergunta");

  // 2. Espera 400 milissegundos (o tempo exato da animação no CSS)
  setTimeout(() => {
    
    // Avança o contador do índice para a próxima pergunta da fila
    indiceAtual++;

    // Verifica se o índice ainda é menor que a quantidade total de perguntas no JSON
    if (indiceAtual < dadosQuiz.length) {
      // Renderiza a próxima questão na tela (ainda invisível)
      exibirPergunta();
      
      // Remove a animação de saída e aplica a de entrada (nova pergunta surge)
      mainContent.classList.remove("esconder-pergunta");
      mainContent.classList.add("mostrar-pergunta");

      // Limpa a animação de entrada após 400ms para ficar pronto para a próxima
      setTimeout(() => {
        mainContent.classList.remove("mostrar-pergunta");
      }, 400);

    } else {
      // Limpa a animação para não bugar a tela final
      mainContent.classList.remove("esconder-pergunta");
      
      // Se acabaram as perguntas, chama a tela final de resultados
      finalizarQuiz();
    }
    
  }, 400); // Fim do setTimeout principal
}

// Função executada quando todas as perguntas do quiz forem respondidas
function finalizarQuiz() {
  // Oculta o contêiner da tela de perguntas
  telaPergunta.style.display = "none";
  // Torna visível o contêiner da tela final de sucesso
  telaSucesso.style.display = "block";

  // Exibe somente os totais de acertos e erros desta tentativa
  telaSucesso.innerHTML = `
    <div class="sucesso-header">
      <i class="fa-solid fa-trophy trofeu-principal"></i>
      <h1 class="titulo-geral">Quiz Finalizado!</h1>
      <p class="subtitulo-geral">Resultado da tentativa atual</p>
    </div>
    <div class="container-resultados">
      <div class="caixa-resultado">
        <div class="status-tentativa">
          <div class="status acertos">
            <span class="numero">${acertos.length}</span>
            <span class="legenda">Acertos</span>
          </div>
          <div class="status erros">
            <span class="numero">${erros.length}</span>
            <span class="legenda">Erros</span>
          </div>
        </div>
      </div>
    </div>
  `;

  confetti();
}
