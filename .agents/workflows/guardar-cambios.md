---
description: Guardar todos los cambios en la rama developer
---

# Guardar cambios en la rama `developer`

Ejecuta estos 4 comandos en orden cada vez que quieras guardar tu trabajo:

## 1. Asegúrate de estar en la rama correcta
```bash
git checkout developer
```

## 2. Agregar TODOS los archivos modificados
```bash
git add -A
```

## 3. Crear el commit con un mensaje descriptivo
```bash
git commit -m "descripción de lo que cambiaste"
```
> Ejemplo: `git commit -m "feat: agregar soft delete en ollas"`

## 4. Subir a GitHub
```bash
git push origin developer
```

---

## 🚨 Si te dice que hay conflictos:
```bash
git stash
git pull origin developer
git stash pop
```
Luego repite desde el paso 2.

## 📋 Resumen rápido (copia y pega):
```bash
git checkout developer
git add -A
git commit -m "tu mensaje aquí"
git push origin developer
```
