package pe.edu.vallegrande.tienda_rosita.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.vallegrande.tienda_rosita.dto.SaleDto;
import pe.edu.vallegrande.tienda_rosita.service.SaleCrudService;
import java.util.List;

@RestController
@RequestMapping("/sales")
@RequiredArgsConstructor
public class SaleCrudController {
    private final SaleCrudService service;

    @GetMapping
    public ResponseEntity<List<SaleDto>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @PostMapping
    public ResponseEntity<SaleDto> create(@RequestBody SaleDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }
}