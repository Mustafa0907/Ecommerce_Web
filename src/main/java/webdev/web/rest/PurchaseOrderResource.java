package webdev.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import webdev.domain.*;
import webdev.repository.*;
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
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link webdev.domain.PurchaseOrder}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PurchaseOrderResource {

    private final Logger log = LoggerFactory.getLogger(PurchaseOrderResource.class);

    private static final String ENTITY_NAME = "purchaseOrder";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private ShoppingCartRepository shoppingCartRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CartProductInvRepository cartProductInvRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;

    public PurchaseOrderResource(PurchaseOrderRepository purchaseOrderRepository) {
        this.purchaseOrderRepository = purchaseOrderRepository;
    }

    /**
     * {@code POST  /purchase-orders} : Create a new purchaseOrder.
     *
     * @param purchaseOrder the purchaseOrder to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new purchaseOrder, or with status {@code 400 (Bad Request)} if the purchaseOrder has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/purchase-orders")
    public ResponseEntity<PurchaseOrder> createPurchaseOrder(@RequestBody PurchaseOrder purchaseOrder) throws URISyntaxException {
        log.debug("REST request to save PurchaseOrder : {}", purchaseOrder);
        if (purchaseOrder.getId() != null) {
            throw new BadRequestAlertException("A new purchaseOrder cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PurchaseOrder result = purchaseOrderRepository.save(purchaseOrder);
        return ResponseEntity.created(new URI("/api/purchase-orders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /purchase-orders} : Updates an existing purchaseOrder.
     *
     * @param purchaseOrder the purchaseOrder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated purchaseOrder,
     * or with status {@code 400 (Bad Request)} if the purchaseOrder is not valid,
     * or with status {@code 500 (Internal Server Error)} if the purchaseOrder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/purchase-orders")
    public ResponseEntity<PurchaseOrder> updatePurchaseOrder(@RequestBody PurchaseOrder purchaseOrder) throws URISyntaxException {
        log.debug("REST request to update PurchaseOrder : {}", purchaseOrder);
        if (purchaseOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PurchaseOrder result = purchaseOrderRepository.save(purchaseOrder);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, purchaseOrder.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /purchase-orders} : get all the purchaseOrders.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of purchaseOrders in body.
     */
    @GetMapping("/purchase-orders")
    public List<PurchaseOrder> getAllPurchaseOrders() {
        log.debug("REST request to get all PurchaseOrders");
        return purchaseOrderRepository.findAll();
    }

    @GetMapping("/purchase-orders/shopping-cart")
    public List<PurchaseOrder> getAllByCart() {
        log.debug("REST request to get all PurchaseOrders");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String login = authentication.getName();
        Optional<User> user = userRepository.findOneByLogin(login);

        Optional<ShoppingCart> sc = shoppingCartRepository.findByUserid(user.get().getId());
        if (!user.isPresent() || !sc.isPresent())
        {
            throw new BadRequestAlertException("Cart or User Not Found", ENTITY_NAME,"notfound");
        }
        return purchaseOrderRepository.findAllByShoppingCartId(sc.get().getId());
    }
    @GetMapping("/user/purchase-orders")
    public List<PurchaseOrder> getAllByUser() {
        log.debug("REST request to get all PurchaseOrders");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String login = authentication.getName();
        Optional<User> user = userRepository.findOneByLogin(login);

        if (!user.isPresent())
        {
            throw new BadRequestAlertException("Cart or User Not Found", ENTITY_NAME,"notfound");
        }
        return purchaseOrderRepository.findAllByUserid(user.get().getId());
    }
    /**
     * {@code GET  /purchase-orders/:id} : get the "id" purchaseOrder.
     *
     * @param id the id of the purchaseOrder to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the purchaseOrder, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/purchase-orders/{id}")
    public ResponseEntity<PurchaseOrder> getPurchaseOrder(@PathVariable Long id) {
        log.debug("REST request to get PurchaseOrder : {}", id);
        Optional<PurchaseOrder> purchaseOrder = purchaseOrderRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(purchaseOrder);
    }

    /**
     * {@code DELETE  /purchase-orders/:id} : delete the "id" purchaseOrder.
     *
     * @param id the id of the purchaseOrder to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/purchase-orders/{id}")
    public ResponseEntity<Void> deletePurchaseOrder(@PathVariable Long id) {
        log.debug("REST request to delete PurchaseOrder : {}", id);
        purchaseOrderRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
    @PostMapping("/user/purchase-orders/create-with-cart")
    public ResponseEntity<PurchaseOrder> createPurchaseOrderWithCart(@RequestParam String payment_method) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String login = authentication.getName();
        Optional<User> user = userRepository.findOneByLogin(login);
        Optional<PurchaseOrder> po2 = purchaseOrderRepository.findByUseridAndStatus(user.get().getId(), "UNPAID");
        if (po2.isPresent()){
            throw new BadRequestAlertException("There is already one unpaid purchase order please delete it or complete it first.",ENTITY_NAME,"multipleunpaidordererror");
        }
        // Retrieve the user's shopping cart
        Optional<ShoppingCart> optionalCart = shoppingCartRepository.findByUserid(user.get().getId());
        if (!optionalCart.isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        ShoppingCart shoppingCart = optionalCart.get();

        List<CartProductInv> cartProductInvs = cartProductInvRepository.findAllByShoppingCartId(shoppingCart.getId());
        Double totalAmount = 0.0;
        for (CartProductInv cartProductInv : cartProductInvs) {
            Double productPrice = cartProductInv.getProduct().getPrice();
            Integer quantity = cartProductInv.getQuantity();
            totalAmount += (productPrice * quantity);
        }
        String status = "UNPAID";
//        String payment_method = "Card";

        // Create a new purchase order
        PurchaseOrder purchaseOrder = new PurchaseOrder();
        purchaseOrder.setTotal(totalAmount);
        purchaseOrder.setUserid(user.get().getId());
        purchaseOrder.setShoppingCart(shoppingCart);
        purchaseOrder.setStatus(status);
        purchaseOrder.setPaymentMethod(payment_method);
        purchaseOrder.setCreatedondate(ZonedDateTime.now());

//        purchaseOrder.setCreatedondate();
//            .totalAmount(totalAmount)
//            .user(shoppingCart.getUser())
//            .cartProductInvs(cartProductInvs);
        purchaseOrderRepository.save(purchaseOrder);

        // Clear the user's shopping cart
        List<CartProductInv> cartInv = cartProductInvRepository.findAllByShoppingCartId(shoppingCart.getId());
        for (CartProductInv cartProductInv : cartProductInvs) {
            // Backup relevant variables before deleting

            Optional<PurchaseOrder> po1 = purchaseOrderRepository.findByUseridAndStatus(user.get().getId(),"UNPAID");
            if (!po1.isPresent()){
                throw new BadRequestAlertException("purchase order save error", ENTITY_NAME,"poid");
            }

//            Long purchaseOrderId = po1.get().getId();

            // Create new OrderItem
            OrderItem orderItem = new OrderItem();
            orderItem.setQuantity(cartProductInv.getQuantity());
            orderItem.setProduct(cartProductInv.getProduct());
            orderItem.setPurchaseOrder(po1.get());
            orderItem.setCreatedondate(ZonedDateTime.now());

            // Save OrderItem
            orderItemRepository.save(orderItem);
        }
        cartProductInvRepository.deleteAll(cartInv);
//        shoppingCart.getCartProductInvs().clear();
//        shoppingCartRepository.save(shoppingCart);

        return ResponseEntity.ok(purchaseOrder);
    }

}
