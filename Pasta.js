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
        position: 'fixed',
        height: 50,
        top: 0,
        marginLeft: 25,
        padding: 0
      },
      criacaoPagina: {
        marginTop: 50
      },
      voltar: {
        fontFamily: 'arial',
        fontWeight: 'bold',
        color: 'cornflowerblue',
        listStyle: 'square',
        cursor: 'pointer'
      }
    };
  }

  mostrar() {
    let that = this;

    let conteiner = $('<div>');

    let listagemIndices = $('<div>');

    let criacaoPagina = $('<div>');
    criacaoPagina.css(this.styles.criacaoPagina);

    let indiceAnalitico = new IndiceAnalitico();

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

        listagemIndices.hide();
        criacaoPagina.show();
      });
    });

    listagemIndices.append(criarPagina);
    listagemIndices.append(indiceAnalitico.pesquisarIndices((idPagina) => {
      let pagina = new Pagina(idPagina);

      criacaoPagina.append(menu);
      criacaoPagina.append(indiceAnalitico.construirIndices(idPagina));
      criacaoPagina.append(pagina.construir());

      listagemIndices.hide();
      criacaoPagina.show();
    }));

    conteiner.append(listagemIndices);
    conteiner.append(criacaoPagina);

    return conteiner;
  }
}
