import { asc, ilike, or, sql } from "drizzle-orm";
import db from "../../../db";
import { advocates } from "../../../db/schema";

const DEFAULT_PAGE_SIZE = 100;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const offset = url.searchParams.get('offset');
  const limit = parseInt(url.searchParams.get('limit') || DEFAULT_PAGE_SIZE.toString());
  const search = url.searchParams.get('search');
  const baseQuery = db.select().from(advocates);
  let whereConditions = null;

  if (search?.trim()) {
    const searchTerm = `%${search.trim()}%`;
    whereConditions = or(
      ilike(advocates.firstName, searchTerm),
      ilike(advocates.lastName, searchTerm),
      ilike(advocates.city, searchTerm),
      ilike(advocates.degree, searchTerm),
      sql`${advocates.specialties}::text ILIKE ${searchTerm}`,
      sql`${advocates.yearsOfExperience}::text ILIKE ${searchTerm}`
    );
  }

  const query = whereConditions
    ? baseQuery.where(whereConditions)
    : baseQuery

  const data = await query
    .orderBy(
      asc(advocates.lastName),
      asc(advocates.firstName))
    .offset(offset ? Number(offset) : 0)
    .limit(limit + 1); // Fetch one extra to check for next page

  const hasNextPage = data.length > limit;
  const results = hasNextPage ? data.slice(0, -1) : data;
  const nextOffset = hasNextPage ? (Number(offset) ?? 0) + results.length + 1 : null;

  return Response.json({
    data: results,
    pagination: {
      nextOffset,
      hasNextPage,
      limit
    }
  });
}
