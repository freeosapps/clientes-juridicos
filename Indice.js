class Indice {
  constructor(id) {
    this.id = id;
    this.db = new Dexie('ClientesJuridicos');
    this.db.version(1).stores({
      indices: '++id,idPagina'
    });
    this.db.open()
    .catch((error) => {
      throw error;
    });
    this.styles = {
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
  construir(idPagina) {
    let that = this;
    let campoTexto = $('<input>');
    campoTexto.css(this.styles.campoTexto);
    campoTexto.on('blur', () => {
      return this.db.indices.add({
        idPagina: idPagina
      })
      .then((id) => {
        that.id = id;
      });
    });
    campoTexto.prop('type', 'text');
    return campoTexto;
  }
  mostrar() {

  }
  contem(outroIndice) {

  }
}
