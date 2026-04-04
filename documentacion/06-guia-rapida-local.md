# Guia rapida local (1 pagina)


pgAdmin (http://127.0.0.1:5050/login)
  usuario/email: admin@sancocholab.com
  contraseña: admin123
Frontend (app) (http://127.0.0.1:4200)
  usuario/correo: johanstian20@hotmail.com
  contraseña: rmmr




Si no eres tecnico, usa solo esta guia.

## 1) Preparar proyecto (solo primera vez)

```powershell
# Parate en la raiz del repo
Copy-Item .env.example .env
```

## 2) Levantar backend + base de datos + pgAdmin

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-backend.ps1 -WithPgAdmin
```

## 3) Levantar frontend

```powershell
Set-Location .\frontend
npm install
npm run start
```

## 4) URLs que debes abrir

- Frontend: `http://127.0.0.1:4200`
- API docs: `http://127.0.0.1:3000/docs`
- pgAdmin: `http://127.0.0.1:5050/login`

## 5) Credenciales importantes

- App (frontend):
  - correo: `johanstian20@hotmail.com`
  - password: `rmmr`
- pgAdmin:
  - email: `admin@sancocholab.com`
  - password: `admin123`

## 6) Si algo falla (comandos de rescate)

```powershell
# Desde la raiz del repo
powershell -ExecutionPolicy Bypass -File .\scripts\fix-docker.ps1 -RestartStack -WithPgAdmin
```

Si pgAdmin no deja entrar:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\reset-pgadmin.ps1
```

## 7) Apagar todo al terminar

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\stop-all.ps1
```
