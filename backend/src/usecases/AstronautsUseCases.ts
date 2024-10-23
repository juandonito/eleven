import { NotFoundError } from '../errorHandling/errors';
import Astronaut from '../entities/Astronaut';
import AstronautsRepository from '../repositories/AstronautsRepository';
import PlanetsUseCases from './PlanetsUseCases';

const AstronautsUseCases = {
  getAstronautsList: async (args: {
    page: number;
    limit: number;
  }): Promise<{ astronauts: Astronaut[]; count: number }> => {
    return AstronautsRepository.getAll(args);
  },

  getAstronautById: async (
    astronautId: number,
  ): Promise<Astronaut | undefined> => {
    const astronaut = await AstronautsRepository.getById(astronautId);

    if (!astronaut) {
      throw new NotFoundError('Astronaut not found');
    }

    return astronaut;
  },

  createAstronaut: async (astronaut: {
    firstname: string;
    lastname: string;
    originPlanetId: number;
  }): Promise<Astronaut> => {
    await PlanetsUseCases.getPlanetById(astronaut.originPlanetId);

    return AstronautsRepository.create(astronaut);
  },

  updateAstronaut: async (astronaut: {
    id: number;
    firstname: string;
    lastname: string;
    originPlanetId: number;
  }): Promise<boolean> => {
    await PlanetsUseCases.getPlanetById(astronaut.originPlanetId);
    await AstronautsUseCases.getAstronautById(astronaut.id);

    return AstronautsRepository.update(astronaut);
  },

  deleteAstronaut: async (astronautId: number): Promise<boolean> => {
    await AstronautsUseCases.getAstronautById(astronautId);

    return AstronautsRepository.delete(astronautId);
  },
};

export default AstronautsUseCases;
