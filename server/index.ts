import Fastify from "fastify";
import { renderPage } from "vike/server";
import { root } from "./root.js";
const isProduction = process.env.NODE_ENV === "production";

const development = {};

const production = {};

const app = Fastify(isProduction ? production : development);

app.register(import("@fastify/compress"), { global: true });

if (isProduction) {
	// In production, we need to serve our static assets ourselves.
	// (In dev, Vite's middleware serves our static assets.)
	await app.register(import("@fastify/static"), {
		root: root + "/dist/client/assets",
		prefix: "/assets/",
	});
} else {
	console.log("Building Vite dev server...");
	// We instantiate Vite's development server and integrate its middleware to our server.
	// ⚠️ We instantiate it only in development. (It isn't needed in production and it
	// would unnecessarily bloat our production server.)
	const vite = await import("vite");
	const viteDevMiddleware = (
		await vite.createServer({
			server: {
				middlewareMode: true,
				hmr: {
					protocol: "wss",
					clientPort: 443,
					port: 443,
				},
			},
		})
	).middlewares;

	// this is middleware for vite's dev server
	app.addHook("onRequest", async (request, reply) => {
		const next = () =>
			new Promise<void>((resolve) => {
				viteDevMiddleware(request.raw, reply.raw, () => resolve());
			});
		await next();
	});
}

app.get("*", async (request, reply) => {
	console.log("Request received");
	const pageContextInit = {
		urlOriginal: request.raw.url || "",
	};
	const pageContext = await renderPage(pageContextInit);
	const httpResponse = pageContext.httpResponse;

	if (httpResponse) {
		const { statusCode, headers, getReadableNodeStream } = httpResponse;

		headers.forEach(([name, value]: [string, string]) =>
			reply.header(name, value),
		);
		reply.status(statusCode).send(await getReadableNodeStream());
	} else {
		reply.status(500).send("Internal Server Error");
	}

	return reply;
});

async function main() {
	console.log("Building server...");

	const port = process.env.PORT || 5173;
	try {
		await app.listen({ port: +port });
		console.log(`Server listening at http://localhost:${port}`);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
}

console.log("Starting dserver...");
main();
