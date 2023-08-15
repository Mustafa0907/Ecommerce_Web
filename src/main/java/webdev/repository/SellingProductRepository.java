package webdev.repository;

import webdev.domain.SellingProduct;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the SellingProduct entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SellingProductRepository extends JpaRepository<SellingProduct, Long> {

}
