export default function H1({ className, ...otherProps }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      {...otherProps}
      className="text-2xl text-gray-900 py-8"
    />
  );
}
