package webdev.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;
import java.time.ZonedDateTime;

/**
 * A Review.
 */
@Entity
@Table(name = "review")
public class Review implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "createdondate")
    private ZonedDateTime createdondate;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "review_text")
    private String reviewText;

    @Column(name = "userid")
    private Long userid;

    @ManyToOne
    @JsonIgnoreProperties("reviews")
    private Product product;

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

    public Review createdondate(ZonedDateTime createdondate) {
        this.createdondate = createdondate;
        return this;
    }

    public void setCreatedondate(ZonedDateTime createdondate) {
        this.createdondate = createdondate;
    }

    public Integer getRating() {
        return rating;
    }

    public Review rating(Integer rating) {
        this.rating = rating;
        return this;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getReviewText() {
        return reviewText;
    }

    public Review reviewText(String reviewText) {
        this.reviewText = reviewText;
        return this;
    }

    public void setReviewText(String reviewText) {
        this.reviewText = reviewText;
    }

    public Long getUserid() {
        return userid;
    }

    public Review userid(Long userid) {
        this.userid = userid;
        return this;
    }

    public void setUserid(Long userid) {
        this.userid = userid;
    }

    public Product getProduct() {
        return product;
    }

    public Review product(Product product) {
        this.product = product;
        return this;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Review)) {
            return false;
        }
        return id != null && id.equals(((Review) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Review{" +
            "id=" + getId() +
            ", createdondate='" + getCreatedondate() + "'" +
            ", rating=" + getRating() +
            ", reviewText='" + getReviewText() + "'" +
            ", userid=" + getUserid() +
            "}";
    }
}
