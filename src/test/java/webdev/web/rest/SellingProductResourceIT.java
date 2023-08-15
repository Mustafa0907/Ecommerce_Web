package webdev.web.rest;

import webdev.EcommerceWebApp;
import webdev.domain.SellingProduct;
import webdev.repository.SellingProductRepository;

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
 * Integration tests for the {@link SellingProductResource} REST controller.
 */
@SpringBootTest(classes = EcommerceWebApp.class)

@AutoConfigureMockMvc
@WithMockUser
public class SellingProductResourceIT {

    private static final ZonedDateTime DEFAULT_CREATEDONDATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATEDONDATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_BRAND = "AAAAAAAAAA";
    private static final String UPDATED_BRAND = "BBBBBBBBBB";

    private static final String DEFAULT_CATEGORY = "AAAAAAAAAA";
    private static final String UPDATED_CATEGORY = "BBBBBBBBBB";

    private static final String DEFAULT_DETAILS = "AAAAAAAAAA";
    private static final String UPDATED_DETAILS = "BBBBBBBBBB";

    private static final String DEFAULT_EXPECTED_PRICE = "AAAAAAAAAA";
    private static final String UPDATED_EXPECTED_PRICE = "BBBBBBBBBB";

    private static final Long DEFAULT_USERID = 1L;
    private static final Long UPDATED_USERID = 2L;

    @Autowired
    private SellingProductRepository sellingProductRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSellingProductMockMvc;

    private SellingProduct sellingProduct;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SellingProduct createEntity(EntityManager em) {
        SellingProduct sellingProduct = new SellingProduct()
            .createdondate(DEFAULT_CREATEDONDATE)
            .name(DEFAULT_NAME)
            .brand(DEFAULT_BRAND)
            .category(DEFAULT_CATEGORY)
            .details(DEFAULT_DETAILS)
            .expectedPrice(DEFAULT_EXPECTED_PRICE)
            .userid(DEFAULT_USERID);
        return sellingProduct;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SellingProduct createUpdatedEntity(EntityManager em) {
        SellingProduct sellingProduct = new SellingProduct()
            .createdondate(UPDATED_CREATEDONDATE)
            .name(UPDATED_NAME)
            .brand(UPDATED_BRAND)
            .category(UPDATED_CATEGORY)
            .details(UPDATED_DETAILS)
            .expectedPrice(UPDATED_EXPECTED_PRICE)
            .userid(UPDATED_USERID);
        return sellingProduct;
    }

    @BeforeEach
    public void initTest() {
        sellingProduct = createEntity(em);
    }

    @Test
    @Transactional
    public void createSellingProduct() throws Exception {
        int databaseSizeBeforeCreate = sellingProductRepository.findAll().size();

        // Create the SellingProduct
        restSellingProductMockMvc.perform(post("/api/selling-products")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(sellingProduct)))
            .andExpect(status().isCreated());

        // Validate the SellingProduct in the database
        List<SellingProduct> sellingProductList = sellingProductRepository.findAll();
        assertThat(sellingProductList).hasSize(databaseSizeBeforeCreate + 1);
        SellingProduct testSellingProduct = sellingProductList.get(sellingProductList.size() - 1);
        assertThat(testSellingProduct.getCreatedondate()).isEqualTo(DEFAULT_CREATEDONDATE);
        assertThat(testSellingProduct.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSellingProduct.getBrand()).isEqualTo(DEFAULT_BRAND);
        assertThat(testSellingProduct.getCategory()).isEqualTo(DEFAULT_CATEGORY);
        assertThat(testSellingProduct.getDetails()).isEqualTo(DEFAULT_DETAILS);
        assertThat(testSellingProduct.getExpectedPrice()).isEqualTo(DEFAULT_EXPECTED_PRICE);
        assertThat(testSellingProduct.getUserid()).isEqualTo(DEFAULT_USERID);
    }

    @Test
    @Transactional
    public void createSellingProductWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = sellingProductRepository.findAll().size();

        // Create the SellingProduct with an existing ID
        sellingProduct.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSellingProductMockMvc.perform(post("/api/selling-products")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(sellingProduct)))
            .andExpect(status().isBadRequest());

        // Validate the SellingProduct in the database
        List<SellingProduct> sellingProductList = sellingProductRepository.findAll();
        assertThat(sellingProductList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllSellingProducts() throws Exception {
        // Initialize the database
        sellingProductRepository.saveAndFlush(sellingProduct);

        // Get all the sellingProductList
        restSellingProductMockMvc.perform(get("/api/selling-products?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sellingProduct.getId().intValue())))
            .andExpect(jsonPath("$.[*].createdondate").value(hasItem(sameInstant(DEFAULT_CREATEDONDATE))))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].brand").value(hasItem(DEFAULT_BRAND)))
            .andExpect(jsonPath("$.[*].category").value(hasItem(DEFAULT_CATEGORY)))
            .andExpect(jsonPath("$.[*].details").value(hasItem(DEFAULT_DETAILS)))
            .andExpect(jsonPath("$.[*].expectedPrice").value(hasItem(DEFAULT_EXPECTED_PRICE)))
            .andExpect(jsonPath("$.[*].userid").value(hasItem(DEFAULT_USERID.intValue())));
    }
    
    @Test
    @Transactional
    public void getSellingProduct() throws Exception {
        // Initialize the database
        sellingProductRepository.saveAndFlush(sellingProduct);

        // Get the sellingProduct
        restSellingProductMockMvc.perform(get("/api/selling-products/{id}", sellingProduct.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sellingProduct.getId().intValue()))
            .andExpect(jsonPath("$.createdondate").value(sameInstant(DEFAULT_CREATEDONDATE)))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.brand").value(DEFAULT_BRAND))
            .andExpect(jsonPath("$.category").value(DEFAULT_CATEGORY))
            .andExpect(jsonPath("$.details").value(DEFAULT_DETAILS))
            .andExpect(jsonPath("$.expectedPrice").value(DEFAULT_EXPECTED_PRICE))
            .andExpect(jsonPath("$.userid").value(DEFAULT_USERID.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingSellingProduct() throws Exception {
        // Get the sellingProduct
        restSellingProductMockMvc.perform(get("/api/selling-products/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSellingProduct() throws Exception {
        // Initialize the database
        sellingProductRepository.saveAndFlush(sellingProduct);

        int databaseSizeBeforeUpdate = sellingProductRepository.findAll().size();

        // Update the sellingProduct
        SellingProduct updatedSellingProduct = sellingProductRepository.findById(sellingProduct.getId()).get();
        // Disconnect from session so that the updates on updatedSellingProduct are not directly saved in db
        em.detach(updatedSellingProduct);
        updatedSellingProduct
            .createdondate(UPDATED_CREATEDONDATE)
            .name(UPDATED_NAME)
            .brand(UPDATED_BRAND)
            .category(UPDATED_CATEGORY)
            .details(UPDATED_DETAILS)
            .expectedPrice(UPDATED_EXPECTED_PRICE)
            .userid(UPDATED_USERID);

        restSellingProductMockMvc.perform(put("/api/selling-products")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedSellingProduct)))
            .andExpect(status().isOk());

        // Validate the SellingProduct in the database
        List<SellingProduct> sellingProductList = sellingProductRepository.findAll();
        assertThat(sellingProductList).hasSize(databaseSizeBeforeUpdate);
        SellingProduct testSellingProduct = sellingProductList.get(sellingProductList.size() - 1);
        assertThat(testSellingProduct.getCreatedondate()).isEqualTo(UPDATED_CREATEDONDATE);
        assertThat(testSellingProduct.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSellingProduct.getBrand()).isEqualTo(UPDATED_BRAND);
        assertThat(testSellingProduct.getCategory()).isEqualTo(UPDATED_CATEGORY);
        assertThat(testSellingProduct.getDetails()).isEqualTo(UPDATED_DETAILS);
        assertThat(testSellingProduct.getExpectedPrice()).isEqualTo(UPDATED_EXPECTED_PRICE);
        assertThat(testSellingProduct.getUserid()).isEqualTo(UPDATED_USERID);
    }

    @Test
    @Transactional
    public void updateNonExistingSellingProduct() throws Exception {
        int databaseSizeBeforeUpdate = sellingProductRepository.findAll().size();

        // Create the SellingProduct

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSellingProductMockMvc.perform(put("/api/selling-products")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(sellingProduct)))
            .andExpect(status().isBadRequest());

        // Validate the SellingProduct in the database
        List<SellingProduct> sellingProductList = sellingProductRepository.findAll();
        assertThat(sellingProductList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteSellingProduct() throws Exception {
        // Initialize the database
        sellingProductRepository.saveAndFlush(sellingProduct);

        int databaseSizeBeforeDelete = sellingProductRepository.findAll().size();

        // Delete the sellingProduct
        restSellingProductMockMvc.perform(delete("/api/selling-products/{id}", sellingProduct.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SellingProduct> sellingProductList = sellingProductRepository.findAll();
        assertThat(sellingProductList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
