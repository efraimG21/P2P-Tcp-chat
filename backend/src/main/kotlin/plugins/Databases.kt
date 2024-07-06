package plugins

import com.mongodb.client.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.config.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.litote.kmongo.KMongo
import org.litote.kmongo.getCollection
import org.slf4j.LoggerFactory
import schema.Chat
import schema.User

private val logger = LoggerFactory.getLogger("Database")
private lateinit var mongoDatabase: MongoDatabase

fun Application.configureDatabases() {
    mongoDatabase = connectToMongoDB()
}

object Database {
    val userCollection: MongoCollection<User> by lazy {
        mongoDatabase.getCollection<User>("User")
    }
    val chatCollection: MongoCollection<Chat> by lazy {
        mongoDatabase.getCollection<Chat>("Chat")
    }
}

private fun Application.connectToMongoDB(): MongoDatabase {
    val dbConfig = DatabaseConfig(environment.config)
    val uri = "mongodb://${dbConfig.credentials}${dbConfig.host}:${dbConfig.port}/?maxPoolSize=${dbConfig.maxPoolSize}&w=majority"

    return try {
        val mongoClient = KMongo.createClient(connectionString = uri)
        val database = mongoClient.getDatabase(dbConfig.databaseName)
        logger.info("Successfully connected to MongoDB at ${dbConfig.host}:${dbConfig.port}")

        environment.monitor.subscribe(ApplicationStopped) {
            mongoClient.close()
            logger.info("MongoDB client closed")
        }

        database
    } catch (e: Exception) {
        logger.error("Failed to connect to MongoDB", e)
        throw e
    }
}

data class DatabaseConfig(val config: ApplicationConfig) {
    val user: String? = config.tryGetString("db.mongo.user")
    val password: String? = config.tryGetString("db.mongo.password")
    val host: String = config.tryGetString("db.mongo.host") ?: "127.0.0.1"
    val port: String = config.tryGetString("db.mongo.port") ?: "27017"
    val maxPoolSize: Int = config.tryGetString("db.mongo.maxPoolSize")?.toInt() ?: 20
    val databaseName: String = config.tryGetString("db.mongo.database.name") ?: "Chats"

    val credentials: String
        get() = user?.let { userVal -> password?.let { passwordVal -> "$userVal:$passwordVal@" } }.orEmpty()
}
