package webdev.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import webdev.web.rest.TestUtil;

public class CartProductInvTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CartProductInv.class);
        CartProductInv cartProductInv1 = new CartProductInv();
        cartProductInv1.setId(1L);
        CartProductInv cartProductInv2 = new CartProductInv();
        cartProductInv2.setId(cartProductInv1.getId());
        assertThat(cartProductInv1).isEqualTo(cartProductInv2);
        cartProductInv2.setId(2L);
        assertThat(cartProductInv1).isNotEqualTo(cartProductInv2);
        cartProductInv1.setId(null);
        assertThat(cartProductInv1).isNotEqualTo(cartProductInv2);
    }
}
