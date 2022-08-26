const knex = require('../db/knex.config');

class RepositoriesController {
    constructor() {
        this.table = 'repositories'

        knex.schema.hasTable('repositories').then(function (exists) {
            if (!exists) {
                return knex.schema.createTable('repositories', function (t) {
                    t.increments('id').primary();
                    t.string('project_name', 100).notNullable();
                    t.enum('language', ['JavaScript', 'Python', 'Java', '.Net', 'PHP']).notNullable();
                    t.datetime('created_at').defaultTo(knex.fn.now()).notNullable();
                    t.string('description', 100);
                }).then(() => {
                    console.log('Repositories table created')
                }).catch((err) => {
                    console.log(err)
                    throw err
                });
            }
        });
    }

    async getAll() {
        try {
            return await knex.from(`${this.table}`).select("*")
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async getByName(name) {
        try {
            return await knex.from(`${this.table}`).where({ project_name: name }).select()
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async getById(id) {
        try {
            return await knex.from(`${this.table}`).where({ id: id }).select()
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async save(obj) {
        try {
            return await knex(`${this.table}`).insert(obj)
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async update(obj, id) {
        try {
            return await knex(`${this.table}`).update(obj).where({ id: id })
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async deleteById(id) {
        try {
            return await knex.from(`${this.table}`).where({ id: id }).del()
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}

let controllerInstance = new RepositoriesController()

module.exports = controllerInstance