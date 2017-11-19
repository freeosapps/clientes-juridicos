class IndiceAnalitico {
  constructor() {
    this.db = new Dexie('ClientesJuridicos');
    this.db.version(1).stores({
      indices: '++id,valor',
      associacoes: '++id,idIndice,idPagina'
    });
    this.db.open();
    this.styles = {
      fielsetIndices: {
        fontFamily: 'arial',
        margin: 5,
        color: 'dimgrey',
        borderRadius: 5,
        borderStyle: 'dotted',
        borderWidth: 1
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
        fontWeight: ' bold',
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
      },
      textoNenhumIndiceAdicionado: {
        fontWeight: 'normal',
        fontStyle: 'italic',
        padding: 5,
        display: 'inline-block'
      },
      linhaIndice: {
        fontFamily: 'arial',
        padding: 5,
        color: 'gray',
        display: 'flex'
      },
      itemAssociacao: {
        color: 'cornflowerblue',
        cursor: 'pointer',
        listStyle: 'square'
      },
      listaAssociacoes: {
        marginTop: 0,
        marginBottom: 0
      }
    };
  }

  _adicionarIndice(valor) {
    return this.db.indices.add({
      valor: valor
    });
  }

  _removerIndice(id) {
    return this.db.indices.where({id: id}).delete();
  }

  _listarIndices(valor, ids) {
    if (valor) {
      return this.db.indices.where('valor').equalsIgnoreCase(valor);
    } else if (ids) {
      let query = this.db.indices.where('id').equals(ids[0]);
      for (let i = 1; i < ids.length; i++) {
        query = query.or('id').equals(ids[i]);
      }
      return query;
    } else {
      return this.db.indices;
    }
  }

  _listarAssociacoes(idIndice, idPagina) {
    if (idIndice && idPagina) {
      return this.db.associacoes.where({
        idIndice: idIndice,
        idPagina: idPagina
      });
    } else if (idPagina) {
      return this.db.associacoes.where({
        idPagina: idPagina
      });
    } else {
      return this.db.associacoes.where({
        idIndice: idIndice
      });
    }
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
          if (indice && indice.id != id) {
            that._removerAssociacao(id, idPagina);
            that._removerIndice(id);
            that._adicionarAssociacao(indice.id, idPagina);
            $.data(conteinerIndice, 'id', indice.id);
          } else {
            that._removerAssociacao(id, idPagina);
            that._listarAssociacoes(id).first((associacao) => {
              if (!associacao) {
                that._removerIndice(id);
              }
              that._adicionarIndice(campoTexto.val())
              .then((id) => {
                that._adicionarAssociacao(id, idPagina);
                $.data(conteinerIndice, 'id', id);
              });
            });
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

  _construirConteinerDeIndice(idPagina, idIndice, valor, aoRemover) {
    let that = this;

    let conteinerIndice = $('<span>')
    .css(this.styles.conteinerIndice);

    let iconeRemover = $('<span>')
    .css(this.styles.iconeRemover)
    .text('x')
    .prop('title', 'Remover')
    .prop('alt', 'Remover')
    .on('click', () => {
      conteinerIndice.remove();
      let id = $.data(conteinerIndice, 'id');
      if (id) {
        that._removerAssociacao(id, idPagina);
        that._listarAssociacoes(id).first((associacao) => {
          if (!associacao) {
            that._removerIndice(id);
          }
        });
      }
      aoRemover();
    });

    let campoTexto = $('<input>')
    .prop('type', 'text')
    .attr('list', 'indices')
    .css(this.styles.campoTexto)
    .on('blur', () => {
      campoTexto.val(campoTexto.val().replace(/\s+$/, ''));
      that._persistirAlteracoes(conteinerIndice, campoTexto, idPagina);
    })
    .on('keyup', () => {
      campoTexto.val(campoTexto.val().replace(/^\s+/, ''));
    });

    if (valor) {
      campoTexto.val(valor);
    }

    let listaIndices = $('<datalist>')
    listaIndices.prop('id', 'indices');
    this._listarIndices().each((indice) => {
      let opcao = $('<option>');
      opcao.val(indice.valor);
      listaIndices.append(opcao);
    });

    conteinerIndice.append(listaIndices)
    .append(campoTexto)
    .append(iconeRemover);

    $.data(conteinerIndice, 'id', idIndice);

    return conteinerIndice;
  }

  _construirTextoNenhumIndiceAdicionado() {
    let textoNenhumIndiceAdicionado = $('<span>')
    .css(this.styles.textoNenhumIndiceAdicionado)
    .text('Nenhum índice adicionado.');
    return textoNenhumIndiceAdicionado;
  }

  construirIndices(idPagina) {
    let that = this;

    let conteinerIndices = $('<span>');
    let textoNenhumIndiceAdicionado = this._construirTextoNenhumIndiceAdicionado();

    let idsIndices = [];

    let associacoes = this._listarAssociacoes(null, idPagina).each((associacao) => {
      idsIndices.push(associacao.idIndice);
    }).then(() => {
      if (idsIndices.length > 0) {
        let query = that._listarIndices(null, idsIndices).each((indice) => {
          conteinerIndices.append(that._construirConteinerDeIndice(idPagina, indice.id, indice.valor, () => {
            if (conteinerIndices.children().length == 0) {
              textoNenhumIndiceAdicionado = this._construirTextoNenhumIndiceAdicionado();
              conteinerIndices.append(textoNenhumIndiceAdicionado);
            }
          }));
        });
      } else {
        textoNenhumIndiceAdicionado = this._construirTextoNenhumIndiceAdicionado();
        conteinerIndices.append(textoNenhumIndiceAdicionado);
      }
    });

    let botaoAdicionarIndice = $('<button>')
    .prop('title', 'Adicionar um índice')
    .prop('alt', 'Adicionar um índice')
    .css(this.styles.botaoAdicionarIndice)
    .text('+')
    .on('click', () => {
      if (textoNenhumIndiceAdicionado) {
        textoNenhumIndiceAdicionado.remove();
      }
      conteinerIndices.append(that._construirConteinerDeIndice(idPagina, null, null, () => {
        if (conteinerIndices.children().length == 0) {
          textoNenhumIndiceAdicionado = this._construirTextoNenhumIndiceAdicionado();
          conteinerIndices.append(textoNenhumIndiceAdicionado);
        }
      }));
    });

    let textoLegendaFieldsetIndices = $('<span>')
    .append('Índices')
    .css(this.styles.textoLegendaFieldsetIndices);

    let legendaFielsetIndices = $('<legend>')
    .append(textoLegendaFieldsetIndices)
    .append(botaoAdicionarIndice);

    let fielsetIndices = $('<fieldset>')
    .css(this.styles.fielsetIndices)
    .append(legendaFielsetIndices)
    .append(conteinerIndices);

    return fielsetIndices;
  }

  pesquisarIndices(callback) {
    let that = this;

    let listaIndices = $('<div>');
    let indices = [];
    this._listarIndices().each((indice) => {
      indices.push(indice);
    })
    .then(() => {
      indices.sort((a, b) => {
        return a.valor > b.valor;
      });
      for (let i = 0; i < indices.length; i++) {

        let listaAssociacoes = $('<ul>')
        .css(that.styles.listaAssociacoes);

        that._listarAssociacoes(indices[i].id).each((associacao) => {

          let itemAssociacao = $('<li>')
          .css(that.styles.itemAssociacao)
          .text('Pág. ' + associacao.idPagina)
          .on('click', () => {
            callback(associacao.idPagina);
          });

          listaAssociacoes.append(itemAssociacao);
        }).then(() => {
          let linhaIndice = $('<div>')
          .css(that.styles.linhaIndice)
          .append(indices[i].valor)
          .append(listaAssociacoes);

          listaIndices.append(linhaIndice);
        });
      }
    });
    return listaIndices;
  }

  semIndices() {
    return this._listarIndices().count((quantidade) => {
      return quantidade == 0;
    });
  }
}
