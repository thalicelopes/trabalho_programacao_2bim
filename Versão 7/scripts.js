var personagem = document.getElementById("personagem");
        var jogoConteudo = document.getElementById("conteudo-jogo");
        var elementoPontuacao = document.getElementById("valorpontuacao");
        var elementoVidas = document.getElementById("valorvidas");
        var elementoContagemRegressiva = document.getElementById("contagemRegressiva");
        var MensagemInicial = document.getElementById("mensagem");
        var aviso = document.getElementById("aviso");
        var elementoFimJogo = document.getElementById("fimjogo");
        var tabelaPontuacao = document.getElementById("ranking");
        var pulando = false;
        var intervaloObstaculo;
        var pontuacao = 0;
        var vidas = 3;
        var contagemRegressiva = 3;
        var checarInicioJogo = false;
        var contagemColisao = 0;
        var nomeJogador = null;
        var contagemRepeticaoAviso = 0;
        
        // Obter nome do jogador
        function getNomeJogador() {
            nomeJogador = localStorage.getItem("nomeJogador");
            if (!nomeJogador) {
                nomeJogador = prompt("Por favor, digite seu nome:");
                localStorage.setItem("nomeJogador", nomeJogador || "Anônimo");
            }
        }
        
        // Atualizar tabela de ranking
        function atualizarRanking() {
            var ranking = JSON.parse(localStorage.getItem("ranking")) || [];
            var pontuacaoJogador = { nome: nomeJogador, pontuacao: pontuacao };
          
            ranking.push(pontuacaoJogador);
            ranking.sort(function (a, b) {
              return b.pontuacao - a.pontuacao;
            });
            ranking = ranking.slice(0, 3); 
          
            localStorage.setItem("ranking", JSON.stringify(ranking));
            localStorage.removeItem("nomeJogador");
          
            // Atualizar a tabela de classificação
            var tabelaClassificacao = tabelaPontuacao.getElementsByTagName("tbody")[0];
            tabelaClassificacao.innerHTML = "";
          
            for (var i = 0; i < ranking.length; i++) {
              var row = tabelaClassificacao.insertRow(i);
              var celulaTabelaPosicao = row.insertCell(0);
              var celulaNomePosicao = row.insertCell(1);
              var celulaPontuacaoPosicao = row.insertCell(2);
          
              celulaTabelaPosicao.textContent = i + 1;
              celulaNomePosicao.textContent = ranking[i].nome;
              celulaPontuacaoPosicao.textContent = ranking[i].pontuacao;
            }
          }
          
          
        
        // Movimento do personagem
        function teclaParaCima(event) {
            if (!pulando) {
                if (event.keyCode === 38) {
                    pulando = true;
                    Pular();
                    if (!checarInicioJogo) {
                        getNomeJogador();
                        inicioJogo();
                    }
                }
            }
        }
        
        // Salto do personagem
        function Pular() {
            var contagemPulos = 0;
            var intervaloPulos = setInterval(function() {
                var personagemBottom = parseInt(window.getComputedStyle(personagem).getPropertyValue("bottom"));
                if (contagemPulos < 15) {
                    personagem.style.bottom = (personagemBottom + 8) + "px";
                } else if (contagemPulos >= 15 && contagemPulos < 30) {
                    personagem.style.bottom = (personagemBottom - 8) + "px";
                } else {
                    clearInterval(intervaloPulos);
                    pulando = false;
                }
                contagemPulos++;
            }, 30);
        }
        
        // Geração de obstáculos
        function gerarObstaculo() {
            var obstaculo = document.createElement("div");
            obstaculo.classList.add("obstaculo");
            obstaculo.style.left = "600px";
            obstaculo.style.bottom = "0";
            jogoConteudo.appendChild(obstaculo);
            
            function moverObstaculo() {
                var obstaculoLeft = parseInt(window.getComputedStyle(obstaculo).getPropertyValue("left"));
                if (obstaculoLeft > -20) {
                    obstaculo.style.left = (obstaculoLeft - 5) + "px";
                } else {
                    obstaculo.parentNode.removeChild(obstaculo);
                    clearInterval(intervaloObstaculo);
                }
                
                var personagemBottom = parseInt(window.getComputedStyle(personagem).getPropertyValue("bottom"));
                var obstaculoBottom = parseInt(window.getComputedStyle(obstaculo).getPropertyValue("bottom"));
                if (obstaculoLeft > 0 && obstaculoLeft < 50 && personagemBottom <= obstaculoBottom + 50) {
                    clearInterval(intervaloObstaculo);
                    vidas--;
                    elementoVidas.textContent = vidas;
                    
                    if (vidas === 0) {
                        fimJogo();
                    } else {
                        if (contagemColisao <= 2) {
                            contagemColisao++;
                            var intervaloAvisoCuidado = setInterval(function() {
                                aviso.style.display = "block";
                                setTimeout(function() {
                                    aviso.style.display = "none";
                                }, 100);
                                contagemRepeticaoAviso++;
                                if (contagemRepeticaoAviso == 7)
                                    clearInterval(intervaloAvisoCuidado);
                            }, 300);
                            contagemRepeticaoAviso = 0;
                        }
                    }
                    
                    obstaculo.parentNode.removeChild(obstaculo);
                } else if (obstaculoLeft === 0) {
                    pontuacao += 10;
                    elementoPontuacao.textContent = pontuacao;
                    
                    if (pontuacao % 100 === 0) {
                        clearInterval(intervaloObstaculo);
                        var obstaculoRapidez = Math.max(5, 5 - pontuacao / 100);
                        intervaloObstaculo = setInterval(moverObstaculo, obstaculoRapidez);
                    }
                }                
            }
            
            var intervaloObstaculo = setInterval(moverObstaculo, 10);
        }
        
        function mostrarAviso() {
            aviso.style.display = "block";
            setTimeout(function() {
                aviso.style.display = "none";
            }, 100);
        }
        
        // Iniciar o jogo
        function inicioJogo() {
            checarInicioJogo = true;
            MensagemInicial.style.display = "none";
            elementoContagemRegressiva.style.display = "block";
            var intervaloContagemRegressiva = setInterval(function() {
                contagemRegressiva--;
                elementoContagemRegressiva.textContent = contagemRegressiva;
                if (contagemRegressiva === 0) {
                    clearInterval(intervaloContagemRegressiva);
                    elementoContagemRegressiva.style.display = "none";
                    setInterval(gerarObstaculo, 2000);
                }
            }, 1000);
        }
        
        // Game over
        function fimJogo() {
            clearInterval(intervaloObstaculo);
            checarInicioJogo = false;
            atualizarRanking();
            elementoFimJogo.style.display = "block";
            elementoFimJogo.addEventListener("click", function() {
                location.reload();
            });
        }
        
        // Event Listener para pressionar a tecla para cima
        document.addEventListener("keydown", teclaParaCima);