export function SubComponent({ content }: { content: string }) {
  return (
    <div className="p-2 bg-gray-100 rounded">
      <p>{content}</p>
    </div>
  );
}
