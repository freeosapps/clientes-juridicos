class Tabela {
  constructor() {
    this.largura = 1;
    this.celulas = [[new Celula()]];
  }
  ampliarLargura() {
    for (let i = 0; i < this.celulas.length; i++) {
      this.celulas[i].push(new Celula());
    }
    this.largura++;
  }
  reduzirLargura() {
    if (this.largura > 1) {
      for (let i = 0; i < this.celulas.length; i++) {
        this.celulas[i].splice(this.celulas[i].length - 1, 1);
      }
      this.largura--;
    }
  }
  percorrerLargura(indice, callback) {
    for (let i; i < this.largura; i++) {
      callback(this.celulas[indice][i]);
    }
  }
  percorrerAltura(indice, callback) {
    for (let i; i < this.celulas.length; i++) {
      callback(this.celulas[i][indice]);
    }
  }
  ampliarAltura() {
    let altura = this.celulas.length;
    for (let i = 0; i <= altura; i++) {
      if (this.celulas[i] === undefined) {
        this.celulas[i] = [];
        for (let j = 0; j < this.largura; j++) {
          this.celulas[i].push(new Celula());
        }
      }
    }
  }
  reduzirAltura() {
    let altura = this.celulas.length;
    if (altura > 1) {
      this.celulas.splice(altura - 1, 1);
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
      flex: 1,
      textAlign: 'center'
    });
    let input = $('<input>');
    input.css({
      width: '100%'
    });
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
  ampliarLargura.text('+ largura');
  $(document.body).append(ampliarLargura);
  
  let reduzirLargura = $('<button>');
  reduzirLargura.on('click', () => {
    tabela.reduzirLargura();
    containerTabela.empty();
    containerTabela.append(tabela.desenhar());
  });
  reduzirLargura.text('- largura');
  $(document.body).append(reduzirLargura);

  let ampliarAltura = $('<button>');
  ampliarAltura.on('click', () => {
    tabela.ampliarAltura();
    containerTabela.empty();
    containerTabela.append(tabela.desenhar());
  });
  ampliarAltura.text('+ altura');
  $(document.body).append(ampliarAltura);

  let reduzirAltura = $('<button>');
  reduzirAltura.on('click', () => {
    tabela.reduzirAltura();
    containerTabela.empty();
    containerTabela.append(tabela.desenhar());
  });
  reduzirAltura.text('- altura');
  $(document.body).append(reduzirAltura);


});
