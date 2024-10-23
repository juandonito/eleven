import { CommonDB } from '../common/common.db';
import Astronaut from '../entities/Astronaut';
import knex from '../db';
import { InternalServerError } from '../errorHandling/errors';
import Knex from 'knex';

const AstronautsRepository = {
  getAll: async (args: {
    page: number;
    limit: number;
  }): Promise<{ astronauts: Astronaut[]; count: number }> => {
    try {
      const { results, count } =
        await CommonDB.createQueryBuilderWithPagination<{
          id: number;
          firstname: string;
          lastname: string;
          name: string;
          isHabitable: boolean;
          description: string;
          path: string;
          imageName: string;
        }>(
          'astronauts',
          (queryBuilder) => {
            return AstronautsRepository.fullJoinPlanetsAndImages(queryBuilder);
          },
          args.page,
          args.limit,
        );

      const astronauts = results.map((astronautResult) =>
        AstronautsRepository.formatAstronaut(astronautResult),
      );

      return { astronauts, count };
    } catch (error) {
      throw new InternalServerError();
    }
  },

  getById: async (astronautId: number): Promise<Astronaut | undefined> => {
    try {
      const result = await AstronautsRepository.fullJoinPlanetsAndImages(
        knex('astronauts').where('astronauts.id', astronautId),
      ).first();

      return AstronautsRepository.formatAstronaut(result);
    } catch (error) {
      throw new InternalServerError();
    }
  },

  create: async ({
    firstname,
    lastname,
    originPlanetId,
  }: {
    firstname: string;
    lastname: string;
    originPlanetId: number;
  }): Promise<Astronaut> => {
    try {
      const [id] = await knex
        .insert({ firstname, lastname, originPlanetId })
        .into('astronauts');

      const astronaut = await AstronautsRepository.getById(id);

      if (!astronaut) {
        throw new InternalServerError();
      }

      return astronaut;
    } catch (error) {
      throw new InternalServerError();
    }
  },

  update: async ({
    id,
    firstname,
    lastname,
    originPlanetId,
  }: {
    id: number;
    firstname: string;
    lastname: string;
    originPlanetId: number;
  }): Promise<boolean> => {
    try {
      const updatedRows = await knex('astronauts')
        .where('id', id)
        .update({ firstname, lastname, originPlanetId });

      return updatedRows > 0;
    } catch (error) {
      throw new InternalServerError();
    }
  },

  delete: async (astronautId: number): Promise<boolean> => {
    try {
      const deletedRows = await knex('astronauts')
        .where('id', astronautId)
        .del();

      return deletedRows > 0;
    } catch (error) {
      throw new InternalServerError();
    }
  },

  fullJoinPlanetsAndImages: (
    query: Knex.Knex.QueryBuilder,
  ): Knex.Knex.QueryBuilder => {
    return query
      .leftJoin('planets', 'astronauts.originPlanetId', 'planets.id')
      .leftJoin('images', 'planets.imageId', 'images.id')
      .select(
        'astronauts.*',
        'planets.name',
        'planets.description',
        'planets.isHabitable',
        'images.path',
        'images.name as imageName',
      );
  },

  formatAstronaut: ({
    id,
    firstname,
    lastname,
    name,
    isHabitable,
    description,
    path,
    imageName,
  }: {
    id: number;
    firstname: string;
    lastname: string;
    name: string;
    isHabitable: boolean;
    description: string;
    path: string;
    imageName: string;
  }): Astronaut => ({
    id,
    firstname,
    lastname,
    originPlanet: {
      name,
      isHabitable,
      description,
      image: {
        path,
        name: imageName,
      },
    },
  }),
};

export default AstronautsRepository;
