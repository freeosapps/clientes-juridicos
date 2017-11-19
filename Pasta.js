class Pasta {
  constructor() {
    this.db = new Dexie('ClientesJuridicos');
    this.db.version(1).stores({
      paginas: '++id'
    });
    this.db.open();
  }

  mostrar() {
    let that = this;

    let conteiner = $('<div>');

    let listagemIndices = $('<div>');

    let criacaoPagina = $('<div>');

    let indiceAnalitico = new IndiceAnalitico();

    let criarPagina = $('<button>');
    criarPagina.text('Criar página');
    criarPagina.on('click', () => {
      that.db.paginas.add({})
      .then((idPagina) => {
        let pagina = new Pagina(idPagina);

        criacaoPagina.append(indiceAnalitico.construirIndices(idPagina));
        criacaoPagina.append(pagina.construir());

        listagemIndices.hide();
        criacaoPagina.show();
      });
    });

    listagemIndices.append(criarPagina);
    listagemIndices.append(indiceAnalitico.pesquisarIndices());

    conteiner.append(listagemIndices);
    conteiner.append(criacaoPagina);

    return conteiner;
  }
}
