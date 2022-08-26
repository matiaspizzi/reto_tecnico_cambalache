const knex = require('../db/database');

class RepositoriesController{
    constructor(){
        this.table = 'repositories'

        knex.schema.hasTable('repositories').then(function(exists) {
            if (!exists) {
                return knex.schema.createTable('repositories', function(t) {
                    t.increments('id').primary();
                    t.string('projectName', 100).notNullable();
                    t.enum('languaje', ['JavaScript', 'Python']).notNullable();
                    t.date('createdAt', 100).notNullable();
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

    async getAll(){
        try{
            return await knex.from(`${this.table}`).select("*")
        } catch(err) {
            console.log(err)
            throw err
        } 
    }
    
    async getByName(name){
        try{
            return await knex.from(`${this.table}`).where({ projectName: name }).select()
        } catch(err) {
            console.log(err)
            throw err
        }
    }

    async getById(id){
        try{
            return await knex.from(`${this.table}`).where({ id: id }).select()
        } catch(err) {
            console.log(err)
            throw err
        }
    }
    
    async save(obj){
        try{
            return await knex(`${this.table}`).insert(obj)
        } catch(err) {
            console.log(err)
            throw err
        }
    }

    async update(obj, id){
        try{
            return await knex(`${this.table}`).update(obj).where({ id: id })
        } catch(err) {
            console.log(err)
            throw err
        }
    }
    
    async deleteById(id){
        try{
            return await knex.from(`${this.table}`).where({ id: id }).del()
        } catch(err) {
            console.log(err)
            throw err
        }
    }
}

let RepositoriesControllerInstance = new RepositoriesController()

module.exports = RepositoriesControllerInstance