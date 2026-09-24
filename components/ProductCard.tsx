type ProductCardProps = {
  name: string;
  description: string;
};

export default function ProductCard({ name, description }: ProductCardProps) {
  return (
    <article>
      <h2>{name}</h2>
      <p>{description}</p>
    </article>
  );
}
