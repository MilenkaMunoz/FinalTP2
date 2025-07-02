package pe.edu.vallegrande.tienda_rosita.service;


import pe.edu.vallegrande.tienda_rosita.dto.ClientDto;
import java.util.List;

public interface ClientCrudService {
    List<ClientDto> findAll();
    ClientDto findById(Long id);
    ClientDto create(ClientDto dto);
    ClientDto update(Long id, ClientDto dto);
    void delete(Long id);
}
