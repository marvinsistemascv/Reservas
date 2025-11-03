package marvin.Reservas.controller;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import marvin.Reservas.cookie.CookieService;
import marvin.Reservas.model.UsuarioModel;
import marvin.Reservas.repository.UsuarioRepository;
import marvin.Reservas.util.Cripto;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import org.springframework.http.HttpStatus;

@RestController
public class LoginController {

    @Autowired
    UsuarioRepository usuarioRepository;

    @GetMapping("/clube/login")
    public ModelAndView fazer_login() {
        ModelAndView mv = new ModelAndView("login");
        return mv;
    }

    @PostMapping("/clube/checar_login")
    @Transactional
    public ResponseEntity<Void> checar_login(UsuarioModel u, HttpServletResponse response) {

        UsuarioModel user = usuarioRepository.checarLogin(u.getEmail(),
                Cripto.criptografiaBase64Encoder(u.getSenha()));

        if (user != null) {
            try {
                CookieService.setCookie(response, "usuario_marvin", user.getEmail(), (60 * 60 * 30));
            } catch (Exception e) {
                System.out.println("erro " + e);
            }
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}
