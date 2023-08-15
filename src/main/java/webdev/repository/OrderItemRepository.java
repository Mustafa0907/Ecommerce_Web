package webdev.repository;

import webdev.domain.OrderItem;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import webdev.domain.PurchaseOrder;

import java.util.List;
import java.util.Optional;


/**
 * Spring Data  repository for the OrderItem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findAllByPurchaseOrderId(Long id);
}
