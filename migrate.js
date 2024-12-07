const sequelize = require('./config/database.js');
const Caixa = require('./models/caixa.js');

sequelize.sync()
    .then(() => {
        console.log('Tabela Caixas criada com sucesso!');
    })
    .catch((error) => {
        console.error('Erro ao criar a tabela:', error);
    });

// (async () => {
//     try {
//       const novoCaixa = await Caixa.create({
//         tipo: 'Entrada',
//         valor: 100.50,
//         status: 1,
//       });
//       console.log('Novo registro criado:', novoCaixa.toJSON());
//     } catch (err) {
//       console.error('Erro ao criar registro:', err);
//     }
//   })();
