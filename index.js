let display = document.getElementById('display');
let botoes = document.querySelectorAll('.botoes button');
let botaoIgual = Array.from(botoes).find(botao => botao.textContent === '=');
let botaoBackspace = Array.from(botoes).find(botao => botao.textContent === '←');
let sol = document.getElementById('sol-icon');
let lua = document.getElementById('lua-icon')

let primeiroNumero = '';
let operador = '';
let numeroAtual = '';
let resultado = 0;
let valorBruto = '';
let calculoFinalizado = false;

display.focus();

document.addEventListener('keydown', () => {
  display.focus();
});

function éOperador(caractere) {
  const operadores = "+-*/%";
  return operadores.includes(caractere);
}

document.addEventListener('keydown', (e) => {
  const teclasPermitidas = "0123456789+-*/%=,";
  const operadores = "+-*/%";

  display.focus();

  if (!teclasPermitidas.includes(e.key) && !["Enter", "Backspace", "Delete"].includes(e.key)) {
    e.preventDefault();
    return;
  }

  let ultimo = display.value.slice(-1);
  let numeroAtual = display.value.split(/[\+\-\*\/%]/).pop().replace(/\./g, '').replace(',', '.');

  if (e.key === 'Enter') {
    e.preventDefault();
    botaoIgual.click();
    return;
  }

  if (operadores.includes(e.key) && éOperador(ultimo)) {
    e.preventDefault();
    return;
  }

  if (e.key === ',' && numeroAtual.includes('.')) {
    e.preventDefault();
    return;
  }

  if (["Backspace", "Delete"].includes(e.key)) {
    setTimeout(() => {
      if (display.value === '') {
        display.value = '0';
      } else {
        display.value = formataDisplay(display.value);
      }
    }, 0);
    return;
  }

  if (display.value === "0" && !isNaN(parseInt(e.key))) {
    display.value = e.key;
    e.preventDefault();
    return;
  }


  if (e.key === ',') {
    display.value += ',';
  } else {
    display.value += e.key;
    if (!display.value.endsWith(',')) {
      display.value = formataDisplay(display.value);
    }
  }
  e.preventDefault();
});




function formataDisplay(expressao) {
  // Divide expressão pelos operadores, mantendo-os
  let partes = expressao.split(/\s*([+\-*/])\s*/);

  return partes.map(parte => {
    let valor = parte.trim();
    // Se for número válido
    if (valor !== '' && !isNaN(valor.replace(/\./g, '').replace(',', '.'))) {
      // Converte para número e formata no padrão brasileiro
      let numero = parseFloat(valor.replace(/\./g, '').replace(',', '.'));
      if (!isNaN(numero)) {
        return new Intl.NumberFormat('pt-BR', {
          minimumFractionDigits: valor.includes(',') ? 1 : 0,
          maximumFractionDigits: 10
        }).format(numero);
      }
    }
    // Retorna operadores ou partes inválidas como estão
    return valor;
  }).join(' ');
}


function atualizaTema() {
  if (document.body.classList.contains('dark-mode')) {
    lua.style.display = "none";
    sol.style.display = "block";
  } else {
    lua.style.display = "block";
    sol.style.display = "none";
  }
}

sol.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  atualizaTema();
});

lua.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  atualizaTema();
});


atualizaTema();

botoes.forEach(botao => {
  botao.addEventListener('click', () => {
    let valorBotao = botao.textContent;

    if (valorBotao == 'C') {
      display.value = '0';
      primeiroNumero = '';
      operador = '';
      numeroAtual = '';
      resultado = 0;

    } else if (valorBotao == '=') {
      try {
        let expressaoEval = display.value
          .replace(/\./g, '')
          .replace(/,/g, '.');
        let resultadoNumero = eval(expressaoEval);


        if (!isFinite(resultadoNumero)) {
          display.value = 'Erro!'
          return;
        } else {
          const formatador = new Intl.NumberFormat('pt-BR');
          const textoFormatado = formatador.format(resultadoNumero);

          display.value = textoFormatado;
          calculoFinalizado = true;
        }

      } catch (erro) {
        display.value = "Erro!";
      }
    } else if (valorBotao == "CE") {
      display.value = display.value.slice(0, -1);
      if (display.value === "" || display.value === " ") {
        display.value = "0";
      }
    }

    else if (valorBotao == '←') {
      if (display.value.endsWith(" ")) {
        display.value = display.value.slice(0, -3)
      } else {
        display.value = display.value.slice(0, -1);
      }
      if (display.value === '') {
        display.value = 0;
      }
    } else if (valorBotao === "%") {
      try {
        let partes = display.value.trim().split(" ");
        if (partes.length === 3) {
          let base = parseFloat(partes[0].replace(/,/g, ''));
          let valor = parseFloat(partes[2].replace(/,/g, ''));
          if (!isNaN(base) && !isNaN(valor)) {
            partes[2] = (base * valor / 100).toString();
            display.value = partes.join(" ");
          }
        }
      } catch (e) {
        display.value = "Erro!";
      }
    }

    else {

      if (valorBotao == '+' || valorBotao == '-' || valorBotao == '*' || valorBotao == '/') {
        if (display.value === 'Erro!') {
          display.value = 'Digite um número.';
          return;
        }

        if (display.value === 'Digite um número.') {
          if (['+', '-', '*', '/'].includes(valorBotao)) {
            return;
          } else {
            display.value = valorBotao;
            return;
          }
        }

        if (calculoFinalizado) {
          calculoFinalizado = false
          display.value += ' ' + valorBotao + ' ';
          return;
        }

        let terminaComOperador = display.value.trim().endsWith('+') ||
          display.value.trim().endsWith('-') ||
          display.value.trim().endsWith('*') ||
          display.value.trim().endsWith('/');

        if (terminaComOperador) {
          display.value = display.value.slice(0, -3);
          calculoFinalizado = false;
        }
        display.value += " " + valorBotao + " ";
      }
      else {
        if (calculoFinalizado) {
          display.value = valorBotao;
          calculoFinalizado = false;
          return;
        } else if (display.value === '0' && valorBotao !== '.') {
          display.value = valorBotao;
          return;
        }

        if (valorBotao === ",") {
          if (display.value === "Digite um número." || display.value === "Erro!") {
            display.value = "0,";
            display.value = formataDisplay(display.value);
            return;
          }

          if (display.value === "0") {
            display.value = "0,";
            display.value = formataDisplay(display.value);
            return;
          }

          let ultimaParte = display.value.split(/[\+\-\*\/]/).pop().trim().replace(/\./g, '').replace(/,/g, '.');

          if (!ultimaParte.includes('.')) {
            display.value += ",";
          }
        }




        else {
          if (display.value === "Erro!" || display.value === "Digite um número.") {
            display.value = valorBotao;
            return;
          }
          display.value += valorBotao;
        }
      }
    }

    display.value = formataDisplay(display.value);
  })
})