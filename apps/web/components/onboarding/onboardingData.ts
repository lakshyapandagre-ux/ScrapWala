export interface OnboardingSlideData {
  id: number;
  layout: 'slide1' | 'standard';
  // Top green curved area
  topBrandTitle?: string;
  topBrandSubtitle?: string;
  // Main headings
  headingDark: string;
  headingGreen: string;
  englishSubtitle: string;
  hindiSupporting?: string;
  // Button text
  ctaText: string;
  // Progress dot index
  stepIndex: number;
}

export const ONBOARDING_SLIDES_DATA: OnboardingSlideData[] = [
  {
    id: 1,
    layout: 'slide1',
    topBrandTitle: 'ScrapWala',
    topBrandSubtitle: 'बेकार नहीं,\nबहुमूल्य है',
    headingDark: 'बस फोटो लो',
    headingGreen: 'कचरा पहचानो',
    englishSubtitle: 'Take a photo and identify what type of scrap it is.',
    ctaText: 'आगे बढ़ें (Next)',
    stepIndex: 0,
  },
  {
    id: 2,
    layout: 'standard',
    headingDark: 'तुरंत जानें',
    headingGreen: 'कितने का है?',
    englishSubtitle: 'Get instant estimated value for your scrap.',
    hindiSupporting: 'अपने कबाड़ की सही कीमत जानें',
    ctaText: 'आगे बढ़ें (Next)',
    stepIndex: 1,
  },
  {
    id: 3,
    layout: 'standard',
    headingDark: 'अपने पास के',
    headingGreen: 'कबाड़ी से जुड़ें',
    englishSubtitle: 'Compare rates from verified local recyclers and get the best deal.',
    hindiSupporting: 'नज़दीकी कबाड़ी और रिसाइक्लर खोजें',
    ctaText: 'आगे बढ़ें (Next)',
    stepIndex: 2,
  },
  {
    id: 4,
    layout: 'standard',
    headingDark: 'साथ मिलकर बनाएं',
    headingGreen: 'स्वच्छ भारत',
    englishSubtitle: 'Your scrap helps reduce pollution and keeps our cities cleaner.',
    hindiSupporting: 'आपका कबाड़, देश के काम आए',
    ctaText: 'शुरू करें (Get Started)',
    stepIndex: 3,
  },
];
