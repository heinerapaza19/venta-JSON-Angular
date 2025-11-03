package edu.pe.upeu.ventas.controller;


import edu.pe.upeu.ventas.model.Venta;
import edu.pe.upeu.ventas.service.VentaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("ventas")
@CrossOrigin(origins = "http://localhost:4200")
public class VentaController {

    private final VentaService service;

    public VentaController(VentaService service) {
        this.service = service;
    }

    // 🔹 Listar todas las ventas
    @GetMapping
    public List<Venta> listar() {
        return service.listar();
    }

    // 🔹 Listar ventas de un cliente específico
    @GetMapping("/cliente/{clienteId}")
    public List<Venta> listarPorCliente(@PathVariable Long clienteId) {
        return service.listarPorCliente(clienteId);
    }

    // 🔹 Registrar una nueva venta (con sus detalles)
    @PostMapping
    public ResponseEntity<Venta> registrar(@RequestBody Venta venta) {
        try {
            Venta guardada = service.registrarVenta(venta);
            return ResponseEntity.ok(guardada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
