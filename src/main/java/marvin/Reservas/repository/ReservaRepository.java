package marvin.Reservas.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import marvin.Reservas.model.ReservaModel;

public interface ReservaRepository extends JpaRepository<ReservaModel, Integer> {

}
