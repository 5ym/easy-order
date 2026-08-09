import { Database } from 'bun:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export const DATABASE_PATH = process.env.DATABASE_PATH ?? './data/easy-order.sqlite';

/**
 * Ordered, append-only list of schema migrations.
 *
 * The applied count is tracked in SQLite's `user_version` pragma, so adding a
 * new entry is all it takes to ship a schema change. Never edit or reorder an
 * existing entry — append a new one.
 */
const MIGRATIONS: readonly string[] = [
	`CREATE TABLE orders (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		-- Unguessable public identifier used in the /pay/<token> URL.
		token TEXT NOT NULL UNIQUE,
		-- 4-digit code the customer shows to staff when paying.
		confirm TEXT NOT NULL UNIQUE,
		-- The validated order payload, as JSON.
		data TEXT NOT NULL,
		paid INTEGER NOT NULL DEFAULT 0,
		created_at INTEGER NOT NULL DEFAULT (unixepoch()),
		updated_at INTEGER NOT NULL DEFAULT (unixepoch())
	) STRICT;`
];

/** Apply every pending migration. Safe to call repeatedly. */
export function runMigrations(sqlite: Database = db): void {
	const row = sqlite.query<{ user_version: number }, []>('PRAGMA user_version').get();
	const applied = row?.user_version ?? 0;

	for (let version = applied; version < MIGRATIONS.length; version++) {
		sqlite.transaction(() => {
			sqlite.exec(MIGRATIONS[version]);
			// PRAGMA cannot be parameterised; `version` is a loop index we control.
			sqlite.exec(`PRAGMA user_version = ${version + 1}`);
		})();
	}
}

function connect(): Database {
	mkdirSync(dirname(DATABASE_PATH), { recursive: true });

	const sqlite = new Database(DATABASE_PATH, { create: true, strict: true });
	// WAL keeps readers from blocking the writer; busy_timeout absorbs the rest.
	sqlite.exec('PRAGMA journal_mode = WAL;');
	sqlite.exec('PRAGMA synchronous = NORMAL;');
	sqlite.exec('PRAGMA foreign_keys = ON;');
	sqlite.exec('PRAGMA busy_timeout = 5000;');

	return sqlite;
}

// Vite re-executes modules on HMR; caching on globalThis avoids leaking handles.
const globalForDb = globalThis as typeof globalThis & { __easyOrderDb?: Database };

export const db: Database = (globalForDb.__easyOrderDb ??= connect());

// `bun run src/lib/server/db.ts` applies migrations from the CLI. The server
// also runs them on startup (see src/hooks.server.ts).
if (import.meta.main) {
	runMigrations();
	console.log(`migrations applied to ${DATABASE_PATH}`);
}
