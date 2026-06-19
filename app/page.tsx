import ReadmeEmbedBuilder from "@/app/components/readme-embed-builder";

const BASE_URL = process.env.BASE_URL;

export default function Page() {
  return (
    <main className="w-full max-w-5xl mx-auto p-4">
      <h1 className="text-4xl font-bold">RPG風</h1>
      <ReadmeEmbedBuilder baseUrl={BASE_URL ?? ""} />
    </main >
  );
}
