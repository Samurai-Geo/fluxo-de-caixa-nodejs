const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const Caixa = sequelize.define('caixa', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    tipo: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    valor: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'caixa', // Nome da tabela no banco de dados
    timestamps: false,   // Adiciona createdAt e updatedAt
});

module.exports = Caixa;
