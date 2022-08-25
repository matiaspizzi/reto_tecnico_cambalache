const knex = require('../db/database')

class RepositoriesController{
    constructor(){

        knex.schema.hasTable('repositories').then(function(exists) {
            if (!exists) {
                return knex.schema.createTable('users', function(t) {
                    t.increments('id').primary();
                    t.string('projectName', 100).notNullable();
                    t.enum('languaje', ['JavaScript', 'Python']).notNullable();
                    t.date('createdAt', 100).notNullable();
                    t.string('description', 100);
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

module.exports = RepositoriesController