export default function H2({ className, ...otherProps }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      {...otherProps}
      className="text-2xl text-gray-900 py-8"
    />
  );
}
