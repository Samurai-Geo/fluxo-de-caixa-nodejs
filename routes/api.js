const express = require('express');
const router = express.Router();
const Caixa = require('../models/caixa.js');

// Listar Lançamentos
router.get('/caixas', async (req, res) => {
  try {
    const lancamentos = await Caixa.findAll();

    const receitas = lancamentos
      .filter(item => item.valor > 0)
      .reduce((total, item) => total + item.valor, 0);

    const despesas = lancamentos
      .filter(item => item.valor < 0)
      .reduce((total, item) => total + Math.abs(item.valor), 0);

    const valorTotal = receitas - despesas;

    const extrato = lancamentos.map(item => ({
      id: item.id,
      tipo: item.tipo,
      valor: item.valor,
      status: item.status === 0 ? 'Receita' : 'Despesa',
    }));

    res.send({ title: 'Fluxo de Caixa', valorTotal, receitas, despesas, extrato });
  } catch (err) {
    console.error('Erro ao buscar dados de Caixa:', err);
    res.status(500).send({ message: 'Erro ao buscar dados de Caixa', error: err });
  }
});

// Excluir Lançamento
router.delete('/caixas/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    const registro = await Caixa.findByPk(id);
    if (registro) {
      await registro.destroy();
      return res.status(204).send({ mensagem: `Registro ${id} excluído com sucesso` });
    } else {
      return res.status(404).send({ mensagem: `Registro ${id} inexistente` });
    }
  } catch (err) {
    next(err);
  }
});

// Cadastrar Novo Lançamento
router.post('/caixas', async (req, res, next) => {
  try {
    const { tipo, valor, status } = req.body;

    if (isNaN(valor)) {
      return res.status(400).send({ message: 'Valor inválido' });
    }

    const caixa = await Caixa.create({
      tipo,
      valor: parseFloat(valor),
      status: parseInt(status, 10),
    });

    res.status(201).redirect('/'); // muda oque é so uma barr para /api/caixas
  } catch (err) {
    next(err);
  }
});

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const Caixa = require('../models/caixa.js'); // Importa o modelo

// router.get('/caixas', async (req, res) => {
//   try {
//     // Obtém todos os lançamentos
//     const lancamentos = await Caixa.findAll();

//     // Calcula os valores de receitas, despesas e valor total
//     let receitas = lancamentos
//       .filter(item => item.valor > 0)
//       .reduce((total, item) => total + item.valor, 0);
//     let despesas = lancamentos
//       .filter(item => item.valor < 0)
//       .reduce((total, item) => total + Math.abs(item.valor), 0);
//     let valorTotal = receitas - despesas;

//     // Formatando valores
//     receitas = receitas;
//     despesas = despesas;
//     valorTotal = valorTotal;

//     // Formatando os valores do extrato
//     const extrato = lancamentos.map(item => ({
//       id: item.id,
//       tipo: item.tipo,
//       valor: item.valor,
//       status: item.status === 0 ? 'Receita' : 'Despesa', // Formata o status
//     }));

//     res.send({
//       title: 'Fluxo de Caixa',
//       valorTotal,
//       receitas,
//       despesas,
//       extrato
//     });
//   } catch (err) {
//     console.error('Erro ao buscar dados de Caixa:', err);
//     res.status(500).send({ message: 'Erro ao buscar dados de Caixa', error: err });

//   }
// });

// // ROTA DO EXCLUIR
// router.delete('/caixas/:id', async (req, res, next) => {
//   try {
//     const id = req.params.id; // Obtém o ID do registro a ser excluído

//     // Tenta encontrar e excluir o registro no banco de dados
//     const registro = await Caixa.findByPk(id);
//     if (registro) {
//       await registro.destroy(); // Exclui o registro
//       return res.status(204).send({ mensagem: `Registro ${id} excluído com sucesso` });

//     } else {
//       return res.status(404).send({ mensagem: `Registro ${id} inexistente` });

//     }

//   } catch (err) {
//     next(err);
//   }
// });

// // ROTA CADASTRAR
// router.post('/caixas', async (req, res, next) => {
//   // if (isNaN(valor)) {
//   //   return res.status(400).send({ message: 'Valor inválido' });
//   // }

//   try {
//     const { tipo, valor, status } = req.body;

//     // Cria um novo registro no banco de dados
//     const caixa = await Caixa.create({
//       tipo,
//       valor: parseFloat(valor), // Converte o valor para float
//       status: parseInt(status, 10), // Converte o status para inteiro
//     });

//     res.status(201).send(caixa); // Redireciona para a página inicial após o cadastro
//   } catch (err) {
//     next(err);
//   }
// });



// module.exports = router;
