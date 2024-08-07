package routing

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.litote.kmongo.json
import org.slf4j.LoggerFactory
import schema.ApiResponse
import schema.User
import services.UserService

fun Route.UserRouting(userService: UserService) {
    val logger = LoggerFactory.getLogger("userRouting")

    route("/user-handling") {

        get("/get/{uid?}") {
            val uid = call.parameters["uid"]
            if (uid == null) {
                logger.warn("GET /get called without uid parameter")
                call.respond(HttpStatusCode.BadRequest, "uid missing")
                return@get
            }
            try {
                val user = withContext(Dispatchers.IO) {
                    userService.getUser(uid)
                }
                if (user == null) {
                    call.respond(HttpStatusCode.NotFound, "User not found")
                } else {
                    call.respond(HttpStatusCode.OK, user)
                }
            } catch (e: Exception) {
                logger.error("Error retrieving user with uid $uid: ${e.message}", e)
                call.respond(HttpStatusCode.InternalServerError, "Error retrieving user: ${e.message}")
            }
        }

        post("/sign-on") {
            try {
                val userInfo = call.receive<User>()
                val success = withContext(Dispatchers.IO) {
                    userService.signOnUser(userInfo)
                }
                if (success) {
                    call.respond(
                        HttpStatusCode.Created,
                        ApiResponse(message = "User signed on successfully", content = userInfo._id)
                    )
                } else {
                    call.respond(HttpStatusCode.Conflict, "User with similar details already exists".json)
                }
            } catch (e: Exception) {
                logger.error("Error signing on user: ${e.message}", e)
                call.respond(HttpStatusCode.BadRequest, "Error signing on user: ${e.message}")
            }
        }

        get("/user-list") {
            try {
                val userList = withContext(Dispatchers.IO) {
                    userService.getUsersList()
                }
                call.respond(HttpStatusCode.OK, userList)
            } catch (e: Exception) {
                logger.error("Error retrieving user list: ${e.message}", e)
                call.respond(HttpStatusCode.InternalServerError, "Error retrieving user list: ${e.message}")
            }
        }


        get("/sorted-user-list/{uid}") {
            try {
                val uid = call.parameters["uid"]
                if (uid == null) {
                    logger.warn("get called without uid parameter")
                    call.respond(HttpStatusCode.BadRequest, "uid missing")
                    return@get
                }
                val sortedList = withContext(Dispatchers.IO) {
                    userService.getUsersListSorted(uid)
                }
                call.respond(HttpStatusCode.OK, sortedList)
            } catch (e: Exception) {
                logger.error("Error retrieving sorted user list: ${e.message}", e)
                call.respond(HttpStatusCode.InternalServerError, "Error retrieving sorted user list: ${e.message}")
            }
        }

        get("/is-exists/{uid?}") {
            val uid = call.parameters["uid"]
            if (uid == null) {
                logger.warn("GET /is-exists called without uid parameter")
                call.respond(HttpStatusCode.BadRequest, "uid missing")
                return@get
            }
            try {
                val userExists = withContext(Dispatchers.IO) {
                    userService.doesUserExist(uid)
                }
                call.respond(HttpStatusCode.OK, userExists)
            } catch (e: Exception) {
                logger.error("Error checking if user exists with uid $uid: ${e.message}", e)
                call.respond(HttpStatusCode.InternalServerError, "Error checking if user exists: ${e.message}")
            }
        }
    }
}