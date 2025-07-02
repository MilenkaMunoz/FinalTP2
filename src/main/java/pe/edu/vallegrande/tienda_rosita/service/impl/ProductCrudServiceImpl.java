package pe.edu.vallegrande.tienda_rosita.service.impl;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.vallegrande.tienda_rosita.dao.ProductRepository;
import pe.edu.vallegrande.tienda_rosita.dto.ProductDto;
import pe.edu.vallegrande.tienda_rosita.model.Product;
import pe.edu.vallegrande.tienda_rosita.service.ProductCrudService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductCrudServiceImpl implements ProductCrudService {

    private final ProductRepository repository;

    @Override
    public List<ProductDto> findAll() {
        return repository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public ProductDto create(ProductDto dto) {
        Product entity = toEntity(dto);
        return toDto(repository.save(entity));
    }

    @Override
    public ProductDto update(Long id, ProductDto dto) {
        Product entity = repository.findById(id).orElseThrow();
        entity.setProductCode(dto.getProductCode());
        entity.setProductName(dto.getProductName());
        entity.setDescription(dto.getDescription());
        entity.setPurchasePrice(dto.getPurchasePrice());
        entity.setSalePrice(dto.getSalePrice());
        entity.setStock(dto.getStock());
        entity.setCategory(dto.getCategory());
        entity.setStatus(dto.getStatus());
        return toDto(repository.save(entity));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    private ProductDto toDto(Product entity) {
        return new ProductDto(
                entity.getProductId(),
                entity.getProductCode(),
                entity.getProductName(),
                entity.getDescription(),
                entity.getPurchasePrice(),
                entity.getSalePrice(),
                entity.getStock(),
                entity.getCategory(),
                entity.getStatus()
        );
    }

    private Product toEntity(ProductDto dto) {
        return new Product(
                dto.getProductId(),
                dto.getProductCode(),
                dto.getProductName(),
                dto.getDescription(),
                dto.getPurchasePrice(),
                dto.getSalePrice(),
                dto.getStock(),
                dto.getCategory(),
                dto.getStatus()
        );
    }
}
