package edu.pe.upeu.ventas.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Entity
@Table(name = "detalle_venta")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // 👈 evita errores JSON
public class DetalleVenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔹 Relación con la venta (FK)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venta_id", nullable = false)
    @JsonIgnoreProperties({"detalles", "cliente", "hibernateLazyInitializer", "handler"}) // evita recursión
    private Venta venta;

    // 🔹 Relación con el producto (FK)
    @ManyToOne(fetch = FetchType.EAGER) // 👈 CAMBIADO a EAGER para enviar el producto completo
    @JoinColumn(name = "producto_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // 👈 evita ByteBuddy
    private Producto producto;

    // 🔹 Cantidad del producto vendido
    @NotNull
    @Min(1)
    @Column(nullable = false)
    private Integer cantidad;

    // 🔹 Precio unitario del producto
    @NotNull
    @DecimalMin("0.00")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario;

    // 🔹 Subtotal = cantidad * precioUnitario
    @NotNull
    @DecimalMin("0.00")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    // 🔸 Calcula subtotal antes de guardar o actualizar
    @PrePersist @PreUpdate
    public void calcularSubtotal() {
        if (precioUnitario != null && cantidad != null) {
            this.subtotal = this.precioUnitario.multiply(BigDecimal.valueOf(this.cantidad));
        }
    }

    // ======== Getters y Setters ======== //
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Venta getVenta() { return venta; }
    public void setVenta(Venta venta) { this.venta = venta; }

    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
}
