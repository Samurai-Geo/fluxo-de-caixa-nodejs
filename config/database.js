const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('fluxo_caixinha', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql', // ou 'postgres', 'sqlite', 'mssql'
});

module.exports = sequelize;
