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
        fontWeight: 'bold',
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

    let fieldsetIndiceAnalitico = $('<fieldset>');
    fieldsetIndiceAnalitico.css(this.styles.fieldsetIndiceAnalitico);

    let textoFieldsetIndiceAnalitico = $('<span>');
    textoFieldsetIndiceAnalitico.css(this.styles.textoFieldsetIndiceAnalitico);
    textoFieldsetIndiceAnalitico.text('Índice analítico');

    let legendaIndiceAnalitico = $('<legend>');
    legendaIndiceAnalitico.append(textoFieldsetIndiceAnalitico);

    fieldsetIndiceAnalitico.append(legendaIndiceAnalitico);

    let indiceAnalitico = new IndiceAnalitico();

    indiceAnalitico.semIndices().then((semIndices) => {
      if (semIndices) {
        let textoNenhumIndice = $('<span>');
        textoNenhumIndice.css(this.styles.textoNenhumIndice);
        textoNenhumIndice.text('Não há índices ainda.');
        fieldsetIndiceAnalitico.append(textoNenhumIndice);
      }
    });

    let listagemIndices = $('<div>');

    let criacaoPagina = $('<div>');
    criacaoPagina.css(this.styles.criacaoPagina);

    let voltar = $('<li>');
    voltar.css(this.styles.voltar);
    voltar.text('Voltar');
    voltar.on('click', () => {
      location.reload();
    });

    let menu = $('<ul>');
    menu.css(this.styles.menu);
    menu.append(voltar);

    let criarPagina = $('<button>');
    criarPagina.css(this.styles.botao);
    criarPagina.text('Criar página');
    criarPagina.on('click', () => {
      that.db.paginas.add({})
      .then((idPagina) => {
        let pagina = new Pagina(idPagina);

        criacaoPagina.append(menu);
        criacaoPagina.append(indiceAnalitico.construirIndices(idPagina));
        criacaoPagina.append(pagina.construir());

        conteinerListagemIndices.hide();
        conteinerCriacaoPagina.show();
      });
    });

    listagemIndices.append(criarPagina);
    fieldsetIndiceAnalitico.append(indiceAnalitico.pesquisarIndices((idPagina) => {
      let pagina = new Pagina(idPagina);

      criacaoPagina.append(menu);
      criacaoPagina.append(indiceAnalitico.construirIndices(idPagina));
      criacaoPagina.append(pagina.construir());

      conteinerListagemIndices.hide();
      conteinerCriacaoPagina.show();
    }));

    conteinerListagemIndices.append(criarPagina);
    conteinerListagemIndices.append(fieldsetIndiceAnalitico);
    conteinerCriacaoPagina.append(criacaoPagina);

    conteiner.append(conteinerListagemIndices);
    conteiner.append(conteinerCriacaoPagina);

    return conteiner;
  }
}
