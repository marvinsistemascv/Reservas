package marvin.Reservas.cookie;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

import java.security.Principal;

@Component
public class UserInterceptor implements ChannelInterceptor {

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            // 👇 pega o valor do header "login" vindo do JS
            String email = accessor.getFirstNativeHeader("login");
            if (email != null) {
                accessor.setUser(() -> email); // agora principal.getName() = email
                System.out.println("🔑 WebSocket conectado como: " + email);
            }
        }

        return message;
    }
}
