package webdev.repository;

import webdev.domain.CartProductInv;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import webdev.domain.Product;
import webdev.domain.ShoppingCart;

import java.util.List;
import java.util.Optional;


/**
 * Spring Data  repository for the CartProductInv entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CartProductInvRepository extends JpaRepository<CartProductInv, Long> {
    Optional<CartProductInv> findByProductAndShoppingCart(Product product, ShoppingCart shoppingCart);
    Optional<CartProductInv> findByShoppingCart(ShoppingCart shoppingCart);

    List<CartProductInv> findAllByShoppingCartId(Long shoppingCartId);
}
