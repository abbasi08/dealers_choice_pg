const pg = require("pg");

const client = new pg.Client("postgres://localhost/dealers_choice_pg");

const syncAndSeed = async () => {
  const SQL = `
    DROP TABLE IF EXISTS sisters;
    DROP TABLE IF EXISTS city;

        CREATE TABLE city(
            id INTEGER PRIMARY KEY,
            name VARCHAR(25) NOT NULL
        );
        CREATE TABLE sisters(
            id INTEGER PRIMARY KEY,
            name VARCHAR(25) NOT NULL,
            city_id INTEGER REFERENCES city(id)
        );

        INSERT INTO city(id, name) VALUES(1, 'Austin');
        INSERT INTO city(id, name) VALUES(2, 'Birmingham');
        INSERT INTO city(id, name) VALUES(3, 'Glasgow');
        INSERT INTO city(id, name) VALUES(4, 'Karachi');
        INSERT INTO sisters(id, name, city_id) VALUES(1, 'Violet', 1);
        INSERT INTO sisters(id, name, city_id) VALUES(2, 'Shubnam', 2);
        INSERT INTO sisters(id, name, city_id) VALUES(3, 'Tubassum', 2);
        INSERT INTO sisters(id, name, city_id) VALUES(4, 'Nadia', 3);
        INSERT INTO sisters(id, name, city_id) VALUES(5, 'Aroosa', 4);

        `;
  await client.query(SQL);
};

module.exports = {
  client,
  syncAndSeed,
};
