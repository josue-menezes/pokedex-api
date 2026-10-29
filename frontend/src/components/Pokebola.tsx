// Pokébola feita só com CSS
export default function Pokebola({ tamanho = 36 }: { tamanho?: number }) {
  return <span className="pokebola" style={{ width: tamanho, height: tamanho }} aria-hidden />;
}
