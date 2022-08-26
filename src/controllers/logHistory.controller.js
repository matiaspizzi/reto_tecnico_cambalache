const knex = require('../db/knex.config')

class LogHistoryController {
    constructor() {
        this.table = 'log_history'

        knex.schema.hasTable('log_history').then(function (exists) {
            if (!exists) {
                return knex.schema.createTable('log_history', function (t) {
                    t.increments('id').primary();
                    t.datetime('date_time').defaultTo(knex.fn.now()).notNullable();
                    t.enum('type', ['login', 'logout', 'signup']).notNullable();
                    t.string('user_id').notNullable();
                }).then(() => {
                    console.log('log_history table created')
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

    async getByUserId(id) {
        try {
            return await knex.from(`${this.table}`).where({ user_id: id }).select()
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

    async deleteById(id) {
        try {
            return await knex.from(`${this.table}`).where({ id: id }).del()
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}

let controllerInstance = new LogHistoryController()

module.exports = controllerInstance