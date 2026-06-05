import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "ka" | "en" | "ru";

interface TranslationContextProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, any>> = {
  ka: {
    nav: {
      features: "მახასიათებლები",
      builder: "კონსტრუქტორი",
      portfolio: "პორტფოლიო",
      pricing: "ფასები",
      contact: "კონტაქტი",
      cta: "დავიწყოთ",
    },
    hero: {
      badge: "ქართული წარმოების · გლობალური ხედვით",
      title: "ჩვენ ვზრდით ვებ შედევრებს.",
      sub: "მჭრელი. სწრაფი. ორგანული.",
      desc: "ალუჩა სტუდია აერთიანებს დიზაინის უმაღლეს სტანდარტებსა და ელვისებურ სისწრაფეს თქვენი ბრენდის ციფრული სახლის შესაქმნელად — შექმნილია თბილისში, ინჟინერია მთელი მსოფლიოსთვის.",
      ctaLaunch: "პროექტის გაშვება",
      ctaExplore: "მახასიათებლების ნახვა",
      statSites: "გაზრდილი საიტი",
      statLighthouse: "Lighthouse-ის საშ.",
      statMarket: "ლოკალური + გლობალური",
    },
    features: {
      badge: "რატომ ალუჩა",
      title: "ოთხი ფესვი, ერთი უძლეველი ბაღი.",
      desc: "ყოველი საიტი, რომელსაც ვზრდით, ეფუძნება ერთსა და იმავე პრინციპებს — მჭრელი, ორგანული, მორგებული, მხარდაჭერილი.",
      f1Title: "ალუჩასავით მჭრელი სისწრაფე",
      f1Desc: "ულტრა-სწრაფი ჩატვირთვა რეაქტის სუფთა არქიტექტურითა და მოწინავე სერვერული ტექნოლოგიებით.",
      f2Title: "ორგანული ზრდა",
      f2Desc: "ლოკალური SEO მორგებული ქართულ ბაზარზე და გათვლილი საერთაშორისო რეიტინგებზე.",
      f3Title: "მორგებული UI",
      f3Desc: "ინდივიდუალური 3D ვიზუალები, ანიმაციები და დიზაინ სისტემები თქვენს ბრენდზე მორგებული.",
      f4Title: "ქართული მხარდაჭერა",
      f4Desc: "ლოკალური დახმარება, საიმედო ჰოსტინგი და მუდმივი ტექნიკური მხარდაჭერა — თქვენს დროის სარტყელში.",
    },
    builder: {
      badge: "ლაივ დემო",
      title: "ალუჩას მიკრო-რედაქტორი.",
      desc: "გემო იმისა, თუ როგორ ვაშენებთ. შეცვალეთ პარამეტრები და უყურეთ საიტს რეალურ დროში — ყოველი ოფცია მართავს რეალურ პარამეტრებს.",
      theme: "თემა",
      themeDark: "ბნელი",
      themeLight: "ნათელი",
      layout: "განლაგება",
      layoutGrid: "ბადე",
      layoutList: "სია",
      accent: "აქცენტი",
      accentAlucha: "ალუჩას მწვანე",
      accentPlum: "ტყემლის ვარდისფერი",
      previewUrl: "preview.alucha.studio",
      mockBrand: "თქვენიბრენდი",
      mockStatus: "ლაივი",
      mockTitle: "შექმნილია რეალურ დროში",
      mockDesc: "შეცვალეთ მართვის პანელი — დიზაინი, პალიტრა და განწყობა მყისიერად რეაგირებს.",
      mockCta: "დავიწყოთ",
    },
    portfolio: {
      badge: "პორტფოლიო",
      title: "ალუჩას გაზრდილი.",
      desc: "მცირე მოსავალი დატვირთული სეზონიდან — შერჩეული ნამუშევრები ელექტრონული კომერციის, ბრენდინგისა და პროდუქტების მიმართულებით.",
      view: "ნახვა",
      tagWine: "ელ. კომერცია · ღვინო",
      tagFashion: "მოდა · ბრენდი",
      tagRealEstate: "უძრავი ქონება",
      tagHospitality: "სასტუმრო & რესტორანი",
      tagFintech: "ფინტექი · SaaS",
      tagArchitecture: "არქიტექტურა",
      tagFlowersSisters: "ყვავილები · 24/7 მიწოდება",
      tagFlowersLily: "პრემიუმ ყვავილები · ბუტიკი",
      comingSoon: "მალე...",
      comingSoonDesc: "აქ შეიძლება შენი ვებსაიტი იყოს.",
    },
    pricing: {
      badge: "კალკულატორი",
      title: "მართე შენი მოსავალი.",
      desc: "გადააადგილეთ სლაიდერი, მონიშნეთ ოფციები და ნახეთ გამჭვირვალე საწყისი ფასი და ვადები.",
      pages: "გვერდების რაოდენობა",
      pagesLanding: "ლენდინგი",
      pagesMid: "საშუალო საიტი",
      pagesPlatform: "პლატფორმა",
      ecomTitle: "ელ. კომერცია",
      ecomSub: "კალათა, გადახდები",
      visualsTitle: "3D ვიზუალი",
      visualsSub: "WebGL & ანიმაცია",
      cmsTitle: "CMS სისტემა",
      cmsSub: "მართვადი კონტენტი",
      startingFrom: "საწყისი ფასი",
      weeksToLaunch: "კვირა გასაშვებად",
      list1: "კვლევა და დიზაინ-სპრინტები",
      list2: "ინდივიდუალური დეველოპმენტი",
      list3: "ოპტიმიზაცია და საბაზისო SEO",
      list4: "30 დღიანი უფასო მხარდაჭერა",
      cta: "დეტალური ფასის მოთხოვნა",
    },
    contact: {
      badge: "კონტაქტი",
      title: "მოდით, გავზარდოთ რაღაც ერთად.",
      desc: "მოგვიყევით თქვენი პროექტის შესახებ — გიპასუხებთ 1 სამუშაო დღეში.",
      successTitle: "თქვენი მოთხოვნა წარმატებით გაიზარდა!",
      successDesc: "მალე დაგიკავშირდებით — თვალი ადევნეთ თქვენს ელ-ფოსტას.",
      sendAnother: "ახლის გაგზავნა",
      name: "სახელი",
      email: "ელ-ფოსტა",
      projectType: "პროექტის ტიპი",
      optMarketing: "მარკეტინგული საიტი",
      optEcom: "ელ. კომერცია",
      optSaas: "SaaS პროდუქტი",
      optBrand: "ბრენდი & იდენტობა",
      optOther: "სხვა",
      message: "შეტყობინება",
      messagePlaceholder: "რამდენიმე წინადადება თქვენი მიზნების შესახებ...",
      cta: "მოთხოვნის გაგზავნა",
    },
    footer: {
      desc: "ალუჩა — მჟავე, მჭრელი და ნამდვილად ჩვენებური. ჩვენ ვქმნით ვებ-შედევრებს ამბიციური გუნდებისთვის.",
      colStudio: "სტუდია",
      colWork: "ნამუშევრები",
      colContact: "კონტაქტი",
      linkAbout: "შესახებ",
      linkProcess: "პროცესი",
      linkCareers: "ვაკანსიები",
      linkPortfolio: "პორტფოლიო",
      linkPricing: "ფასები",
      linkCaseStudies: "ქეისები",
      location: "თბილისი, ვაკე",
      copyright: "ყველა უფლება გაზრდილია.",
    },
  },
  en: {
    nav: {
      features: "Features",
      builder: "Builder",
      portfolio: "Portfolio",
      pricing: "Pricing",
      contact: "Contact",
      cta: "Start Building",
    },
    hero: {
      badge: "Georgian-grown · Globally minded",
      title: "We grow web masterpieces.",
      sub: "Sharp. Fast. Organic.",
      desc: "Alucha Studios combines the sharpest design standards with lightning-fast performance to build your brand's digital home — handcrafted in Tbilisi, engineered for the world.",
      ctaLaunch: "Launch your project",
      ctaExplore: "Explore features",
      statSites: "Sites grown",
      statLighthouse: "Lighthouse avg.",
      statMarket: "Local + global",
    },
    features: {
      badge: "Why Alucha",
      title: "Four roots, one unstoppable orchard.",
      desc: "Every site we grow stands on the same principles — sharp, organic, tailored, supported.",
      f1Title: "Sour-sharp performance",
      f1Desc: "Ultra-fast loading speeds powered by clean, modern React architecture and edge delivery.",
      f2Title: "Organic growth",
      f2Desc: "Localised SEO tuned for the Georgian market and engineered to rank internationally.",
      f3Title: "Tailored UI",
      f3Desc: "Bespoke 3D visuals, custom animations and design systems built to your brand.",
      f4Title: "Georgian support",
      f4Desc: "Local assistance, reliable hosting and effortless ongoing maintenance — in your timezone.",
    },
    builder: {
      badge: "Live demo",
      title: "The Alucha Micro-Editor.",
      desc: "A taste of how we build. Toggle the controls and watch the mock-site re-style itself in real time — every option below maps to a real lever in our studio workflow.",
      theme: "Theme",
      themeDark: "Dark",
      themeLight: "Light",
      layout: "Layout",
      layoutGrid: "Grid",
      layoutList: "List",
      accent: "Accent",
      accentAlucha: "Alucha green",
      accentPlum: "Plum pink",
      previewUrl: "preview.alucha.studio",
      mockBrand: "Yourbrand",
      mockStatus: "Live",
      mockTitle: "Built in real-time",
      mockDesc: "Toggle the controls — the layout, palette and mood respond.",
      mockCta: "Get started",
    },
    portfolio: {
      badge: "Portfolio",
      title: "Grown by Alucha.",
      desc: "A small harvest from a busy season — selected work spanning commerce, brand, and product.",
      view: "View",
      tagWine: "E-commerce · Wine",
      tagFashion: "Fashion · Brand",
      tagRealEstate: "Real estate",
      tagHospitality: "Hospitality",
      tagFintech: "Fintech · SaaS",
      tagArchitecture: "Architecture",
      tagFlowersSisters: "Flowers · 24/7 Delivery",
      tagFlowersLily: "Premium Flowers · Boutique",
      comingSoon: "Coming soon...",
      comingSoonDesc: "Your website could be here.",
    },
    pricing: {
      badge: "Estimator",
      title: "Shape your harvest.",
      desc: "Move the sliders, toggle the options, and see a transparent starting price and timeline.",
      pages: "Number of pages",
      pagesLanding: "Landing",
      pagesMid: "Mid-site",
      pagesPlatform: "Platform",
      ecomTitle: "E-commerce",
      ecomSub: "Cart, checkout, payments",
      visualsTitle: "3D visuals",
      visualsSub: "Custom WebGL & motion",
      cmsTitle: "CMS",
      cmsSub: "Editable content backend",
      startingFrom: "Starting from",
      weeksToLaunch: "weeks to launch",
      list1: "Discovery & design sprints",
      list2: "Custom development",
      list3: "Performance & SEO baseline",
      list4: "30 days of post-launch care",
      cta: "Request detailed quote",
    },
    contact: {
      badge: "Contact",
      title: "Let's grow something together.",
      desc: "Tell us about your project — we reply within one business day.",
      successTitle: "Your inquiry has been successfully grown!",
      successDesc: "We'll reach out soon — keep an eye on your inbox.",
      sendAnother: "Send another",
      name: "Name",
      email: "Email",
      projectType: "Project type",
      optMarketing: "Marketing website",
      optEcom: "E-commerce",
      optSaas: "SaaS product",
      optBrand: "Brand & identity",
      optOther: "Other",
      message: "Message",
      messagePlaceholder: "A few sentences about your goals…",
      cta: "Send inquiry",
    },
    footer: {
      desc: "ალუჩა — sour, sharp and unmistakably ours. We grow web masterpieces for ambitious teams.",
      colStudio: "Studio",
      colWork: "Work",
      colContact: "Contact",
      linkAbout: "About",
      linkProcess: "Process",
      linkCareers: "Careers",
      linkPortfolio: "Portfolio",
      linkPricing: "Pricing",
      linkCaseStudies: "Case studies",
      location: "Tbilisi, Vake",
      copyright: "All rights grown.",
    },
  },
  ru: {
    nav: {
      features: "Особенности",
      builder: "Конструктор",
      portfolio: "Портфолио",
      pricing: "Цены",
      contact: "Контакты",
      cta: "Начать проект",
    },
    hero: {
      badge: "Выращено в Грузии · С глобальным видением",
      title: "Мы выращиваем веб-шедевры.",
      sub: "Острые. Быстрые. Органические.",
      desc: "Alucha Studios сочетает в себе высочайшие стандарты дизайна с молниеносной производительностью для создания цифрового дома вашего бренда — создано вручную в Тбилиси, разработано для всего мира.",
      ctaLaunch: "Запустить проект",
      ctaExplore: "Изучить возможности",
      statSites: "выращенных сайтов",
      statLighthouse: "ср. Lighthouse",
      statMarket: "Локальные + глобальные",
    },
    features: {
      badge: "Почему Alucha",
      title: "Четыре корня, один неостановимый сад.",
      desc: "Каждый создаваемый нами сайт держится на одних и тех же принципах — острый, органический, индивидуальный, поддерживаемый.",
      f1Title: "Кисло-острая скорость",
      f1Desc: "Ультрабыстрая загрузка на базе чистой архитектуры React и передовых серверных технологий.",
      f2Title: "Органический рост",
      f2Desc: "Локальное SEO, настроенное для грузинского рынка и оптимизированное для международного уровня.",
      f3Title: "Индивидуальный UI",
      f3Desc: "Эксклюзивные 3D-визуализации, индивидуальная анимация и дизайн-системы для вашего бренда.",
      f4Title: "Поддержка в Грузии",
      f4Desc: "Локальная помощь, надежный хостинг и легкое обслуживание — в вашем часовом поясе.",
    },
    builder: {
      badge: "Демо в реальном времени",
      title: "Микро-редактор Alucha.",
      desc: "Почувствуйте, как мы создаем сайты. Переключайте элементы управления и наблюдайте за изменением дизайна в реальном времени.",
      theme: "Тема",
      themeDark: "Темная",
      themeLight: "Светлая",
      layout: "Макет",
      layoutGrid: "Сетка",
      layoutList: "Список",
      accent: "Акцент",
      accentAlucha: "Зеленая алыча",
      accentPlum: "Розовая слива",
      previewUrl: "preview.alucha.studio",
      mockBrand: "Вашбренд",
      mockStatus: "Активен",
      mockTitle: "Создано в реальном времени",
      mockDesc: "Переключайте элементы управления — макет, палитра и настроение меняются на лету.",
      mockCta: "Начать",
    },
    portfolio: {
      badge: "Портфолио",
      title: "Выращено Alucha.",
      desc: "Небольшой урожай за насыщенный сезон — избранные работы в сфере коммерции, брендинга и цифровых продуктов.",
      view: "Смотреть",
      tagWine: "Эл. коммерция · Вино",
      tagFashion: "Мода · Брендинг",
      tagRealEstate: "Недвижимость",
      tagHospitality: "Рестораны & Отели",
      tagFintech: "Финтех · SaaS",
      tagArchitecture: "Архитектура",
      tagFlowersSisters: "Цветы · Доставка 24/7",
      tagFlowersLily: "Премиум цветы · Бутик",
      comingSoon: "Скоро...",
      comingSoonDesc: "Здесь может быть ваш сайт.",
    },
    pricing: {
      badge: "Калькулятор",
      title: "Сформируйте свой урожай.",
      desc: "Двигайте ползунки, переключайте опции и получайте прозрачную стартовую цену и сроки.",
      pages: "Количество страниц",
      pagesLanding: "Лендинг",
      pagesMid: "Средний сайт",
      pagesPlatform: "Платформа",
      ecomTitle: "Эл. коммерция",
      ecomSub: "Корзина, оплата",
      visualsTitle: "3D визуализация",
      visualsSub: "WebGL и анимация",
      cmsTitle: "CMS система",
      cmsSub: "Управление контентом",
      startingFrom: "Начиная от",
      weeksToLaunch: "недель до запуска",
      list1: "Аналитика и дизайн-спринты",
      list2: "Индивидуальная разработка",
      list3: "Оптимизация производительности и SEO",
      list4: "30 дней поддержки после запуска",
      cta: "Запросить подробный расчет",
    },
    contact: {
      badge: "Контакты",
      title: "Давайте вырастим что-то вместе.",
      desc: "Расскажите о своем проекте — мы ответим в течение одного рабочего дня.",
      successTitle: "Ваш запрос успешно выращен!",
      successDesc: "Мы скоро свяжемся с вами — следите за входящими сообщениями.",
      sendAnother: "Отправить еще раз",
      name: "Имя",
      email: "Эл. почта",
      projectType: "Тип проекта",
      optMarketing: "Маркетинговый сайт",
      optEcom: "Эл. коммерция",
      optSaas: "SaaS продукт",
      optBrand: "Брендинг и фирменный стиль",
      optOther: "Другое",
      message: "Сообщение",
      messagePlaceholder: "Несколько предложений о ваших целях...",
      cta: "Отправить запрос",
    },
    footer: {
      desc: "Алыча — кислая, острая и определенно наша. Мы выращиваем веб-шедевры для амбициозных команд.",
      colStudio: "Студия",
      colWork: "Работы",
      colContact: "Контакты",
      linkAbout: "О нас",
      linkProcess: "Процесс",
      linkCareers: "Карьера",
      linkPortfolio: "Портфолио",
      linkPricing: "Цены",
      linkCaseStudies: "Кейсы",
      location: "Тбилиси, Ваке",
      copyright: "Все права выращены.",
    },
  },
};

const TranslationContext = createContext<TranslationContextProps | undefined>(
  undefined
);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("alucha-lang");
      if (saved === "ka" || saved === "en" || saved === "ru") {
        return saved;
      }
    }
    return "ka";
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("alucha-lang", newLang);
      document.documentElement.lang = newLang;
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (keyPath: string): string => {
    const keys = keyPath.split(".");
    let current: any = translations[lang];

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        // Fallback to English if Georgian/Russian translation is missing
        let enFallback: any = translations["en"];
        for (const k of keys) {
          if (enFallback && typeof enFallback === "object" && k in enFallback) {
            enFallback = enFallback[k];
          } else {
            return keyPath;
          }
        }
        return typeof enFallback === "string" ? enFallback : keyPath;
      }
    }

    return typeof current === "string" ? current : keyPath;
  };

  return (
    <TranslationContext.Provider value={{ lang, setLang, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};
