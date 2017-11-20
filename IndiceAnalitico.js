class IndiceAnalitico {
  constructor() {
    this.db = new Dexie('ClientesJuridicos');
    this.db.version(1).stores({
      indices: '++id,idCategoria,valor',
      associacoesIndicePagina: '++id,idIndice,idPagina',
      categorias: '++id,valor'
    });
    this.db.open();
    this._adicionarCategorias();
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
        marginRight: 10,
        marginTop: 5,
        marginBottom: 5,
        display: 'inline-block'
      },
      campoTextoIndice: {
        padding: 5,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: 'cornflowerblue',
        backgroundColor: 'white',
        marginRight: 5,
        height: 30,
        borderRadius: '0 5px 5px 0'
      },
      campoSelecaoCategoria: {
        padding: 5,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: 'cornflowerblue',
        backgroundColor: 'cornflowerblue',
        color: 'white',
        marginRight: 0,
        height: 30,
        borderRadius: '5px 0 0 5px',
        fontWeight: 'normal'
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
      listaAssociacoesIndicePagina: {
        marginTop: 0,
        marginBottom: 0
      },
      valorCategoria: {
        fontWeight: 'bold'
      }
    };
  }

  _listarCategorias() {
    return this.db.categorias;
  }

  _adicionarCategorias() {
    return this._listarCategorias().count((quantidade) => {
      if (quantidade == 0) {
        this.db.categorias
        .add({
          valor: 'Nome do cliente'
        });
        this.db.categorias
        .add({
          valor: 'RG do cliente'
        });
        this.db.categorias
        .add({
          valor: 'CPF do cliente'
        });
        this.db.categorias
        .add({
          valor: 'Endereço do cliente'
        });
        this.db.categorias
        .add({
          valor: 'Situação do processo'
        });
        this.db.categorias
        .add({
          valor: 'Ação'
        });
        this.db.categorias
        .add({
          valor: 'Natureza do processo'
        });
        this.db.categorias
        .add({
          valor: 'Fase do processo'
        });
        this.db.categorias
        .add({
          valor: 'Advogado responsável'
        });
        this.db.categorias
        .add({
          valor: 'Posição do cliente'
        });
      }
    });
  }

  _adicionarIndice(idCategoria, valor) {
    return this.db.indices.add({
      valor: valor,
      idCategoria: idCategoria
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

  _listarAssociacoesIndicePagina(idIndice, idPagina) {
    if (idIndice && idPagina) {
      return this.db.associacoesIndicePagina.where({
        idIndice: idIndice,
        idPagina: idPagina
      });
    } else if (idPagina) {
      return this.db.associacoesIndicePagina.where({
        idPagina: idPagina
      });
    } else {
      return this.db.associacoesIndicePagina.where({
        idIndice: idIndice
      });
    }
  }

  _adicionarAssociacao(idIndice, idPagina) {
    return this.db.associacoesIndicePagina.add({
      idIndice: idIndice,
      idPagina: idPagina
    })
  }

  _removerAssociacao(idIndice, idPagina) {
    return this.db.associacoesIndicePagina.where({idIndice: idIndice, idPagina: idPagina}).delete();
  }

  _alterarIndice(idIndice, dadosAlteracao) {
    return this.db.indices.update(idIndice, dadosAlteracao);
  }

  _persistirAlteracoes(campoSelecaoCategoria, campoTextoIndice, idPagina) {
    let that = this;
    let id = $.data(campoTextoIndice, 'id');
    let idCategoria = parseInt(campoSelecaoCategoria.val(), 10);
    let valor = campoTextoIndice.val();
    if (id) {
      if (valor.trim()) {
        that._listarIndices(valor)
        .first((indice) => {
          if (indice && indice.id != id) {
            that._removerAssociacao(id, idPagina);
            that._removerIndice(id);
            that._adicionarAssociacao(indice.id, idPagina);
            $.data(campoTextoIndice, 'id', indice.id);
          } else {
            that._removerAssociacao(id, idPagina);
            that._listarAssociacoesIndicePagina(id).first((associacao) => {
              if (!associacao) {
                that._removerIndice(id);
                that._adicionarIndice(idCategoria, valor)
                .then((id) => {
                  that._adicionarAssociacao(id, idPagina);
                  $.data(campoTextoIndice, 'id', id);
                });
              } else {
                that._adicionarAssociacao(id, idPagina);
              }
            });
          }
        });
      } else {
        that._removerAssociacao(id, idPagina);
        that._removerIndice(id);
        $.data(campoTextoIndice, 'id', '');
      }
    } else {
      if (valor.trim()) {
        that._listarIndices(valor)
        .first((indice) => {
          if (indice) {
            that._alterarIndice(indice.id, {idCategoria: idCategoria});

            that._listarAssociacoesIndicePagina(indice.id, idPagina)
            .first((associacao) => {
              if (!associacao) {
                that._adicionarAssociacao(indice.id, idPagina)
                .then((id) => {
                  $.data(campoTextoIndice, 'id', id);
                });
              } else {
                $.data(campoTextoIndice, 'id', indice.id);
              }
            });
          } else {
            that._adicionarIndice(idCategoria, valor)
            .then((id) => {
              $.data(campoTextoIndice, 'id', id);
              that._adicionarAssociacao(id, idPagina);
            });
          }
        });
      }
    }
  }

  _construirConteinerDeIndice(categorias, idCategoria, idPagina, idIndice, valor, aoRemover) {
    let that = this;

    let conteinerIndice = $('<div>')
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
        that._listarAssociacoesIndicePagina(id)
        .first((associacao) => {
          if (!associacao) {
            that._removerIndice(id);
          }
        });
      }
      aoRemover();
    });

    let campoSelecaoCategoria = $('<select>')
    .css(this.styles.campoSelecaoCategoria)
    .on('change', () => {
      campoSelecaoCategoria
      .val(campoSelecaoCategoria.val().replace(/\s+$/, ''))
      .prop('title', campoSelecaoCategoria.text())
      .prop('alt', campoSelecaoCategoria.text());

      that._persistirAlteracoes(campoSelecaoCategoria, campoTextoIndice, idPagina);
    });

    for (let i = 0; i < categorias.length; i++) {
      let opcao = $('<option>')
      .prop('value', categorias[i].id)
      .text(categorias[i].valor);

      campoSelecaoCategoria
      .append(opcao);
    }

    campoSelecaoCategoria
    .val(idCategoria);

    let campoTextoIndice = $('<input>')
    .prop('type', 'text')
    .attr('list', 'indices')
    .css(this.styles.campoTextoIndice)
    .on('blur', () => {
      campoTextoIndice
      .val(campoTextoIndice.val().replace(/\s+$/, ''))
      .prop('title', campoTextoIndice.val())
      .prop('alt', campoTextoIndice.val());

      that._persistirAlteracoes(campoSelecaoCategoria, campoTextoIndice, idPagina);
    })
    .on('keyup', () => {
      campoTextoIndice
      .val(campoTextoIndice.val().replace(/^\s+/, ''));
    });

    if (valor) {
      campoTextoIndice
      .val(valor)
      .prop('title', campoTextoIndice.val())
      .prop('alt', campoTextoIndice.val());
    }

    let listaIndices = $('<datalist>')
    .prop('id', 'indices');

    let indices = [];
    this._listarIndices()
    .each((indice) => {
      indices.push(indice);
    })
    .then(() => {
      indices = that._ordenarIndices(indices);
      for (let i = 0; i < indices.length; i++) {

        let opcao = $('<option>')
        .val(indices[i].valor);

        listaIndices
        .append(opcao);
      }
    });

    conteinerIndice.append(listaIndices)
    .append(campoSelecaoCategoria)
    .append(campoTextoIndice)
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

  _ordenarIndices(indices) {
    return indices
    .sort((a, b) => {
      return a.valor.toUpperCase() > b.valor.toUpperCase();
    });
  }

  construirIndices(idPagina) {
    let that = this;

    let conteinerIndices = $('<span>');
    let textoNenhumIndiceAdicionado = this._construirTextoNenhumIndiceAdicionado();

    let idsIndices = [];

    this._listarAssociacoesIndicePagina(null, idPagina)
    .each((associacao) => {
      idsIndices.push(associacao.idIndice);
    })
    .then(() => {
      let categorias = [];
      that._listarCategorias()
      .each((categoria) => {
        categorias.push(categoria);
      })
      .then(() => {
        if (idsIndices.length > 0) {
          let query = that._listarIndices(null, idsIndices)
          .each((indice) => {
            conteinerIndices.append(that._construirConteinerDeIndice(categorias, indice.idCategoria, idPagina, indice.id, indice.valor, () => {
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
    });

    let botaoAdicionarIndice = $('<button>')
    .text('+')
    .prop('title', 'Adicionar um índice')
    .prop('alt', 'Adicionar um índice')
    .css(this.styles.botaoAdicionarIndice)
    .on('click', () => {
      if (textoNenhumIndiceAdicionado) {
        textoNenhumIndiceAdicionado.remove();
      }
      let categorias = [];
      that._listarCategorias()
      .each((categoria) => {
        categorias.push(categoria);
      })
      .then(() => {
        conteinerIndices.append(that._construirConteinerDeIndice(categorias, categorias[0].id, idPagina, null, null, () => {
          if (conteinerIndices.children().length == 0) {
            textoNenhumIndiceAdicionado = this._construirTextoNenhumIndiceAdicionado();
            conteinerIndices.append(textoNenhumIndiceAdicionado);
          }
        }));
      });
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

  pesquisarIndices(aoEscolherPagina) {
    let that = this;

    let listaIndices = $('<div>');
    let indices = [];
    this._listarIndices().each((indice) => {
      indices.push(indice);
    })
    .then(() => {
      indices = that._ordenarIndices(indices);
      for (let i = 0; i < indices.length; i++) {

        let listaAssociacoesIndicePagina = $('<ul>')
        .css(that.styles.listaAssociacoesIndicePagina);

        that._listarAssociacoesIndicePagina(indices[i].id).each((associacao) => {

          let itemAssociacao = $('<li>')
          .text('Pág. ' + associacao.idPagina)
          .css(that.styles.itemAssociacao)
          .on('click', () => {
            aoEscolherPagina(associacao.idPagina);
          });

          listaAssociacoesIndicePagina.append(itemAssociacao);
        }).then(() => {
          that._listarCategorias().get(indices[i].idCategoria, (categoria) => {
            let valorCategoria = $('<span>')
            .css(that.styles.valorCategoria)
            .text(categoria.valor + ':')
            .append('&nbsp;');


            let linhaIndice = $('<div>')
            .css(that.styles.linhaIndice)
            .append(valorCategoria)
            .append(indices[i].valor)
            .append(listaAssociacoesIndicePagina);

            listaIndices.append(linhaIndice);
          });

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
