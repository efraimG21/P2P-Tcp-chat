package services

import com.mongodb.client.MongoCollection
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.litote.kmongo.ne
import org.slf4j.LoggerFactory
import schema.User
import schema.UsersList

class UsersListService (
    private val usersCollection: MongoCollection<User>,
                 private val chatService: ChatService )
{
    private val logger = LoggerFactory.getLogger("users list service")

    suspend fun getUsersList(): List<User> {
        return withContext(Dispatchers.IO) {
            usersCollection.find().toList()
        }
    }

    suspend fun getUsersListSorted(uid: String): UsersList {
        return withContext(Dispatchers.IO) {
            val userList = usersCollection.find(User::_id ne uid).toList()
            val chatList = chatService.getAllChats(uid)
            val knownUserIds = chatList.flatMap { listOf(it.usersUid.first, it.usersUid.second) }.toSet()

            //TODO(sort the knownUser list by last message time)
            val knownUser = userList.filter { it._id in knownUserIds }
            val unknownUsers = userList.filter { it._id !in knownUserIds }

            UsersList(userList, unknownUsers, knownUser)
        }
    }
}