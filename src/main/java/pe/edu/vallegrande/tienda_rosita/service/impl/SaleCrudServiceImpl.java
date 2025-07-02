package pe.edu.vallegrande.tienda_rosita.service.impl;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.vallegrande.tienda_rosita.dao.*;
import pe.edu.vallegrande.tienda_rosita.dto.SaleDetailDto;
import pe.edu.vallegrande.tienda_rosita.dto.SaleDto;
import pe.edu.vallegrande.tienda_rosita.model.*;
import pe.edu.vallegrande.tienda_rosita.service.SaleCrudService;
import pe.edu.vallegrande.tienda_rosita.util.CodeGeneratorUtil;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SaleCrudServiceImpl implements SaleCrudService {

    private final SaleRepository saleRepository;
    private final SaleDetailRepository saleDetailRepository;
    private final ProductRepository productRepository;

    @Override
    public List<SaleDto> findAll() {
        return saleRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SaleDto create(SaleDto dto) {
        Sale sale = new Sale();
        sale.setClientId(dto.getClientId());
        sale.setClientName(dto.getClientName());
        sale.setPaymentMethod(dto.getPaymentMethod());
        sale.setRemarks(dto.getRemarks());
        sale.setStatus("A");

        List<SaleDetail> details = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (SaleDetailDto d : dto.getDetails()) {
            Product product = productRepository.findById(d.getProductId()).orElseThrow();

            if (product.getStock() < d.getQuantity()) {
                throw new RuntimeException("Stock insuficiente para el producto: " + product.getProductName());
            }

            product.setStock(product.getStock() - d.getQuantity());
            productRepository.save(product);

            SaleDetail detail = new SaleDetail();
            detail.setProductId(d.getProductId());
            detail.setProductName(d.getProductName());
            detail.setQuantity(d.getQuantity());
            detail.setUnitPrice(d.getUnitPrice());
            detail.setSubtotal(d.getUnitPrice().multiply(BigDecimal.valueOf(d.getQuantity())));
            detail.setUnit(d.getUnit());
            detail.setCategory(d.getCategory());
            detail.setRemarks(d.getRemarks());
            detail.setStatus("A");
            detail.setSale(sale);

            total = total.add(detail.getSubtotal());
            details.add(detail);
        }

        sale.setTotalAmount(total);
        sale.setDetails(details);
        Sale savedSale = saleRepository.save(sale);

        // Generar código de venta después de guardar
        String generatedCode = CodeGeneratorUtil.generateSaleCode(savedSale.getSaleId());
        savedSale.setSaleCode(generatedCode);
        saleRepository.save(savedSale);

        return toDto(savedSale);
    }

    private SaleDto toDto(Sale sale) {
        List<SaleDetailDto> details = sale.getDetails().stream().map(detail -> new SaleDetailDto(
                detail.getDetailId(),
                detail.getProductId(),
                detail.getProductName(),
                detail.getQuantity(),
                detail.getUnitPrice(),
                detail.getSubtotal(),
                detail.getUnit(),
                detail.getCategory(),
                detail.getRemarks(),
                detail.getStatus()
        )).collect(Collectors.toList());

        return new SaleDto(
                sale.getSaleId(),
                sale.getSaleCode(),
                sale.getClientId(),
                sale.getClientName(),
                sale.getPaymentMethod(),
                sale.getRemarks(),
                sale.getStatus(),
                details
        );
    }
}
