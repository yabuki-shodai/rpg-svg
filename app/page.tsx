const BASE_URL = process.env.BASE_URL;
const RPG_PATH =
  "/rpg?links=初めまして、藪木と言います。&links=フロントエンドエンジニアをやっています。";


export default function Page() {
  return (
    <main className="w-full max-w-5xl mx-auto p-4">
      <h1 className="text-4xl font-bold">RPG風</h1>
      <iframe
        src={RPG_PATH}
        title="rpg-preview"
        style={{
          display: "block",
          width: "100%",
          height: "360px",
          border: "0",
        }}
      />

      <div className="mt-8">
        <p className="text-2xl font-bold">HOW TO USE</p>
        <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-md border border-zinc-700 overflow-auto text-sm font-mono">
          {`${BASE_URL}/rpg?links=初めまして、藪木と言います。&links=フロントエンドエンジニアをやっています。`}
        </pre>
      </div>



    </main >
  );
}
