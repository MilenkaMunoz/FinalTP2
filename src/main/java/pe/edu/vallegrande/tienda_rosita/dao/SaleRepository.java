package pe.edu.vallegrande.tienda_rosita.dao;


import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.vallegrande.tienda_rosita.model.Sale;

public interface SaleRepository extends JpaRepository<Sale, Long> {
}
