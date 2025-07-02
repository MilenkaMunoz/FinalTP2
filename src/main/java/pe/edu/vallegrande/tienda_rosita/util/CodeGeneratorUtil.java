package pe.edu.vallegrande.tienda_rosita.util;
import java.text.DecimalFormat;

public class CodeGeneratorUtil {

    private static final String PREFIX = "SALE-";
    private static final DecimalFormat FORMATTER = new DecimalFormat("000000");

    public static String generateSaleCode(Long id) {
        return PREFIX + FORMATTER.format(id);
    }

    // Puedes extenderlo para productos, clientes, etc.
    public static String generateProductCode(Long id) {
        return "PROD-" + FORMATTER.format(id);
    }

    public static String generateClientCode(Long id) {
        return "CLNT-" + FORMATTER.format(id);
    }
}