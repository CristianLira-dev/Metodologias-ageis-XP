// Seleciona o elemento no HTML onde o texto da pergunta vai aparecer
const perguntaCard = document.getElementById("text-question");

// Seleciona os 4 botões de alternativas do HTML para configurar os cliques depois
const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");
const button3 = document.getElementById("button3");
const button4 = document.getElementById("button4");

// Cria listas (arrays) vazias para registrar as perguntas que o usuário acertou e errou
let acertos = [];
let erros = [];

async function carregarQuiz() {
  try {
    const resposta = await fetch('./data/quiz.json'); // faz a busca das perguntas
    const dados = await resposta.json(); // "dados" agora é o seu array completo

    //Pegar a pergunta atual (ex: índice 0 para a primeira pergunta)
    let indiceAtual = 0;
    //coleta o titulo e alternativas da pergunta atual
    const perguntaAtiva = dados[indiceAtual];
    
    //Extrair o array de respostas dessa pergunta
    let alternativas = perguntaAtiva.respostas;

    //Embaralhar as alternativas
    alternativas.sort(() => Math.random() - 0.5);

    //Mostra titulo da pergunta ativa
    perguntaCard.innerHTML = perguntaAtiva.pergunta

    // percorre a lista das 4 alternativas para colocar em cada botão
    alternativas.forEach(alternativa => {
      //adicionar perguntas aos botões
    });

  } catch (error) {
    console.error("Erro ao carregar o JSON:", error); // caso ocorra erro na hora de buscar os dados
  }
}

// ao clicar na resposta acionará essa função
function validar_resposta (response_question, id_pergunta){ //parametros que será recebido ao clicar no button escolhido
    if (id_pergunta != "correta"){ //verifica se o id da pergunta é diferente de "correta"
        alert("errou") /
        erros.push(response_question) //adicionar o a resposta a lista de erros
        window.location = "error.html" //redireciona o usuario para a pagina de erro
        return; //cancela a função para que o bloco abaixo não execute 
    } 
    acertos.push(response_question) //adiciona a resposta a lista de acertos
    alert("Acertou") //aviso de acerto (trocar para modal depois...)
    window.location = "success.html" //redireciona o usuario para pagina de acerto

}

carregarQuiz(); //carregar quiz ao entrar no site