import dbConnect from '../../../lib/dbConnect';
import { validate } from '../../../middlewares/validate';
import { petSchema } from '../../../middlewares/validation-schemas/pets';
import Pet from '../../../models/Pet';

async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const pets = await Pet.find({}); /* find all the data in our database */
        res.status(200).json({ success: true, data: pets });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const pet = await Pet.create(
          req.body,
        ); /* create a new model in the database */

        res.status(201).json({ success: true, data: pet });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}

export default validate(petSchema, handler);
