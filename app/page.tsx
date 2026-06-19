const BASE_URL = process.env.BASE_URL;
const README_EMBED = `![RPG](${BASE_URL}/rpg.svg?lines=初めまして、藪木と言います。&lines=フロントエンドエンジニアをやっています。)`;


export default function Page() {
  return (
    <main className="w-full max-w-5xl mx-auto p-4">
      <h1 className="text-4xl font-bold">RPG風</h1>

      <div className="mt-8">
        <p className="text-2xl font-bold">HOW TO USE</p>
        <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-md border border-zinc-700 overflow-auto text-sm font-mono">
          {README_EMBED}
        </pre>
      </div>
    </main >
  );
}
