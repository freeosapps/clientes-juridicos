class Celula {
  constructor() {
    this.input = $('<input>');
  }
  contem(conteudo) {
    if (!conteudo) {
      return true;
    } else {
      return this.input.val().match(new RegExp(conteudo, 'g'));
    }
  }
  desenhar() {
    this.input.css({
      flex: 1,
      borderRadius: 50,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: 'lightgray',
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 10,
      paddingRight: 10
    });
    return this.input;
  }
}
