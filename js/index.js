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

//faz referencia ao elemento do botão para inicar o jogo
const btnInicar = document.getElementById("btn-iniciar-quiz");

//faz referencia a tela de inicio do quiz
const telaInicial = document.getElementById("tela-boas-vindas");

//faz referencia a tela de Grupos
const telaGrupo = document.getElementById("tela-grupo");

// Faz referência ao input onde será digitado o nome do grupo
const inputNomeGrupo = document.getElementById("input-nome-grupo");

// Faz referência ao botão que confirma o grupo
const btnConfirmarGrupo = document.getElementById("btn-confirmar-grupo");

// Faz referência à mensagem de erro
const erroGrupo = document.getElementById("erro-grupo");

// Faz referência ao título da tela de grupo
const tituloGrupo = document.getElementById("titulo-grupo");

// Faz referência à descrição da tela de grupo
const descricaoGrupo = document.getElementById("descricao-grupo");

// Mostra o nome do grupo durante o quiz
const nomeGrupoAtual = document.getElementById("nome-grupo-atual");

// Mostra o nome do grupo dentro do modal de eliminação
const grupoEliminado = document.getElementById("grupo-eliminado");

// Guarda o nome do grupo que está jogando atualmente
let grupoAtual;

// Informa se o JSON do quiz já foi carregado
let quizCarregado = false;

// Informa se estamos trocando de grupo
let trocandoGrupo = false;

let grupos = [];

btnInicar.addEventListener("click", () => {
  //pagina inicial some
  telaInicial.classList.add("d-none");
  //tela do grupo aparece
  telaGrupo.classList.remove("d-none");
  // coloca o cursor automaticamente no campo
  inputNomeGrupo.focus();
})

//função ao clicar no botão do modal fazendo ele sumir 
btnModalEsgotado.addEventListener("click", () => {
  modalEsgotado.classList.add("d-none");
  if (indiceAtual < dadosQuiz.length - 1){
    indiceAtual++
    solicitarNovoGrupo();
  } else {
    finalizarQuiz();
  }
});

btnConfirmarGrupo.addEventListener("click", () => {
  //pega o nome digitado e remove espaços do começo e do final com o trim
  const nomeDigitado = inputNomeGrupo.value.trim();

  // Verifica se o campo está vazio
  if (nomeDigitado === "" || nomeDigitado === null) {
   // Mostra mensagem de erro
    erroGrupo.classList.remove("d-none");
    //exibe a mensagem
    erroGrupo.innerHTML = "Informe o nome do grupo que começará o desafio."
    // Interrompe a função
    return;
  }

  // se o nome for válido esconde a mensagem de erro
  erroGrupo.classList.add("d-none");

  const novoGrupo = {
    nome: nomeDigitado,
    erros: 0,
    acertos: 0
  }

  grupos.push(novoGrupo)

  // Guarda o nome do grupo
  grupoAtual = novoGrupo;

  // Mostra o grupo atual durante o quiz
  nomeGrupoAtual.innerText = `Grupo atual jogando: ${grupoAtual.nome}`; 
  // Limpa o campo
  inputNomeGrupo.value = "";

  // Esconde a tela dos grupos
  telaGrupo.classList.add("d-none");
  // Mostra a tela da pergunta
  telaPergunta.classList.remove("d-none");

  // Verifica se é a primeira vez que o jogo inicia
  if (!quizCarregado) {
    // Marca que o quiz já foi carregado
    quizCarregado = true;
    // Busca o JSON e mostra a primeira pergunta
    carregarQuiz();
  } else {
    // Se o quiz já existe,
    // significa que aconteceu uma troca de grupo
    exibirPergunta();
  }
  // Finaliza o estado de troca
  trocandoGrupo = false;
});

inputNomeGrupo.addEventListener("keydown", (event) => {
  // Verifica se a tecla pressionada foi Enter
  if (event.key === "Enter") {
    // Executa o botão
    btnConfirmarGrupo.click();
  }
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
  const botoes = document.querySelectorAll(".button-awnser");
  
  // Verifica se o id da resposta clicada não é "correta"
  if (id_pergunta !== "correta") {
    // Adiciona a classe blocked para alterar o estilo do botão com erro
    botao.classList.remove("button-awnser");
    botao.classList.add("button-awnser-blocked");
    // Desativa o botão clicado para não permitir novos cliques nele
    botao.disabled = true;
    
    // Incrementa a contagem de erros
    errosPerguntaAtual++;
    grupoAtual.erros++;
    
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
      erros.push(response_question);
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
  grupoAtual.acertos++;

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


function solicitarNovoGrupo() {
  // realizando uma troca de grupo
  trocandoGrupo = true;
  // Esconde a tela da pergunta
  telaPergunta.classList.add("d-none");
  // Muda o conteúdo da tela de grupos
  tituloGrupo.innerText = "Vez do próximo grupo!";
  // Explica por que houve a troca
  descricaoGrupo.innerText = `O grupo "${grupoAtual.nome}" utilizou as duas tentativas. Informe o nome do próximo grupo.`;
  // Muda o texto do botão
  btnConfirmarGrupo.innerText = "Continuar desafio";
  // Exibe novamente a tela de grupos
  telaGrupo.classList.remove("d-none");
  // Coloca o cursor automaticamente no input
  inputNomeGrupo.focus();
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

  // Ordena os grupos pela quantidade de acertos (do maior para o menor)
  const gruposRanqueados = grupos.sort((a, b) => b.acertos - a.acertos);

  // Cria o Cabeçalho da tela (Apenas uma vez)
  telaSucesso.innerHTML = `
    <div class="sucesso-header">
      <i class="fa-solid fa-trophy trofeu-principal"></i>
      <h1 class="titulo-geral">Quiz Finalizado!</h1>
      <p class="subtitulo-geral">Confira o ranking final dos grupos</p>
      </div>
    <div class="container-resultados"></div>
    `;

    // Seleciona a div onde os cards dos grupos vão entrar
  const containerResultados = telaSucesso.querySelector('.container-resultados');
  
  setTimeout(() =>{
  // Cria um card para cada grupo
  gruposRanqueados.forEach((grupo, index) => {

    // Define a classe baseada na posição (index começa em 0)
    let classeRanking = "";
    if (index === 0) {
        classeRanking = "primeiro-lugar";
    } else if (index === 1) {
        classeRanking = "segundo-lugar";
    } else if (index === 2) {
        classeRanking = "terceiro-lugar";
    } else {
        classeRanking = "demais-posicoes";
    }

    containerResultados.innerHTML += `
    <div class="caixa-resultado ${classeRanking}"> 
      <div class="posicao-ranking">#${index + 1}</div>
      <h2 class="nome-grupo">${grupo.nome}</h2>
      
      <div class="status-grupo">
        <div class="status acertos">
          <span class="numero">${grupo.acertos}</span>
          <span class="legenda">Acertos</span>
        </div>
        <div class="status erros">
          <span class="numero">${grupo.erros}</span>
          <span class="legenda">Erros</span>
        </div>
      </div>
    </div>
    `;
  });
    confetti();
  }, 1000)
}

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