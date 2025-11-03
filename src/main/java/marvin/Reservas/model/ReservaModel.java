package marvin.Reservas.model;

import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class ReservaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private LocalDateTime inicio_evt;
    private LocalDateTime fim_evt;
    private String sócio;
    private Double valor;
    private String quiosque;
    private String sit;

}
