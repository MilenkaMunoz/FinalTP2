package pe.edu.vallegrande.tienda_rosita.dto;


import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientDto {
    private Long clientId;
    private String nationalId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String district;
    private String status;
}