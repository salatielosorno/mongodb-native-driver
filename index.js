const mongodb = require('mongodb')
const mongoClient = mongodb.MongoClient

const url = 'mongodb://localhost:27017/edx-course-db'
const studentsTable = 'edx-course-students'

mongoClient.connect(url, { useNewUrlParser: true },(err, client) => {
    if(err) return process.exit(1)
    
    console.log('Connection is okay')
    let  db = client.db('edx-course-db')
    insertDocument(db, () => {
        updateDocument(db, () => {
            removeDocument(db, () => {
                findDocuments(db, () => {
                    client.close()
                })
            })
        })
    })
})

const insertDocument = (db, callback) => {
    const collection = db.collection(studentsTable)

    collection.insertMany([
        { name: 'Bob' }, { name: 'John' }, { name: 'Peter' }
    ], (error, result) => {
        if(error) return process.exit(1)
        
        console.log(result.result.n)
        console.log(result.ops.length)
        console.log('Inserted 3 documents into the edx-course-students collection')
        callback(result)
    })
}
const updateDocument = (db, callback) => {
    let collection =  db.collection(studentsTable)
    const name = 'Peter'

    collection.updateOne({ name : name }, { $set: { grade : 'A' } }, (error, result) => {
        if(error) return process.exit(1)
        
        console.log(result.result.n)
        console.log(`Updated the student document where name = ${name}`)
        callback(result)
    })
}
const removeDocument = (db, callback) => {
    const collection = db.collection(studentsTable)
    const name = 'Bob'

    collection.removeOne({ name : name }, (error, result) => {
        if(error) return process.exit(1)

        console.log(result.result.n)
        console.log(`Removed the document where name = ${name}`)
        callback(result)
    })
}
var findDocuments = (db, callback) => {
    var collection = db.collection(studentsTable)

    collection.find({}).toArray((error, docs) => {
        if(error) return process.exit(1)

        console.log(2, docs.length)
        console.log(`Found the following documents:`)
        console.dir(docs)
        callback(docs)
    })
}