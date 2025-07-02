package pe.edu.vallegrande.tienda_rosita.dao;


import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.vallegrande.tienda_rosita.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}