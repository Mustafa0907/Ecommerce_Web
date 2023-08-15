package webdev.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import webdev.web.rest.TestUtil;

public class SellingProductTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SellingProduct.class);
        SellingProduct sellingProduct1 = new SellingProduct();
        sellingProduct1.setId(1L);
        SellingProduct sellingProduct2 = new SellingProduct();
        sellingProduct2.setId(sellingProduct1.getId());
        assertThat(sellingProduct1).isEqualTo(sellingProduct2);
        sellingProduct2.setId(2L);
        assertThat(sellingProduct1).isNotEqualTo(sellingProduct2);
        sellingProduct1.setId(null);
        assertThat(sellingProduct1).isNotEqualTo(sellingProduct2);
    }
}
