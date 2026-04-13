import { and, eq, gte, lte, ilike } from "drizzle-orm";

function dateFilterBuilder(date, dateType) {
  const dateQueryList = [];
  switch (dateType) {
    case "between":
      // "2026-04-01_2026-04-13" kabi formatni ajratib olamiz
      const [from, to] = date.split("_");
      if (from && to) {
        dateQueryList.push(
          gte(users.createdAt, new Date(`${from} 00:00:00`)),
          lte(users.createdAt, new Date(`${to} 23:59:59`)),
        );
      }
      break;

    case "gte":
      dateQueryList.push(gte(users.createdAt, new Date(`${date} 00:00:00`)));
      break;

    case "lte":
      dateQueryList.push(lte(users.createdAt, new Date(`${date} 23:59:59`)));
      break;

    default:
      break;
  }
}

const usersWhereBuilder = (params, users) => {
  if (!params) return undefined;
  const conditions = [];

  if (params.name) conditions.push(ilike(users.name, `%${params.name}%`));
  if (params.role) conditions.push(eq(users.role, params.role));
  if (params.login) conditions.push(ilike(users.login, `%${params.login}%`));

  if (params?.date && params?.dateType) {
    const dateConditions = dateFilterBuilder(params.date, params.dateType);
    conditions.push(...dateConditions);
  }

  return and(...conditions);
};

export default {
  usersWhereBuilder,
};
