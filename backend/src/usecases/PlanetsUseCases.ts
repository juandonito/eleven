import PlanetsRepository from '../repositories/PlanetsRepository';
import Planet from '../entities/Planet';
import { NotFoundError } from '../errorHandling/errors';

const PlanetsUseCases = {
  getPlanetById: async (planetId: number): Promise<Planet> => {
    const planet = await PlanetsRepository.getById(planetId);
    if (!planet) {
      throw new NotFoundError('Planet not found');
    }
    return planet;
  },
};

export default PlanetsUseCases;
