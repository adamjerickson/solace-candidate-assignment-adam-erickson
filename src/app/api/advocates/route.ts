import { and, asc, gt, ilike, or, sql } from "drizzle-orm";
import db from "../../../db";
import { advocates } from "../../../db/schema";

const DEFAULT_PAGE_SIZE = 10;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const cursor = url.searchParams.get('cursor');
  const limit = parseInt(url.searchParams.get('limit') || DEFAULT_PAGE_SIZE.toString());
  const search = url.searchParams.get('search');
  const baseQuery = db.select().from(advocates);
  let whereConditions = null;

  if (search?.trim()) {
    const searchTerm = `%${search.trim()}%`;
    const searchConditions = or(
      ilike(advocates.firstName, searchTerm),
      ilike(advocates.lastName, searchTerm),
      ilike(advocates.city, searchTerm),
      ilike(advocates.degree, searchTerm),
      sql`${advocates.specialties}::text ILIKE ${searchTerm}`,
      sql`${advocates.yearsOfExperience}::text ILIKE ${searchTerm}`
    );
    whereConditions = cursor
      ? and(searchConditions, gt(advocates.id, Number(cursor)))
      : searchConditions;
  } else if (cursor) {
    whereConditions = gt(advocates.id, Number(cursor));
  }

  const query = whereConditions
    ? baseQuery.where(whereConditions)
    : baseQuery;

  const data = await query.orderBy(asc(advocates.id)).limit(limit + 1);
  const hasNextPage = data.length > limit;
  const results = hasNextPage ? data.slice(0, -1) : data;
  const nextCursor = hasNextPage ? results[results.length - 1].id : null;

  return Response.json({
    data: results,
    pagination: {
      nextCursor,
      hasNextPage,
      limit
    }
  });
}
