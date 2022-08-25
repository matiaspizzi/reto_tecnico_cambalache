const knex = require('../db/database')

class LoginHistoryController{
    constructor(){

        knex.schema.hasTable('loginHistory').then(function(exists) {
            if (!exists) {
                return knex.schema.createTable('users', function(t) {
                    t.increments('id').primary();
                    t.datetime('date&time', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable();
                    t.enum('type', ['', '']).notNullable();
                    t.string('userId').notNullable();
                }).then(() => {
                    console.log('Users table created')
                }).catch((err) => {
                    console.log(err)
                    throw err
                });
            }
        });
    }

    async getAll(){
        try{
            return await knex.from(`${this.tabla}`).select("*")
        } catch(err) {
            console.log(err)
            throw err
        } 
    }
    
    async getById(id){
        try{
            return await knex.from(`${this.tabla}`).where({ id: id }).select()
        } catch(err) {
            console.log(err)
            throw err
        }
    }
    
    async save(obj){
        try{
            return await knex(`${this.tabla}`).insert(obj)
        } catch(err) {
            console.log(err)
            throw err
        }
    }
    
    async deleteById(id){
        try{
            return await knex.from(`${this.tabla}`).where({ id: id }).del()
        } catch(err) {
            console.log(err)
            throw err
        }
    }
}

module.exports = LoginHistoryController