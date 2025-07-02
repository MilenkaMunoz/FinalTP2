package pe.edu.vallegrande.tienda_rosita.service;
import pe.edu.vallegrande.tienda_rosita.dto.ProductDto;
import java.util.List;

public interface ProductCrudService {
    List<ProductDto> findAll();
    ProductDto create(ProductDto dto);
    ProductDto update(Long id, ProductDto dto);
    void delete(Long id);
}