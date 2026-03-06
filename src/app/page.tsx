import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { ProofBar } from '@/components/sections/ProofBar';
import { FeaturedWork } from '@/components/sections/FeaturedWork';
import { ResultsDashboard } from '@/components/sections/ResultsDashboard';
import { Manifesto } from '@/components/sections/Manifesto';
import { CaseStudyArchive } from '@/components/sections/CaseStudyArchive';
import { Pricing } from '@/components/sections/Pricing';
import { FAQ } from '@/components/sections/FAQ';
import { Footer } from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import { CaseStudy, SelectedWork } from '@/types/database';

export const revalidate = 60;

export default async function Home() {
  // Fetch selected works for the slider
  const { data: selectedWorksData } = await supabase
    .from('selected_works')
    .select('*')
    .order('sort_order', { ascending: true });

  const selectedWorks = (selectedWorksData as SelectedWork[]) || [];

  // Fetch all case studies (for archive + joining with selected works)
  const { data: caseStudiesData } = await supabase
    .from('case_studies')
    .select('*')
    .order('created_at', { ascending: false });

  const caseStudies = (caseStudiesData as CaseStudy[]) || [];

  // Join selected works with their linked case studies
  const worksWithStudies = selectedWorks.map(work => ({
    ...work,
    case_study: caseStudies.find(cs => cs.id === work.case_study_id) || null,
  }));

  return (
    <main className="relative z-10 min-h-screen selection:bg-ink selection:text-white">
      <Navbar />
      <Hero />
      <ProofBar />
      <FeaturedWork works={worksWithStudies} />
      <ResultsDashboard />
      <Manifesto />
      <CaseStudyArchive studies={caseStudies} />
      <FAQ />
      <Footer />
    </main>
  );
}
