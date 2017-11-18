class Pagina {
  constructor(id) {
    this.db = new Dexie('ClientesJuridicos');
    this.db.version(1).stores({
      imagens: '++id,idPagina,dataUri'
    });
    this.db.open();
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
        padding: 5,
        fontFamily: 'arial',
        backgroundColor: 'cornflowerblue',
        fontWeight: 'bold',
        color: 'white',
        cursor: 'pointer'
      },
      iconeRemover: {
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
      conteinerAnexarImagens: {
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

    let iconeRemover = $('<div>');
    iconeRemover.css(this.styles.iconeRemover);
    iconeRemover.text('x');
    iconeRemover.prop('title', 'Remover');
    iconeRemover.prop('alt', 'Remover');
    iconeRemover.on('click', () => {
      conteinerImagem.remove();
      this._removerImagem(id);
    });

    conteinerImagem.append(iconeRemover);
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

      let conteinerAnexarImagens = $('<div>');
      conteinerAnexarImagens.css(this.styles.conteinerAnexarImagens);
      conteinerAnexarImagens.append(anexarImagens);

      conteiner.append(conteinerAnexarImagens);
      conteiner.append(conteinerImagens);

      return conteiner;
  }
  mostrar() {

  }
  criarIndices() {

  }
}
