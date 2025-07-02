package pe.edu.vallegrande.tienda_rosita.dto;


import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaleDetailDto {
    private Long detailId;
    private Long productId;
    private String productName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
    private String unit;
    private String category;
    private String remarks;
    private String status;
}

