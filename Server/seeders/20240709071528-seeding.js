"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    let dataCategory = require(`../data/category.json`).map((el) => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    });

    let dataEvent = require(`../data/event.json`).map((el) => {
      el.createdAt = el.updatedAt = new Date();
      el.location = Sequelize.fn(
        "ST_GeomFromText",
        `POINT(${el.location.coordinates.long} ${el.location.coordinates.lat})`
      );
      return el;
    });

    await queryInterface.bulkInsert("Categories", dataCategory, {});
    await queryInterface.bulkInsert("Events", dataEvent, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Categories", null, {});
    await queryInterface.bulkDelete("Events", null, {});
  },
};
