package webdev.repository;

import webdev.domain.PurchaseOrder;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the PurchaseOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    Optional<PurchaseOrder> findByUserid(Long id);
    Optional<PurchaseOrder> findByUseridAndStatus(Long id, String status);
    List<PurchaseOrder> findAllByUseridAndStatus(Long id, String status);
    List<PurchaseOrder> findAllByShoppingCartId(Long shoppingCartId);
    List<PurchaseOrder> findAllByUserid(Long userid);

}
