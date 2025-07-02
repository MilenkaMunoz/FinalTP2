package pe.edu.vallegrande.tienda_rosita.model;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "clients", schema = "tienda_rosita")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
