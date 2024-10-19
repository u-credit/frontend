export default function Page({ params }: { params: { slug: string } }) {
  return <div>full detail and review page for {params.slug}</div>;
}
