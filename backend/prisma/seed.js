/* prisma/seed.js */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const PERMISSIONS = [
  // ETAPA 1
  'PROVIDER_CREATE', 'PROVIDER_READ', 'PROVIDER_UPDATE',
  'PRODUCT_CREATE', 'PRODUCT_READ', 'PRODUCT_UPDATE',
  'MEASURE_READ', 'MEASURE_CREATE', 'MEASURE_UPDATE',
  'QUOTE_CREATE', 'QUOTE_READ', 'QUOTE_UPDATE', 'QUOTE_DELETE',

  // ETAPA 2
  'RECIPE_CREATE', 'RECIPE_READ', 'RECIPE_UPDATE', 'RECIPE_CALCULATE',
  'RECIPE_CATEGORY_CREATE', 'RECIPE_CATEGORY_READ', 'RECIPE_CATEGORY_UPDATE',

  // ETAPA 3
  'WAREHOUSE_CREATE', 'WAREHOUSE_READ', 'WAREHOUSE_UPDATE',
  'INVOICE_CREATE', 'INVOICE_READ', 'INVOICE_CONFIRM', 'INVOICE_CANCEL',
  'INVENTORY_READ', 'INVENTORY_ADJUST', 'INVENTORY_TRANSFER',

  // ETAPA 4
  'POT_CREATE', 'POT_READ', 'POT_UPDATE', 'POT_CLOSE',
  'OLLA_CREATE', 'OLLA_READ',

  // ETAPA 5 (Admin)
  'ADMIN_USERS_READ',
  'ADMIN_USERS_UPDATE',
  'ADMIN_ROLES_READ',
  'ADMIN_PERMS_READ',
  'ADMIN_DELEGATE_PERMS',

  // (Opcional) Auth
  'PASSWORD_RESET_REQUEST',
  'PASSWORD_RESET_CONFIRM',
];

const MEASURES = [
  { key: 'KG', nombre: 'Kilogramo' },
  { key: 'G', nombre: 'Gramo' },
  { key: 'L', nombre: 'Litro' },
  { key: 'ML', nombre: 'Mililitro' },
  { key: 'UND', nombre: 'Unidad' },
];

async function upsertRole(nombre, descripcion) {
  return prisma.rol.upsert({
    where: { nombre },
    update: { descripcion },
    create: { nombre, descripcion },
  });
}

async function main() {
  // 1) Roles base
  const adminRole = await upsertRole('ADMIN', 'Administrador del sistema');
  const monitorRole = await upsertRole('MONITOR', 'Puede confirmar facturas y cerrar olla');
  const operadorRole = await upsertRole('OPERADOR', 'Operador del sistema');

  // 2) Permisos base
  const uniquePerms = Array.from(new Set(PERMISSIONS));
  for (const key of uniquePerms) {
    await prisma.permiso.upsert({
      where: { key },
      update: { activo: true, descripcion: key },
      create: { key, activo: true, descripcion: key },
    });
  }

  // 3) Asignar TODOS los permisos al ADMIN
  const allPerms = await prisma.permiso.findMany({ where: { activo: true } });
  for (const p of allPerms) {
    await prisma.rolPermiso.upsert({
      where: { rolId_permisoId: { rolId: adminRole.idRol, permisoId: p.idPermiso } },
      update: {},
      create: { rolId: adminRole.idRol, permisoId: p.idPermiso },
    });
  }

  // 4) MONITOR: confirmar facturas + cerrar olla + inventory read
  const monitorPermKeys = ['INVOICE_CONFIRM', 'POT_CLOSE', 'INVENTORY_READ'];
  const monitorPerms = await prisma.permiso.findMany({
    where: { key: { in: monitorPermKeys }, activo: true },
  });
  for (const p of monitorPerms) {
    await prisma.rolPermiso.upsert({
      where: { rolId_permisoId: { rolId: monitorRole.idRol, permisoId: p.idPermiso } },
      update: {},
      create: { rolId: monitorRole.idRol, permisoId: p.idPermiso },
    });
  }

  // 5) (Opcional) OPERADOR set mínimo (si quieres dejarlo vacío, comenta esta sección)
  const operadorPermKeys = ['PROVIDER_READ', 'PRODUCT_READ', 'QUOTE_READ', 'RECIPE_READ', 'INVENTORY_READ', 'POT_READ'];
  const operadorPerms = await prisma.permiso.findMany({
    where: { key: { in: operadorPermKeys }, activo: true },
  });
  for (const p of operadorPerms) {
    await prisma.rolPermiso.upsert({
      where: { rolId_permisoId: { rolId: operadorRole.idRol, permisoId: p.idPermiso } },
      update: {},
      create: { rolId: operadorRole.idRol, permisoId: p.idPermiso },
    });
  }

  // 6) Unidades base
  for (const m of MEASURES) {
    await prisma.unidadMedida.upsert({
      where: { key: m.key },
      update: { nombre: m.nombre, activo: true },
      create: { key: m.key, nombre: m.nombre, activo: true },
    });
  }

  // 7) Admin default por .env
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const pass = process.env.ADMIN_PASSWORD || '';
  const nombres = process.env.ADMIN_NOMBRES || 'Admin';
  const apellidos = process.env.ADMIN_APELLIDOS || 'Root';
  const celular = process.env.ADMIN_CELULAR || '0000000000';

  if (email && pass) {
    const existingPersona = await prisma.persona.findUnique({ where: { correo: email } });

    let usuarioId;

    if (!existingPersona) {
      const persona = await prisma.persona.create({
        data: { nombres, apellidos, correo: email, celular, activo: true },
      });

      const passwordHash = await bcrypt.hash(pass, 10);

      const user = await prisma.usuario.create({
        data: { personaId: persona.idPersona, passwordHash, activo: true },
      });

      usuarioId = user.idUsuario;
    } else {
      const user = await prisma.usuario.findFirst({ where: { personaId: existingPersona.idPersona } });
      usuarioId = user?.idUsuario;

      // Si existe persona pero no usuario, lo creamos
      if (!usuarioId) {
        const passwordHash = await bcrypt.hash(pass, 10);
        const created = await prisma.usuario.create({
          data: { personaId: existingPersona.idPersona, passwordHash, activo: true },
        });
        usuarioId = created.idUsuario;
      }
    }

    // asignar rol ADMIN
    await prisma.usuarioRol.upsert({
      where: { usuarioId_rolId: { usuarioId, rolId: adminRole.idRol } },
      update: {},
      create: { usuarioId, rolId: adminRole.idRol },
    });

    console.log(`✅ Admin default OK: ${email}`);
  } else {
    console.log('ℹ️ ADMIN_EMAIL/ADMIN_PASSWORD no configurados; no se creó admin default.');
  }

  console.log('✅ Seed completado: roles + permisos + medidas + admin/monitor/operador');
}

main()
  .catch((e) => {
    console.error('❌ Seed falló:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
