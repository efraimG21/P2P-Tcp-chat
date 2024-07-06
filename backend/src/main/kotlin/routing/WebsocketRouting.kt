package routing

import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import services.WebsocketService

fun Route.WebsocketRouting(websocketService: WebsocketService) {
    route("/socket") {
        webSocket("/{uid?}") {
            val uid = call.parameters["uid"]
            if (uid == null) {
                close(CloseReason(CloseReason.Codes.VIOLATED_POLICY, "No UID provided"))
                return@webSocket
            }
            try {
                websocketService.onStartConnection(uid, this)

                for (frame in incoming) {
                    frame as? Frame.Text ?: continue
                    websocketService.incomingFrame(uid, frame.readText())
                }
            } catch (e: Exception) {
                close(CloseReason(CloseReason.Codes.INTERNAL_ERROR, "Error in WebSocket: ${e.message}"))
            } finally {
                websocketService.disconnect(uid, this)
            }
        }
    }
}