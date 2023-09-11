module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // comprobemos que el encabezado existe y comienza con 'Bearer '
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Se requiere autorización' });
  }

  // obtener el token
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // tratando de verificar el token
    payload = jwt.verify(token, process.env.SECRET_KEY);
  } catch (err) {
    // devolvemos un error si algo va mal
    return res
      .status(401)
      .send({ message: 'Se requiere autorización' });
  }

  req.user = payload; // asigna el payload al objeto de solicitud

  next(); // envía la solicitud al siguiente middleware
};