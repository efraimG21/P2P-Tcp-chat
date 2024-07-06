package plugins

import io.ktor.server.application.*
import io.ktor.server.plugins.autohead.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.slf4j.LoggerFactory
import routing.ChatRouting
import routing.UserRouting
import routing.UsersListRouting
import routing.WebsocketRouting
import services.ChatService
import services.UserService
import services.UsersListService
import services.WebsocketService

private val logger = LoggerFactory.getLogger("configureRouting")

fun Application.configureRouting() {
    install(AutoHeadResponse)

    val mongoDatabase = Database
    val chatService = ChatService(mongoDatabase.chatCollection)
    val userService = UserService(mongoDatabase.userCollection, chatService)
    val usersListService = UsersListService(mongoDatabase.userCollection, chatService)
    val websocketService = WebsocketService(userService, chatService)

    routing {
        UserRouting(userService)
        UsersListRouting(usersListService)
        ChatRouting(chatService = chatService, userService = userService)
        WebsocketRouting(websocketService)
    }
}
