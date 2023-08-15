package webdev.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;
import java.time.ZonedDateTime;

/**
 * A PurchaseOrder.
 */
@Entity
@Table(name = "purchase_order")
public class PurchaseOrder implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "createdondate")
    private ZonedDateTime createdondate;

    @Column(name = "status")
    private String status;

    @Column(name = "total")
    private Double total;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "userid")
    private Long userid;

    @OneToOne
    @JoinColumn(unique = true)
    private Payment payment;

    @ManyToOne
    @JsonIgnoreProperties("purchaseOrders")
    private ShoppingCart shoppingCart;

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

    public PurchaseOrder createdondate(ZonedDateTime createdondate) {
        this.createdondate = createdondate;
        return this;
    }

    public void setCreatedondate(ZonedDateTime createdondate) {
        this.createdondate = createdondate;
    }

    public String getStatus() {
        return status;
    }

    public PurchaseOrder status(String status) {
        this.status = status;
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getTotal() {
        return total;
    }

    public PurchaseOrder total(Double total) {
        this.total = total;
        return this;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public PurchaseOrder paymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
        return this;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Long getUserid() {
        return userid;
    }

    public PurchaseOrder userid(Long userid) {
        this.userid = userid;
        return this;
    }

    public void setUserid(Long userid) {
        this.userid = userid;
    }

    public Payment getPayment() {
        return payment;
    }

    public PurchaseOrder payment(Payment payment) {
        this.payment = payment;
        return this;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public ShoppingCart getShoppingCart() {
        return shoppingCart;
    }

    public PurchaseOrder shoppingCart(ShoppingCart shoppingCart) {
        this.shoppingCart = shoppingCart;
        return this;
    }

    public void setShoppingCart(ShoppingCart shoppingCart) {
        this.shoppingCart = shoppingCart;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PurchaseOrder)) {
            return false;
        }
        return id != null && id.equals(((PurchaseOrder) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "PurchaseOrder{" +
            "id=" + getId() +
            ", createdondate='" + getCreatedondate() + "'" +
            ", status='" + getStatus() + "'" +
            ", total=" + getTotal() +
            ", paymentMethod='" + getPaymentMethod() + "'" +
            ", userid=" + getUserid() +
            "}";
    }
}
