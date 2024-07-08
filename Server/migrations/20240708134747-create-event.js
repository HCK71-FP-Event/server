'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull:false
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull:false
      },
      location: {
        type: Sequelize.GEOMETRY,
        allowNull:false
      },
      CategoryId: {
        type: Sequelize.INTEGER
      },
      eventDate: {
        type: Sequelize.DATE
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull:false

      },
      isFree: {
        type: Sequelize.BOOLEAN,
        allowNull:false

      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Events');
  }
};