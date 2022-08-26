const knex = require('../db/knex.config')

class UserController {
    constructor() {
        this.table = 'users'

        knex.schema.hasTable('users').then(function (exists) {
            if (!exists) {
                return knex.schema.createTable('users', function (t) {
                    t.increments('id').primary();
                    t.string('name', 100).notNullable();
                    t.string('email', 100).notNullable();
                    t.date('birth_date', 6).notNullable();
                    t.enum('favourite_language', ['JavaScript', 'Python', 'Java', '.Net', 'PHP']);
                    t.string('password', 100).notNullable();
                }).then(() => {
                    console.log('* Table created "users"')
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

    async getByEmail(email) {
        try {
            return await knex.from(`${this.table}`).where({ email: email }).select()
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

let controllerInstance = new UserController()

module.exports = controllerInstance