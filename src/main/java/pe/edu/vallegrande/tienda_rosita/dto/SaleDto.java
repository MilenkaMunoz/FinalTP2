package pe.edu.vallegrande.tienda_rosita.dto;


import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaleDto {
    private Long saleId;
    private String saleCode;
    private Long clientId;
    private String clientName;
    private String paymentMethod;
    private String remarks;
    private String status;
    private List<SaleDetailDto> details;
}
