package webdev.domain;


import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;
import java.time.ZonedDateTime;

/**
 * A SellingProduct.
 */
@Entity
@Table(name = "selling_product")
public class SellingProduct implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "createdondate")
    private ZonedDateTime createdondate;

    @Column(name = "name")
    private String name;

    @Column(name = "brand")
    private String brand;

    @Column(name = "category")
    private String category;

    @Column(name = "details")
    private String details;

    @Column(name = "expected_price")
    private String expectedPrice;

    @Column(name = "userid")
    private Long userid;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getCreatedondate() {
        return createdondate;
    }

    public SellingProduct createdondate(ZonedDateTime createdondate) {
        this.createdondate = createdondate;
        return this;
    }

    public void setCreatedondate(ZonedDateTime createdondate) {
        this.createdondate = createdondate;
    }

    public String getName() {
        return name;
    }

    public SellingProduct name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBrand() {
        return brand;
    }

    public SellingProduct brand(String brand) {
        this.brand = brand;
        return this;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getCategory() {
        return category;
    }

    public SellingProduct category(String category) {
        this.category = category;
        return this;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDetails() {
        return details;
    }

    public SellingProduct details(String details) {
        this.details = details;
        return this;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getExpectedPrice() {
        return expectedPrice;
    }

    public SellingProduct expectedPrice(String expectedPrice) {
        this.expectedPrice = expectedPrice;
        return this;
    }

    public void setExpectedPrice(String expectedPrice) {
        this.expectedPrice = expectedPrice;
    }

    public Long getUserid() {
        return userid;
    }

    public SellingProduct userid(Long userid) {
        this.userid = userid;
        return this;
    }

    public void setUserid(Long userid) {
        this.userid = userid;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SellingProduct)) {
            return false;
        }
        return id != null && id.equals(((SellingProduct) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "SellingProduct{" +
            "id=" + getId() +
            ", createdondate='" + getCreatedondate() + "'" +
            ", name='" + getName() + "'" +
            ", brand='" + getBrand() + "'" +
            ", category='" + getCategory() + "'" +
            ", details='" + getDetails() + "'" +
            ", expectedPrice='" + getExpectedPrice() + "'" +
            ", userid=" + getUserid() +
            "}";
    }
}
