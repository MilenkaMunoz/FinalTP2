package pe.edu.vallegrande.tienda_rosita.service;

import pe.edu.vallegrande.tienda_rosita.dto.SaleDto;
import java.util.List;

public interface SaleCrudService {
    List<SaleDto> findAll();
    SaleDto create(SaleDto dto);
}
