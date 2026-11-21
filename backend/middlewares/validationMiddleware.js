const { ZodError } = require('zod');

/**
 * Middleware générique de validation avec Zod
 * @param {import('zod').ZodSchema} schema Schéma Zod pour valider body, query ou params
 * @param {'body'|'query'|'params'} source Partie de la requête à valider
 */
const validate = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      const validated = await schema.parseAsync(req[source]);
      req[source] = validated;
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return res.status(400).json({
          success: false,
          message: 'Données de formulaire invalides.',
          errors,
        });
      }
      return next(error);
    }
  };
};

module.exports = validate;
