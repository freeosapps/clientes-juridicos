class IndiceAnalitico {
  constructor() {
    this.db = new Dexie('ClientesJuridicos');
    this.db.version(1).stores({
      indices: '++id,idPagina'
    });
    this.db.open()
    .catch((error) => {
      throw error;
    });
    this.styles = {
      fielsetIndices: {
        fontFamily: 'arial',
        fontWeight: ' bold',
        margin: 5,
        color: 'dimgrey',
        borderRadius: 5,
        borderStyle: 'dotted',
        borderWidth: 1,
        backgroundColor: 'white'
      },
      botaoAdicionarIndice: {
        borderStyle: 'none',
        backgroundColor: 'lightgreen',
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 50,
        width: 20,
        height: 20,
        cursor: 'pointer'
      },
      textoLegendaFieldsetIndices: {
        margin: 5
      },
      iconeRemover: {
        display: 'inline-block',
        borderRadius: 20,
        borderStyle: 'solid',
        borderWidth: 1,
        width: 20,
        height: 20,
        textAlign: 'center',
        fontFamily: 'arial',
        fontWeight: 'bold',
        backgroundColor: 'lightcoral',
        color: 'white',
        marginBottom: 5,
        cursor: 'pointer',
        borderRadius: '1px 10px 10px 1px',
        position: 'relative',
        left: -5,
        paddingTop: 5,
        paddingBottom: 5
      },
      conteinerIndice: {
        marginRight: 10
      },
      campoTexto: {
        padding: 5,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: 'cornflowerblue',
        backgroundColor: 'aliceblue',
        margin: 5,
        height: 30
      }
    };
  }

  manterIndice() {
    let campoTexto = $('<input>');
    campoTexto.prop('type', 'text');
    return campoTexto;
  }

  _removerIndice(id) {
    return this.db.indices.where({id: id}).delete();
  }

  construirIndices(idPagina) {
    let that = this;

    let botaoAdicionarIndice = $('<button>');
    botaoAdicionarIndice.prop('title', 'Adicionar um índice');
    botaoAdicionarIndice.prop('alt', 'Adicionar um índice');
    botaoAdicionarIndice.css(this.styles.botaoAdicionarIndice);
    botaoAdicionarIndice.text('+');
    botaoAdicionarIndice.on('click', () => {
      let conteinerIndice = $('<span>');
      conteinerIndice.css(this.styles.conteinerIndice);

      let iconeRemover = $('<span>');
      iconeRemover.css(this.styles.iconeRemover);
      iconeRemover.text('x');
      iconeRemover.prop('title', 'Remover');
      iconeRemover.prop('alt', 'Remover');
      iconeRemover.on('click', () => {
        conteinerIndice.remove();
        let id = $.data(iconeRemover, 'id');
        if (id) {
          that._removerIndice(id)
          .catch((error) => {
            throw error;
          });
        }
      });

      let campoTexto = $('<input>');
      campoTexto.prop('type', 'text');
      campoTexto.css(this.styles.campoTexto);
      campoTexto.on('blur', () => {
        return that.db.indices.add({
          idPagina: idPagina
        })
        .then((id) => {
          $.data(iconeRemover, 'id', id);
        });
      });

      conteinerIndice.append(campoTexto);
      conteinerIndice.append(iconeRemover);

      conteinerIndices.append(conteinerIndice);
    });

    let legendaFielsetIndices = $('<legend>');

    let textoLegendaFieldsetIndices = $('<span>');
    textoLegendaFieldsetIndices.append('Índices');
    textoLegendaFieldsetIndices.css(this.styles.textoLegendaFieldsetIndices);

    legendaFielsetIndices.append(textoLegendaFieldsetIndices);
    legendaFielsetIndices.append(botaoAdicionarIndice);

    let conteinerIndices = $('<span>');

    let conteinerIndice = $('<span>');
    conteinerIndice.css(this.styles.conteinerIndice);

    let iconeRemover = $('<span>');
    iconeRemover.css(this.styles.iconeRemover);
    iconeRemover.text('x');
    iconeRemover.prop('title', 'Remover');
    iconeRemover.prop('alt', 'Remover');
    iconeRemover.on('click', () => {
      conteinerIndice.remove();
      let id = $.data(iconeRemover, 'id');
      if (id) {
        that._removerIndice(id)
        .catch((error) => {
          throw error;
        });
      }
    });

    let campoTexto = $('<input>');
    campoTexto.prop('type', 'text');
    campoTexto.css(this.styles.campoTexto);
    campoTexto.on('blur', () => {
      return this.db.indices.add({
        idPagina: idPagina
      })
      .then((id) => {
        $.data(iconeRemover, 'id', id);
      });
    });

    conteinerIndice.append(campoTexto);
    conteinerIndice.append(iconeRemover);

    conteinerIndices.append(conteinerIndice);

    let fielsetIndices = $('<fieldset>');
    fielsetIndices.css(this.styles.fielsetIndices);
    fielsetIndices.append(legendaFielsetIndices);
    fielsetIndices.append(conteinerIndices);

    return fielsetIndices;
  }

  // Opcional, apenas para facilitar a leitura
  ordenarIndices() {

  }
  pesquisarIndices() {

  }
}
