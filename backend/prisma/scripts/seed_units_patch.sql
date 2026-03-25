BEGIN;

-- Unidades comunes (keys alternativas) para que NO vuelva a quedar null
INSERT INTO "UnidadMedida" ("key","nombre","activo","createdAt","updatedAt") VALUES
('KG','Kilogramo',TRUE,NOW(),NOW()),
('KILO','Kilogramo',TRUE,NOW(),NOW()),

('BULTO','Bulto',TRUE,NOW(),NOW()),
('CAJA','Caja',TRUE,NOW(),NOW()),
('CAJA_DE_MADERA','Caja de madera',TRUE,NOW(),NOW()),
('CANASTILLA','Canastilla',TRUE,NOW(),NOW()),
('BOLSA','Bolsa',TRUE,NOW(),NOW()),
('DOCENA','Docena',TRUE,NOW(),NOW()),
('ATADO','Atado',TRUE,NOW(),NOW()),
('ROLLO','Rollo',TRUE,NOW(),NOW()),
('PAQUETE','Paquete',TRUE,NOW(),NOW()),
('TONELADA','Tonelada',TRUE,NOW(),NOW()),
('LIBRAS_25','25 libras',TRUE,NOW(),NOW()),
('UNIDADES_30','30 unidades',TRUE,NOW(),NOW()),

('UND','Unidad',TRUE,NOW(),NOW()),
('UNIDAD','Unidad',TRUE,NOW(),NOW())
ON CONFLICT ("key") DO UPDATE SET
  "nombre"=EXCLUDED."nombre",
  "activo"=TRUE,
  "updatedAt"=NOW();

COMMIT;