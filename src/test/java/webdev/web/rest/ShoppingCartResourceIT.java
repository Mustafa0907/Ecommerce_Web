package webdev.web.rest;

import webdev.EcommerceWebApp;
import webdev.domain.ShoppingCart;
import webdev.repository.ShoppingCartRepository;

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
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static webdev.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link ShoppingCartResource} REST controller.
 */
@SpringBootTest(classes = EcommerceWebApp.class)

@AutoConfigureMockMvc
@WithMockUser
public class ShoppingCartResourceIT {

    private static final ZonedDateTime DEFAULT_CREATEDONDATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATEDONDATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Long DEFAULT_USERID = 1L;
    private static final Long UPDATED_USERID = 2L;

    @Autowired
    private ShoppingCartRepository shoppingCartRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restShoppingCartMockMvc;

    private ShoppingCart shoppingCart;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShoppingCart createEntity(EntityManager em) {
        ShoppingCart shoppingCart = new ShoppingCart()
            .createdondate(DEFAULT_CREATEDONDATE)
            .userid(DEFAULT_USERID);
        return shoppingCart;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShoppingCart createUpdatedEntity(EntityManager em) {
        ShoppingCart shoppingCart = new ShoppingCart()
            .createdondate(UPDATED_CREATEDONDATE)
            .userid(UPDATED_USERID);
        return shoppingCart;
    }

    @BeforeEach
    public void initTest() {
        shoppingCart = createEntity(em);
    }

    @Test
    @Transactional
    public void createShoppingCart() throws Exception {
        int databaseSizeBeforeCreate = shoppingCartRepository.findAll().size();

        // Create the ShoppingCart
        restShoppingCartMockMvc.perform(post("/api/shopping-carts")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(shoppingCart)))
            .andExpect(status().isCreated());

        // Validate the ShoppingCart in the database
        List<ShoppingCart> shoppingCartList = shoppingCartRepository.findAll();
        assertThat(shoppingCartList).hasSize(databaseSizeBeforeCreate + 1);
        ShoppingCart testShoppingCart = shoppingCartList.get(shoppingCartList.size() - 1);
        assertThat(testShoppingCart.getCreatedondate()).isEqualTo(DEFAULT_CREATEDONDATE);
        assertThat(testShoppingCart.getUserid()).isEqualTo(DEFAULT_USERID);
    }

    @Test
    @Transactional
    public void createShoppingCartWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = shoppingCartRepository.findAll().size();

        // Create the ShoppingCart with an existing ID
        shoppingCart.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restShoppingCartMockMvc.perform(post("/api/shopping-carts")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(shoppingCart)))
            .andExpect(status().isBadRequest());

        // Validate the ShoppingCart in the database
        List<ShoppingCart> shoppingCartList = shoppingCartRepository.findAll();
        assertThat(shoppingCartList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllShoppingCarts() throws Exception {
        // Initialize the database
        shoppingCartRepository.saveAndFlush(shoppingCart);

        // Get all the shoppingCartList
        restShoppingCartMockMvc.perform(get("/api/shopping-carts?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shoppingCart.getId().intValue())))
            .andExpect(jsonPath("$.[*].createdondate").value(hasItem(sameInstant(DEFAULT_CREATEDONDATE))))
            .andExpect(jsonPath("$.[*].userid").value(hasItem(DEFAULT_USERID.intValue())));
    }
    
    @Test
    @Transactional
    public void getShoppingCart() throws Exception {
        // Initialize the database
        shoppingCartRepository.saveAndFlush(shoppingCart);

        // Get the shoppingCart
        restShoppingCartMockMvc.perform(get("/api/shopping-carts/{id}", shoppingCart.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(shoppingCart.getId().intValue()))
            .andExpect(jsonPath("$.createdondate").value(sameInstant(DEFAULT_CREATEDONDATE)))
            .andExpect(jsonPath("$.userid").value(DEFAULT_USERID.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingShoppingCart() throws Exception {
        // Get the shoppingCart
        restShoppingCartMockMvc.perform(get("/api/shopping-carts/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateShoppingCart() throws Exception {
        // Initialize the database
        shoppingCartRepository.saveAndFlush(shoppingCart);

        int databaseSizeBeforeUpdate = shoppingCartRepository.findAll().size();

        // Update the shoppingCart
        ShoppingCart updatedShoppingCart = shoppingCartRepository.findById(shoppingCart.getId()).get();
        // Disconnect from session so that the updates on updatedShoppingCart are not directly saved in db
        em.detach(updatedShoppingCart);
        updatedShoppingCart
            .createdondate(UPDATED_CREATEDONDATE)
            .userid(UPDATED_USERID);

        restShoppingCartMockMvc.perform(put("/api/shopping-carts")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedShoppingCart)))
            .andExpect(status().isOk());

        // Validate the ShoppingCart in the database
        List<ShoppingCart> shoppingCartList = shoppingCartRepository.findAll();
        assertThat(shoppingCartList).hasSize(databaseSizeBeforeUpdate);
        ShoppingCart testShoppingCart = shoppingCartList.get(shoppingCartList.size() - 1);
        assertThat(testShoppingCart.getCreatedondate()).isEqualTo(UPDATED_CREATEDONDATE);
        assertThat(testShoppingCart.getUserid()).isEqualTo(UPDATED_USERID);
    }

    @Test
    @Transactional
    public void updateNonExistingShoppingCart() throws Exception {
        int databaseSizeBeforeUpdate = shoppingCartRepository.findAll().size();

        // Create the ShoppingCart

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShoppingCartMockMvc.perform(put("/api/shopping-carts")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(shoppingCart)))
            .andExpect(status().isBadRequest());

        // Validate the ShoppingCart in the database
        List<ShoppingCart> shoppingCartList = shoppingCartRepository.findAll();
        assertThat(shoppingCartList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteShoppingCart() throws Exception {
        // Initialize the database
        shoppingCartRepository.saveAndFlush(shoppingCart);

        int databaseSizeBeforeDelete = shoppingCartRepository.findAll().size();

        // Delete the shoppingCart
        restShoppingCartMockMvc.perform(delete("/api/shopping-carts/{id}", shoppingCart.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ShoppingCart> shoppingCartList = shoppingCartRepository.findAll();
        assertThat(shoppingCartList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
