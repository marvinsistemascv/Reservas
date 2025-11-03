package marvin.Reservas.repository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import marvin.Reservas.model.UsuarioModel;

@Transactional
@Repository
public interface UsuarioRepository extends JpaRepository<UsuarioModel, Integer> {

    @Query("SELECT u FROM UsuarioModel as u where u.email =:email and u.senha =:senha")
    UsuarioModel checarLogin(@Param("email") String email, @Param("senha") String senha);

    @Query("SELECT u FROM UsuarioModel as u where u.email =:email")
    UsuarioModel pegar_usuario_email(@Param("email") String email);

    @Query("SELECT u FROM UsuarioModel as u where u.id =:id")
    UsuarioModel pegar_usuario_id(@Param("id") Integer id);

}
