package webdev.repository;

import webdev.domain.Payment;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


/**
 * Spring Data  repository for the Payment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByUserid(Long id);


    Optional<Payment> findFirstByUseridOrderByCreatedondateDesc(Long id);
    List<Payment> findAllByUserid(Long id);

}
