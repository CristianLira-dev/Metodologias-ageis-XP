// Seleciona o elemento no HTML onde o texto da pergunta vai aparecer
const perguntaCard = document.getElementById("text-question");

// Seleciona o contêiner dos botões onde as alternativas serão inseridas
const containerAlternativas = document.getElementById("container-alternativas");

// Seleciona o contêiner principal da tela de perguntas
const telaPergunta = document.getElementById("tela-pergunta");

// Seleciona o contêiner da tela final de sucesso/conclusão
const telaSucesso = document.getElementById("tela-sucesso");

// Cria uma lista vazia para registrar as respostas que o usuário acertou
let acertos = [];

// Cria uma lista vazia para registrar as respostas que o usuário errou
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

//função ao clicar no botão do modal fazendo ele sumir 
btnModalEsgotado.addEventListener("click", () => {
  modalEsgotado.classList.add("d-none");
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
  // Verifica se o id da resposta clicada não é "correta"
  if (id_pergunta !== "correta") {
    // Adiciona a classe blocked para alterar o estilo do botão com erro
    botao.classList.remove("button-awnser")
    botao.classList.add("button-awnser-blocked");
    // Desativa o botão clicado para não permitir novos cliques nele
    botao.disabled = true;
    // Incrementa a contagem de tentativas erradas da pergunta em andamento
    errosPerguntaAtual++;
    erros.push(response_question);

    // --- ADICIONA AS ANIMAÇÕES SEPARADAS ---
    // Faz a tag <main> tremer
    mainContent.classList.add("animacao-tremer");
    // Faz o fundo da tag <body> ficar vermelho
    document.body.classList.add("animacao-fundo-erro");

    // Remove as duas classes após 2 segundos (2000 milissegundos)
    setTimeout(() => {
      mainContent.classList.remove("animacao-tremer");
      document.body.classList.remove("animacao-fundo-erro");
    }, 2000);
    // ---------------------------------------

    // Verifica se o usuário atingiu o limite de 2 erros na mesma questão
    if (errosPerguntaAtual === 2) {
      // Salva a resposta incorreta na lista geral de erros
      erros.push(response_question);
      modalEsgotado.classList.remove("d-none")
      setTimeout( () => {
        // Avança o quiz para a próxima pergunta
        avancarProximaPergunta();
      }, 1500);
    }
    // Interrompe a execução para não cair no bloco de resposta correta
    return;
  }

  // Se chegou aqui, a resposta foi correta; adiciona o texto à lista de acertos
  acertos.push(response_question);
  // Faz o fundo da tag <body> ficar vermelho
  document.body.classList.add("animacao-fundo-acerto");

  // Remove a classe depois que a animação terminar
setTimeout(() => {
  document.body.classList.remove("animacao-fundo-acerto");
}, 2000);


    confetti();
botao.disabled = true;
   setTimeout( () => {
        // Avança o quiz para a próxima pergunta
        avancarProximaPergunta();
      }, 2000);
}


// Função responsável pelo fluxo de avançar a pergunta ou finalizar o quiz
function avancarProximaPergunta() {
  // Avança o contador do índice para a próxima pergunta da fila
  indiceAtual++;

  // Verifica se o índice ainda é menor que a quantidade total de perguntas no JSON
  if (indiceAtual < dadosQuiz.length) {
    // Renderiza a próxima questão na tela
    exibirPergunta();
  } else {
    // Se acabaram as perguntas, chama a tela final de resultados
    finalizarQuiz();
  }
}

// Função executada quando todas as perguntas do quiz forem respondidas
function finalizarQuiz() {
  // Oculta o contêiner da tela de perguntas
  telaPergunta.style.display = "none";
  // Torna visível o contêiner da tela final de sucesso
  telaSucesso.style.display = "block";

  // Obtém o total de questões disponíveis no arquivo JSON
  const totalQuestoes = dadosQuiz.length;
  // Calcula a taxa percentual de acertos em relação ao total
  const taxaAcerto = acertos.length / totalQuestoes;
  // Calcula uma estimativa lúdica de QI baseada na taxa de acertos (entre 80 e 130)
  const iqEstimado = Math.round(80 + taxaAcerto * 50);

  // Constrói e injeta o resumo final diretamente no HTML da tela de sucesso
  telaSucesso.innerHTML = `
  <div class="caixa-resultado"> 
    <h2 id="titulo-sucesso">Quiz Finalizado!</h2>
    <p class="texto-acertos"><strong>Total de perguntas:</strong> ${totalQuestoes}</p>
    <p class="texto-acertos"><strong>Acertos:</strong> ${acertos.length}</p>
    <p class="texto-acertos"><strong>Erros:</strong> ${erros.length}</p>
    <p class="texto-acertos"><strong>Estimativa de QI:</strong> ${iqEstimado}</p>
  </div>
  `;
}

// Dispara a busca dos dados e inicia o quiz assim que a página é carregada
carregarQuiz();

/* 
 * ESTRUTURA DE CADA PÁGINA (FLUXO DO JOGO)
 *
 * Página da Pergunta (Principal)
 * - Texto da pergunta em destaque.
 * - 4 botões com as alternativas (que serão embaralhadas pelo sistema).
 * caso erre deixe desabilitado a questões retando 3, caso erre mostre o erro e pule para a proxima pergunta
 * caso acerte mostre uma mensagem de sucesso e passe para a proxima pergunta, caso seja a ultima pergunta mostre a tela de sucesso
 * caso seja a ultima pergunta mostre a tela de sucesso com a quantidade de acertos, e erros e uma estimaiva media de IQ na brincadeira
 * 
*/