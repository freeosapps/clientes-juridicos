class Pagina {
  constructor(id) {
    this.db = new Dexie('ClientesJuridicos');
    this.db.version(1).stores({
      imagens: '++id,idPagina,dataUri'
    });
    this.db.open()
    .catch((error) => {
      throw error;
    });
    this.id = id;
    this.styles = {
      campoArquivo: {
        display: 'none'
      },
      anexarImagens: {
        display: 'inline-block',
        borderStyle: 'double',
        borderWidth: 6,
        borderColor: 'white',
        borderRadius: 25,
        padding: 10,
        fontFamily: 'arial',
        backgroundColor: 'cornflowerblue',
        fontWeight: 'bold',
        color: 'white',
        cursor: 'pointer'
      },
      iconeFechar: {
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
        cursor: 'pointer'
      },
      conteinerImagem: {
        padding: 5,
        borderStyle: 'dotted',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 15,
        textAlign: 'center',
        margin: 5,
        backgroundColor: 'white'
      },
      conteiner: {
        display: 'flex',
        flexDirection: 'column'
      },
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
      conteinerAnexarImagens: {
        margin: 5
      },
      botaoAdicionarIndice: {
        borderStyle: 'none',
        backgroundColor: 'lightgreen',
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 50,
        padding: 5,
        width: 30,
        height: 30,
        cursor: 'pointer'
      },
      botaoRemoverIndice: {
        borderStyle: 'none',
        backgroundColor: 'lightcoral',
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 50,
        padding: 5,
        width: 30,
        height: 30,
        display: 'none',
        cursor: 'pointer'
      },
      textoLegendaFieldsetIndices: {
        margin: 5
      }
    };
  }

  _armazenarImagem(dataUri) {
    return this.db.imagens.add({
      idPagina: this.id,
      dataUri: dataUri
    });
  }

  _removerImagem(id) {
    return this._obterImagem(id).delete();
  }

  _obterImagem(id) {
    return this.db.imagens.where({idPagina: this.id, id: id});
  }

  _listarImagens() {
    return this.db.imagens.where({idPagina: this.id});
  }

  _mostrarImagem(dataUri, id) {
    let imagem = $('<img>');

    let conteinerImagem = $('<div>');
    conteinerImagem.css(this.styles.conteinerImagem);

    let iconeFechar = $('<div>');
    iconeFechar.css(this.styles.iconeFechar);
    iconeFechar.text('x');
    iconeFechar.prop('title', 'Remover');
    iconeFechar.prop('alt', 'Remover');
    iconeFechar.on('click', () => {
      conteinerImagem.remove();
      this._removerImagem(id).catch((error) => {
        console.log(error);
      });
    });

    conteinerImagem.append(iconeFechar);
    conteinerImagem.append(imagem);

    imagem.prop('src', dataUri);

    return conteinerImagem;
  }

  construir() {
      let conteiner = $('<div>');
      conteiner.css(this.styles.conteiner);

      let conteinerImagens = $('<div>');

      let campoArquivo = $('<input>');
      campoArquivo.css(this.styles.campoArquivo);
      campoArquivo.prop('type', 'file');
      campoArquivo.prop('accept', 'image/*');
      campoArquivo.prop('multiple', 'true');
      let that = this;

      this._listarImagens(this.id).each((dadosImagem) => {
        conteinerImagens.append(that._mostrarImagem(dadosImagem.dataUri, dadosImagem.id));
      });

      campoArquivo.on('change', () => {
        for (let i = 0; i < campoArquivo[0].files.length; i++) {
          let arquivo = campoArquivo[0].files[i];
          let leitorArquivos = new FileReader();
          leitorArquivos.onload = (data) => {

            let loading = $('<img>');
            loading.prop('src', 'loading.gif');

            let conteinerLoading = $('<div>');
            conteinerLoading.css(that.styles.conteinerImagem);
            conteinerLoading.append(loading);

            conteinerImagens.append(conteinerLoading);

            that._armazenarImagem(data.target.result)
            .then((id) => {
              conteinerLoading.remove();
              conteinerImagens.append(that._mostrarImagem(data.target.result, id));
            });
          };
          leitorArquivos.readAsDataURL(arquivo);
        }
        campoArquivo.val('');
      });
      let anexarImagens = $('<label>');
      anexarImagens.css(this.styles.anexarImagens);
      anexarImagens.text('Anexar imagens');
      anexarImagens.append(campoArquivo);

      let indice = new Indice();

      let indices = [];
      indices.push(indice);

      let conteinerAnexarImagens = $('<div>');
      conteinerAnexarImagens.css(this.styles.conteinerAnexarImagens);
      conteinerAnexarImagens.append(anexarImagens);

      let botaoRemoverIndice = $('<button>');
      botaoRemoverIndice.prop('title', 'Remover um índice');
      botaoRemoverIndice.prop('alt', 'Remover um índice');
      botaoRemoverIndice.css(this.styles.botaoRemoverIndice);
      botaoRemoverIndice.text('-');
      botaoRemoverIndice.on('click', () => {
        if (indices.length > 1) {
          indices.pop();
          conteinerIndices.children().last().remove();
        }
        if (indices.length == 1) {
          botaoRemoverIndice.hide();
        }
      });

      let botaoAdicionarIndice = $('<button>');
      botaoAdicionarIndice.prop('title', 'Adicionar um índice');
      botaoAdicionarIndice.prop('alt', 'Adicionar um índice');
      botaoAdicionarIndice.css(this.styles.botaoAdicionarIndice);
      botaoAdicionarIndice.text('+');
      botaoAdicionarIndice.on('click', () => {
        let novoIndice = new Indice();
        indices.push(novoIndice);
        conteinerIndices.append(novoIndice.construir());
        botaoRemoverIndice.show();
      });

      let legendaFielsetIndices = $('<legend>');

      let textoLegendaFieldsetIndices = $('<span>');
      textoLegendaFieldsetIndices.append('Índices');
      textoLegendaFieldsetIndices.css(this.styles.textoLegendaFieldsetIndices);

      legendaFielsetIndices.append(botaoRemoverIndice);
      legendaFielsetIndices.append(textoLegendaFieldsetIndices);
      legendaFielsetIndices.append(botaoAdicionarIndice);

      let conteinerIndices = $('<span>');
      conteinerIndices.append(indice.construir());

      let fielsetIndices = $('<fieldset>');
      fielsetIndices.css(this.styles.fielsetIndices);
      fielsetIndices.append(legendaFielsetIndices);
      fielsetIndices.append(conteinerIndices);
      //fielsetIndices.append(botaoRemoverIndice);
      //fielsetIndices.append(botaoAdicionarIndice);

      conteiner.append(fielsetIndices);
      conteiner.append(conteinerAnexarImagens);
      conteiner.append(conteinerImagens);

      return conteiner;
  }
  mostrar() {

  }
  criarIndices() {

  }
}
