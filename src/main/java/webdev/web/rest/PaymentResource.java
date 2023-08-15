package webdev.web.rest;

import com.stripe.Stripe;
import com.stripe.model.Token;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import webdev.domain.Payment;
import webdev.domain.PurchaseOrder;
import webdev.domain.User;
import webdev.repository.PaymentRepository;
import webdev.repository.PurchaseOrderRepository;
import webdev.repository.UserRepository;
import webdev.service.dto.PaymentApiDTO;
import webdev.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * REST controller for managing {@link webdev.domain.Payment}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PaymentResource {

    private final Logger log = LoggerFactory.getLogger(PaymentResource.class);

    private static final String ENTITY_NAME = "payment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PaymentRepository paymentRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;


    public PaymentResource(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    /**
     * {@code POST  /payments} : Create a new payment.
     *
     * @param payment the payment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new payment, or with status {@code 400 (Bad Request)} if the payment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/payments")
    public ResponseEntity<Payment> createPayment(@RequestBody Payment payment) throws URISyntaxException {
        log.debug("REST request to save Payment : {}", payment);
        if (payment.getId() != null) {
            throw new BadRequestAlertException("A new payment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Payment result = paymentRepository.save(payment);
        return ResponseEntity.created(new URI("/api/payments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /payments} : Updates an existing payment.
     *
     * @param payment the payment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated payment,
     * or with status {@code 400 (Bad Request)} if the payment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the payment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/payments")
    public ResponseEntity<Payment> updatePayment(@RequestBody Payment payment) throws URISyntaxException {
        log.debug("REST request to update Payment : {}", payment);
        if (payment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Payment result = paymentRepository.save(payment);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, payment.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /payments} : get all the payments.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of payments in body.
     */
    @GetMapping("/payments")
    public List<Payment> getAllPayments() {
        log.debug("REST request to get all Payments");
        return paymentRepository.findAll();
    }

    /**
     * {@code GET  /payments/:id} : get the "id" payment.
     *
     * @param id the id of the payment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the payment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/payments/{id}")
    public ResponseEntity<Payment> getPayment(@PathVariable Long id) {
        log.debug("REST request to get Payment : {}", id);
        Optional<Payment> payment = paymentRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(payment);
    }

    @GetMapping("/user/payments")
    public List<Payment> getAllPaymentsByUser() {
        log.debug("REST request to get all Payments");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String login = authentication.getName();
        Optional<User> user = userRepository.findOneByLogin(login);

        if (!user.isPresent())
        {
            throw new BadRequestAlertException("Cart or User Not Found", ENTITY_NAME,"notfound");
        }
        return paymentRepository.findAllByUserid(user.get().getId());
    }

    /**
     * {@code DELETE  /payments/:id} : delete the "id" payment.
     *
     * @param id the id of the payment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/payments/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        log.debug("REST request to delete Payment : {}", id);
        paymentRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
    @PostMapping("/user/charge")
    public ResponseEntity<String> createPaymentandChargeCard(@RequestBody PaymentApiDTO pt) {
        try {

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String login = authentication.getName();
            Optional<User> user = userRepository.findOneByLogin(login);

            Optional<PurchaseOrder> purchaseOrder = purchaseOrderRepository.findByUseridAndStatus(user.get().getId(), "UNPAID");
//            List<PurchaseOrder> purchaseOrder3 = purchaseOrderRepository.findAllByUseridAndStatus(user.get().getId(), "Paid");
            if (!purchaseOrder.isPresent())
            {
                throw new BadRequestAlertException("Purchase Order is not Created",ENTITY_NAME,"invalidorderid");
            }
            PurchaseOrder po = purchaseOrder.get();
            Payment payment = new Payment();
            payment.setCreatedondate(ZonedDateTime.now());

            payment.setUserid(user.get().getId());
            payment.setAmount(po.getTotal());


            long Amount = (long)(po.getTotal()*100);
            Stripe.apiKey = "sk_test_51MfTJqASW7Sg3dtTqoXv4ADxyD509b9h6SWzC52gLPlcrgPhwEm9PcrnAQkdzHzviGLlDzIrFdmhuq7VyGnz1Jmm00Lk0pmBeI";


            Map<String, Object> card = new HashMap<>();
//            card.put("number", "4242424242424242");
//            card.put("exp_month", 3);
//            card.put("exp_year", 2024);
//            card.put("cvc", "314");
//            Map<String, Object> params2 = new HashMap<>();
//            params2.put("card", card);
            card.put("number", pt.getNumber());
            card.put("exp_month", pt.getExp_month());
            card.put("exp_year", pt.getExp_year());
            card.put("cvc", pt.getCvc());
            Map<String, Object> params2 = new HashMap<>();
            params2.put("card", card);

            Token token = Token.create(params2);

            String tokenString = token.getId();

            PaymentIntentCreateParams params = PaymentIntentCreateParams
                .builder()
                .setAmount(Amount)
                .setCurrency("usd")
                .setPaymentMethod(tokenString)
                .build();

//            purchaseOrderRepository.save(po);
            payment.setStatus("Paid");

            paymentRepository.save(payment);
            Optional<Payment> payment1 = paymentRepository.findFirstByUseridOrderByCreatedondateDesc(user.get().getId());

//                paymentRepository.findByUserid(user.get().getId());
            if (!payment1.isPresent()){
                throw new BadRequestAlertException("payment not found",ENTITY_NAME,"paymentiderror");
            }
            po.setPayment(payment1.get());
            po.setStatus("Paid");
            purchaseOrderRepository.save(po);
            return ResponseEntity.ok("Payment processed successfully! --> " + tokenString);
//            return ResponseEntity.ok().build();
        } catch (Exception e) {
            // Log the exception
            System.out.println("Error processing payment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment failed: " + e.getMessage());
        }
    }
    @PostMapping("/user/charge/{purchaseOrderid}")
    public ResponseEntity<String> createPaymentandChargeCard(@Valid @RequestBody PaymentApiDTO pt, @PathVariable Integer purchaseOrderid) {
        if (pt.getNumber() == null || pt.getCvc() == null || pt.getExp_month() == 0 || pt.getExp_year() == 0 || pt.getAmount() == null){
            throw new BadRequestAlertException("Enter all details correctly", ENTITY_NAME, "incompletedetails");
        }
        try {


            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String login = authentication.getName();
            Optional<User> user = userRepository.findOneByLogin(login);

            //        Optional<PurchaseOrder> purchaseOrder = purchaseOrderRepository.findByUseridAndStatus(user.get().getId(), "UNPAID");
            Optional<PurchaseOrder> purchaseOrder = purchaseOrderRepository.findById((long)purchaseOrderid);
            if (!purchaseOrder.isPresent()) {
                throw new BadRequestAlertException("Wrong id", ENTITY_NAME, "wrongid");
            }


            PurchaseOrder po = purchaseOrder.get();
            if (!po.getUserid().equals(user.get().getId())) {
                throw new BadRequestAlertException("You are not authorized to pay for this order", ENTITY_NAME, "unauthorized");
            }
            if (!po.getStatus().equals("UNPAID")) {
                throw new BadRequestAlertException("Payment for this order has already been made", ENTITY_NAME, "paidorder");
            }
            Payment payment = new Payment();
            payment.setCreatedondate(ZonedDateTime.now());
            payment.setStatus("Paid");
            payment.setUserid(user.get().getId());
            payment.setAmount(po.getTotal());
            po.setStatus("Paid");

            long Amount = (long)(po.getTotal()*100);
            Stripe.apiKey = "sk_test_51MfTJqASW7Sg3dtTqoXv4ADxyD509b9h6SWzC52gLPlcrgPhwEm9PcrnAQkdzHzviGLlDzIrFdmhuq7VyGnz1Jmm00Lk0pmBeI";


            Map<String, Object> card = new HashMap<>();
            card.put("number", pt.getNumber());
            card.put("exp_month", pt.getExp_month());
            card.put("exp_year", pt.getExp_year());
            card.put("cvc", pt.getCvc());
            Map<String, Object> params2 = new HashMap<>();
            params2.put("card", card);

            Token token = Token.create(params2);

            String tokenString = token.getId();

            PaymentIntentCreateParams params = PaymentIntentCreateParams
                .builder()
                .setAmount(Amount)
                .setCurrency("usd")
                .setPaymentMethod(tokenString)
                .build();


            paymentRepository.save(payment);
            Optional<Payment> payment1 = paymentRepository.findFirstByUseridOrderByCreatedondateDesc(user.get().getId());

//                paymentRepository.findByUserid(user.get().getId());
            if (!payment1.isPresent()){
                throw new BadRequestAlertException("payment not found",ENTITY_NAME,"paymentiderror");
            }
            po.setPayment(payment1.get());
            purchaseOrderRepository.save(po);
            return ResponseEntity.ok("Payment processed successfully!");
        } catch (Exception e) {
            // Log the exception
            System.out.println("Error processing payment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment failed: " + e.getMessage());
        }
    }

}
