class Pasta {
  constructor() {
    this.db = new Dexie('ClientesJuridicos');
    this.db.version(1).stores({
      paginas: '++id'
    });
    this.db.open();
    this.styles = {
      botao: {
        display: 'inline-block',
        borderStyle: 'double',
        borderWidth: 6,
        borderColor: 'white',
        borderRadius: 25,
        padding: 5,
        fontFamily: 'arial',
        backgroundColor: 'cornflowerblue',
        fontWeight: 'bold',
        color: 'white',
        cursor: 'pointer'
      },
      menu: {
        top: 0,
        marginLeft: 25,
        padding: 0
      },
      criacaoPagina: {

      },
      voltar: {
        fontFamily: 'arial',
        color: 'cornflowerblue',
        listStyle: 'square',
        cursor: 'pointer'
      },
      fieldsetIndiceAnalitico: {
        fontFamily: 'arial',
        margin: 5,
        color: 'dimgrey',
        borderRadius: 5,
        borderStyle: 'dotted',
        borderWidth: 1,
        marginTop: 15
      },
      textoFieldsetIndiceAnalitico: {
        fontWeight: ' bold',
        color: 'gray'
      },
      textoNenhumIndice: {
        fontWeight: 'normal',
        fontStyle: 'italic',
        padding: 5,
        display: 'inline-block'
      }
    };
  }

  mostrar() {
    let that = this;

    let conteiner = $('<div>');

    let conteinerListagemIndices = $('<div>');

    let conteinerCriacaoPagina = $('<div>');

    let textoFieldsetIndiceAnalitico = $('<span>')
    .css(this.styles.textoFieldsetIndiceAnalitico)
    .text('Índice analítico');

    let legendaIndiceAnalitico = $('<legend>')
    .append(textoFieldsetIndiceAnalitico);

    let indiceAnalitico = new IndiceAnalitico();

    let fieldsetIndiceAnalitico = $('<fieldset>')
    .css(this.styles.fieldsetIndiceAnalitico)
    .append(legendaIndiceAnalitico)
    .append(indiceAnalitico.pesquisarIndices((idPagina) => {
      let pagina = new Pagina(idPagina);

      criacaoPagina
      .append(menu)
      .append(indiceAnalitico.construirIndices(idPagina))
      .append(pagina.construir());

      conteinerListagemIndices
      .hide();

      conteinerCriacaoPagina
      .show();
    }));

    indiceAnalitico.semIndices().then((semIndices) => {
      if (semIndices) {
        let textoNenhumIndice = $('<span>')
        .css(this.styles.textoNenhumIndice)
        .text('Não há índices ainda.');

        fieldsetIndiceAnalitico.append(textoNenhumIndice);
      }
    });

    let criacaoPagina = $('<div>')
    .css(this.styles.criacaoPagina);

    let voltar = $('<li>')
    .css(this.styles.voltar)
    .text('Voltar')
    .on('click', () => {
      location.reload();
    });

    let menu = $('<ul>')
    .css(this.styles.menu)
    .append(voltar);

    let criarPagina = $('<button>')
    .css(this.styles.botao)
    .text('Criar página')
    .on('click', () => {
      that.db.paginas.add({})
      .then((idPagina) => {
        let pagina = new Pagina(idPagina);

        criacaoPagina
        .append(menu)
        .append(indiceAnalitico.construirIndices(idPagina))
        .append(pagina.construir());

        conteinerListagemIndices
        .hide();

        conteinerCriacaoPagina
        .show();
      });
    });

    conteinerListagemIndices
    .append(criarPagina)
    .append(fieldsetIndiceAnalitico);

    conteinerCriacaoPagina
    .append(criacaoPagina);

    conteiner
    .append(conteinerListagemIndices)
    .append(conteinerCriacaoPagina);

    return conteiner;
  }
}
