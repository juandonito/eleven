import knex from 'knex';
import dbKnex from '../db';

export const CommonDB = {
  createQueryBuilderWithPagination: async <T>(
    target: string,
    callback: (queryBuilder: knex.Knex.QueryBuilder) => knex.Knex.QueryBuilder,
    page?: number,
    limit?: number,
  ): Promise<{
    results: T[];
    count: number;
  }> => {
    const baseQuery = dbKnex(target);

    if (page && limit) {
      baseQuery.offset((page - 1) * limit).limit(limit);
    }

    const query = callback(baseQuery);

    const count = (await query.clone().clearSelect().count().first())[
      'count(*)'
    ];
    const results = await query;

    return {
      results,
      count,
    };
  },
};
