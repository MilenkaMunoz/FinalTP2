package pe.edu.vallegrande.tienda_rosita.service.impl;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.vallegrande.tienda_rosita.dao.ClientRepository;
import pe.edu.vallegrande.tienda_rosita.dto.ClientDto;
import pe.edu.vallegrande.tienda_rosita.model.Client;
import pe.edu.vallegrande.tienda_rosita.service.ClientCrudService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClientCrudServiceImpl implements ClientCrudService {

    private final ClientRepository repository;

    @Override
    public List<ClientDto> findAll() {
        return repository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public ClientDto findById(Long id) {
        return repository.findById(id).map(this::toDto).orElse(null);
    }

    @Override
    public ClientDto create(ClientDto dto) {
        Client client = toEntity(dto);
        return toDto(repository.save(client));
    }

    @Override
    public ClientDto update(Long id, ClientDto dto) {
        Client existing = repository.findById(id).orElseThrow();
        existing.setNationalId(dto.getNationalId());
        existing.setFirstName(dto.getFirstName());
        existing.setLastName(dto.getLastName());
        existing.setEmail(dto.getEmail());
        existing.setPhone(dto.getPhone());
        existing.setAddress(dto.getAddress());
        existing.setDistrict(dto.getDistrict());
        existing.setStatus(dto.getStatus());
        return toDto(repository.save(existing));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    private ClientDto toDto(Client client) {
        return new ClientDto(
                client.getClientId(),
                client.getNationalId(),
                client.getFirstName(),
                client.getLastName(),
                client.getEmail(),
                client.getPhone(),
                client.getAddress(),
                client.getDistrict(),
                client.getStatus()
        );
    }

    private Client toEntity(ClientDto dto) {
        return new Client(
                dto.getClientId(),
                dto.getNationalId(),
                dto.getFirstName(),
                dto.getLastName(),
                dto.getEmail(),
                dto.getPhone(),
                dto.getAddress(),
                dto.getDistrict(),
                dto.getStatus()
        );
    }
}