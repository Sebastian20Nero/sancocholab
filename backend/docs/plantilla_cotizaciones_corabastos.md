# Plantilla Excel para Cotizaciones - Formato Completo

## Estructura de Columnas (Formato Recomendado)

| Columna | Nombre | Tipo | Requerido | Descripción | Ejemplo |
|---------|--------|------|-----------|-------------|---------|
| A | **Ingrediente** | Texto | ✅ Sí | Nombre del producto | "Tomate Chonto" |
| B | **Presentación** | Texto | ✅ Sí | Unidad de compra | "1 Arroba" |
| C | **Precio Presentación** | Número | ✅ Sí | Precio de la presentación | 25000 |
| D | **Unidad** | Lista | ✅ Sí | Unidad base (KG/L/UND/GR) | "LB" |
| E | **Cantidad** | Número | ✅ Sí | Cantidad en la presentación | 25 |
| F | **Proveedor** | Texto | ✅ Sí | Nombre del proveedor | "Corabastos" |
| G | **Fecha** | Fecha | ✅ Sí | Fecha del boletín (DD/MM/YYYY) | "12/02/2026" |
| H | **NIT Proveedor** | Texto | ✅ Sí | NIT del proveedor | "800123456" |
| I | **Categoría** | Texto | ⚪ No | Categoría del producto | "Verduras" |
| J | **Observación** | Texto | ⚪ No | Notas adicionales | "Calidad extra" |

---

## Explicación de Campos

### **A - Ingrediente** (Requerido)
- Nombre del producto tal como aparece en el boletín
- **Ejemplos**: 
  - "Tomate Chonto"
  - "Cebolla Cabezona Blanca"
  - "Papa Criolla"

### **B - Presentación** (Requerido)
- Unidad de compra o presentación comercial
- **Ejemplos**:
  - "1 Arroba"
  - "Bulto x 50"
  - "Caja x 20"
  - "Canastilla"
  - "Unidad"

### **C - Precio Presentación** (Requerido)
- Precio TOTAL de la presentación
- **Ejemplos**:
  - Si "1 Arroba = $25,000" → Ingresar: `25000`
  - Si "Bulto x 50 Kg = $125,000" → Ingresar: `125000`
  - Si "Caja x 20 Kg = $60,000" → Ingresar: `60000`

### **D - Unidad** (Requerido)
- Unidad base para las recetas
- **Valores permitidos**: KG, L, UND, GR, LB
- **Validación**: Lista desplegable
- **Ejemplos**:
  - Productos sólidos: KG, LB, GR
  - Líquidos: L
  - Unidades: UND (huevos, limones, etc.)

### **E - Cantidad** (Requerido)
- Cantidad de unidades base en la presentación
- **Ejemplos**:
  - "1 Arroba" de 25 libras → Ingresar: `25`
  - "Bulto x 50 Kg" → Ingresar: `50`
  - "Caja x 20 Kg" → Ingresar: `20`
  - "Unidad" (1 tomate) → Ingresar: `1`

### **F - Proveedor** (Requerido)
- Nombre del proveedor
- **Por defecto**: "Corabastos"

### **G - Fecha** (Requerido)
- Fecha del boletín de precios
- **Formato**: DD/MM/YYYY
- **Ejemplo**: 12/02/2026

### **H - NIT Proveedor** (Requerido)
- NIT del proveedor
- **Por defecto para Corabastos**: "800123456"

### **I - Categoría** (Opcional)
- Categoría del producto
- Se creará automáticamente si no existe
- **Ejemplos**: "Verduras", "Frutas", "Tubérculos", "Proteínas"

### **J - Observación** (Opcional)
- Notas adicionales
- **Ejemplos**: "Precio promedio", "Calidad extra", "Temporada alta"

---

## Ejemplos Completos

### Ejemplo 1: Tomate Chonto (por Arroba)
**Del boletín**: "Tomate Chonto - 1 Arroba (25 lb) - $25,000"

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| Tomate Chonto | 1 Arroba | 25000 | LB | 25 | Corabastos | 12/02/2026 | 800123456 | Verduras | |

**Cálculo automático**: 25,000 ÷ 25 = **$1,000 por libra**

---

### Ejemplo 2: Cebolla Cabezona (por Bulto)
**Del boletín**: "Cebolla Cabezona - Bulto x 50 Kg - $125,000"

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| Cebolla Cabezona | Bulto x 50 | 125000 | KG | 50 | Corabastos | 12/02/2026 | 800123456 | Verduras | |

**Cálculo automático**: 125,000 ÷ 50 = **$2,500 por Kg**

---

### Ejemplo 3: Cilantro (por Atado)
**Del boletín**: "Cilantro - Atado x 500 g - $2,000"

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| Cilantro | Atado x 500 g | 2000 | GR | 500 | Corabastos | 12/02/2026 | 800123456 | Hierbas | |

**Cálculo automático**: 2,000 ÷ 500 = **$4 por gramo**

---

### Ejemplo 4: Huevos (por Cubeta)
**Del boletín**: "Huevos AA - Cubeta x 30 und - $15,000"

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| Huevos AA | Cubeta x 30 | 15000 | UND | 30 | Corabastos | 12/02/2026 | 800123456 | Proteínas | |

**Cálculo automático**: 15,000 ÷ 30 = **$500 por unidad**

---

### Ejemplo 5: Limón (por Unidad)
**Del boletín**: "Limón Tahití - Unidad - $500"

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| Limón Tahití | Unidad | 500 | UND | 1 | Corabastos | 12/02/2026 | 800123456 | Frutas | |

**Cálculo automático**: 500 ÷ 1 = **$500 por unidad**

---

## Cálculo Automático

El sistema calculará automáticamente:

```
Precio Unitario = Precio Presentación ÷ Cantidad
```

**Ejemplo**:
- Presentación: "1 Arroba"
- Precio Presentación: $25,000
- Unidad: LB
- Cantidad: 25
- **Precio Unitario**: $25,000 ÷ 25 = **$1,000 por libra**

---

## Validaciones del Sistema

✅ **Campos requeridos**: Ingrediente, Presentación, Precio Presentación, Unidad, Cantidad, Proveedor, Fecha, NIT  
✅ **Formato de unidades**: Solo acepta KG, L, UND, GR, LB  
✅ **Precio positivo**: Debe ser mayor a 0  
✅ **Cantidad positiva**: Debe ser mayor a 0  
✅ **Formato de fecha**: DD/MM/YYYY  
✅ **Creación automática**: Proveedores, productos y categorías se crean si no existen  

---

## Errores Comunes

### ❌ Error: "Debe proporcionar precioPresentacion + cantidad"
- **Causa**: Falta el precio de la presentación o la cantidad
- **Solución**: Completar ambos campos (columnas C y E)

### ❌ Error: "Cantidad debe ser un número mayor a 0"
- **Causa**: La cantidad está vacía o es cero
- **Solución**: Ingresar la cantidad correcta (ej: 25 para 1 Arroba de 25 lb)

### ❌ Error: "La unidad 'kg' no es válida"
- **Causa**: Unidad en minúsculas o con espacios
- **Solución**: Usar MAYÚSCULAS sin espacios: KG, L, UND, GR, LB

### ❌ Error: "Fecha inválida"
- **Causa**: Formato de fecha incorrecto
- **Solución**: Usar formato DD/MM/YYYY (ej: 12/02/2026)

---

## Formato CSV

Si prefieres usar CSV en lugar de Excel:

```csv
Ingrediente,Presentación,Precio Presentación,Unidad,Cantidad,Proveedor,Fecha,NIT Proveedor,Categoría,Observación
Tomate Chonto,1 Arroba,25000,LB,25,Corabastos,12/02/2026,800123456,Verduras,
Cebolla Cabezona,Bulto x 50,125000,KG,50,Corabastos,12/02/2026,800123456,Verduras,
Cilantro,Atado x 500 g,2000,GR,500,Corabastos,12/02/2026,800123456,Hierbas,
Huevos AA,Cubeta x 30,15000,UND,30,Corabastos,12/02/2026,800123456,Proteínas,
```

**Notas para CSV**:
- Usar coma (`,`) como separador
- Codificación UTF-8
- NO usar separadores de miles en números
- Decimales con punto: `2500.50`

---

## Datos Almacenados en la Base de Datos

Para cada cotización, el sistema guarda:

1. **presentacionCompra**: "1 Arroba" (columna B)
2. **precioPresentacion**: 25000 (columna C)
3. **cantidad**: 25 (columna E)
4. **precioUnitario**: 25000 (mismo que precioPresentacion)
5. **precioUnidad**: 1000 (calculado: 25000 ÷ 25)
6. **unidadId**: ID de la unidad (LB)

---

## Soporte

Para dudas o problemas con la plantilla, contactar al administrador del sistema.
