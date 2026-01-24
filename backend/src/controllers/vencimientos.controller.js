import prisma from '../prisma.js';

export const getVencimientos = async (req, res) => {
    try {
        const userId = req.user.id;
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        // 1. Buscar vencimientos del usuario
        let vencimientos = await prisma.vencimiento.findMany({
            where: { usuario_id: userId },
            orderBy: { fecha_vencimiento: 'asc' }
        });

        // 2. "Auto-rollover": Si es mensual/anual y ya pasó, actualizarlo
        let updatedCount = 0;
        for (const v of vencimientos) {
            const dateOnly = v.fecha_vencimiento.toISOString().split('T')[0];
            const [year, month, day] = dateOnly.split('-').map(Number);
            let dueDate = new Date(year, month - 1, day);
            dueDate.setHours(0, 0, 0, 0);

            // Si la fecha ya pasó y no es 'UNICO'
            while (dueDate < now && v.frecuencia !== 'UNICO') {
                if (v.frecuencia === 'MENSUAL') {
                    dueDate.setMonth(dueDate.getMonth() + 1);
                } else if (v.frecuencia === 'ANUAL') {
                    dueDate.setFullYear(dueDate.getFullYear() + 1);
                }

                // Actualizar en base de datos
                await prisma.vencimiento.update({
                    where: { id: v.id },
                    data: { fecha_vencimiento: dueDate }
                });
                v.fecha_vencimiento = new Date(dueDate); // Actualizar en el array para la respuesta
                updatedCount++;
            }
        }

        // Si hubo cambios, volvemos a ordenar la lista
        if (updatedCount > 0) {
            vencimientos.sort((a, b) => new Date(a.fecha_vencimiento).getTime() - new Date(b.fecha_vencimiento).getTime());
        }

        res.json(vencimientos);
    } catch (error) {
        console.error('Error en getVencimientos:', error);
        res.status(500).json({ error: 'Error al obtener vencimientos' });
    }
};

export const createVencimiento = async (req, res) => {
    try {
        const { titulo, fecha_vencimiento, frecuencia } = req.body;

        if (!titulo || !fecha_vencimiento) {
            return res.status(400).json({ error: 'Título y fecha son requeridos' });
        }

        const vencimiento = await prisma.vencimiento.create({
            data: {
                usuario_id: req.user.id,
                titulo,
                fecha_vencimiento: new Date(fecha_vencimiento),
                frecuencia: frecuencia || 'UNICO'
            }
        });

        res.status(201).json(vencimiento);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear vencimiento' });
    }
};

export const updateVencimiento = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, fecha_vencimiento, frecuencia, activo } = req.body;

        // Verificar propiedad
        const existing = await prisma.vencimiento.findFirst({
            where: { id: parseInt(id), usuario_id: req.user.id }
        });
        if (!existing) return res.status(404).json({ error: 'Vencimiento no encontrado' });

        const updated = await prisma.vencimiento.update({
            where: { id: parseInt(id) },
            data: {
                titulo,
                fecha_vencimiento: fecha_vencimiento ? new Date(fecha_vencimiento) : undefined,
                frecuencia,
                activo
            }
        });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar vencimiento' });
    }
};

export const deleteVencimiento = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar propiedad
        const existing = await prisma.vencimiento.findFirst({
            where: { id: parseInt(id), usuario_id: req.user.id }
        });
        if (!existing) return res.status(404).json({ error: 'Vencimiento no encontrado' });

        await prisma.vencimiento.delete({ where: { id: parseInt(id) } });

        res.json({ message: 'Vencimiento eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar vencimiento' });
    }
};
