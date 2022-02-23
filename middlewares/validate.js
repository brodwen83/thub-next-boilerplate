export function validate(schema, handler) {
  return async (req, res) => {
    if (['POST', 'PUT'].includes(req.method)) {
      try {
        await schema.validate(req.body, {
          abortEarly: false,
          stripUnknown: true,
        });
      } catch (error) {
        return res.status(400).json(error);
      }
    }

    await handler(req, res);
  };
}
