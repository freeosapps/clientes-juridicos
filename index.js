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
    for (let i = 0; i < this.largura; i++) {
      callback(i, this.celulas[indice][i]);
    }
  }
  percorrerAltura(indice, callback) {
    for (let i = 0; i < this.celulas.length; i++) {
      callback(i, this.celulas[i][indice]);
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
  projetarAltura(indices) {
    let tabela = this.desenhar();
    let linhas = tabela.children();
    for (let i = 0; i < linhas.length; i++) {
      if (indices.indexOf(i) == -1) {
        $(linhas[i]).hide();
      }
    }
    return tabela;
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
  constructor() {
    this.input = $('<input>');
  }
  contem(conteudo) {
    if (!conteudo) {
      return true;
    } else {
      return this.input.val().match(new RegExp(conteudo, 'g'));
    }
  }
  desenhar() {
    this.input.css({
      flex: 1,
      borderRadius: 50,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: 'lightgray',
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 10,
      paddingRight: 10
    });
    return this.input;
  }
}

$(() => {
  let tabela = new Tabela();
  let containerTabela = $('<div>');
  containerTabela.css({
    marginTop: 5,
    marginBottom: 5
  });
  let containerFiltros = $('<div>');
  containerFiltros.css({
    display: 'flex',
    marginTop: 5,
    marginBottom: 5
  });
  containerTabela.append(tabela.desenhar());

  $(document.body).append(containerFiltros);
  $(document.body).append(containerTabela);

  let filtros = [];

  function adicionarFiltro(placeholder) {
    let input = $('<input>');
    input.prop('placeholder', placeholder);
    input.css({
      flex: 1,
      borderRadius: 50,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: 'gray',
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 10,
      paddingRight: 10
    });
    input.on('keyup', () => {
      let intersecaoIndices = [];
      tabela.percorrerAltura(0, (i, celula) => {
        if (celula.contem(filtros[0].val())) {
          intersecaoIndices.push(i);
        }
      });
      for (let j = 1; j < filtros.length; j++) {
        let indices = [];
        tabela.percorrerAltura(j, (i, celula) => {
          if (celula.contem(filtros[j].val())) {
            indices.push(i);
          }
        });
        intersecaoIndices = indices.filter(x => {
          return intersecaoIndices.indexOf(x) > -1;
        });
      }
      containerTabela.empty();
      containerTabela.append(tabela.projetarAltura(intersecaoIndices));
    });
    filtros.push(input);
    containerFiltros.append(input);
  }

  function removerFiltro() {
    if (filtros.length > 1) {
      filtros[filtros.length - 1].remove();
      filtros.splice(filtros.legnth - 1, 1);
    }
  }

  function redesenharTabela() {
    containerTabela.empty();
    containerTabela.append(tabela.desenhar());
  }

  adicionarFiltro('Nome');
  adicionarFiltro('RG');
  adicionarFiltro('CPF');
  adicionarFiltro('Endereço');

  tabela.ampliarLargura();
  tabela.ampliarLargura();
  tabela.ampliarLargura();
  tabela.ampliarAltura();
  redesenharTabela();

  let ampliarAltura = $('<button>');
  ampliarAltura.css({
    width: 30,
    height: 30,
    fontWeight: 'bold'
  });
  ampliarAltura.on('click', () => {
    tabela.ampliarAltura();
    redesenharTabela();
  });
  ampliarAltura.text('+');
  $(document.body).append(ampliarAltura);

  let reduzirAltura = $('<button>');
  reduzirAltura.css({
    width: 30,
    height: 30,
    fontWeight: 'bold'
  });
  reduzirAltura.on('click', () => {
    tabela.reduzirAltura();
    redesenharTabela();
  });
  reduzirAltura.text('-');
  $(document.body).append(reduzirAltura);
});
