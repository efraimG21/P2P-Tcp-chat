package services

import com.mongodb.client.MongoCollection
import com.mongodb.client.MongoDatabase
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.litote.kmongo.*
import org.slf4j.LoggerFactory
import schema.User
import schema.UsersList

class UserService(private val userCollection: MongoCollection<User>, private val chatService: ChatService) {
    private val logger = LoggerFactory.getLogger("user service")

    suspend fun signOnUser(user: User): Boolean {
        return withContext(Dispatchers.IO) {
            try {
                if (isUserDetailsExists(user)) {
                    logger.warn("Attempt to sign on user with existing details: $user")
                    false
                } else {
                    userCollection.insertOne(user)
                    true
                }
            } catch (e: Exception) {
                logger.error("Error signing on user: ${e.message}", e)
                false
            }
        }
    }

    private suspend fun isUserDetailsExists(user: User): Boolean {
        return withContext(Dispatchers.IO) {
            try {
                userCollection.findOne(
                    or(
                        User::name eq user.name,
                        User::port eq user.port,
                        User::ipAddress eq user.ipAddress
                    )
                ) != null
            } catch (e: Exception) {
                logger.error("Error checking user details: ${e.message}", e)
                false
            }
        }
    }
    suspend fun getUser(uid: String): User? {
        return withContext(Dispatchers.IO) {
            try {
                userCollection.findOne(User::_id eq uid)
            } catch (e: Exception) {
                logger.error("Error retrieving user with uid $uid: ${e.message}", e)
                null
            }
        }
    }

    suspend fun getUsersList(): List<User> {
        return withContext(Dispatchers.IO) {
            try {
                userCollection.find().toList()
            } catch (e: Exception) {
                logger.error("Error retrieving users list: ${e.message}", e)
                emptyList()
            }
        }
    }

    suspend fun getUsersListSorted(uid: String): UsersList {
        return withContext(Dispatchers.IO) {
            try {
                val userList = userCollection.find(User::_id ne uid).toList()
                val chatList = chatService.getAllChats(uid)
                val knownUserIds = chatList.flatMap { listOf(it.usersUid.first, it.usersUid.second) }.toSet()

                val knownUser = userList.filter { it._id in knownUserIds }
                val unknownUsers = userList.filter { it._id !in knownUserIds }

                UsersList(userList, unknownUsers, knownUser)
            } catch (e: Exception) {
                logger.error("Error retrieving sorted users list: ${e.message}", e)
                UsersList(emptyList(), emptyList(), emptyList())
            }
        }
    }

    suspend fun doesUserExist(uid: String): Boolean {
        return withContext(Dispatchers.IO) {
            try {
                userCollection.findOne(User::_id eq uid) != null
            } catch (e: Exception) {
                logger.error("Error checking if user exists: ${e.message}", e)
                false
            }
        }
    }

    suspend fun deleteUser(uid: String) {
        withContext(Dispatchers.IO) {
            try {
                userCollection.deleteOne(User::_id eq uid)
            } catch (e: Exception) {
                logger.error("Error deleting user with uid $uid: ${e.message}", e)
            }
        }
    }
}