module.exports = (req, res, next) => {
  console.log(
    `Methode ${req.method} sur l'url ${req.url} depuis ${req.hostname}`
  );
  next();
};

//middleware qui pour chaque requête entrante, affiche la méthode, l'URL et le nom d'hôte.