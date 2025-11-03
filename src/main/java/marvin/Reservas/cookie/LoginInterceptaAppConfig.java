package marvin.Reservas.cookie;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class LoginInterceptaAppConfig extends WebMvcConfigurerAdapter {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {

        registry.addInterceptor(new marvin.Reservas.cookie.LoginInterceptor())
                .excludePathPatterns(

                        // ROTAS MODULO ADMINISTRADOR
                        "/clube/login",
                        "/clube/checar_login",
                        "/clube/criar_login",
                        "/clube/solicitar_login",
                        "/clube/aceitar_novo_login",
                        "/clube/listar_unidades",
                        "/clube/rejeitar_novo_login",
                        "/clube/recuperar_senha_login",

                        "/clube/**",

                        // ************************************************************************************************************
                        // ROTAS DE IMPORTAÇÕES
                        // "/image/**",

                        "/img/**",
                        "/css/**",
                        "/js/**",
                        "/favicon.ico",
                        "/js/fontawesome-free/css/**",
                        "/path/to/js.cookie.mjs",
                        "/maxcdn.bootstrapcdn.com/**",
                        "/cdnjs.cloudflare.com/**",
                        "/webjars/**",
                        "/fontawesome.com/**",
                        "/js.nicedit.com/**",
                        "/fonts.googleapis.com/**",
                        "/ajax.googleapis.com/**",
                        "/cdnjs.cloudflare.com/**",
                        "/thymeleaf.org",
                        "/www.ultraq.net/thymeleaf/layout",
                        "/unpkg.com/**",
                        "/www.w3.org/1999/xhtml"

                );
    }

}