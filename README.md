USERS:

[POST] /user/register -> recibe los datos de un user lo crea en la BD y devuelve el user recién creado. STATUS: 201

[POST] /user/login -> recibe los datos de un user ya registrado y devuelve el status. STATUS: 201

COMPLAINTS:

[GET] /complaints -> devuelve un array con todas las quejas de la BD. STATUS: 200

[GET] /complaint/:idComplaint -> devuelve una queja de la BD por id. STATUS: 200

[POST] /complaint/register -> recibe los datos de una queja y la crea en la BD y devuelve la queja recién creada. STATUS: 201

[PUT] /complaint/update/:idComplaint -> recibe una queja, la modifica en la BD y devuelve la queja modificada. STATUS: 200

[DELETE] /complaint/delete/:idRobot -> elimina de la BD una queja por id y devuelve el status. STATUS: 200

Bad request - STATUS: 400
Unauthorized - STATUS: 401
Not Found - STATUS: 404
Conflict - STATUS: 409
