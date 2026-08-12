// This page itself is a client component

import AnimatedSection from '@/components/ui/AnimatedSection';
import FunnyLogin from '@/components/funny/FunnyLogin';

const LoginPage = () => {
  return (
    <AnimatedSection>
      <FunnyLogin />
    </AnimatedSection>
  );
};

export default LoginPage;