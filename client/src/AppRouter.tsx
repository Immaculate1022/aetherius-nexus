import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import { useLocation } from 'wouter';
import App from './App';
import TheoryLibrary from './pages/TheoryLibrary';
import ResearchAssistant from './pages/ResearchAssistant';

export default function AppRouter() {
  const [location] = useLocation();

  // Determine which component to render
  let currentComponent = <App />;

  if (location === '/theory') {
    currentComponent = <TheoryLibrary />;
  } else if (location === '/assistant') {
    currentComponent = <ResearchAssistant />;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          {currentComponent}
          <Toaster />
          {/* MathJax Script for Theory Library */}
          <script
            async
            src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.MathJax = {
                tex: {
                  inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
                  displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
                },
                svg: { fontCache: 'global' }
              };`,
            }}
          />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
