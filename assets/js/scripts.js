function start() { // Inicio da função start()

    const fundoGame = $("#fundoGame");

    $("#inicio").hide();

    fundoGame.append("<div id='jogador' class='animaJogador'></div>");
    fundoGame.append("<div id='inimigo1' class='animaInimigo1'></div>");
    fundoGame.append("<div id='inimigo2'></div>");
    fundoGame.append("<div id='amigo' class='animaAmigo'></div>");
    fundoGame.append("<div id='placar'></div>");
    fundoGame.append("<div id='energia'></div>");


    //Principais variáveis do jogo
    var jogoFinalizado = false;
    var velocidade = 5;
    var posicaoY = parseInt(Math.random() * 340);
    var jogo = {}; // Variável que salva as informações referente ao pressionamento das teclas
    const TECLA = {
        W: 87,
        S: 83,
        D: 68
    }
    var podeAtirar = true;

    var pontos = 0;
    var amigosSalvos = 0;
    var amigosPerdidos = 0;
    var energiaAtual = 3;

    var somDisparo = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var musica = document.getElementById("musica");
    var somGameover = document.getElementById("somGameover");
    var somPerdido = document.getElementById("somPerdido");
    var somResgate = document.getElementById("somResgate");

    const jogador = $("#jogador");
    const inimigo1 = $("#inimigo1");
    const placar = $("#placar");

    jogo.pressionou = [];

    // Verificando se o usuário pressionou alguma tecla
    $(document).keydown(function (e) {
        // Define true se a tecla for pressionada
        jogo.pressionou[e.which] = true;
    });
    $(document).keyup(function (e) {
        // Define false se a tecla for soltada
        jogo.pressionou[e.which] = false;
    });

    //Game Loop
    //Indica que a função loop deve ser executada constantemente a cada 30 ms
    jogo.timer = setInterval(loop, 30);


    function loop() {
        // Função responsável por executar um loop infinito para o funcionamento do jogo
        moverFundo();
        executarAcaoJogador();
        moverInimigo1();
        moverInimigo2();
        moverAmigo();
        colidir();
        exibirPlacar();
        energia();

        // Música em loop
        if (jogoFinalizado == false) {
            musica.addEventListener("ended", function () { musica.currentTime = 0; musica.play() }, false);
            musica.play();
        }
    }

    function moverFundo() {
        // Função responsável por movimentar o fundo do jogo
        esquerda = parseInt(fundoGame.css("background-position"));
        fundoGame.css("background-position", esquerda - 1);
    }

    function executarAcaoJogador() {
        // Função responsável por verificar se foi pressionada uma tecla que move o jogador

        if (jogo.pressionou[TECLA.W]) {
            // Verifica se a Tecla W está sendo pressionada e sobe a imagem do jogador se true
            var topo = parseInt(jogador.css("top"));
            if (topo >= 10) {
                jogador.css("top", topo - 10);
            } else {
                jogador.css("top", 0);
            }

        }
        if (jogo.pressionou[TECLA.S]) {
            // Verifica se a Tecla S está sendo pressionada e desce a imagem do jogador se true
            var topo = parseInt(jogador.css("top"));
            if (topo <= 430) {
                jogador.css("top", topo + 10);
            } else {
                jogador.css("top", 440);
            }
        }
        if (jogo.pressionou[TECLA.D]) {
            // Chama a função Disparo se a Tecla D for pressionada
            disparar();
        }
    }

    function reposicionarInimigo1() {
        // Reposiciona o inimigo 1 helicóptero para a posição inicial

        if (jogoFinalizado == false) {
            posicaoY = parseInt(Math.random() * 340);
            inimigo1.css("left", 694);
            inimigo1.css("top", posicaoY);
        }
    }

    function reposicionarInimigo2() {

        $("#inimigo2").remove();
        var tempoColisao4 = window.setInterval(function () {
            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;

            if (jogoFinalizado == false) {
                fundoGame.append("<div id='inimigo2'></div");
            }
        }, 5000);
        // 
    }

    function moverInimigo1() {
        // Função responsável por mover o helicóptero inimigo
        posicaoX = parseInt(inimigo1.css("left"));
        inimigo1.css("left", posicaoX - velocidade);
        inimigo1.css("top", posicaoY);

        if (posicaoX <= -250) {
            reposicionarInimigo1();
            pontos -= 50;
        }
    }

    function moverInimigo2() {
        // Função responsável por movimentar o inimigo 2, caminhão
        posicaoX = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left", posicaoX - 3);

        if (posicaoX <= -50) {
            reposicionarInimigo2();
            pontos -= 25;
        }
    }

    function reposicionarAmigo() {
        // Reposiciona o personagem amigo para a posição inicial

        $("#amigo").remove();
        var tempoAmigo = window.setInterval(function () {
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;
            if (jogoFinalizado == false) {
                fundoGame.append("<div id='amigo' class='animaAmigo'></div>");
                $("#amigo").css("left", 0);
            }
        }, 6000);
    }

    function moverAmigo() {
        // Função responsável por mover o personagem amigo

        posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left", posicaoX + 1);

        if (posicaoX > 906) {
            $("#amigo").css("left", 0);
        }
    }

    function disparar() {
        // Função responsável por adicionar o efeito do disparo na tela

        if (podeAtirar == true) {

            somDisparo.play();
            podeAtirar = false; // Impede que seja efetuado outro tiro enquanto tiver um tiro na tela.

            tiroX = (parseInt(jogador.css("left"))) + 192;
            tiroY = (parseInt(jogador.css("top"))) + 40;

            fundoGame.append("<div id='disparo'></div>");
            $("#disparo").css("left", tiroX);
            $("#disparo").css("top", tiroY);

            // Criando um intervalo para que uma função seja executada constantemente a cada 30 ms
            // Para a execução da função quando a posição do disparo ultrapassar 900 px 
            var tempoDisparo = window.setInterval(function () {
                posicaoX = parseInt($("#disparo").css("left"));
                $("#disparo").css("left", posicaoX + 15);
                if (posicaoX > 900) {
                    window.clearInterval(tempoDisparo);
                    tempoDisparo = null;
                    $("#disparo").remove();
                    podeAtirar = true;
                }
            }, 30)
        }
    }

    function colidir() {
        // Função responsável por verificar se houve colisões entre os elementos do jogo

        var colisaoJogadorInimigo1 = jogador.collision(inimigo1); // Verificando colisão entre jogador com o inimigo1 helicóptero
        var colisaoAmigoInimigo = $("#amigo").collision($("#inimigo2")); // Verificando colisão entre o amigo e o inimigo 2 caminhão
        var colisaoJogadorInimigo2 = jogador.collision($("#inimigo2"));
        var colisaoDisparoInimigo1 = $("#disparo").collision(inimigo1);
        var colisaoDisparoInimigo2 = $("#disparo").collision($("#inimigo2"));
        var colisaoJogadorAmigo = jogador.collision($("#amigo"));

        if (colisaoJogadorInimigo1.length > 0) {

            energiaAtual--;
            inimigo1X = parseInt(inimigo1.css("left"));
            inimigo1Y = parseInt(inimigo1.css("top"));
            explodirInimigo1(inimigo1X, inimigo1Y);

            reposicionarInimigo1();
        }

        if (colisaoAmigoInimigo.length > 0) {

            amigosPerdidos++;
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            morteAmigo(amigoX, amigoY);

            reposicionarAmigo();
        }

        if (colisaoJogadorInimigo2.length > 0) {

            energiaAtual--;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explodirInimigo2(inimigo2X, inimigo2Y);

            reposicionarInimigo2();
        }

        if (colisaoDisparoInimigo1.length > 0) {

            pontos = pontos + 100;
            velocidade += 0.5;
            inimigo1X = parseInt(inimigo1.css("left"));
            inimigo1Y = parseInt(inimigo1.css("top"));

            explodirInimigo1(inimigo1X, inimigo1Y);
            $("#disparo").css("left", 950)

            reposicionarInimigo1();
        }

        if (colisaoDisparoInimigo2.length > 0) {

            pontos = pontos + 50;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));

            explodirInimigo2(inimigo2X, inimigo2Y);
            $("#disparo").css("left", 950)

            reposicionarInimigo2();
        }

        if (colisaoJogadorAmigo.length > 0) {

            amigosSalvos++;
            somResgate.play();
            reposicionarAmigo();
        }

    } // Fim da função colisao()

    function explodirInimigo1(inimigoX, inimigoY) {
        // Função responsável por adicionar a explosão do inimigo 1 helicóptero na tela
        // Recebe como parâmetros a posição onde deve ocorrer a explosão

        somExplosao.play();
        fundoGame.append("<div id='explosaoInimigo1'></div>");
        var explosao = $("#explosaoInimigo1");
        explosao.css("left", inimigoX);
        explosao.css("top", inimigoY);
        explosao.animate({ width: 200, opacity: 0 }, "slow");

        var tempoExplosao = window.setInterval(function () {
            explosao.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao = null;
        }, 500);
    }

    function explodirInimigo2(inimigoX, inimigoY) {
        // Função responsável por adicionar a explosão do inimigo 1 helicóptero na tela
        // Recebe como parâmetros a posição onde deve ocorrer a explosão

        somExplosao.play();
        fundoGame.append("<div id='explosaoInimigo2'></div>");
        var explosao = $("#explosaoInimigo2");
        explosao.css("left", inimigoX);
        explosao.css("top", inimigoY);
        explosao.animate({ width: 200, opacity: 0 }, "slow");

        var tempoExplosao = window.setInterval(function () {
            explosao.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao = null;
        }, 500);
    }

    function morteAmigo(amigoX, amigoY) {
        // Função responsável por adicionar a explosão da morte do personagem amigo na tela
        // Recebe como parâmetros a posição onde deve ocorrer a explosão

        somPerdido.play();
        fundoGame.append("<div id='morteAmigo' class='animaMorteAmigo'></div>");
        var morteAmigo = $("#morteAmigo");
        morteAmigo.css("left", amigoX);
        morteAmigo.css("top", amigoY);
        // morteAmigo.animate({ width: 200, opacity: 0 }, "slow");

        var tempoMorteAmigo = window.setInterval(function () {
            morteAmigo.remove();
            window.clearInterval(tempoMorteAmigo);
            tempoMorteAmigo = null;
        }, 1000);
    }

    function exibirPlacar() {
        placar.html("<h2> Pontos: " + pontos + " Amigos Salvos: " + amigosSalvos + " Amigos Perdidos: "
            + amigosPerdidos + "</h2>");
    }

    function energia() {

        const divEnergia = $("#energia");

        if (energiaAtual == 3) {
            divEnergia.css("background-image", "url(assets/imgs/energia3.png)");
        } else if (energiaAtual == 2) {
            divEnergia.css("background-image", "url(assets/imgs/energia2.png)");
        } else if (energiaAtual == 1) {
            divEnergia.css("background-image", "url(assets/imgs/energia1.png)");
        } else {
            divEnergia.css("background-image", "url(assets/imgs/energia0.png)");
            gameOver();
            // Game Over
        }
    }

    function gameOver() {
        jogoFinalizado = true;
        musica.pause();
        somGameover.play();

        window.clearInterval(jogo.timer);
        jogo.timer = null;

        jogador.remove();
        inimigo1.remove();
        $("#inimigo2").remove();
        $("#amigo").remove();

        fundoGame.append("<div id='fim'></div>");

        $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" +
            "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");

        $("#reinicia").css("cursor", "pointer");
    }

} // Fim da função start

function reiniciaJogo() {
    somGameover.pause();
    $("#fim").remove();
    start();
}