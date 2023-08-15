package webdev.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link webdev.domain.ShoppingCart}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ShoppingCartResource {

    private final Logger log = LoggerFactory.getLogger(ShoppingCartResource.class);

    private static final String ENTITY_NAME = "shoppingCart";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CartProductInvRepository cartProductInvRepository;
    private final ShoppingCartRepository shoppingCartRepository;

    public ShoppingCartResource(ShoppingCartRepository shoppingCartRepository) {
        this.shoppingCartRepository = shoppingCartRepository;
    }

    /**
     * {@code POST  /shopping-carts} : Create a new shoppingCart.
     *
     * @param shoppingCart the shoppingCart to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new shoppingCart, or with status {@code 400 (Bad Request)} if the shoppingCart has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/shopping-carts")
    public ResponseEntity<ShoppingCart> createShoppingCart(@RequestBody ShoppingCart shoppingCart) throws URISyntaxException {
        log.debug("REST request to save ShoppingCart : {}", shoppingCart);
        if (shoppingCart.getId() != null) {
            throw new BadRequestAlertException("A new shoppingCart cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String login = authentication.getName();
        Optional<User> user = userRepository.findOneByLogin(login);
//        Optional<ShoppingCart> shoppingCarts = shoppingCartRepository.findByUserid(user.get().getId()); // works with authentication on
        Optional<ShoppingCart> shoppingCarts = shoppingCartRepository.findByUserid(shoppingCart.getUserid());
//        List<ShoppingCart> shoppingCarts = shoppingCartRepository.findAll();

        if (shoppingCarts.isPresent()){
            throw new BadRequestAlertException("Shopping Cart Already Created for this User ", ENTITY_NAME , "cartexist");
        }
        ShoppingCart result = shoppingCartRepository.save(shoppingCart);
        return ResponseEntity.created(new URI("/api/shopping-carts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /shopping-carts} : Updates an existing shoppingCart.
     *
     * @param shoppingCart the shoppingCart to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shoppingCart,
     * or with status {@code 400 (Bad Request)} if the shoppingCart is not valid,
     * or with status {@code 500 (Internal Server Error)} if the shoppingCart couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/shopping-carts")
    public ResponseEntity<ShoppingCart> updateShoppingCart(@RequestBody ShoppingCart shoppingCart) throws URISyntaxException {
        log.debug("REST request to update ShoppingCart : {}", shoppingCart);
        if (shoppingCart.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Optional<ShoppingCart> shoppingCart1 = shoppingCartRepository.findById(shoppingCart.getId());
        if (!shoppingCart1.isPresent()){
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "wrongid");
        }
        ShoppingCart result = shoppingCartRepository.save(shoppingCart);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, shoppingCart.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /shopping-carts} : get all the shoppingCarts.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of shoppingCarts in body.
     */
    //    @GetMapping("/shopping-carts")
//    @Timed
//    public List<ShoppingCart> getAllShoppingCarts(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
//        log.debug("REST request to get all ShoppingCarts");
////        return shoppingCartRepository.findAllWithEagerRelationships();
//        return  shoppingCartRepository.findAll();
//    }

    @GetMapping("/shopping-carts")
    public List<ShoppingCart> getAllShoppingCarts(){
        log.debug("REST request to get all ShoppingCarts");
//        return shoppingCartRepository.findAllWithEagerRelationships();
        return  shoppingCartRepository.findAll();
    }

    /**
     * GET  /shopping-carts/:id : get the "id" shoppingCart.
     *
     * @param id the id of the shoppingCart to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the shoppingCart, or with status 404 (Not Found)
     */
//    @GetMapping("/shopping-carts/{id}")
//    @Timed
//    public ResponseEntity<ShoppingCart> getShoppingCart(@PathVariable Long id) {
//        log.debug("REST request to get ShoppingCart : {}", id);
//        Optional<ShoppingCart> shoppingCart = shoppingCartRepository.findOneWithEagerRelationships(id);
//        return ResponseUtil.wrapOrNotFound(shoppingCart);
//    }

    @GetMapping("/shopping-carts/{id}")
    public ResponseEntity<ShoppingCart> getShoppingCart(@PathVariable Long id) {
        log.debug("REST request to get ShoppingCart : {}", id);
        Optional<ShoppingCart> shoppingCart = shoppingCartRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(shoppingCart);
    }
    /**
     * {@code DELETE  /shopping-carts/:id} : delete the "id" shoppingCart.
     *
     * @param id the id of the shoppingCart to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/shopping-carts/{id}")
    public ResponseEntity<Void> deleteShoppingCart(@PathVariable Long id) {
        log.debug("REST request to delete ShoppingCart : {}", id);
        shoppingCartRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
