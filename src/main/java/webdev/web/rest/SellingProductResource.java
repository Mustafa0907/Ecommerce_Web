package webdev.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import webdev.domain.SellingProduct;
import webdev.domain.User;
import webdev.repository.SellingProductRepository;
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

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link webdev.domain.SellingProduct}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SellingProductResource {

    private final Logger log = LoggerFactory.getLogger(SellingProductResource.class);

    private static final String ENTITY_NAME = "sellingProduct";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @Autowired
    private UserRepository userRepository;
    private final SellingProductRepository sellingProductRepository;

    public SellingProductResource(SellingProductRepository sellingProductRepository) {
        this.sellingProductRepository = sellingProductRepository;
    }

    /**
     * {@code POST  /selling-products} : Create a new sellingProduct.
     *
     * @param sellingProduct the sellingProduct to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sellingProduct, or with status {@code 400 (Bad Request)} if the sellingProduct has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user/selling-products")
    public ResponseEntity<SellingProduct> createSellingProduct(@Valid @RequestBody SellingProduct sellingProduct) throws URISyntaxException {
        log.debug("REST request to save SellingProduct : {}", sellingProduct);
        if (sellingProduct.getId() != null) {
            throw new BadRequestAlertException("A new sellingProduct cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String login = authentication.getName();
        Optional<User> user = userRepository.findOneByLogin(login);
        sellingProduct.setUserid(user.get().getId());
        SellingProduct result = sellingProductRepository.save(sellingProduct);
        return ResponseEntity.created(new URI("/api/user/selling-products/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /selling-products} : Updates an existing sellingProduct.
     *
     * @param sellingProduct the sellingProduct to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sellingProduct,
     * or with status {@code 400 (Bad Request)} if the sellingProduct is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sellingProduct couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/selling-products")
    public ResponseEntity<SellingProduct> updateSellingProduct(@RequestBody SellingProduct sellingProduct) throws URISyntaxException {
        log.debug("REST request to update SellingProduct : {}", sellingProduct);
        if (sellingProduct.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        SellingProduct result = sellingProductRepository.save(sellingProduct);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, sellingProduct.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /selling-products} : get all the sellingProducts.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sellingProducts in body.
     */
    @GetMapping("/selling-products")
    public List<SellingProduct> getAllSellingProducts() {
        log.debug("REST request to get all SellingProducts");
        return sellingProductRepository.findAll();
    }

    /**
     * {@code GET  /selling-products/:id} : get the "id" sellingProduct.
     *
     * @param id the id of the sellingProduct to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sellingProduct, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/selling-products/{id}")
    public ResponseEntity<SellingProduct> getSellingProduct(@PathVariable Long id) {
        log.debug("REST request to get SellingProduct : {}", id);
        Optional<SellingProduct> sellingProduct = sellingProductRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(sellingProduct);
    }

    /**
     * {@code DELETE  /selling-products/:id} : delete the "id" sellingProduct.
     *
     * @param id the id of the sellingProduct to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/selling-products/{id}")
    public ResponseEntity<Void> deleteSellingProduct(@PathVariable Long id) {
        log.debug("REST request to delete SellingProduct : {}", id);
        sellingProductRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
