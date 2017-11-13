class Tabela {
  constructor() {
    this.celulas = [[new Celula()]];
  }
  ampliarAltura() {
    let altura = this.celulas.length;
    for (let i = 0; i <= altura; i++) {
      if (this.celulas[i] === undefined) {
        this.celulas[i] = [new Celula()];
      }
    }
  }
  ampliarLargura() {
    let altura = this.celulas.length;
    for (let i = 0; i < altura; i++) {
      let largura = this.celulas[i].length;
      for (let j = 0; j <= largura; j++) {
        if (this.celulas[i][j] === undefined) {
          this.celulas[i][j] = new Celula();
        }
      }
    }
  }

  desenhar() {
    let tabela = $('<div>');
    for (let i = 0; i < this.celulas.length; i++) {
      let linha = $('<div>');
      linha.css({
        display: 'flex',
        flexDirection: 'row'
      });
      for (let j = 0; j < this.celulas[i].length; j++) {
        linha.append(this.celulas[i][j].desenhar());
      }
      tabela.append(linha);
    }
    return tabela;
  }
}

class Celula {
  contem(conteudo) {

  }
  desenhar() {
    let span = $('<span>');
    span.css({
      borderStyle: 'solid',
      borderWidth: 1,
      flex: 1,
      textAlign: 'center'
    });
    let input = $('<input>');
    span.append(input);
    return span;
  }
}

$(() => {
  let tabela = new Tabela();
  let containerTabela = $('<div>');
  containerTabela.append(tabela.desenhar());
  $(document.body).append(containerTabela);
  let ampliarLargura = $('<button>');
  ampliarLargura.on('click', () => {
    tabela.ampliarLargura();
    containerTabela.empty();
    containerTabela.append(tabela.desenhar());
  });
  ampliarLargura.text('Ampliar largura');
  $(document.body).append(ampliarLargura);
  let ampliarAltura = $('<button>');
  ampliarAltura.on('click', () => {
    tabela.ampliarAltura();
    containerTabela.empty();
    containerTabela.append(tabela.desenhar());
  });
  ampliarAltura.text('Ampliar altura');
  $(document.body).append(ampliarAltura);
});
