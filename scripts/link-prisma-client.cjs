const fs = require("node:fs");
const path = require("node:path");

function existsDefaultClient(rootPrismaDir) {
  return fs.existsSync(path.join(rootPrismaDir, "client", "default.js"));
}

function ensurePrismaBridge() {
  const clientPackageJson = fs.realpathSync(require.resolve("@prisma/client/package.json"));
  const clientDir = path.dirname(clientPackageJson);
  const packageNodeModules = path.resolve(clientDir, "..", "..");
  const sourcePrismaDir = path.join(packageNodeModules, ".prisma");
  const targetPrismaDir = path.join(process.cwd(), "node_modules", ".prisma");

  if (!existsDefaultClient(sourcePrismaDir)) {
    throw new Error(`Source Prisma client/default.js not found: ${sourcePrismaDir}`);
  }

  if (path.resolve(sourcePrismaDir) === path.resolve(targetPrismaDir)) {
    console.log(`[prisma-link] Using in-place .prisma at ${targetPrismaDir}`);
    return;
  }

  try {
    fs.rmSync(targetPrismaDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
  } catch {
    // ignore and re-check
  }

  if (existsDefaultClient(targetPrismaDir)) {
    console.log(`[prisma-link] Existing .prisma already valid at ${targetPrismaDir}`);
    return;
  }

  try {
    fs.symlinkSync(sourcePrismaDir, targetPrismaDir, "junction");
  } catch (error) {
    if (error && error.code === "EEXIST" && existsDefaultClient(targetPrismaDir)) {
      console.log(`[prisma-link] Existing .prisma already valid at ${targetPrismaDir}`);
      return;
    }
    throw error;
  }

  if (!existsDefaultClient(targetPrismaDir)) {
    throw new Error(`Linked .prisma exists but client/default.js is missing at ${targetPrismaDir}`);
  }

  console.log(`[prisma-link] Linked ${targetPrismaDir} -> ${sourcePrismaDir}`);
}

ensurePrismaBridge();