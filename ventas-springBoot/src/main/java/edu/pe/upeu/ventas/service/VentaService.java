package edu.pe.upeu.ventas.service;


import edu.pe.upeu.ventas.model.Cliente;
import edu.pe.upeu.ventas.model.DetalleVenta;
import edu.pe.upeu.ventas.model.Producto;
import edu.pe.upeu.ventas.model.Venta;
import edu.pe.upeu.ventas.repository.ClienteRepository;
import edu.pe.upeu.ventas.repository.DetalleVentaRepository;
import edu.pe.upeu.ventas.repository.ProductoRepository;
import edu.pe.upeu.ventas.repository.VentaRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class VentaService {

    private final VentaRepository ventaRepo;
    private final DetalleVentaRepository detalleRepo;
    private final ProductoRepository productoRepo;
    private final ClienteRepository clienteRepo;

    public VentaService(VentaRepository ventaRepo, DetalleVentaRepository detalleRepo,
                        ProductoRepository productoRepo, ClienteRepository clienteRepo) {
        this.ventaRepo = ventaRepo;
        this.detalleRepo = detalleRepo;
        this.productoRepo = productoRepo;
        this.clienteRepo = clienteRepo;
    }

    // 🔹 Listar todas las ventas
    public List<Venta> listar() {
        return ventaRepo.findAll();
    }

    // 🔹 Listar por cliente
    public List<Venta> listarPorCliente(Long clienteId) {
        return ventaRepo.findByClienteId(clienteId);
    }

    // 🔹 Registrar una nueva venta
    public Venta registrarVenta(Venta venta) {
        // 1️⃣ Validar cliente existente
        Cliente cliente = clienteRepo.findById(venta.getCliente().getId())
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado"));

        venta.setCliente(cliente);
        venta.setFecha(LocalDateTime.now());

        // 2️⃣ Validar productos y actualizar stock
        for (DetalleVenta detalle : venta.getDetalles()) {
            Producto producto = productoRepo.findById(detalle.getProducto().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));

            if (producto.getStock() < detalle.getCantidad()) {
                throw new IllegalArgumentException("Stock insuficiente para: " + producto.getNombre());
            }

            // Descontar stock
            producto.setStock(producto.getStock() - detalle.getCantidad());
            productoRepo.save(producto);

            // Asignar datos del detalle
            detalle.setPrecioUnitario(producto.getPrecio());
            detalle.calcularSubtotal();
            detalle.setVenta(venta);
        }

        // 3️⃣ Calcular total y guardar venta
        venta.calcularTotal();
        return ventaRepo.save(venta);
    }
}
