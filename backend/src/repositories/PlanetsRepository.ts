import { InternalServerError } from '../errorHandling/errors';
import knex from '../db';
import Planet from '../entities/Planet';

const PlanetsRepository = {
  getById: async (id: number): Promise<Planet | undefined> => {
    try {
      const planet = await knex('planets')
        .where('planets.id', id)
        .leftJoin('images', 'planets.imageId', 'images.id')
        .select('planets.*', 'images.path', 'images.name as imageName')
        .first();
      return planet;
    } catch (error) {
      throw new InternalServerError();
    }
  },
};
export default PlanetsRepository;
