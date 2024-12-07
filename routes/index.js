const express = require('express');
const router = express.Router();
const Caixa = require('../models/caixa.js'); // Importa o modelo

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

router.get('/', async (req, res) => {
  try {
    // Obtém todos os lançamentos
    const lancamentos = await Caixa.findAll();

    // Calcula os valores de receitas, despesas e valor total
    let receitas = lancamentos
      .filter(item => item.valor > 0)
      .reduce((total, item) => total + item.valor, 0);
    let despesas = lancamentos
      .filter(item => item.valor < 0)
      .reduce((total, item) => total + Math.abs(item.valor), 0);
    let valorTotal = receitas - despesas;

    // Formatando valores
    receitas = formatarMoeda(receitas);
    despesas = formatarMoeda(despesas);
    valorTotal = formatarMoeda(valorTotal);

    // Formatando os valores do extrato
    const extrato = lancamentos.map(item => ({
      id: item.id,
      tipo: item.tipo,
      valor: formatarMoeda(item.valor),
      status: item.status === 0 ? 'Receita' : 'Despesa', // Formata o status
    }));

    // Renderiza o template com os dados
    res.render('index', {
      title: 'Fluxo de Caixa',
      valorTotal,
      receitas,
      despesas,
      extrato,
      formatarStatus: (status) => {
        return status === 1 ? "Receita" : "Despesa"
      },
      corStatus: (status) => {
        return status === "Receita" ? '#1aff66' : '#ff6666'
      } // Extrato com valores formatados
    });
  } catch (err) {
    console.error('Erro ao buscar dados de Caixa:', err);
    res.render('index', {
      title: 'Fluxo de Caixa',
      valorTotal: formatarMoeda(0),
      receitas: formatarMoeda(0),
      despesas: formatarMoeda(0),
      extrato: [],
    });
  }
});

// ROTA DO EXCLUIR
router.get('/excluir/:id', async (req, res) => {
  try {
    const id = req.params.id; // Obtém o ID do registro a ser excluído

    // Tenta encontrar e excluir o registro no banco de dados
    const registro = await Caixa.findByPk(id);
    if (registro) {
      await registro.destroy(); // Exclui o registro
      console.log(`Registro com ID ${id} excluído com sucesso.`);
    } else {
      console.log(`Registro com ID ${id} não encontrado.`);
    }

    // Redireciona para a página inicial
    res.redirect('/');
  } catch (err) {
    console.error('Erro ao excluir registro:', err);
    res.redirect('/'); // Redireciona mesmo em caso de erro
  }
});

// ROTA ADICIONAR
router.get('/adicionar', (req, res) => {
  res.render('adicionar'); // Renderiza o arquivo adicionar.ejs
});



// ROTA CADASTRAR
router.post('/cadastrar', async (req, res) => {
  try {
    const { tipo, valor, status } = req.body;

    // VALIDAÇÃO
    if (!tipo || !valor || isNaN(valor)) {
      return res.redirect('/adicionar'); // Redireciona caso haja dados inválidos
    }

    // Cria um novo registro no banco de dados
    await Caixa.create({
      tipo,
      valor: parseFloat(valor), // Converte o valor para float
      status: parseInt(status, 10), // Converte o status para inteiro
    });

    console.log('Novo lançamento cadastrado com sucesso!');
    res.redirect('/'); // Redireciona para a página inicial após o cadastro
  } catch (err) {
    console.error('Erro ao cadastrar lançamento:', err);
    res.redirect('/adicionar'); // Redireciona de volta para o formulário em caso de erro
  }
});



module.exports = router;
