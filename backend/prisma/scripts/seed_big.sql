BEGIN;

-- =========================================================
-- 0) Utilidad para hash bcrypt desde SQL (compatible con bcryptjs)
-- =========================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================================================
-- 1) Usuario default: johanstian20@hotmail.com / rmmr
--    - Crea/actualiza Persona y Usuario
--    - Asegura rol ADMIN asignado
-- =========================================================
WITH persona_upsert AS (
  INSERT INTO "Persona" ("nombres","apellidos","correo","celular","activo","createdAt","updatedAt")
  VALUES ('Johan','Patiño','johanstian20@hotmail.com','0000000000',TRUE, NOW(), NOW())
  ON CONFLICT ("correo") DO UPDATE SET
    "nombres"   = EXCLUDED."nombres",
    "apellidos" = EXCLUDED."apellidos",
    "celular"   = EXCLUDED."celular",
    "activo"    = TRUE,
    "updatedAt" = NOW()
  RETURNING "idPersona"
),
usuario_upsert AS (
  INSERT INTO "Usuario" ("personaId","passwordHash","activo","createdAt","updatedAt")
  SELECT
    p."idPersona",
    crypt('rmmr', gen_salt('bf', 10)),
    TRUE,
    NOW(),
    NOW()
  FROM persona_upsert p
  ON CONFLICT ("personaId") DO UPDATE SET
    "passwordHash" = EXCLUDED."passwordHash",
    "activo"       = TRUE,
    "updatedAt"    = NOW()
  RETURNING "idUsuario"
),
rol_admin AS (
  INSERT INTO "Rol" ("nombre","descripcion","createdAt","updatedAt")
  VALUES ('ADMIN','Administrador del sistema', NOW(), NOW())
  ON CONFLICT ("nombre") DO UPDATE SET
    "descripcion" = EXCLUDED."descripcion",
    "updatedAt"   = NOW()
  RETURNING "idRol"
),
asignar_admin AS (
  INSERT INTO "UsuarioRol" ("usuarioId","rolId")
  SELECT u."idUsuario", r."idRol"
  FROM usuario_upsert u, rol_admin r
  ON CONFLICT ("usuarioId","rolId") DO NOTHING
  RETURNING 1
),
admin AS (
  SELECT u."idUsuario" AS admin_id
  FROM "Usuario" u
  JOIN "Persona" p ON p."idPersona" = u."personaId"
  WHERE p."correo" = 'johanstian20@hotmail.com'
  LIMIT 1
),

-- =========================================================
-- 2) Proveedor: CORABASTOS (Upsert por NIT)
-- =========================================================
prov AS (
  INSERT INTO "Proveedor" (
    "nit","nombre","telefono","correo","direccion","activo",
    "createdById","createdAt","updatedAt"
  )
  SELECT
    '860028093-7',
    'CORABASTOS',
    '601 453 7188 | +57 323 991 7394',
    'atencioncliente@corabastos.com.co',
    'Av. Carrera 80 No. 2 - 51 Bogotá, Colombia',
    TRUE,
    (SELECT admin_id FROM admin),
    NOW(),
    NOW()
  ON CONFLICT ("nit") DO UPDATE SET
    "nombre"    = EXCLUDED."nombre",
    "telefono"  = EXCLUDED."telefono",
    "correo"    = EXCLUDED."correo",
    "direccion" = EXCLUDED."direccion",
    "activo"    = TRUE,
    "updatedAt" = NOW(),
    "updatedById" = (SELECT admin_id FROM admin)
  RETURNING "idProveedor"
),

-- =========================================================
-- 3) Categorías del boletín (Upsert)
-- =========================================================
cats_src AS (
  SELECT * FROM (VALUES
    ('Pollo'),
    ('Pescados y Mariscos'),
    ('Granos y Procesados'),
    ('Plátanos'),
    ('Tubérculos'),
    ('Frutas'),
    ('Hortalizas'),
    ('Cárnicos'),
    ('Huevos'),
    ('Lácteos')
  ) AS v(nombre)
),
cats AS (
  INSERT INTO "Categoria" ("nombre","activo","createdAt","updatedAt")
  SELECT nombre, TRUE, NOW(), NOW()
  FROM cats_src
  ON CONFLICT ("nombre") DO UPDATE SET
    "activo"    = TRUE,
    "updatedAt" = NOW()
  RETURNING "idCategoria","nombre"
),

-- =========================================================
-- 4) Unidades necesarias (además de las del seed)
-- =========================================================
units_src AS (
  SELECT * FROM (VALUES
    ('BULTO','Bulto'),
    ('CAJA','Caja'),
    ('CAJA_DE_MADERA','Caja de madera'),
    ('CANASTILLA','Canastilla'),
    ('BOLSA','Bolsa'),
    ('DOCENA','Docena'),
    ('ATADO','Atado'),
    ('ROLLO','Rollo'),
    ('PAQUETE','Paquete'),
    ('TONELADA','Tonelada'),
    ('LIBRAS_25','25 libras'),
    ('UNIDADES_30','30 unidades')
  ) AS v(key, nombre)
),
units AS (
  INSERT INTO "UnidadMedida" ("key","nombre","activo","createdAt","updatedAt")
  SELECT key, nombre, TRUE, NOW(), NOW()
  FROM units_src
  ON CONFLICT ("key") DO UPDATE SET
    "nombre"    = EXCLUDED."nombre",
    "activo"    = TRUE,
    "updatedAt" = NOW()
  RETURNING "idUnidadMedida","key"
),

-- =========================================================
-- 5) Productos del boletín (Upsert por nombre)
--    Nota: Producto.nombre es UNIQUE global en tu Prisma schema.
-- =========================================================
prod_src AS (
  SELECT * FROM (VALUES
    -- POLLO
    ('ALAS DE POLLO','Boletín Corabastos 2026-01-28. Presentación: KILO (1).','Pollo'),
    ('MENUDENCIAS','Boletín Corabastos 2026-01-28. Presentación: KILO (1).','Pollo'),
    ('PECHUGA DE POLLO','Boletín Corabastos 2026-01-28. Presentación: KILO (1).','Pollo'),
    ('PERNILES DE POLLO','Boletín Corabastos 2026-01-28. Presentación: KILO (1).','Pollo'),
    ('POLLO SIN VICERAS','Boletín Corabastos 2026-01-28. Presentación: KILO (1).','Pollo'),

    -- PESCADOS Y MARISCOS
    ('BAGRE DORADO','Presentación: KILO (1).','Pescados y Mariscos'),
    ('BAGRE PINTADO','Presentación: KILO (1).','Pescados y Mariscos'),
    ('BLANQUILLO GALLEGO','Presentación: KILO (1).','Pescados y Mariscos'),
    ('BOCA CHICO','Presentación: KILO (1).','Pescados y Mariscos'),
    ('CACHAMA','Presentación: KILO (1).','Pescados y Mariscos'),
    ('CAJARO','Presentación: KILO (1).','Pescados y Mariscos'),
    ('CAMARON TIGRE','Presentación: KILO (1).','Pescados y Mariscos'),
    ('CAMARON TITI','Presentación: KILO (1).','Pescados y Mariscos'),
    ('CAPACETA','Presentación: KILO (1).','Pescados y Mariscos'),
    ('CARACOL ALMEJA','Presentación: KILO (1).','Pescados y Mariscos'),
    ('CORVINA','Presentación: KILO (1).','Pescados y Mariscos'),
    ('CUCHA','Presentación: KILO (1).','Pescados y Mariscos'),
    ('DONCELLA','Presentación: KILO (1).','Pescados y Mariscos'),
    ('FILETE DE MERLUZA','Presentación: KILO (1).','Pescados y Mariscos'),
    ('FILETE DE ROBALO','Presentación: KILO (1).','Pescados y Mariscos'),
    ('GUALAJO','Presentación: KILO (1).','Pescados y Mariscos'),
    ('MOJARRA DE MAR','Presentación: KILO (1).','Pescados y Mariscos'),
    ('MOJARRA O TILAPIA ROJA','Presentación: KILO (1).','Pescados y Mariscos'),
    ('NICURO','Presentación: KILO (1).','Pescados y Mariscos'),
    ('PALETON','Presentación: KILO (1).','Pescados y Mariscos'),
    ('PELADA','Presentación: KILO (1).','Pescados y Mariscos'),
    ('PESCADO SECO','Presentación: KILO (1).','Pescados y Mariscos'),
    ('PEZ MERO O POLLITO DE MAR','Presentación: KILO (1).','Pescados y Mariscos'),
    ('PIRA BOTON','Presentación: KILO (1).','Pescados y Mariscos'),
    ('SIERRA','Presentación: KILO (1).','Pescados y Mariscos'),
    ('TOYO TIBURON PEQUE','Presentación: KILO (1).','Pescados y Mariscos'),
    ('TRUCHA ARCO IRIS','Presentación: KILO (1).','Pescados y Mariscos'),
    ('VALENTON','Presentación: KILO (1).','Pescados y Mariscos'),

    -- GRANOS Y PROCESADOS
    ('ACEITE (1000 c.c)','Presentación: CAJA (12).','Granos y Procesados'),
    ('ACEITE (500 c.c)','Presentación: CAJA (24).','Granos y Procesados'),
    ('ACEITE GALON (3000 c.c)','Presentación: CAJA (6).','Granos y Procesados'),
    ('ARROZ CORRIENTE','Presentación: BULTO (50).','Granos y Procesados'),
    ('ARROZ ORYZICA','Presentación: BULTO (50).','Granos y Procesados'),
    ('ARROZ SOPA CRISTAL','Presentación: BULTO (50).','Granos y Procesados'),
    ('ARVEJA VERDE SECA','Presentación: BULTO (50).','Granos y Procesados'),
    ('AZUCAR EMPACADA','Presentación: BULTO (25).','Granos y Procesados'),
    ('AZUCAR SULFITADA','Presentación: BULTO (50).','Granos y Procesados'),
    ('CAFE 500GR','Presentación: PAQUETE (5).','Granos y Procesados'),
    ('CEBADA','Presentación: 25 LIBRAS (1).','Granos y Procesados'),
    ('CHOCOLATE DULCE','Presentación: CAJA (24).','Granos y Procesados'),
    ('CUCHUCO DE CEBADA','Presentación: 25 LIBRAS (1).','Granos y Procesados'),
    ('CUCHUCO DE MAIZ','Presentación: BULTO (50).','Granos y Procesados'),
    ('CUCHUCO DE TRIGO','Presentación: 25 LIBRAS (1).','Granos y Procesados'),
    ('FRIJOL NIMA CALIMA','Presentación: BULTO (50).','Granos y Procesados'),
    ('FRIJOL RADICAL','Presentación: BULTO (50).','Granos y Procesados'),
    ('GARBANZO','Presentación: BULTO (50).','Granos y Procesados'),
    ('HARINA DE MAIZ','Presentación: 25 LIBRAS (1).','Granos y Procesados'),
    ('HARINA DE TRIGO','Presentación: BULTO (50).','Granos y Procesados'),
    ('LECHE POLVO 400 GR','Presentación: CAJA (30).','Granos y Procesados'),
    ('MAIZ AMARILLO DURO /ROCOL','Presentación: BULTO (60).','Granos y Procesados'),
    ('MAIZ BLANCO DURO','Presentación: BULTO (50).','Granos y Procesados'),
    ('MAIZ TRILLADO PETO','Presentación: BULTO (50).','Granos y Procesados'),
    ('MANTECA HIDROGENADA','Presentación: CAJA (10).','Granos y Procesados'),
    ('MARGARINA','Presentación: CAJA (10).','Granos y Procesados'),
    ('PANELA','Presentación: CAJA (20).','Granos y Procesados'),
    ('PASTAS ALIMENTICIAS','Presentación: 25 LIBRAS (1).','Granos y Procesados'),
    ('SAL','Presentación: BULTO (50).','Granos y Procesados'),

    -- PLÁTANOS
    ('PLATANO COLICERO','Presentación: KILO (1).','Plátanos'),
    ('PLATANO HARTON (BOLSA)','Presentación: BOLSA (20).','Plátanos'),
    ('PLATANO HARTON (CANASTILLA)','Presentación: CANASTILLA (22).','Plátanos'),

    -- TUBÉRCULOS
    ('ARRACACHA','Presentación: BULTO (50).','Tubérculos'),
    ('PAPA CRIOLLA LAVADA','Presentación: BULTO (50).','Tubérculos'),
    ('PAPA CRIOLLA SUCIA','Presentación: BULTO (50).','Tubérculos'),
    ('PAPA PASTUSA','Presentación: BULTO (50).','Tubérculos'),
    ('PAPA R12 INDUSTRIAL','Presentación: BULTO (50).','Tubérculos'),
    ('PAPA R12 NEGRA','Presentación: BULTO (50).','Tubérculos'),
    ('PAPA R12 ROJA','Presentación: BULTO (50).','Tubérculos'),
    ('PAPA SABANERA','Presentación: BULTO (50).','Tubérculos'),
    ('PAPA SUPREMA','Presentación: BULTO (50).','Tubérculos'),
    ('PAPA TOCARRE','Presentación: BULTO (50).','Tubérculos'),
    ('YUCA ARMENIA','Presentación: BOLSA (30).','Tubérculos'),
    ('YUCA LLANERA','Presentación: BOLSA (30).','Tubérculos'),

    -- FRUTAS
    ('AGUACATE HASS X TONELADA','Presentación: TONELADA (1000).','Frutas'),
    ('AGUACATE PIELES VERDES X TONELADA','Presentación: TONELADA (1000).','Frutas'),
    ('BANANO CRIOLLO','Presentación: CAJA DE MADERA (30).','Frutas'),
    ('BANANO URABA','Presentación: CAJA (20).','Frutas'),
    ('BREVA','Presentación: KILO (1).','Frutas'),
    ('COCO','Presentación: DOCENA (12).','Frutas'),
    ('CURUBA BOYACENCE','Presentación: CANASTILLA (22).','Frutas'),
    ('CURUBA SAN BERNARDO','Presentación: KILO (1).','Frutas'),
    ('DURAZNO IMPORTADO','Presentación: CAJA (10).','Frutas'),
    ('DURAZNO NACIONAL','Presentación: KILO (1).','Frutas'),
    ('FEIJOA','Presentación: KILO (1).','Frutas'),
    ('FRESA','Presentación: KILO (1).','Frutas'),
    ('GRANADILLA','Presentación: CAJA (14).','Frutas'),
    ('GUANABANA','Presentación: KILO (1).','Frutas'),
    ('GUAYABA','Presentación: KILO (1).','Frutas'),
    ('LIMON COMUN','Presentación: BULTO (70).','Frutas'),
    ('LIMON TAHITI','Presentación: BULTO (70).','Frutas'),
    ('LULO','Presentación: CANASTILLA (25).','Frutas'),
    ('MANDARINA ARRAYANA','Presentación: CANASTILLA (22).','Frutas'),
    ('MANDARINA ONECO','Presentación: KILO (1).','Frutas'),
    ('MANGO CHANCLETO','Presentación: CAJA (11).','Frutas'),
    ('MANGO DE AZUCAR','Presentación: KILO (1).','Frutas'),
    ('MANGO REINA','Presentación: CAJA (11).','Frutas'),
    ('MANGO TOMMY','Presentación: CAJA (11).','Frutas'),
    ('MANZANA NACIONAL','Presentación: KILO (1).','Frutas'),
    ('MANZANA ROJA IMPORTADA','Presentación: CAJA (18).','Frutas'),
    ('MANZANA VERDE IMPORTADA','Presentación: CAJA (18).','Frutas'),
    ('MARACUYA','Presentación: BOLSA (10).','Frutas'),
    ('MELON','Presentación: KILO (1).','Frutas'),
    ('MORA DE CASTILLA','Presentación: CAJA (7).','Frutas'),
    ('NARANJA ARMENIA','Presentación: BULTO (50).','Frutas'),
    ('NARANJA GREY','Presentación: BULTO (50).','Frutas'),
    ('NARANJA OMBLIGONA','Presentación: BULTO (50).','Frutas'),
    ('NARANJA VALENCIA','Presentación: BULTO (50).','Frutas'),
    ('PAPAYA HAWAIANA','Presentación: CANASTILLA (22).','Frutas'),
    ('PAPAYA MARADOL','Presentación: CAJA DE MADERA (18).','Frutas'),
    ('PAPAYA MELONA','Presentación: CAJA DE MADERA (18).','Frutas'),
    ('PAPAYA REDONDA','Presentación: CAJA DE MADERA (18).','Frutas'),
    ('PAPAYA TAINUNG','Presentación: CAJA DE MADERA (10).','Frutas'),
    ('PATILLA','Presentación: KILO (1).','Frutas'),
    ('PINA GOLD','Presentación: CAJA (11).','Frutas'),
    ('PINA PEROLERA','Presentación: CAJA DE MADERA (32).','Frutas'),
    ('PITAHAYA','Presentación: KILO (1).','Frutas'),
    ('TOMATE DE ARBOL','Presentación: CANASTILLA (25).','Frutas'),
    ('UVA CHAMPA','Presentación: CAJA (10).','Frutas'),
    ('UVA NEGRA','Presentación: CAJA (10).','Frutas'),
    ('UVA ROJA','Presentación: CAJA (10).','Frutas'),

    -- HORTALIZAS
    ('ACELGA','Presentación: ATADO (10).','Hortalizas'),
    ('AHUYAMA','Presentación: KILO (1).','Hortalizas'),
    ('AJO ROSADO','Presentación: ATADO (10).','Hortalizas'),
    ('ALCACHOFA','Presentación: DOCENA (10).','Hortalizas'),
    ('APIO','Presentación: ATADO (10).','Hortalizas'),
    ('ARVEJA VERDE SABANERA','Presentación: BULTO (50).','Hortalizas'),
    ('BERENJENA','Presentación: KILO y/o referencia del boletín.','Hortalizas'),
    ('BROCOLI','Presentación: DOCENA (10).','Hortalizas'),
    ('CALABACIN','Presentación: KILO (1).','Hortalizas'),
    ('CALABAZA','Presentación: KILO (1).','Hortalizas'),
    ('CEBOLLA CABEZONA BLANCA','Presentación: BULTO (50).','Hortalizas'),
    ('CEBOLLA CABEZONA ROJA','Presentación: BULTO (50).','Hortalizas'),
    ('CEBOLLA LARGA','Presentación: ROLLO (25).','Hortalizas'),
    ('CILANTRO','Presentación: ATADO (10).','Hortalizas'),
    ('COLIFLOR','Presentación: DOCENA (10).','Hortalizas'),
    ('ESPINACA','Presentación: ATADO (10).','Hortalizas'),
    ('FRIJOL VERDE','Presentación: BULTO (50).','Hortalizas'),
    ('HABA VERDE SABANERA','Presentación: BULTO (50).','Hortalizas'),
    ('HABICHUELA','Presentación: BULTO (50).','Hortalizas'),
    ('LECHUGA','Presentación: DOCENA (10).','Hortalizas'),
    ('MAZORCA','Presentación: BULTO (50).','Hortalizas'),
    ('PEPINO COHOMBRO','Presentación: KILO (1).','Hortalizas'),
    ('PEPINO COMUN','Presentación: KILO (1).','Hortalizas'),
    ('PIMENTON','Presentación: KILO (1).','Hortalizas'),
    ('RABANO ROJO','Presentación: ATADO (3).','Hortalizas'),
    ('REMOLACHA','Presentación: BULTO (50).','Hortalizas'),
    ('REPOLLO','Presentación: BULTO (50).','Hortalizas'),
    ('TOMATE CHONTO','Presentación: KILO (1).','Hortalizas'),
    ('TOMATE LARGA VIDA','Presentación: KILO (1).','Hortalizas'),
    ('TOMATE MILANO','Presentación: KILO (1).','Hortalizas'),
    ('ZANAHORIA','Presentación: BULTO (50).','Hortalizas'),

    -- CÁRNICOS
    ('CADERA','Presentación: KILO (1).','Cárnicos'),
    ('CHATAS','Presentación: KILO (1).','Cárnicos'),
    ('COSTILLA','Presentación: KILO (1).','Cárnicos'),
    ('LOMO','Presentación: KILO (1).','Cárnicos'),
    ('PIERNA','Presentación: KILO (1).','Cárnicos'),
    ('SOBREBARRIGA','Presentación: KILO (1).','Cárnicos'),

    -- HUEVOS
    ('HUEVO BLANCO A','Presentación: 30 UNIDADES (1).','Huevos'),
    ('HUEVO BLANCO AA','Presentación: 30 UNIDADES (1).','Huevos'),
    ('HUEVO BLANCO B','Presentación: 30 UNIDADES (1).','Huevos'),
    ('HUEVO BLANCO EXTRA','Presentación: 30 UNIDADES (1).','Huevos'),
    ('HUEVO ROJO A','Presentación: 30 UNIDADES (1).','Huevos'),
    ('HUEVO ROJO AA','Presentación: 30 UNIDADES (1).','Huevos'),
    ('HUEVO ROJO B','Presentación: 30 UNIDADES (1).','Huevos'),
    ('HUEVO ROJO EXTRA','Presentación: 30 UNIDADES (1).','Huevos'),

    -- LÁCTEOS
    ('CUAJADA','Presentación: KILO (1).','Lácteos'),
    ('QUESO CAMPESINO','Presentación: KILO (1).','Lácteos'),
    ('QUESO COSTE','Presentación: KILO (1).','Lácteos'),
    ('QUESO DOBLE CREMA','Presentación: KILO (1).','Lácteos'),
    ('QUESO PAIPA','Presentación: KILO (1).','Lácteos'),
    ('QUESO PERA','Presentación: KILO (1).','Lácteos')
  ) AS v(nombre, descripcion, categoria_nombre)
),
prod_upsert AS (
  INSERT INTO "Producto" ("nombre","descripcion","activo","categoriaId","createdById","createdAt","updatedAt")
  SELECT
    p.nombre,
    p.descripcion,
    TRUE,
    (SELECT c."idCategoria" FROM cats c WHERE c."nombre" = p.categoria_nombre LIMIT 1),
    (SELECT admin_id FROM admin),
    NOW(),
    NOW()
  FROM prod_src p
  ON CONFLICT ("nombre") DO UPDATE SET
    "descripcion" = EXCLUDED."descripcion",
    "activo"      = TRUE,
    "categoriaId" = EXCLUDED."categoriaId",
    "updatedById" = (SELECT admin_id FROM admin),
    "updatedAt"   = NOW()
  RETURNING "idProducto","nombre"
),

-- =========================================================
-- 6) Cotizaciones (Precio calidad PRIMERA) del 2026-01-28
--    - Se guarda precioUnitario (precio primera)
--    - Se guarda cantidad y unidad según presentación
-- =========================================================
cot_src AS (
  SELECT * FROM (VALUES
    -- POLLO
    ('ALAS DE POLLO','KG', 1::numeric, 16000::numeric),
    ('MENUDENCIAS','KG', 1::numeric, 12000::numeric),
    ('PECHUGA DE POLLO','KG', 1::numeric, 20000::numeric),
    ('PERNILES DE POLLO','KG', 1::numeric, 15000::numeric),
    ('POLLO SIN VICERAS','KG', 1::numeric, 21000::numeric),

    -- PESCADOS Y MARISCOS (todos KILO 1)
    ('BAGRE DORADO','KG', 1::numeric, 30000::numeric),
    ('BAGRE PINTADO','KG', 1::numeric, 30000::numeric),
    ('BLANQUILLO GALLEGO','KG', 1::numeric, 16000::numeric),
    ('BOCA CHICO','KG', 1::numeric, 19000::numeric),
    ('CACHAMA','KG', 1::numeric, 12000::numeric),
    ('CAJARO','KG', 1::numeric, 20000::numeric),
    ('CAMARON TIGRE','KG', 1::numeric, 38000::numeric),
    ('CAMARON TITI','KG', 1::numeric, 28000::numeric),
    ('CAPACETA','KG', 1::numeric, 20000::numeric),
    ('CARACOL ALMEJA','KG', 1::numeric, 34000::numeric),
    ('CORVINA','KG', 1::numeric, 54000::numeric),
    ('CUCHA','KG', 1::numeric, 16000::numeric),
    ('DONCELLA','KG', 1::numeric, 14000::numeric),
    ('FILETE DE MERLUZA','KG', 1::numeric, 62000::numeric),
    ('FILETE DE ROBALO','KG', 1::numeric, 62000::numeric),
    ('GUALAJO','KG', 1::numeric, 33000::numeric),
    ('MOJARRA DE MAR','KG', 1::numeric, 17000::numeric),
    ('MOJARRA O TILAPIA ROJA','KG', 1::numeric, 14500::numeric),
    ('NICURO','KG', 1::numeric, 15000::numeric),
    ('PALETON','KG', 1::numeric, 10000::numeric),
    ('PELADA','KG', 1::numeric, 30000::numeric),
    ('PESCADO SECO','KG', 1::numeric, 36000::numeric),
    ('PEZ MERO O POLLITO DE MAR','KG', 1::numeric, 25000::numeric),
    ('PIRA BOTON','KG', 1::numeric, 20000::numeric),
    ('SIERRA','KG', 1::numeric, 24000::numeric),
    ('TOYO TIBURON PEQUE','KG', 1::numeric, 28000::numeric),
    ('TRUCHA ARCO IRIS','KG', 1::numeric, 24000::numeric),
    ('VALENTON','KG', 1::numeric, 35000::numeric),

    -- GRANOS/PROCESADOS (según presentación del boletín)
    ('ACEITE (1000 c.c)','CAJA', 12::numeric, 88900::numeric),
    ('ACEITE (500 c.c)','CAJA', 24::numeric, 92000::numeric),
    ('ACEITE GALON (3000 c.c)','CAJA', 6::numeric, 122000::numeric),
    ('ARROZ CORRIENTE','BULTO', 50::numeric, 150000::numeric),
    ('ARROZ ORYZICA','BULTO', 50::numeric, 160000::numeric),
    ('ARROZ SOPA CRISTAL','BULTO', 50::numeric, 120000::numeric),
    ('ARVEJA VERDE SECA','BULTO', 50::numeric, 169000::numeric),
    ('AZUCAR EMPACADA','BULTO', 25::numeric, 150000::numeric),
    ('AZUCAR SULFITADA','BULTO', 50::numeric, 160000::numeric),
    ('CAFE 500GR','PAQUETE', 5::numeric, 550000::numeric),
    ('CEBADA','LIBRAS_25', 1::numeric, 58000::numeric),
    ('CHOCOLATE DULCE','CAJA', 24::numeric, 610000::numeric),
    ('CUCHUCO DE CEBADA','LIBRAS_25', 1::numeric, 68000::numeric),
    ('CUCHUCO DE MAIZ','BULTO', 50::numeric, 160000::numeric),
    ('CUCHUCO DE TRIGO','LIBRAS_25', 1::numeric, 45000::numeric),
    ('FRIJOL NIMA CALIMA','BULTO', 50::numeric, 380000::numeric),
    ('FRIJOL RADICAL','BULTO', 50::numeric, 420000::numeric),
    ('GARBANZO','BULTO', 50::numeric, 439000::numeric),
    ('HARINA DE MAIZ','LIBRAS_25', 1::numeric, 35000::numeric),
    ('HARINA DE TRIGO','BULTO', 50::numeric, 120000::numeric),
    ('LECHE POLVO 400 GR','CAJA', 30::numeric, 220000::numeric),
    ('MAIZ AMARILLO DURO /ROCOL','BULTO', 60::numeric, 90000::numeric),
    ('MAIZ BLANCO DURO','BULTO', 50::numeric, 105000::numeric),
    ('MAIZ TRILLADO PETO','BULTO', 50::numeric, 112000::numeric),
    ('MANTECA HIDROGENADA','CAJA', 10::numeric, 120000::numeric),
    ('MARGARINA','CAJA', 10::numeric, 149000::numeric),
    ('PANELA','CAJA', 20::numeric, 110000::numeric),
    ('PASTAS ALIMENTICIAS','LIBRAS_25', 1::numeric, 48000::numeric),
    ('SAL','BULTO', 50::numeric, 60000::numeric),

    -- PLÁTANOS
    ('PLATANO COLICERO','KG', 1::numeric, 1400::numeric),
    ('PLATANO HARTON (BOLSA)','BOLSA', 20::numeric, 80000::numeric),
    ('PLATANO HARTON (CANASTILLA)','CANASTILLA', 22::numeric, 105000::numeric),

    -- TUBÉRCULOS
    ('ARRACACHA','BULTO', 50::numeric, 175000::numeric),
    ('PAPA CRIOLLA LAVADA','BULTO', 50::numeric, 145000::numeric),
    ('PAPA CRIOLLA SUCIA','BULTO', 50::numeric, 115000::numeric),
    ('PAPA PASTUSA','BULTO', 50::numeric, 75000::numeric),
    ('PAPA R12 INDUSTRIAL','BULTO', 50::numeric, 95000::numeric),
    ('PAPA R12 NEGRA','BULTO', 50::numeric, 75000::numeric),
    ('PAPA R12 ROJA','BULTO', 50::numeric, 65000::numeric),
    ('PAPA SABANERA','BULTO', 50::numeric, 125000::numeric),
    ('PAPA SUPREMA','BULTO', 50::numeric, 70000::numeric),
    ('PAPA TOCARRE','BULTO', 50::numeric, 115000::numeric),
    ('YUCA ARMENIA','BOLSA', 30::numeric, 105000::numeric),
    ('YUCA LLANERA','BOLSA', 30::numeric, 105000::numeric),

    -- FRUTAS
    ('AGUACATE HASS X TONELADA','TONELADA', 1000::numeric, 5500000::numeric),
    ('AGUACATE PIELES VERDES X TONELADA','TONELADA', 1000::numeric, 4500000::numeric),
    ('BANANO CRIOLLO','CAJA_DE_MADERA', 30::numeric, 70000::numeric),
    ('BANANO URABA','CAJA', 20::numeric, 44000::numeric),
    ('BREVA','KG', 1::numeric, 8000::numeric),
    ('COCO','DOCENA', 12::numeric, 75000::numeric),
    ('CURUBA BOYACENCE','CANASTILLA', 22::numeric, 48000::numeric),
    ('CURUBA SAN BERNARDO','KG', 1::numeric, 2500::numeric),
    ('DURAZNO IMPORTADO','CAJA', 10::numeric, 155000::numeric),
    ('DURAZNO NACIONAL','KG', 1::numeric, 6000::numeric),
    ('FEIJOA','KG', 1::numeric, 8000::numeric),
    ('FRESA','KG', 1::numeric, 7000::numeric),
    ('GRANADILLA','CAJA', 14::numeric, 105000::numeric),
    ('GUANABANA','KG', 1::numeric, 4500::numeric),
    ('GUAYABA','KG', 1::numeric, 3500::numeric),
    ('LIMON COMUN','BULTO', 70::numeric, 65000::numeric),
    ('LIMON TAHITI','BULTO', 70::numeric, 65000::numeric),
    ('LULO','CANASTILLA', 25::numeric, 125000::numeric),
    ('MANDARINA ARRAYANA','CANASTILLA', 22::numeric, 65000::numeric),
    ('MANDARINA ONECO','KG', 1::numeric, 3500::numeric),
    ('MANGO CHANCLETO','CAJA', 11::numeric, 18000::numeric),
    ('MANGO DE AZUCAR','KG', 1::numeric, 2500::numeric),
    ('MANGO REINA','CAJA', 11::numeric, 18000::numeric),
    ('MANGO TOMMY','CAJA', 11::numeric, 28000::numeric),
    ('MANZANA NACIONAL','KG', 1::numeric, 3500::numeric),
    ('MANZANA ROJA IMPORTADA','CAJA', 18::numeric, 169000::numeric),
    ('MANZANA VERDE IMPORTADA','CAJA', 18::numeric, 179000::numeric),
    ('MARACUYA','BOLSA', 10::numeric, 40000::numeric),
    ('MELON','KG', 1::numeric, 3500::numeric),
    ('MORA DE CASTILLA','CAJA', 7::numeric, 30000::numeric),
    ('NARANJA ARMENIA','BULTO', 50::numeric, 135000::numeric),
    ('NARANJA GREY','BULTO', 50::numeric, 95000::numeric),
    ('NARANJA OMBLIGONA','BULTO', 50::numeric, 145000::numeric),
    ('NARANJA VALENCIA','BULTO', 50::numeric, 145000::numeric),
    ('PAPAYA HAWAIANA','CANASTILLA', 22::numeric, 35000::numeric),
    ('PAPAYA MARADOL','CAJA_DE_MADERA', 18::numeric, 33000::numeric),
    ('PAPAYA MELONA','CAJA_DE_MADERA', 18::numeric, 33000::numeric),
    ('PAPAYA REDONDA','CAJA_DE_MADERA', 18::numeric, 30000::numeric),
    ('PAPAYA TAINUNG','CAJA_DE_MADERA', 10::numeric, 28000::numeric),
    ('PATILLA','KG', 1::numeric, 1800::numeric),
    ('PINA GOLD','CAJA', 11::numeric, 26000::numeric),
    ('PINA PEROLERA','CAJA_DE_MADERA', 32::numeric, 58000::numeric),
    ('PITAHAYA','KG', 1::numeric, 6000::numeric),
    ('TOMATE DE ARBOL','CANASTILLA', 25::numeric, 58000::numeric),
    ('UVA CHAMPA','CAJA', 10::numeric, 119000::numeric),
    ('UVA NEGRA','CAJA', 10::numeric, 110000::numeric),
    ('UVA ROJA','CAJA', 10::numeric, 110000::numeric),

    -- HORTALIZAS
    ('ACELGA','ATADO', 10::numeric, 16000::numeric),
    ('AHUYAMA','KG', 1::numeric, 1200::numeric),
    ('AJO ROSADO','ATADO', 10::numeric, 55000::numeric),
    ('ALCACHOFA','DOCENA', 10::numeric, 58000::numeric),
    ('APIO','ATADO', 10::numeric, 16000::numeric),
    ('ARVEJA VERDE SABANERA','BULTO', 50::numeric, 235000::numeric),
    ('BERENJENA','KG', 1::numeric, 4000::numeric),
    ('BROCOLI','DOCENA', 10::numeric, 38000::numeric),
    ('CALABACIN','KG', 1::numeric, 900::numeric),
    ('CALABAZA','KG', 1::numeric, 900::numeric),
    ('CEBOLLA CABEZONA BLANCA','BULTO', 50::numeric, 45000::numeric),
    ('CEBOLLA CABEZONA ROJA','BULTO', 50::numeric, 195000::numeric),
    ('CEBOLLA LARGA','ROLLO', 25::numeric, 85000::numeric),
    ('CILANTRO','ATADO', 10::numeric, 28000::numeric),
    ('COLIFLOR','DOCENA', 10::numeric, 38000::numeric),
    ('ESPINACA','ATADO', 10::numeric, 18000::numeric),
    ('FRIJOL VERDE','BULTO', 50::numeric, 215000::numeric),
    ('HABA VERDE SABANERA','BULTO', 50::numeric, 115000::numeric),
    ('HABICHUELA','BULTO', 50::numeric, 235000::numeric),
    ('LECHUGA','DOCENA', 10::numeric, 22000::numeric),
    ('MAZORCA','BULTO', 50::numeric, 65000::numeric),
    ('PEPINO COHOMBRO','KG', 1::numeric, 5000::numeric),
    ('PEPINO COMUN','KG', 1::numeric, 3500::numeric),
    ('PIMENTON','KG', 1::numeric, 3500::numeric),
    ('RABANO ROJO','ATADO', 3::numeric, 13000::numeric),
    ('REMOLACHA','BULTO', 50::numeric, 155000::numeric),
    ('REPOLLO','BULTO', 50::numeric, 38000::numeric),
    ('TOMATE CHONTO','KG', 1::numeric, 3000::numeric),
    ('TOMATE LARGA VIDA','KG', 1::numeric, 3500::numeric),
    ('TOMATE MILANO','KG', 1::numeric, 3500::numeric),
    ('ZANAHORIA','BULTO', 50::numeric, 85000::numeric),

    -- CÁRNICOS
    ('CADERA','KG', 1::numeric, 40000::numeric),
    ('CHATAS','KG', 1::numeric, 59000::numeric),
    ('COSTILLA','KG', 1::numeric, 40000::numeric),
    ('LOMO','KG', 1::numeric, 73000::numeric),
    ('PIERNA','KG', 1::numeric, 38000::numeric),
    ('SOBREBARRIGA','KG', 1::numeric, 32000::numeric),

    -- HUEVOS
    ('HUEVO BLANCO A','UNIDADES_30', 1::numeric, 10500::numeric),
    ('HUEVO BLANCO AA','UNIDADES_30', 1::numeric, 11500::numeric),
    ('HUEVO BLANCO B','UNIDADES_30', 1::numeric, 10000::numeric),
    ('HUEVO BLANCO EXTRA','UNIDADES_30', 1::numeric, 14500::numeric),
    ('HUEVO ROJO A','UNIDADES_30', 1::numeric, 10500::numeric),
    ('HUEVO ROJO AA','UNIDADES_30', 1::numeric, 11500::numeric),
    ('HUEVO ROJO B','UNIDADES_30', 1::numeric, 10000::numeric),
    ('HUEVO ROJO EXTRA','UNIDADES_30', 1::numeric, 14500::numeric),

    -- LÁCTEOS
    ('CUAJADA','KG', 1::numeric, 18000::numeric),
    ('QUESO CAMPESINO','KG', 1::numeric, 21000::numeric),
    ('QUESO COSTE','KG', 1::numeric, 24000::numeric),
    ('QUESO DOBLE CREMA','KG', 1::numeric, 22000::numeric),
    ('QUESO PAIPA','KG', 1::numeric, 35000::numeric),
    ('QUESO PERA','KG', 1::numeric, 35000::numeric)
  ) AS v(producto_nombre, unidad_key, cantidad, precio_primera)
),
cot_insert AS (
  INSERT INTO "Cotizacion" (
    "proveedorId","productoId","unidadId",
    "precioUnitario","cantidad","fecha","activo",
    "createdById","createdAt","updatedAt"
  )
  SELECT
    (SELECT "idProveedor" FROM prov),
    p."idProducto",
    COALESCE(u0."idUnidadMedida", u1."idUnidadMedida"),
    s.precio_primera,
    s.cantidad,
    TIMESTAMP '2026-01-28 00:00:00',
    TRUE,
    (SELECT admin_id FROM admin),
    NOW(),
    NOW()
  FROM cot_src s
  JOIN prod_upsert p ON p."nombre" = s.producto_nombre
  LEFT JOIN "UnidadMedida" u0 ON u0."key" = s.unidad_key
  LEFT JOIN units u1 ON u1."key" = s.unidad_key
  WHERE NOT EXISTS (
    SELECT 1
    FROM "Cotizacion" c
    WHERE c."proveedorId" = (SELECT "idProveedor" FROM prov)
      AND c."productoId"  = p."idProducto"
      AND c."unidadId"    = COALESCE(u0."idUnidadMedida", u1."idUnidadMedida")
      AND (c."fecha"::date) = DATE '2026-01-28'
      AND c."cantidad" = s.cantidad
      AND c."precioUnitario" = s.precio_primera
  )
  RETURNING 1
)

SELECT
  (SELECT admin_id FROM admin) AS admin_id,
  (SELECT "idProveedor" FROM prov) AS proveedor_id,
  (SELECT COUNT(*) FROM cats) AS categorias_upserted,
  (SELECT COUNT(*) FROM prod_upsert) AS productos_upserted,
  (SELECT COUNT(*) FROM cot_insert) AS cotizaciones_insertadas;

COMMIT;