package webdev.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import webdev.domain.CartProductInv;
import webdev.domain.Product;
import webdev.domain.ShoppingCart;
import webdev.domain.User;
import webdev.repository.CartProductInvRepository;
import webdev.repository.ProductRepository;
import webdev.repository.ShoppingCartRepository;
import webdev.repository.UserRepository;
import webdev.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * REST controller for managing {@link webdev.domain.CartProductInv}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CartProductInvResource {

    private final Logger log = LoggerFactory.getLogger(CartProductInvResource.class);

    private static final String ENTITY_NAME = "cartProductInv";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @Autowired
    private ShoppingCartRepository shoppingCartRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;

    private final CartProductInvRepository cartProductInvRepository;

    public CartProductInvResource(CartProductInvRepository cartProductInvRepository) {
        this.cartProductInvRepository = cartProductInvRepository;
    }

    /**
     * {@code POST  /cart-product-invs} : Create a new cartProductInv.
     *
     * @param cartProductInv the cartProductInv to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new cartProductInv, or with status {@code 400 (Bad Request)} if the cartProductInv has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/cart-product-invs")
    public ResponseEntity<CartProductInv> createCartProductInv(@RequestBody CartProductInv cartProductInv) throws URISyntaxException {
        log.debug("REST request to save CartProductInv : {}", cartProductInv);
        if (cartProductInv.getId() != null) {
            throw new BadRequestAlertException("A new cartProductInv cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CartProductInv result = cartProductInvRepository.save(cartProductInv);
        return ResponseEntity.created(new URI("/api/cart-product-invs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /cart-product-invs} : Updates an existing cartProductInv.
     *
     * @param cartProductInv the cartProductInv to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cartProductInv,
     * or with status {@code 400 (Bad Request)} if the cartProductInv is not valid,
     * or with status {@code 500 (Internal Server Error)} if the cartProductInv couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/cart-product-invs")
    public ResponseEntity<CartProductInv> updateCartProductInv(@RequestBody CartProductInv cartProductInv) throws URISyntaxException {
        log.debug("REST request to update CartProductInv : {}", cartProductInv);
        if (cartProductInv.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        CartProductInv result = cartProductInvRepository.save(cartProductInv);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, cartProductInv.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /cart-product-invs} : get all the cartProductInvs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of cartProductInvs in body.
     */
    @GetMapping("/cart-product-invs")
    public List<CartProductInv> getAllCartProductInvs() {
        log.debug("REST request to get all CartProductInvs");
        return cartProductInvRepository.findAll();
    }

    @GetMapping("/user/cart-product-invs")
    public List<CartProductInv> getAllByShoppingCart() {
        log.debug("REST request to get all CartProductInvs");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String login = authentication.getName();
        Optional<User> user = userRepository.findOneByLogin(login);

        Optional<ShoppingCart> sc = shoppingCartRepository.findByUserid(user.get().getId());
        if (!user.isPresent() || !sc.isPresent())
        {
            throw new BadRequestAlertException("Cart or User Not Found", ENTITY_NAME,"notfound");
        }
        return cartProductInvRepository.findAllByShoppingCartId(sc.get().getId());
    }
    /**
     * {@code GET  /cart-product-invs/:id} : get the "id" cartProductInv.
     *
     * @param id the id of the cartProductInv to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the cartProductInv, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/cart-product-invs/{id}")
    public ResponseEntity<CartProductInv> getCartProductInv(@PathVariable Long id) {
        log.debug("REST request to get CartProductInv : {}", id);
        Optional<CartProductInv> cartProductInv = cartProductInvRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(cartProductInv);
    }

    /**
     * {@code DELETE  /cart-product-invs/:id} : delete the "id" cartProductInv.
     *
     * @param id the id of the cartProductInv to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/cart-product-invs/{id}")
    public ResponseEntity<Void> deleteCartProductInv(@PathVariable Long id) {
        log.debug("REST request to delete CartProductInv : {}", id);
        cartProductInvRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    @PostMapping("/user/cart-product-invs/{productId}")
    public ResponseEntity<Void> addToCart(@PathVariable Long productId, @RequestParam Integer quantity) {
        if (quantity < 0 ){
            throw new BadRequestAlertException("Quantity can not be negative", ENTITY_NAME,"wrondquantity");
        }
        Optional<Product> optionalProduct = productRepository.findById(productId);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String login = authentication.getName();
        Optional<User> user = userRepository.findOneByLogin(login);


        Optional<ShoppingCart> optionalShoppingCart = shoppingCartRepository.findByUserid(user.get().getId());

        // Check if both the product and shopping cart exist
        if (optionalProduct.isPresent() && optionalShoppingCart.isPresent()) {
            Product product = optionalProduct.get();
            ShoppingCart shoppingCart = optionalShoppingCart.get();

            // Check if there is enough quantity of the product
            if (product.getTotalquantity() < quantity) {
                return ResponseEntity.badRequest().build();
            }

            // Deduct the quantity from the total quantity of the product
            product.setTotalquantity(product.getTotalquantity() - quantity);
            productRepository.save(product);

            // Check if the product is already in the shopping cart
            Optional<CartProductInv> optionalCartProductInv = cartProductInvRepository.findByProductAndShoppingCart(product, shoppingCart);
            if (optionalCartProductInv.isPresent()) {
                // If the product is already in the shopping cart, update the quantity
                CartProductInv cartProductInv = optionalCartProductInv.get();
                cartProductInv.setQuantity(cartProductInv.getQuantity() + quantity);
                cartProductInvRepository.save(cartProductInv);
            } else {
                // If the product is not in the shopping cart, create a new cart item
                CartProductInv cartProductInv = new CartProductInv();
                cartProductInv.setProduct(product);
                cartProductInv.setShoppingCart(shoppingCart);
                cartProductInv.setQuantity(quantity);
                cartProductInvRepository.save(cartProductInv);
            }

            return ResponseEntity.ok().build();
        } else {
            // If either the product or shopping cart is missing, return a 404 error
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/user/cart-product-invs/{productId}")
    public ResponseEntity<Void> updateCartItemQuantity(@PathVariable Long productId, @RequestParam Integer quantity) {
        if (quantity < 0 ){
            throw new BadRequestAlertException("Quantity can not be negative", ENTITY_NAME,"wrondquantity");
        }
        Optional<Product> optionalProduct = productRepository.findById(productId);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String login = authentication.getName();
        Optional<User> user = userRepository.findOneByLogin(login);

        Optional<ShoppingCart> optionalShoppingCart = shoppingCartRepository.findByUserid(user.get().getId());

        // Check if the shopping cart exists
        if (optionalProduct.isPresent() && optionalShoppingCart.isPresent()) {
            Product product = optionalProduct.get();
            ShoppingCart shoppingCart = optionalShoppingCart.get();

            // Check if the product is already in the shopping cart
            Optional<CartProductInv> optionalCartProductInv = cartProductInvRepository.findByProductAndShoppingCart(product, shoppingCart);
            if (optionalCartProductInv.isPresent()) {
                // If the product is in the shopping cart, update the quantity
                CartProductInv cartProductInv = optionalCartProductInv.get();

                // Check if there is enough quantity of the product
                if (quantity > cartProductInv.getQuantity()) {
                    if (product.getTotalquantity() < quantity - cartProductInv.getQuantity()) {
                        return ResponseEntity.badRequest().build();
                    }
                    // Deduct the difference in quantity from the total quantity of the product
                    product.setTotalquantity(product.getTotalquantity() - (quantity - cartProductInv.getQuantity()));
                    productRepository.save(product);

                    cartProductInv.setQuantity(quantity);
                    cartProductInvRepository.save(cartProductInv);
                }
                else {
                    if (quantity == 0){
                        return ResponseEntity.badRequest().build();
                    }
                    product.setTotalquantity(product.getTotalquantity() + (cartProductInv.getQuantity()-quantity));
                    productRepository.save(product);

                    cartProductInv.setQuantity(quantity);
                    cartProductInvRepository.save(cartProductInv);
                }
//                // Deduct the difference in quantity from the total quantity of the product
//                product.setTotalquantity(product.getTotalquantity() - (quantity - cartProductInv.getQuantity()));
//                productRepository.save(product);
//
//                cartProductInv.setQuantity(quantity);
//                cartProductInvRepository.save(cartProductInv);

                return ResponseEntity.ok().build();
            } else {
                // If the product is not in the shopping cart, return a 404 error
                return ResponseEntity.notFound().build();
            }
        } else {
            // If the shopping cart is missing, return a 404 error
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/user/cart-product-invs/totalAmount")
    public Double getTotalAmount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String login = authentication.getName();
        Optional<User> user = userRepository.findOneByLogin(login);
        if (!user.isPresent()){
            throw new BadRequestAlertException("user not found", ENTITY_NAME, "usernotfound");
        }
        Optional<ShoppingCart> sc = shoppingCartRepository.findByUserid(user.get().getId());
        List<CartProductInv> cartProductInvs = cartProductInvRepository.findAllByShoppingCartId(sc.get().getId());
        Double totalAmount = 0.0;
        for (CartProductInv cartProductInv : cartProductInvs) {
            Double productPrice = cartProductInv.getProduct().getPrice();
            Integer quantity = cartProductInv.getQuantity();
            totalAmount += (productPrice * quantity);
        }
        return totalAmount;
    }
    @GetMapping("/user/cart-product-invs/totalAmountPerProduct")
    public Map<Long, Double> getTotalAmountPerProduct() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String login = authentication.getName();
        Optional<User> user = userRepository.findOneByLogin(login);
        if (!user.isPresent()){
            throw new BadRequestAlertException("user not found", ENTITY_NAME, "usernotfound");
        }
        Optional<ShoppingCart> sc = shoppingCartRepository.findByUserid(user.get().getId());
        List<CartProductInv> cartProductInvs = cartProductInvRepository.findAllByShoppingCartId(sc.get().getId());
        Map<Long, Double> totalAmountPerProduct = new HashMap<>();
        for (CartProductInv cartProductInv : cartProductInvs) {
            Double productPrice = cartProductInv.getProduct().getPrice();
            Integer quantity = cartProductInv.getQuantity();
            Long productId = cartProductInv.getProduct().getId();
            Double totalAmount = productPrice * quantity;
            if (totalAmountPerProduct.containsKey(productId)) {
                totalAmount += totalAmountPerProduct.get(productId);
            }
            totalAmountPerProduct.put(productId, totalAmount);
        }
        return totalAmountPerProduct;
    }

    @PutMapping("/user/cart-product-invs/increment/{productId}")
    public ResponseEntity<Void> IncrementItemQuantity(@PathVariable Long productId) {
//        if (quantity < 0 ){
//            throw new BadRequestAlertException("Quantity can not be negative", ENTITY_NAME,"wrondquantity");
//        }
        Optional<Product> optionalProduct = productRepository.findById(productId);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String login = authentication.getName();
        Optional<User> user = userRepository.findOneByLogin(login);

        Optional<ShoppingCart> optionalShoppingCart = shoppingCartRepository.findByUserid(user.get().getId());

        // Check if the shopping cart exists
        if (optionalProduct.isPresent() && optionalShoppingCart.isPresent()) {
            Product product = optionalProduct.get();
            ShoppingCart shoppingCart = optionalShoppingCart.get();

            // Check if the product is already in the shopping cart
            Optional<CartProductInv> optionalCartProductInv = cartProductInvRepository.findByProductAndShoppingCart(product, shoppingCart);
            if (optionalCartProductInv.isPresent()) {
                // If the product is in the shopping cart, update the quantity
                CartProductInv cartProductInv = optionalCartProductInv.get();

                // Check if there is enough quantity of the product

                if (product.getTotalquantity() < 1) {
                    return ResponseEntity.badRequest().build();
                }

                // Deduct the difference in quantity from the total quantity of the product
                product.setTotalquantity(product.getTotalquantity()-1);
                productRepository.save(product);

                cartProductInv.setQuantity(cartProductInv.getQuantity()+1);
                cartProductInvRepository.save(cartProductInv);

                return ResponseEntity.ok().build();
            } else {
                // If the product is not in the shopping cart, return a 404 error
                return ResponseEntity.notFound().build();
            }
        } else {
            // If the shopping cart is missing, return a 404 error
                return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("/user/cart-product-invs/decrement/{productId}")
    public ResponseEntity<Void> DecrementItemQuantity(@PathVariable Long productId) {
//        if (quantity < 0 ){
//            throw new BadRequestAlertException("Quantity can not be negative", ENTITY_NAME,"wrondquantity");
//        }
        Optional<Product> optionalProduct = productRepository.findById(productId);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String login = authentication.getName();
        Optional<User> user = userRepository.findOneByLogin(login);

        Optional<ShoppingCart> optionalShoppingCart = shoppingCartRepository.findByUserid(user.get().getId());

        // Check if the shopping cart exists
        if (optionalProduct.isPresent() && optionalShoppingCart.isPresent()) {
            Product product = optionalProduct.get();
            ShoppingCart shoppingCart = optionalShoppingCart.get();

            // Check if the product is already in the shopping cart
            Optional<CartProductInv> optionalCartProductInv = cartProductInvRepository.findByProductAndShoppingCart(product, shoppingCart);
            if (optionalCartProductInv.isPresent()) {
                // If the product is in the shopping cart, update the quantity
                CartProductInv cartProductInv = optionalCartProductInv.get();

                // Check if there is enough quantity of the product

                if (product.getTotalquantity() < 1) {
                    return ResponseEntity.badRequest().build();
                }

                // Deduct the difference in quantity from the total quantity of the product
                product.setTotalquantity(product.getTotalquantity()+1);
                productRepository.save(product);

                cartProductInv.setQuantity(cartProductInv.getQuantity()-1);
                if (cartProductInv.getQuantity() < 1) {
                    cartProductInvRepository.delete(cartProductInv);
                    return ResponseEntity.ok().build();
                }

                cartProductInvRepository.save(cartProductInv);

                return ResponseEntity.ok().build();
            } else {
                // If the product is not in the shopping cart, return a 404 error
                return ResponseEntity.notFound().build();
            }
        } else {
            // If the shopping cart is missing, return a 404 error
            return ResponseEntity.notFound().build();
        }
    }
}
