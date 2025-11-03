package marvin.Reservas.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import marvin.Reservas.model.ReservaModel;
import marvin.Reservas.repository.ReservaRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
public class ReservaController {

    @Autowired
    ReservaRepository reservaRepository;

    @PostMapping("/clube/pegar_reservas")
    public List<ReservaModel> pegar_reservas() {

        List<ReservaModel> lista = reservaRepository.findAll();
        return lista;

    }

}
