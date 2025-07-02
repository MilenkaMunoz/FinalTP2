package pe.edu.vallegrande.tienda_rosita.model;


import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "sales", schema = "tienda_rosita")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long saleId;
    private String saleCode;
    private Long clientId;
    private String clientName;
    private LocalDateTime saleDate = LocalDateTime.now();
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String remarks;
    private String status;

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL)
    private List<SaleDetail> details;
}