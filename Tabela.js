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
