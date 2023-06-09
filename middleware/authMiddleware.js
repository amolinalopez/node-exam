const jwt = require("jsonwebtoken");
const secretToken = jwt.sign({ userID: "testUser" }, process.env.JWT_SECRET);
console.log("JWT token:", secretToken);

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || authHeader !== `Bearer ${secretToken}`) {
    res.status(401).json({ error: "No ! You shall not pass" });
  } else {
    next();
  }
};

// EXPLICATIONS
// Alors je ne ferais pas ça en situation réelle mais pour les besoins de l'exercice,
// je vais créer un token JWT dans le middleware et le comparer à celui envoyé par le client.
// Dans une vraie application, le token serait généré par le serveur lors de la connexion de l'utilisateur
// la je prends le JWT donné en console.log lorsque je "node app.js" et je le mets dans Headers pour avoir l'authorization sur Postman

// module.exports = (req, res, next) => {
//   if (req.user) {
//     next();
//   } else {
//     res.status(401).json({ error: "You shall not pass" });
//   }
// };
