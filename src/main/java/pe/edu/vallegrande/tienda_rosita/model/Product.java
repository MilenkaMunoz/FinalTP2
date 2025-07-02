package pe.edu.vallegrande.tienda_rosita.model;


import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products", schema = "tienda_rosita")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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