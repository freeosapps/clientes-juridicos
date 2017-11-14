$(() => {
  let tabela = new Tabela();
  let containerTabela = $('<div>');
  containerTabela.css({
    marginTop: 5,
    marginBottom: 5
  });
  let containerFiltros = $('<div>');
  containerFiltros.css({
    display: 'flex',
    marginTop: 5,
    marginBottom: 5
  });
  containerTabela.append(tabela.desenhar());

  $(document.body).append(containerFiltros);
  $(document.body).append(containerTabela);

  let filtros = [];

  function adicionarFiltro(placeholder, title) {
    let input = $('<input>');
    input.prop('placeholder', placeholder);
    input.prop('title', title);
    input.prop('alt', title);
    input.css({
      flex: 1,
      borderRadius: 50,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: 'gray',
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 10,
      paddingRight: 10
    });
    input.on('keyup', () => {
      let intersecaoIndices = [];
      tabela.percorrerAltura(0, (i, celula) => {
        if (celula.contem(filtros[0].val())) {
          intersecaoIndices.push(i);
        }
      });
      for (let j = 1; j < filtros.length; j++) {
        let indices = [];
        tabela.percorrerAltura(j, (i, celula) => {
          if (celula.contem(filtros[j].val())) {
            indices.push(i);
          }
        });
        intersecaoIndices = indices.filter(x => {
          return intersecaoIndices.indexOf(x) > -1;
        });
      }
      containerTabela.empty();
      containerTabela.append(tabela.projetarAltura(intersecaoIndices));
    });
    filtros.push(input);
    containerFiltros.append(input);
  }

  function removerFiltro() {
    if (filtros.length > 1) {
      filtros[filtros.length - 1].remove();
      filtros.splice(filtros.legnth - 1, 1);
    }
  }

  function redesenharTabela() {
    containerTabela.empty();
    containerTabela.append(tabela.desenhar());
  }

  adicionarFiltro('Nome', 'Pesquisar por nome');
  adicionarFiltro('RG', 'Pesquisar por RG');
  adicionarFiltro('CPF', 'Pesquisar por CPF');
  adicionarFiltro('Endereço', 'Pesquisar por endereço');

  tabela.ampliarLargura();
  tabela.ampliarLargura();
  tabela.ampliarLargura();
  tabela.ampliarAltura();
  redesenharTabela();

  let ampliarAltura = $('<button>');
  ampliarAltura.css({
    width: 30,
    height: 30,
    fontWeight: 'bold'
  });
  ampliarAltura.on('click', () => {
    tabela.ampliarAltura();
    redesenharTabela();
  });
  ampliarAltura.text('+');
  $(document.body).append(ampliarAltura);

  let reduzirAltura = $('<button>');
  reduzirAltura.css({
    width: 30,
    height: 30,
    fontWeight: 'bold'
  });
  reduzirAltura.on('click', () => {
    tabela.reduzirAltura();
    redesenharTabela();
  });
  reduzirAltura.text('-');
  $(document.body).append(reduzirAltura);
});
