package webdev.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import webdev.domain.Product;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the Product entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCase(String name);

    List<Product> findByCategory(String category);

    List<Product> findByNameContainingAndCategory(String name, String category);

    Page<Product> findAll(Pageable pageable);
}
