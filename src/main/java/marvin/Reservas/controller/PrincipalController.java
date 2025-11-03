package marvin.Reservas.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class PrincipalController {

    @GetMapping("/clube/home")
    public ModelAndView abrir_home(HttpServletRequest request) {
        ModelAndView mv = new ModelAndView("home");
        return mv;
    }
}
