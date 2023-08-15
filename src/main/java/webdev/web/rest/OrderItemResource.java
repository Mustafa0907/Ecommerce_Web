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
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link webdev.domain.OrderItem}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OrderItemResource {

    private final Logger log = LoggerFactory.getLogger(OrderItemResource.class);

    private static final String ENTITY_NAME = "orderItem";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrderItemRepository orderItemRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;
    @Autowired
    private ShoppingCartRepository shoppingCartRepository;

    @Autowired
    private CartProductInvRepository cartProductInvRepository;

    public OrderItemResource(OrderItemRepository orderItemRepository) {
        this.orderItemRepository = orderItemRepository;
    }

    /**
     * {@code POST  /order-items} : Create a new orderItem.
     *
     * @param orderItem the orderItem to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new orderItem, or with status {@code 400 (Bad Request)} if the orderItem has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/order-items")
    public ResponseEntity<OrderItem> createOrderItem(@RequestBody OrderItem orderItem) throws URISyntaxException {
        log.debug("REST request to save OrderItem : {}", orderItem);
        if (orderItem.getId() != null) {
            throw new BadRequestAlertException("A new orderItem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OrderItem result = orderItemRepository.save(orderItem);
        return ResponseEntity.created(new URI("/api/order-items/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /order-items} : Updates an existing orderItem.
     *
     * @param orderItem the orderItem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderItem,
     * or with status {@code 400 (Bad Request)} if the orderItem is not valid,
     * or with status {@code 500 (Internal Server Error)} if the orderItem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/order-items")
    public ResponseEntity<OrderItem> updateOrderItem(@RequestBody OrderItem orderItem) throws URISyntaxException {
        log.debug("REST request to update OrderItem : {}", orderItem);
        if (orderItem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        OrderItem result = orderItemRepository.save(orderItem);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, orderItem.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /order-items} : get all the orderItems.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orderItems in body.
     */
    @GetMapping("/order-items")
    public List<OrderItem> getAllOrderItems() {
        log.debug("REST request to get all OrderItems");
        return orderItemRepository.findAll();
    }

    /**
     * {@code GET  /order-items/:id} : get the "id" orderItem.
     *
     * @param id the id of the orderItem to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the orderItem, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/order-items/{id}")
    public ResponseEntity<OrderItem> getOrderItem(@PathVariable Long id) {
        log.debug("REST request to get OrderItem : {}", id);
        Optional<OrderItem> orderItem = orderItemRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(orderItem);
    }

    /**
     * {@code DELETE  /order-items/:id} : delete the "id" orderItem.
     *
     * @param id the id of the orderItem to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/order-items/{id}")
    public ResponseEntity<Void> deleteOrderItem(@PathVariable Long id) {
        log.debug("REST request to delete OrderItem : {}", id);
        orderItemRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    @PutMapping("/user/order-items/{purchaseOrderId}")
    public ResponseEntity<Void> editCartRemovePurchaseOrder(@PathVariable Long purchaseOrderId) {

        Optional<PurchaseOrder> optionalPurchaseOrder = purchaseOrderRepository.findById(purchaseOrderId);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String login = authentication.getName();
        Optional<User> user = userRepository.findOneByLogin(login);

        Optional<ShoppingCart> optionalShoppingCart = shoppingCartRepository.findByUserid(user.get().getId());

        if (!optionalPurchaseOrder.isPresent()) {
            throw new BadRequestAlertException("No purchase Order Found", ENTITY_NAME, "nopo");
        }

        List<OrderItem> or = orderItemRepository.findAllByPurchaseOrderId(optionalPurchaseOrder.get().getId());
        PurchaseOrder po = optionalPurchaseOrder.get();
        if (po.getStatus().equals("Paid")) {
            throw new BadRequestAlertException("PO is already paid", ENTITY_NAME, "paiderror");
        }
        for (OrderItem orderItem : or) {
            CartProductInv cpi = new CartProductInv();
            cpi.setQuantity(orderItem.getQuantity());
            cpi.setProduct(orderItem.getProduct());
            cpi.setShoppingCart(optionalPurchaseOrder.get().getShoppingCart());

            cartProductInvRepository.save(cpi);
        }
        for (OrderItem orderItem : or) {
            orderItemRepository.delete(orderItem);
        }


        purchaseOrderRepository.delete(po);

        return ResponseEntity.ok().build();
    }

    @GetMapping("user/order-items/allpurchaseorders/{purchaseOrderId}")
    public List<OrderItem> getAllByPurchaseOrderID(@PathVariable Long purchaseOrderId){
        return orderItemRepository.findAllByPurchaseOrderId(purchaseOrderId);
    }
    @GetMapping("/user/order-items/has-ordered-product/{productId}")
    public ResponseEntity<Boolean> hasUserOrderedProduct(@PathVariable Long productId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String login = authentication.getName();
        Optional<User> user = userRepository.findOneByLogin(login);

        boolean bool = orderItemRepository.findAll().stream()
            .filter(orderItem -> orderItem.getPurchaseOrder().getUserid().equals(user.get().getId()))
            .anyMatch(orderItem -> orderItem.getProduct().getId().equals(productId));

        return ResponseEntity.ok().body(bool);
    }
}
