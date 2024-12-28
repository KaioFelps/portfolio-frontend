import { common, createStarryNight } from "@wooorm/starry-night";
import tsx from "@wooorm/starry-night/source.tsx";
import { toDom } from "hast-util-to-dom";

const prefix = "language-";

type StarryNight = Awaited<ReturnType<typeof createStarryNight>>;

export class StarryNightSingletone {
	private static starryNight: StarryNight | null;

	public static async maybeInitialize() {
		if (!this.starryNight) {
			this.starryNight = await createStarryNight([...common, tsx]);
		}
	}

	private static async getOrInitalize(): Promise<StarryNight> {
		await this.maybeInitialize();
		return this.starryNight!;
	}

	public static async clientSideHighlight(nodes: Element[]) {
		const starryNight = await this.getOrInitalize();

		for (const node of nodes) {
			const language =
				node.classList
					.values()
					.find((_class) => _class.startsWith(prefix))
					?.replace(prefix, "") ?? null;

			if (!language || !node.textContent) continue;

			const scope = starryNight.flagToScope(language);

			if (!scope) continue;

			const tree = starryNight.highlight(node.textContent, scope);
			const highlightedCode = toDom(tree, { fragment: true });

			node.replaceChildren(highlightedCode);
		}
	}
}
