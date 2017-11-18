class IndiceAnalitico {
  constructor() {
    this.db = new Dexie('ClientesJuridicos');
    this.db.version(1).stores({
      indices: '++id,valor',
      associacoes: 'idIndice,idPagina'
    });
    this.db.open();
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
        backgroundColor: 'limegreen',
        fontFamily: 'arial',
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
        color: 'gray'
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
        left: -4
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

  }

  _adicionarIndice(valor) {
    return this.db.indices.add({
      valor: valor
    });
  }

  _removerIndice(id) {
    return this.db.indices.where({id: id}).delete();
  }

  _alterarIndice(id, valor) {
    return this.db.indices.update(id, {valor: valor});
  }

  _listarIndices(valor) {
    if (valor) {
      return this.db.indices.where('valor').equalsIgnoreCase(valor);
    } else {
      return this.db.indices;
    }
  }

  _listarAssociacoes(idIndice, idPagina) {
    return this.db.associacoes.where({
      idIndice: idIndice,
      idPagina: idPagina
    });
  }

  _adicionarAssociacao(idIndice, idPagina) {
    return this.db.associacoes.add({
      idIndice: idIndice,
      idPagina: idPagina
    })
  }

  _removerAssociacao(idIndice, idPagina) {
    return this.db.associacoes.where({idIndice: idIndice, idPagina: idPagina}).delete();
  }

  _persistirAlteracoes(conteinerIndice, campoTexto, idPagina) {
    let that = this;
    let id = $.data(conteinerIndice, 'id');
    let valor = campoTexto.val();
    if (id) {
      if (valor.trim()) {
        that._listarIndices(valor)
        .first((indice) => {
          if (indice) {
            that._removerIndice(id);
            $.data(conteinerIndice, 'id', indice.id);
            that._adicionarAssociacao(indice.id, idPagina);
          } else {
            that._alterarIndice(id, valor);
          }
        });
      } else {
        that._removerAssociacao(id, idPagina);
        that._removerIndice(id);
        $.data(conteinerIndice, 'id', '');
      }
    } else {
      if (valor.trim()) {
        that._listarIndices(valor)
        .first((indice) => {
          if (indice) {
            that._listarAssociacoes(indice.id, idPagina)
            .first((associacao) => {
              if (!associacao) {
                that._adicionarAssociacao(indice.id, idPagina)
                .then((id) => {
                  $.data(conteinerIndice, 'id', id);
                });
              } else {
                $.data(conteinerIndice, 'id', indice.id);
              }
            });
          } else {
            that._adicionarIndice(valor)
            .then((id) => {
              $.data(conteinerIndice, 'id', id);
              that._adicionarAssociacao(id, idPagina);
            });
          }
        });
      }
    }
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
        let id = $.data(conteinerIndice, 'id');
        if (id) {
          that._removerIndice(id);
        }
      });

      let campoTexto = $('<input>');
      campoTexto.prop('type', 'text');
      campoTexto.attr('list', 'indices');
      campoTexto.css(this.styles.campoTexto);
      campoTexto.on('blur', () => {
        that._persistirAlteracoes(conteinerIndice, campoTexto, idPagina);
      });

      let listaIndices = $('<datalist>')
      listaIndices.prop('id', 'indices');
      this._listarIndices().each((indice) => {
        let opcao = $('<option>');
        opcao.val(indice.valor);
        listaIndices.append(opcao);
      });

      conteinerIndice.append(listaIndices);
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
      let id = $.data(conteinerIndice, 'id');
      if (id) {
        that._removerIndice(id);
      }
    });

    let campoTexto = $('<input>');
    campoTexto.prop('type', 'text');
    campoTexto.attr('list', 'indices');
    campoTexto.css(this.styles.campoTexto);
    campoTexto.on('blur', () => {
      that._persistirAlteracoes(conteinerIndice, campoTexto, idPagina);
    });

    let listaIndices = $('<datalist>')
    listaIndices.prop('id', 'indices');
    this._listarIndices().each((indice) => {
      let opcao = $('<option>');
      opcao.val(indice.valor);
      listaIndices.append(opcao);
    });

    conteinerIndice.append(listaIndices);
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
