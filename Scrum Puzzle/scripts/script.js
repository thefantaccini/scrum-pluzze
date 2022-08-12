/* FUN��ES GERAIS PARA UTILIZA��O DO SITE*/

// elementos dom
const formUser = document.querySelector('#form');
const userBtnPO = document.querySelector("#radioPO");
const userBtnSM = document.querySelector("#radioSM");
const userBtnTeam = document.querySelector("#radioTeam");
const boxDes1 = document.querySelector("#boxDesafio1");
const boxDes2 = document.querySelector("#boxDesafio2");
const boxDes3 = document.querySelector("#boxDesafio3");
const btnPlay = document.getElementById("btnPlay");
const btnPause = document.getElementById("btnPause");
const textTimer = document.getElementById("textTimer");

// variaveis de sistema
var usuario = "PO";
const permissoes = ["backlogItens", "backlogSprint", "execucao", "concluido"];
var permissoesPO = ["backlogItens", "backlogSprint"];
var permissoesSM = ["backlogSprint", "execucao", "concluido"];
var permissoesTeam = [];
var programaLiberado = false;
var cronometro = new Timer(180, textTimer, desativarAllPuzzles);
var firstStart = false;
var endTime = false;
var puzzle1Concluido = false;
var puzzle2Concluido = false;
var puzzle3Concluido = false;

for (i = 0; i < permissoes.length; i++)
    document.getElementById(permissoes[i]).setAttribute("ondrop", "null");

// fun��es
function atualizarUser() {
    atualizaPermissao(document.querySelector("#user").usuario.value);
}
function allowDrop(ev) {
    ev.preventDefault();
}
function mostrarDesafio(id) {
    document.getElementById(id).setAttribute("style", "display:flex");
}

function getPosicao(el) {
    return el.parentElement.getAttribute("id");
}

function atualizaPermissao(user) {
    usuario = user;
    if (!firstStart) return false;
    if (endTime) {
        for (i = 0; i < permissoes.length; i++)
            document.getElementById(permissoes[i]).setAttribute("ondrop", "null");
        return false;
    }
    for (i = 0; i < permissoes.length; i++)
        document.getElementById(permissoes[i]).setAttribute("ondrop", "null");
    if (user == "PO")
        for (i = 0; i < permissoesPO.length; i++)
            document.getElementById(permissoesPO[i]).setAttribute("ondrop", "drop(event)");
    if (user == "SM")
        for (i = 0; i < permissoesSM.length; i++)
            document.getElementById(permissoesSM[i]).setAttribute("ondrop", "drop(event)");
    if (user == "Team")
        for (i = 0; i < permissoesTeam.length; i++)
            document.getElementById(permissoesTeam[i]).setAttribute("ondrop", "drop(event)");
}
function liberarDesafios() {
    if (getPosicao(boxDes1) == "execucao")
        mostrarDesafio("desafio1");
    if (getPosicao(boxDes2) == "execucao")
        mostrarDesafio("desafio2");
    if (getPosicao(boxDes3) == "execucao")
        mostrarDesafio("desafio3");
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const el = document.getElementById(data);
    console.log(ev.target.id);
    if (ev.target.getAttribute("id") != "concluido") {
        if (ev.target.className != "boxDesafio")
            ev.target.appendChild(document.getElementById(data));
        else
            ev.target.parentNode.appendChild(el);
    } else {
        if (el.getAttribute("id") == "boxDesafio1") {
            if (puzzle1Concluido) ev.target.appendChild(document.getElementById(data));
            else mostrarAviso("O desafio n\u00e3o <br> est\u00e1 conclu\u00eddo!");
        }
        else if (el.getAttribute("id") == "boxDesafio2") {
            if (puzzle2Concluido) ev.target.appendChild(document.getElementById(data));
            else mostrarAviso("O desafio n\u00e3o <br> est\u00e1 conclu\u00eddo!");
        }
        else if (el.getAttribute("id") == "boxDesafio3") {
            if (puzzle3Concluido) ev.target.appendChild(document.getElementById(data));
            else mostrarAviso("O desafio n\u00e3o <br> est\u00e1 conclu\u00eddo!");
        }
    }
    liberarDesafios();
    if (document.getElementById("concluido").childNodes.length == 6) finalizarScrum();
}

function finalizarScrum() {
    usuario = "PO";
    cronometro.pause();
    document.getElementById("play").style.display = "none";
    document.getElementById("pause").style.display = "none";
    document.getElementById("check").style.display = "flex";
    document.getElementById("textTimer").style.color = "#62b01e";
    permissoesPO = null;
    permissoesSM = null;
    permissoesTeam = null;
}

function alternarDisponibilidade() {
    programaLiberado = !programaLiberado;
    console.log(programaLiberado);
}
function Timer(seg, target, cb) {
    this.counter = seg;
    this.target = target;
    this.callback = cb;
}
Timer.prototype.pad = function (s) {
    return (s < 10) ? '0' + s : s;
}
Timer.prototype.start = function (s) {
    if (usuario == "PO") {
        this.count();
        firstStart = true;
        atualizaPermissao("PO");
        alternarDisponibilidade();
        
    }
}

Timer.prototype.pause = function (s) {
    if (usuario == "PO") {
        pause = alternarDisponibilidade();
    }
}
Timer.prototype.done = function (s) {
    if (this.callback) this.callback();
}
Timer.prototype.display = function (s) {
    this.target.innerHTML = this.pad(s);
}
Timer.prototype.count = function (s) {
    if (firstStart) { return false; }
    firstStart = true;
    var self = this;
    self.display.call(self, self.counter);
    self.counter--;
    var clock = setInterval(function () {
        if (!programaLiberado) return false;
        self.display(self.counter);
        self.counter--;
        if (self.counter < 0) {
            clearInterval(clock);
            self.done.call(self);
        }
    }, 1000);
}

function mostrarAviso(text) {
    textoAviso = document.getElementById("textoAviso");
    if (text == null) text = "Esse usu\u00e1rio n\u00e3o \u00e9 <br />adequado para isso";
    textoAviso.innerHTML = text;
    document.getElementById("aviso").style.opacity = "1";
    setTimeout(function () {
        document.getElementById("aviso").style.opacity = "0";
    }, 2500);
}
// eventos
userBtnPO.addEventListener('click', atualizarUser);
userBtnSM.addEventListener('click', atualizarUser);
userBtnTeam.addEventListener('click', atualizarUser);

btnPlay.addEventListener('click', function () {
    cronometro.start();
    if (usuario == "PO") {
        if (!endTime) {
            document.getElementById("pause").style.display = "flex";
            document.getElementById("play").style.display = "none";
        }
    } else {
        mostrarAviso(null);
    }
});
btnPause.addEventListener('click', function () {
    cronometro.pause();
    if (usuario == "PO") {
        if (!endTime) {
            document.getElementById("play").style.display = "flex";
            document.getElementById("pause").style.display = "none";
        }
    } else {
        mostrarAviso(null);
    }
});

/* QUEBRA-CABE�A */

var rows = 2;
var columns = 4;

var currTile;
var otherTile;

var turns = 0;
var imgIdx = 1;

window.onload = function () {
    for (let i = 1; i < 4; i++) {
        imgIdx = 1
        for (let r = 0; r < rows; r++) {

            for (let c = 0; c < columns; c++) {
                //<img>
                let tile = document.createElement("img");
                tile.src = `./imagens/desafio${i}/${imgIdx}.jpg`;

                tile.addEventListener("dragstart", dragStart); //click on image to drag
                tile.addEventListener("dragover", dragOver);   //drag an image
                tile.addEventListener("dragenter", dragEnter); //dragging an image into another one
                tile.addEventListener("dragleave", dragLeave); //dragging an image away from another one
                tile.addEventListener("drop", dragDrop);       //drop an image onto another one
                tile.addEventListener("dragend", dragEnd);      //after you completed dragDrop

                document.getElementById("puzzle" + i).append(tile);
                imgIdx++
            }
        }
    }
}

function desativarAllPuzzles() {
    desativarPuzzle(1);
    desativarPuzzle(2);
    desativarPuzzle(3);
    endTime = true;
    atualizarUser();
    document.getElementById("pause").style.display = "none";
    document.getElementById("play").style.display = "none";
    document.getElementById("fail").style.display = "flex";
    document.getElementById("textTimer").style.color = "#e25252";
}

function desativarPuzzle(desafioNumber) {

    let imgs = document.querySelectorAll(`#puzzle${desafioNumber}>img`)
    for (const img of imgs) {
        img.style.border = "none";
        img.removeEventListener("dragstart", dragStart); //click on image to drag
        img.removeEventListener("dragover", dragOver);   //drag an image
        img.removeEventListener("dragenter", dragEnter); //dragging an image into another one
        img.removeEventListener("dragleave", dragLeave); //dragging an image away from another one
        img.removeEventListener("drop", dragDrop);       //drop an image onto another one
        img.removeEventListener("dragend", dragEnd);      //after you completed dragDrop
    }
}

//DRAG TILES
function dragStart() {
    currTile = this; //this refers to image that was clicked on for dragging
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    otherTile = this; //this refers to image that is being dropped on
}

function dragEnd() {
    if (currTile.src.includes("blank")) {
        return;
    }
    if (usuario == "Team") {
        let currImg = currTile.src;
        let otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;
        console.log("validateCorrectAllPuzzles", validateCorrectPuzzle(currTile.parentElement.getAttribute("id")));
    } else {
        mostrarAviso(null);
    }
    console.log("usuario nao tem permissão");
}

function validateCorrectPuzzle(desafio) {
    console.log(desafio)
    var pieces = document.getElementById(desafio).childNodes

    isValid = true

    for (let index = pieces.length - 1; index > 0; index--) {
        let piece = pieces[index];
        var srcArr = piece.src.split('/');
        let numberSrc = +srcArr[srcArr.length - 1].replace('.jpg', '');
        if (numberSrc + index != 9) {
            console.log(index + " imagem " + numberSrc + " ERRADO");
            isValid = false;
            break;
        }
        console.log(index + " imagem " + numberSrc + " CERTO");

    }
    if (isValid) {
        console.log(desafio + "concluido");
        if (desafio == "puzzle1") {
            puzzle1Concluido = true;
            desativarPuzzle(1);
        }
        if (desafio == "puzzle2") {
            puzzle2Concluido = true;
            desativarPuzzle(2);
        }
        if (desafio == "puzzle3") {
            puzzle3Concluido = true;
            desativarPuzzle(3);
        }
    }
    return isValid 

}