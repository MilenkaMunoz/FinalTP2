package pe.edu.vallegrande.tienda_rosita.dto;


import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long productId;
    private String productCode;
    private String productName;
    private String description;
    private BigDecimal purchasePrice;
    private BigDecimal salePrice;
    private Integer stock;
    private String category;
    private String status;
}