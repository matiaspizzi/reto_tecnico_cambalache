const knex = require('../db/database')

class UserController{
    constructor(){
        this.tabla = 'users'
        
        knex.schema.hasTable(`${this.tabla}`).then(function(exists) {
            if (!exists) {
                return knex.schema.createTable('users', function(t) {
                    t.increments('id').primary();
                    t.string('name', 100).notNullable();
                    t.string('email', 100).notNullable();
                    t.date('birthDate', 6).notNullable();
                    t.enum('favouriteLanguaje', ['JavaScript', 'Python']);
                    t.string('password', 100).notNullable();
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
    
    async getByEmail(email){
        try{
            return await knex.from(`${this.tabla}`).where({ email: email }).select()
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
    
    async update(obj){
        try{
            return await knex(`${this.tabla}`).update(obj).where({ email: obj.email })
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

let UserControllerInstance = new UserController()

module.exports = UserControllerInstance