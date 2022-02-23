import dbConnect from '../../../lib/dbConnect';
import { validate } from '../../../middlewares/validate';
import { petSchema } from '../../../middlewares/validation-schemas/pets';
import Pet from '../../../models/Pet';

async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET' /* Get a model by its ID */:
      try {
        const pet = await Pet.findById(id);
        if (!pet) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: pet });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;

    case 'PUT' /* Edit a model by its ID */:
      try {
        const pet = await Pet.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });

        if (!pet) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: pet });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error });
      }
      break;

    case 'DELETE' /* Delete a model by its ID */:
      try {
        const deletedPet = await Pet.deleteOne({ _id: id });

        if (!deletedPet) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}

export default validate(petSchema, handler);
