import { Faq } from "@/components/ui/Faq";
import { Container } from "@/components/ui/Container";
import { homeCopy } from "@/content/home";

export function HomeFaq() {
  const { faq } = homeCopy;

  return (
    <section className="bg-cream py-20 md:py-24">
      <Container className="max-w-4xl">
        <Faq title={faq.title} items={[...faq.items]} headingId="home-faq-heading" />
      </Container>
    </section>
  );
}
