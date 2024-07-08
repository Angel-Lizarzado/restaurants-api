
# Case to solved Backend

### Se dejara archivo .sql para cargar a la db datos prestablecidos

### Archivo Restaurants.rest con test de consultas de restaurant
### Archivo Users.rest con test de consultas de usuario

# Testeado totalmente con Postman
## En la carpeta logs se encuentra un requests.log, que registra cada peticion

# Ejecutar seed.js con ```node seed.js ``` luego de configurar db.js
## En caso de no tener las tablas creadas en  la db restaurant se crearan automaticamente

## API Restaurant

#### Obtener todos los restaurants

```http
  GET /restaurantes (Pública)
```

#### Obtener restaurant por id

```http
  GET /restaurantes/<id> (Pública)
```
| Requiere | Tipo     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `Id`      | `Number` | **Requiere**. id del restaurant |

#### Insertar restaurant (privada)

```http
  POST /restaurantes/ (Privada)
```

| Requiere | Tipo     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `Token`      | `string` | **Requiere**. estar logueado |

#### Modificar restaurant

```http
  PUT /restaurantes/<id> (Privada)
```


| Parametro | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `ID` | `Number` | **Requiere**. ser quien registró el restaurant |

#### Eliminar restaurant

```http
  DELETE /restaurantes/<id> (Protegida)
```


| Parametro | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `ID` | `Number` | **Requiere**. Ser usuario de rol ADMIN |

#### Registrar usuario

```http
  POST /usuarios (Pública)
```


| Requiere | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Username` | `String` | **Requiere**. Ser unico |
| `Email` | `String` | **Requiere**. Ser unico |
| `Password` | `String` | **Crypt** Sera encriptada automaticamente |
| `Role` | `String` | **Requiere**. USER O ADMIN |

#### Consultar todos los restaurant del usuario logueado

```http
  GET /usuarios/restaurantes/
```


| Requiere | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Token` | `String` | **Requiere**. Estar logueado |

## Authors

- [@Angel Lizarzado](https://github.com/Angel-Lizarzado)

