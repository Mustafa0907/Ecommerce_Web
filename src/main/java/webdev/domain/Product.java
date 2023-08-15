package webdev.domain;


import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * A Product.
 */
@Entity
@Table(name = "product")
public class Product implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "createdondate")
    private ZonedDateTime createdondate;

    @Column(name = "name")
    private String name;

    @Column(name = "price")
    private Double price;

    @Column(name = "brand")
    private String brand;

    @Column(name = "totalquantity")
    private Integer totalquantity;

    @Column(name = "category")
    private String category;

    @Column(name = "specs")
    private String specs;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "product")
    private Set<Images> images = new HashSet<>();

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

    public Product createdondate(ZonedDateTime createdondate) {
        this.createdondate = createdondate;
        return this;
    }

    public void setCreatedondate(ZonedDateTime createdondate) {
        this.createdondate = createdondate;
    }

    public String getName() {
        return name;
    }

    public Product name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getPrice() {
        return price;
    }

    public Product price(Double price) {
        this.price = price;
        return this;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getBrand() {
        return brand;
    }

    public Product brand(String brand) {
        this.brand = brand;
        return this;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public Integer getTotalquantity() {
        return totalquantity;
    }

    public Product totalquantity(Integer totalquantity) {
        this.totalquantity = totalquantity;
        return this;
    }

    public void setTotalquantity(Integer totalquantity) {
        this.totalquantity = totalquantity;
    }

    public String getCategory() {
        return category;
    }

    public Product category(String category) {
        this.category = category;
        return this;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSpecs() {
        return specs;
    }

    public Product specs(String specs) {
        this.specs = specs;
        return this;
    }

    public void setSpecs(String specs) {
        this.specs = specs;
    }

    public Set<Images> getImages() {
        return images;
    }

    public Product images(Set<Images> images) {
        this.images = images;
        return this;
    }

    public Product addImages(Images images) {
        this.images.add(images);
        images.setProduct(this);
        return this;
    }

    public Product removeImages(Images images) {
        this.images.remove(images);
        images.setProduct(null);
        return this;
    }

    public void setImages(Set<Images> images) {
        this.images = images;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Product)) {
            return false;
        }
        return id != null && id.equals(((Product) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Product{" +
            "id=" + getId() +
            ", createdondate='" + getCreatedondate() + "'" +
            ", name='" + getName() + "'" +
            ", price=" + getPrice() +
            ", brand='" + getBrand() + "'" +
            ", totalquantity=" + getTotalquantity() +
            ", category='" + getCategory() + "'" +
            ", specs='" + getSpecs() + "'" +
            "}";
    }
}
