// Seleciona o elemento no HTML onde o texto da pergunta vai aparecer
const perguntaCard = document.getElementById("text-question");

// Seleciona o contêiner dos botões
const containerAlternativas = document.getElementById("container-alternativas");

//seleciona o container da tela de pergunta
const telaPergunta = document.getElementById("tela-pergunta");

//seleciona o container da tela de erro
const telaErro = document.getElementById("tela-erro");

//seleciona o container da tela de sucesso
const telaSucesso = document.getElementById("tela-sucesso");

// Cria listas (arrays) vazias para registrar as perguntas que o usuário acertou e errou
let acertos = [];
let erros = [];

//Pegar a pergunta atual (ex: índice 0 para a primeira pergunta)
let indiceAtual = 0;

async function carregarQuiz() {
  try {
    const resposta = await fetch('./data/quiz.json'); // faz a busca das perguntas
    const dados = await resposta.json(); // "dados" agora é o seu array completo

    //coleta o titulo e alternativas da pergunta atual
    const perguntaAtiva = dados[indiceAtual];
    
    //Extrair o array de respostas dessa pergunta
    let alternativas = perguntaAtiva.respostas;

    //Embaralhar as alternativas
    alternativas.sort(() => Math.random() - 0.5);

    //Mostra titulo da pergunta ativa
    perguntaCard.innerHTML = perguntaAtiva.pergunta

// Limpa o contêiner caso já tenha botões de perguntas anteriores
    containerAlternativas.innerHTML = "";

    //separar os botõs em grupos de 2 blocos
    let divGrupo; 

    // Percorre a lista das 4 alternativas para criar os botões e grupos
    alternativas.forEach((alternativa, index) => {
      
      // A cada 2 botões (índice 0 e 2), cria uma nova div para agrupá-los
      if (index % 2 === 0) {
        
        divGrupo = document.createElement("div");//cria a div do grupo no html
        divGrupo.classList.add("grupo-botoes");//adiciona a classe ao grupo
        containerAlternativas.appendChild(divGrupo);//adiciona o grupo dentro da div container
      }

      // Cria a tag button
      const botao = document.createElement("button");
      
      //adiciona o id ao button no html referente ao json
      botao.id = alternativa.id; 
      botao.innerText = alternativa.texto; //coloca o texto da resposta dentro do botão
      botao.classList.add("button-awnser"); //adiciona a classe no botão para estilização

      // Adiciona o evento de clique que chama sua função de validação
      botao.addEventListener("click", () => {
        validar_resposta(alternativa.texto, alternativa.id); //aciona a ação passando os parámetros necessários
      });
      // Insere o botão na div de grupo atual
      divGrupo.appendChild(botao);
    });

  } catch (error) { //caso ocorra um erro na busca dos dados
    console.error("Erro ao carregar o JSON:", error); 
  }
}

// ao clicar na resposta acionará essa função
function validar_resposta (response_question, id_pergunta){ //parametros que será recebido ao clicar no button escolhido
    if (id_pergunta != "correta"){ //verifica se o id da pergunta é diferente de "correta"
        alert("errou") //avisso de erro trocar para modal futuramente..
        erros.push(response_question) //adicionar o a resposta a lista de erros
        telaPergunta.style.display = "none"; //oculta a tela com a pergunta atual
        telaErro.style.display = "block"; //mostra a div da tela de erro simulando a navegação
        return; //cancela a função para que o bloco abaixo não execute 
    } 
    acertos.push(response_question) //adiciona a resposta a lista de acertos
    alert("Acertou") //aviso de acerto (trocar para modal depois...)
    telaPergunta.style.display = "none"; //oculta a tela com a pergunta atual
    telaSucesso.style.display = "block"; //mostra a div da tela de sucesso simulando a navegação
}

carregarQuiz(); //carregar quiz ao entrar no site

/* 
 * ESTRUTURA DE CADA PÁGINA (FLUXO DO JOGO)
 *
 * Página da Pergunta (Principal)
 * - Texto da pergunta em destaque.
 * - 4 botões com as alternativas (que serão embaralhadas pelo sistema).
 *
 * Página de Sucesso
 * - Mensagem de acerto (ex: "Você acertou!").
 * - Botão "Próxima Pergunta" (para avançar no quiz).
 *
 * Página de Erro
 * - Mensagem indicando que o usuário errou.
 * - Botão "Responder Novamente" (volta para a mesma perguntas).
 * - Botão "Ver Resposta Correta" (mostra qual era a opção certa).
 * - Botão "Pular Pergunta" (ignora o erro e avança para a próxima).
 */