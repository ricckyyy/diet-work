export function TestComponent({ title }: { title: string }) {
  return (
    <div className="p-4 border rounded">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-2">これはテストコンポーネントです</p>
    </div>
  );
}
