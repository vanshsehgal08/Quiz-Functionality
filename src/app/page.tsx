// import BugReport from "@/components/global/BugReport";
import HomeButton from "@/components/global/HomeButton"
import Navbar from "@/components/global/Navbar";
import FormContainer from "@/components/pages/FormContainer";
import Container from "@/components/shared/Container";
// import GeminiBadge from "@/components/shared/GeminiBadge";
import Header from "@/components/shared/Header";
import Footer from "@/components/global/Footer";

export default function Home() {
  return (
      <main className="relative">
          <Navbar />
          <Container className="mt-40">
              <Header
                  title="Test Your Knowledge on Climate Change!"
                  description="Take interactive quizzes to deepen your understanding of environmental issues and climate change. Maximize your learning and contribute to a sustainable future."
              />
          </Container>
          <FormContainer />
          <HomeButton />
          <Footer />
      </main>
  );
}

