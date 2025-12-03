const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();

// --- CONFIGURACIÓN ---
app.use(cors());

// AUMENTAMOS EL LÍMITE DE DATOS A 50MB (Vital para subir imágenes grandes)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Servir archivos estáticos (HTML, CSS, JS, Imágenes) desde la carpeta 'public'
app.use(express.static('public'));

// --- CONEXIÓN A MONGODB ---
// Usa la variable de entorno en la nube, o la local si estás en tu PC
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/refaccionaria_gallegos';

mongoose.connect(mongoUri)
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch(err => console.error('❌ Error de conexión:', err));

// --- MODELOS (Esquemas) ---

const ProductoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    marca: { type: String, default: 'Genérica' },
    sku: String,
    precio_venta: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    categoria: { type: String, default: 'General' }, 
    imagen: String 
});

const UsuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { type: String, default: 'cliente' }, 
    fecha_registro: { type: Date, default: Date.now }
});

const PedidoSchema = new mongoose.Schema({
    fecha: { type: Date, default: Date.now },
    cliente_email: String,
    cliente_nombre: String,
    total: Number,
    items: Array,
    estado: { type: String, default: 'registrado' }, 
    metodo_pago: String
});

const Producto = mongoose.model('Producto', ProductoSchema);
const Usuario = mongoose.model('Usuario', UsuarioSchema);
const Pedido = mongoose.model('Pedido', PedidoSchema);

// --- RUTAS DE API ---

// 1. LOGIN
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`🔍 Intento de login: ${email}`);

    // Admin Maestro (Hardcoded para emergencia/seguridad básica)
    if (email === 'cesafrapu@gmail.com' && password === '12345') {
        console.log("✅ Acceso Admin concedido");
        return res.json({ mensaje: 'Bienvenido Admin', rol: 'admin', nombre: 'Administrador', email: email });
    }

    try {
        const usuario = await Usuario.findOne({ email, password });
        if (usuario) {
            console.log("✅ Acceso Cliente concedido:", usuario.nombre);
            res.json({ mensaje: 'Bienvenido', rol: 'cliente', nombre: usuario.nombre, email: usuario.email });
        } else {
            console.warn("⚠️ Credenciales incorrectas para:", email);
            res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }
    } catch (error) {
        console.error("❌ Error en login:", error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

// 2. REGISTRO
app.post('/api/registro', async (req, res) => {
    const { nombre, email, password } = req.body;
    
    try {
        const existente = await Usuario.findOne({ email });
        if(existente) {
            return res.status(400).json({ mensaje: "El correo ya está registrado" });
        }

        const nuevoUsuario = new Usuario({ nombre, email, password, rol: 'cliente' });
        await nuevoUsuario.save();
        res.json({ mensaje: "Cuenta creada exitosamente", usuario: nuevoUsuario });
    } catch (error) {
        console.error("❌ Error en registro:", error);
        res.status(500).json({ mensaje: "Error en el registro" });
    }
});

// 3. PRODUCTOS (CRUD)
app.get('/api/productos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener productos" });
    }
});

app.post('/api/productos', async (req, res) => {
    try {
        const nuevo = new Producto(req.body);
        await nuevo.save();
        res.json({ mensaje: "Producto agregado", id: nuevo._id });
    } catch (error) {
        console.error("❌ Error guardando producto:", error);
        res.status(500).json({ mensaje: "Error al guardar producto" });
    }
});

app.put('/api/productos/:id', async (req, res) => {
    try {
        await Producto.findByIdAndUpdate(req.params.id, req.body);
        res.json({ mensaje: "Producto actualizado" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar" });
    }
});

app.delete('/api/productos/:id', async (req, res) => {
    try {
        await Producto.findByIdAndDelete(req.params.id);
        res.json({ mensaje: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar" });
    }
});

// 4. PEDIDOS
app.post('/api/pedidos', async (req, res) => {
    try {
        const nuevoPedido = new Pedido(req.body);
        
        // Descontar stock
        if (req.body.items && req.body.items.length > 0) {
            for (const item of req.body.items) {
                await Producto.updateOne({ nombre: item.nombre }, { $inc: { stock: -1 } });
            }
        }

        await nuevoPedido.save();
        res.json({ mensaje: "Pedido registrado", id: nuevoPedido._id });
    } catch (error) {
        console.error("❌ Error en pedido:", error);
        res.status(500).json({ mensaje: "Error al registrar el pedido" });
    }
});

app.get('/api/mis-pedidos', async (req, res) => {
    try {
        const pedidos = await Pedido.find({ cliente_email: req.query.email }).sort({ fecha: -1 });
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error historial" });
    }
});

// 5. ADMIN DASHBOARD
app.get('/api/admin/pedidos', async (req, res) => {
    try {
        const pedidos = await Pedido.find().sort({ fecha: -1 });
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error admin pedidos" });
    }
});

app.put('/api/admin/pedidos/:id', async (req, res) => {
    try {
        await Pedido.findByIdAndUpdate(req.params.id, { estado: req.body.estado });
        res.json({ mensaje: "Estado actualizado" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error actualizando estado" });
    }
});

app.get('/api/admin/analisis', async (req, res) => {
    try {
        const pedidos = await Pedido.find();
        let totalVentas = 0;
        let ventasHoy = 0;
        const hoy = new Date().toDateString();

        pedidos.forEach(p => {
            totalVentas += (p.total || 0);
            if(p.fecha && new Date(p.fecha).toDateString() === hoy) ventasHoy += (p.total || 0);
        });

        res.json({ totalVentas, ventasHoy, cantidadPedidos: pedidos.length });
    } catch (error) {
        console.error("Error analisis:", error);
        res.status(500).json({ mensaje: "Error analisis" });
    }
});

// --- RUTA PRINCIPAL (FRONTEND) ---
// Esto entrega tu index.html cuando entras a la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- INICIAR SERVIDOR ---
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
