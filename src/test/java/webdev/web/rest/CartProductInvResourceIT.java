package webdev.web.rest;

import webdev.EcommerceWebApp;
import webdev.domain.CartProductInv;
import webdev.repository.CartProductInvRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link CartProductInvResource} REST controller.
 */
@SpringBootTest(classes = EcommerceWebApp.class)

@AutoConfigureMockMvc
@WithMockUser
public class CartProductInvResourceIT {

    private static final Integer DEFAULT_QUANTITY = 1;
    private static final Integer UPDATED_QUANTITY = 2;

    @Autowired
    private CartProductInvRepository cartProductInvRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCartProductInvMockMvc;

    private CartProductInv cartProductInv;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CartProductInv createEntity(EntityManager em) {
        CartProductInv cartProductInv = new CartProductInv()
            .quantity(DEFAULT_QUANTITY);
        return cartProductInv;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CartProductInv createUpdatedEntity(EntityManager em) {
        CartProductInv cartProductInv = new CartProductInv()
            .quantity(UPDATED_QUANTITY);
        return cartProductInv;
    }

    @BeforeEach
    public void initTest() {
        cartProductInv = createEntity(em);
    }

    @Test
    @Transactional
    public void createCartProductInv() throws Exception {
        int databaseSizeBeforeCreate = cartProductInvRepository.findAll().size();

        // Create the CartProductInv
        restCartProductInvMockMvc.perform(post("/api/cart-product-invs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(cartProductInv)))
            .andExpect(status().isCreated());

        // Validate the CartProductInv in the database
        List<CartProductInv> cartProductInvList = cartProductInvRepository.findAll();
        assertThat(cartProductInvList).hasSize(databaseSizeBeforeCreate + 1);
        CartProductInv testCartProductInv = cartProductInvList.get(cartProductInvList.size() - 1);
        assertThat(testCartProductInv.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
    }

    @Test
    @Transactional
    public void createCartProductInvWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = cartProductInvRepository.findAll().size();

        // Create the CartProductInv with an existing ID
        cartProductInv.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCartProductInvMockMvc.perform(post("/api/cart-product-invs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(cartProductInv)))
            .andExpect(status().isBadRequest());

        // Validate the CartProductInv in the database
        List<CartProductInv> cartProductInvList = cartProductInvRepository.findAll();
        assertThat(cartProductInvList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllCartProductInvs() throws Exception {
        // Initialize the database
        cartProductInvRepository.saveAndFlush(cartProductInv);

        // Get all the cartProductInvList
        restCartProductInvMockMvc.perform(get("/api/cart-product-invs?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cartProductInv.getId().intValue())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)));
    }
    
    @Test
    @Transactional
    public void getCartProductInv() throws Exception {
        // Initialize the database
        cartProductInvRepository.saveAndFlush(cartProductInv);

        // Get the cartProductInv
        restCartProductInvMockMvc.perform(get("/api/cart-product-invs/{id}", cartProductInv.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(cartProductInv.getId().intValue()))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY));
    }

    @Test
    @Transactional
    public void getNonExistingCartProductInv() throws Exception {
        // Get the cartProductInv
        restCartProductInvMockMvc.perform(get("/api/cart-product-invs/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCartProductInv() throws Exception {
        // Initialize the database
        cartProductInvRepository.saveAndFlush(cartProductInv);

        int databaseSizeBeforeUpdate = cartProductInvRepository.findAll().size();

        // Update the cartProductInv
        CartProductInv updatedCartProductInv = cartProductInvRepository.findById(cartProductInv.getId()).get();
        // Disconnect from session so that the updates on updatedCartProductInv are not directly saved in db
        em.detach(updatedCartProductInv);
        updatedCartProductInv
            .quantity(UPDATED_QUANTITY);

        restCartProductInvMockMvc.perform(put("/api/cart-product-invs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedCartProductInv)))
            .andExpect(status().isOk());

        // Validate the CartProductInv in the database
        List<CartProductInv> cartProductInvList = cartProductInvRepository.findAll();
        assertThat(cartProductInvList).hasSize(databaseSizeBeforeUpdate);
        CartProductInv testCartProductInv = cartProductInvList.get(cartProductInvList.size() - 1);
        assertThat(testCartProductInv.getQuantity()).isEqualTo(UPDATED_QUANTITY);
    }

    @Test
    @Transactional
    public void updateNonExistingCartProductInv() throws Exception {
        int databaseSizeBeforeUpdate = cartProductInvRepository.findAll().size();

        // Create the CartProductInv

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCartProductInvMockMvc.perform(put("/api/cart-product-invs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(cartProductInv)))
            .andExpect(status().isBadRequest());

        // Validate the CartProductInv in the database
        List<CartProductInv> cartProductInvList = cartProductInvRepository.findAll();
        assertThat(cartProductInvList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteCartProductInv() throws Exception {
        // Initialize the database
        cartProductInvRepository.saveAndFlush(cartProductInv);

        int databaseSizeBeforeDelete = cartProductInvRepository.findAll().size();

        // Delete the cartProductInv
        restCartProductInvMockMvc.perform(delete("/api/cart-product-invs/{id}", cartProductInv.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CartProductInv> cartProductInvList = cartProductInvRepository.findAll();
        assertThat(cartProductInvList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
