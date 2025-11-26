import prisma from "./prisma.js";


export async function getCurrentPathCTE(folderId, ownerId) {
  if (!folderId) return [];
  const rows = await prisma.$queryRaw`
    WITH RECURSIVE path(id, name, parent_directory_id, owner_id, depth) AS (
      SELECT id, name, parent_directory_id, owner_id, 1 FROM folders WHERE id = ${Number(folderId)} AND owner_id = ${ownerId}
      UNION ALL
      SELECT f.id, f.name, f.parent_directory_id, f.owner_id, path.depth + 1
      FROM folders f
      JOIN path ON f.id = path.parent_directory_id
      WHERE f.owner_id = ${ownerId}
    )
    SELECT id, name, depth FROM path ORDER BY depth DESC;`;
  return rows.map(r => ({ id: r.id, name: r.name }));
}