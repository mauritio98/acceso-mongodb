import {MongoClient} from 'mongodb'

// Connection URL
const urlAtlas = 'mongodb+srv://mauricio:1234@cluster0.iyc9f.mongodb.net';
// Database Name
const dbName = 'mauricio';

class MongoManager{
    constructor(urlAtlas, dbName){
        this.url = urlAtlas;
        this.dbName = dbName;
        this.client = new MongoClient(this.url, { useNewUrlParser: true }); 
    }

    async connection() {
        try{
            // Use connect method to connect to the Server
            await this.client.connect();
            this.db = this.client.db(this.dbName);
        }catch (error){
            this.dropConnection();
            throw error;
        }
    }

    async dropConnection() {
        await this.client.close();
    }

    async get_movies(collectionName){
        try{
            await this.connection();
            const result = await this.db.collection(collectionName).find()
                .toArray();
            return result
        }catch (error){
            throw error;
        } finally{
            this.dropConnection();
        }
    }
    async getMovieById(collectionName,id){
        try{
            await this.connection();
            const result = await this.db.collection(collectionName).find({id:parseInt(id)})
                .toArray();
            return result
        }catch (error){
            throw error;
        } finally{
            this.dropConnection();
        }
    }
    async removeMovie(collectionName,id){
        try{
            await this.connection();
            await this.db.collection(collectionName).deleteOne({id:parseInt(id)})
            return await this.get_movies(collectionName)
        }catch (error){
            throw error;
        } finally{
            this.dropConnection();
        }
    }
    async updateMovie(collectionName,id,req){
        try{
            await this.connection();
            await this.db.collection(collectionName).updateOne({id:parseInt(id)},{$set:req})
            return await this.get_movies(collectionName)
        }catch (error){
            throw error;
        } finally{
            this.dropConnection();
        }
    }
    
    async addMovie(collectionName,req){
        try{
            await this.connection();
            await this.db.collection(collectionName).insertOne(req)
            return await this.get_movies(collectionName)
        }catch (error){
            throw error;
        } finally{
            this.dropConnection();
        }
    }
}
    
export default new MongoManager(urlAtlas, dbName);

