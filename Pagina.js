class Pagina {
  constructor(id) {
    this.db = new Dexie('ClientesJuridicos');
    this.db.version(1).stores({
      arquivos: '++id,idPagina,nome,tipo,dataUri'
    });
    this.db.open();
    this.id = id;
    this.styles = {
      campoArquivo: {
        display: 'none'
      },
      anexarArquivos: {
        display: 'inline-block',
        borderStyle: 'double',
        borderWidth: 6,
        borderColor: 'white',
        borderRadius: 5,
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
      conteinerArquivo: {
        padding: 5,
        borderStyle: 'dotted',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        textAlign: 'center',
        margin: 5,
        backgroundColor: 'white'
      },
      conteiner: {
        display: 'flex',
        flexDirection: 'column'
      },
      conteinerAnexarArquivos: {
        margin: 5
      },
      arquivo: {
        display: 'block'
      }
    };
  }

  _armazenarArquivo(tipo, nome, dataUri) {
    return this.db.arquivos.add({
      idPagina: this.id,
      dataUri: dataUri,
      nome: nome,
      tipo: tipo
    });
  }

  _removerArquivo(id) {
    return this._obterArquivo(id).delete();
  }

  _obterArquivo(id) {
    return this.db.arquivos.where({idPagina: this.id, id: id});
  }

  _listarArquivos() {
    return this.db.arquivos.where({idPagina: this.id});
  }

  _dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      var byteString = atob(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to an ArrayBuffer
      var arrayBuffer = new ArrayBuffer(byteString.length);
      var _ia = new Uint8Array(arrayBuffer);
      for (var i = 0; i < byteString.length; i++) {
          _ia[i] = byteString.charCodeAt(i);
      }

      var dataView = new DataView(arrayBuffer);
      var blob = new Blob([dataView], { type: mimeString });
      return blob;
  }

  _mostrarArquivo(nome, tipo, dataUri, id) {

    let conteinerArquivo = $('<div>')
    .css(this.styles.conteinerArquivo);

    let iconeRemover = $('<div>')
    .css(this.styles.iconeRemover)
    .text('x')
    .prop('title', 'Remover')
    .prop('alt', 'Remover')
    .on('click', () => {
      conteinerArquivo.remove();
      this._removerArquivo(id);
    });

    conteinerArquivo
    .append(iconeRemover)

    if (tipo.startsWith('image/')) {
      let imagem = $('<img>')
      .prop('src', dataUri);

      conteinerArquivo.append(imagem);
    }

    let arquivo = $('<a>')
    .css(this.styles.arquivo)
    .attr('href', window.URL.createObjectURL(this._dataURItoBlob(dataUri)))
    .attr('download', nome)
    .text(nome);

    conteinerArquivo
    .append(arquivo);

    return conteinerArquivo;
  }

  construir() {
    let that = this;

      let conteiner = $('<div>')
      .css(this.styles.conteiner);

      let conteinerArquivos = $('<div>');

      let campoArquivo = $('<input>')
      .css(this.styles.campoArquivo)
      .prop('type', 'file')
      .prop('multiple', 'true')
      .on('change', () => {
        for (let i = 0; i < campoArquivo[0].files.length; i++) {
          let arquivo = campoArquivo[0].files[i];
          let leitorArquivos = new FileReader();
          leitorArquivos.onload = (data) => {

            let loading = $('<img>');
            loading.prop('src', 'loading.gif');

            let conteinerLoading = $('<div>');
            conteinerLoading.css(that.styles.conteinerArquivo);
            conteinerLoading.append(loading);

            conteinerArquivos.append(conteinerLoading);

            that._armazenarArquivo(arquivo.type, arquivo.name, data.target.result)
            .then((id) => {
              conteinerLoading.remove();
              conteinerArquivos.append(that._mostrarArquivo(arquivo.name, arquivo.type, data.target.result, id));
            });
          };
          leitorArquivos.readAsDataURL(arquivo);
        }
        campoArquivo.val('');
      });

      this._listarArquivos(this.id).each((dadosArquivo) => {
        conteinerArquivos.append(that._mostrarArquivo(dadosArquivo.nome, dadosArquivo.tipo, dadosArquivo.dataUri, dadosArquivo.id));
      });

      let anexarArquivos = $('<label>')
      .css(this.styles.anexarArquivos)
      .text('Anexar arquivos')
      .append(campoArquivo);

      let conteinerAnexarArquivos = $('<div>')
      .css(this.styles.conteinerAnexarArquivos)
      .append(anexarArquivos);

      conteiner
      .append(conteinerAnexarArquivos)
      .append(conteinerArquivos);

      return conteiner;
  }
}
