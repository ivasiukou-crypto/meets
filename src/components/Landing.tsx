import { useMemo, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { motion } from "framer-motion"; // Added animation library

import { LanguageSwitcher } from "@/components/LanguageSwitcher"; // Added Switcher
import { WeekCycle } from "./WeekCycle";
import { WhyMeet } from "./WhyMeet";

import { CONFIG, buildTelegramLink, buildMailtoLink } from "@/config";
import { sendTelegramMessage } from "@/utils/telegram";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  MessageCircle,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

type FaqItem = { id: string; question: string; answer: string };

export const Landing = () => {
  const { t } = useTranslation();
  const showPricing = false;

  const startMeetingsHref = CONFIG.START_MEETINGS_URL || `${CONFIG.APP_URL}/quiz`;
  const isExternalStart = startMeetingsHref.startsWith("http://") || startMeetingsHref.startsWith("https://");
  const appHomeHref = `${CONFIG.APP_URL}/home`;

  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [leadForm, setLeadForm] = useState({
    name: "",
    community: "",
    contact: "",
    comment: "",
  });

  const managerTelegramLink = useMemo(() => buildTelegramLink(CONFIG.TELEGRAM_MANAGER), []);

  const faqParticipants: FaqItem[] = useMemo(
    () => [
      {
        id: "p-1",
        question: t("faq.p_q1"),
        answer: t("faq.p_a1"),
      },
      {
        id: "p-2",
        question: t("faq.p_q2"),
        answer: t("faq.p_a2"),
      },
      {
        id: "p-3",
        question: t("faq.p_q3"),
        answer: t("faq.p_a3"),
      },
    ],
    [t]
  );

  const faqOwners: FaqItem[] = useMemo(
    () => [
      {
        id: "b-1",
        question: t("faq.b_q1"),
        answer: t("faq.b_a1"),
      },
      {
        id: "b-2",
        question: t("faq.b_q2"),
        answer: t("faq.b_a2"),
      },
      {
        id: "b-3",
        question: t("faq.b_q3"),
        answer: t("faq.b_a3"),
      },
    ],
    [t]
  );

  const toggleFaq = (id: string) => setOpenFaqId((prev) => (prev === id ? null : id));

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const text = [
      "📝 <b>Заявка от владельца сообщества</b>",
      "",
      `👤 <b>Имя:</b> ${leadForm.name || "-"}`,
      `👥 <b>Сообщество:</b> ${leadForm.community || "-"}`,
      `📞 <b>Контакт:</b> ${leadForm.contact || "-"}`,
      `💬 <b>Комментарий:</b> ${leadForm.comment || "-"}`,
    ].join("\n");

    const success = await sendTelegramMessage(text);
    
    if (success) {
      alert("Спасибо! Ваша заявка отправлена.");
      setLeadForm({ name: "", community: "", contact: "", comment: "" });
    }
  };

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      {/* ========== HEADER ========== */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          {/* Левый блок: Логотип */}
          <a href="/" className="flex items-center gap-2">
            <img src="/naura-logo.svg" alt="Naura Meets" className="h-6 sm:h-7 w-auto" />
          </a>

          {/* Правый блок: Ссылки + Кнопки (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6 text-sm font-medium">
              <a href="#for-participants" className="text-muted-foreground hover:text-foreground transition-colors">
                {t("header.for_participants")}
              </a>
              <a href="#for-communities" className="text-muted-foreground hover:text-foreground transition-colors">
                {t("header.for_communities")}
              </a>
              {showPricing ? (
                <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("header.pricing")}
                </a>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-muted-foreground/50 cursor-not-allowed select-none">{t("header.pricing")}</span>
                  </TooltipTrigger>
                  <TooltipContent>{t("header.soon")}</TooltipContent>
                </Tooltip>
              )}
            </nav>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <Button variant="ghost" size="sm" asChild>
                <a href={appHomeHref}>{t("header.login")}</a>
              </Button>
              <Button size="sm" className="px-5" asChild>
                <a href={startMeetingsHref} target={isExternalStart ? "_blank" : undefined} rel={isExternalStart ? "noreferrer" : undefined}>
                  {t("header.start")}
                </a>
              </Button>
            </div>
          </div>

          {/* Mobile кнопки */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" className="h-9 px-3 text-sm" asChild>
              <a href={appHomeHref}>{t("header.login")}</a>
            </Button>
            <Button size="sm" className="h-9 px-4 text-sm" asChild>
              <a href={startMeetingsHref} target={isExternalStart ? "_blank" : undefined} rel={isExternalStart ? "noreferrer" : undefined}>
                {t("header.start")}
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden pt-20 sm:pt-24 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-50" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-5 sm:space-y-6"
            >
              {/* Заголовок */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.15] tracking-tight">
                {t("hero.title_part1")} <span className="text-primary">{t("hero.title_part2")}</span>
              </h1>

              {/* Подзаголовок */}
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                <Trans i18nKey="hero.subtitle" components={{ strong: <strong className="text-foreground font-semibold" />, br: <br className="hidden sm:block" /> }} />
              </p>

              {/* CTA-блок */}
              <div className="flex flex-col gap-4 pt-2">
                <Button size="lg" className="text-base px-8 h-12 sm:h-14 w-full sm:w-auto" asChild>
                  <a href={startMeetingsHref} target={isExternalStart ? "_blank" : undefined} rel={isExternalStart ? "noreferrer" : undefined}>
                    {t("hero.cta_button")}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </Button>
                <a href="#for-communities" className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors text-center sm:text-left">
                  {t("hero.cta_community")}
                </a>
              </div>
            </motion.div>

            {/* Визуал: Скриншот Mini App */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative lg:pl-8 mt-4 lg:mt-0"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl opacity-60" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-border/50 bg-background/50 backdrop-blur-sm">
                 <img src="/hero-interface.svg" alt="Naura Meets Interface" className="w-full h-auto object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== БЛОК 1: Как устроены встречи ========== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-muted/30 scroll-mt-16 sm:scroll-mt-20" id="for-participants">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">{t("how_it_works.title")}</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              <Trans i18nKey="how_it_works.description" components={{ br: <br className="hidden sm:block" /> }} />
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
             {[
               { icon: FileText, title: t("how_it_works.card_context_title"), desc: t("how_it_works.card_context_desc") },
               { icon: Clock, title: t("how_it_works.card_rhythm_title"), desc: t("how_it_works.card_rhythm_desc") },
               { icon: ShieldCheck, title: t("how_it_works.card_protection_title"), desc: t("how_it_works.card_protection_desc") },
             ].map((item, idx) => (
               <motion.div 
                 key={idx}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 className="group relative p-6 sm:p-8 rounded-3xl bg-background border border-border/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
               >
                 <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <item.icon className="w-7 h-7" />
                 </div>
                 <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                 <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* ========== БЛОК 2: Зачем встречаться? ========== */}
      <WhyMeet />

      {/* ========== БЛОК 3: Как проходит неделя ========== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">{t("week_flow.title")}</h2>
          </div>
          
          <WeekCycle />
        </div>
      </section>

      {/* ========== БЛОК 4: Для владельцев сообществ (B2B) ========== */}
      <section id="for-communities" className="py-16 sm:py-24 px-4 sm:px-6 bg-background scroll-mt-16 sm:scroll-mt-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">{t("for_communities.title")}</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t("for_communities.description")}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-start">
            <div className="space-y-8">
              {/* Проблема & Решение */}
               <div className="space-y-4">
                  <motion.div 
                     initial={{ opacity: 0, x: -20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     className="p-6 rounded-2xl bg-muted/50 border border-border"
                  >
                     <h3 className="text-xl font-bold text-muted-foreground mb-2">{t("for_communities.problem_title")}</h3>
                     <p className="text-muted-foreground/80">{t("for_communities.problem_desc")}</p>
                  </motion.div>
                  
                  <motion.div 
                     initial={{ opacity: 0, x: -20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.1 }}
                     className="p-6 rounded-2xl bg-primary/5 border border-primary/20"
                  >
                     <h3 className="text-xl font-bold text-primary mb-2">{t("for_communities.solution_title")}</h3>
                     <p className="text-foreground">
                        <Trans i18nKey="for_communities.solution_desc" components={{ br: <br /> }} />
                     </p>
                  </motion.div>
               </div>

              {/* Benefits List */}
              <div className="space-y-6">
                {[
                  { title: t("for_communities.benefit1_title"), desc: t("for_communities.benefit1_desc"), icon: Sparkles },
                  { title: t("for_communities.benefit2_title"), desc: t("for_communities.benefit2_desc"), icon: CheckCircle2 },
                  { title: t("for_communities.benefit3_title"), desc: t("for_communities.benefit3_desc"), icon: Users },
                ].map((item, idx) => (
                  <motion.div 
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="flex gap-4 items-start"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Форма заявки */}
            <Card className="border-2">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">{t("for_communities.form_title")}</CardTitle>
                <CardDescription className="text-sm">
                  {t("for_communities.form_desc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleLeadSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lead-name" className="text-sm">{t("for_communities.label_name")}</Label>
                      <Input
                        id="lead-name"
                        value={leadForm.name}
                        onChange={(e) => setLeadForm((s) => ({ ...s, name: e.target.value }))}
                        placeholder={t("for_communities.placeholder_name")}
                        autoComplete="name"
                        className="h-11 sm:h-10 text-base sm:text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lead-community" className="text-sm">{t("for_communities.label_community")}</Label>
                      <Input
                        id="lead-community"
                        value={leadForm.community}
                        onChange={(e) => setLeadForm((s) => ({ ...s, community: e.target.value }))}
                        placeholder={t("for_communities.placeholder_community")}
                        className="h-11 sm:h-10 text-base sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lead-contact" className="text-sm">{t("for_communities.label_contact")}</Label>
                    <Input
                      id="lead-contact"
                      value={leadForm.contact}
                      onChange={(e) => setLeadForm((s) => ({ ...s, contact: e.target.value }))}
                      placeholder={t("for_communities.placeholder_contact")}
                      className="h-11 sm:h-10 text-base sm:text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lead-comment" className="text-sm">{t("for_communities.label_comment")}</Label>
                    <Textarea
                      id="lead-comment"
                      value={leadForm.comment}
                      onChange={(e) => setLeadForm((s) => ({ ...s, comment: e.target.value }))}
                      placeholder={t("for_communities.placeholder_comment")}
                      rows={3}
                      className="text-base sm:text-sm"
                    />
                  </div>

                  <div className="pt-2">
                    <Button type="submit" size="lg" className="w-full h-12 sm:h-11 text-base">
                      {t("for_communities.submit_button")}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ========== БЛОК 5: Тарифы (скрыт) ========== */}
      {showPricing && (
        <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 bg-muted/30 scroll-mt-16 sm:scroll-mt-20">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">{t("pricing.title")}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>{t("pricing.for_participants_title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground text-sm sm:text-base">
                    <li>{t("pricing.for_participants_item1")}</li>
                    <li>{t("pricing.for_participants_item2")}</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>{t("pricing.for_communities_title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground text-sm sm:text-base">
                    <li>{t("pricing.for_communities_item1")}</li>
                    <li>{t("pricing.for_communities_item2")}</li>
                  </ul>
                  <a href="#for-communities" className="text-primary hover:underline text-sm mt-4 inline-block">
                    {t("pricing.discuss_terms")}
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* ========== БЛОК 6: FAQ ========== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">{t("faq.title")}</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Для участников */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-base sm:text-lg">{t("faq.participants_title")}</h3>
              <div className="space-y-3">
                {faqParticipants.map((faq) => (
                  <Card
                    key={faq.id}
                    className="border bg-card cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <CardHeader className="py-3 sm:py-4 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm sm:text-base font-medium pr-4">{faq.question}</CardTitle>
                      <ChevronDown
                        className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${openFaqId === faq.id ? "rotate-180" : ""
                          }`}
                      />
                    </CardHeader>
                    {openFaqId === faq.id && (
                      <CardContent className="pt-0 pb-4">
                        <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Для владельцев */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-base sm:text-lg">{t("faq.owners_title")}</h3>
              <div className="space-y-3">
                {faqOwners.map((faq) => (
                  <Card
                    key={faq.id}
                    className="border bg-card cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <CardHeader className="py-3 sm:py-4 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm sm:text-base font-medium pr-4">{faq.question}</CardTitle>
                      <ChevronDown
                        className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${openFaqId === faq.id ? "rotate-180" : ""
                          }`}
                      />
                    </CardHeader>
                    {openFaqId === faq.id && (
                      <CardContent className="pt-0 pb-4">
                        <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="py-12 sm:py-16 px-4 sm:px-6 border-t border-border bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10 sm:mb-12">
            {/* Левый блок: Логотип + описание */}
            <div>
              <img src="/naura-logo.svg" alt="Naura Meets" className="h-7 sm:h-8 w-auto mb-3 sm:mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("footer.subtitle")}
              </p>
            </div>

            {/* Центральный блок: Ссылки + Контакты */}
            <div>
              <h4 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">{t("footer.nav_title")}</h4>
              <div className="space-y-2 text-sm mb-5 sm:mb-6">
                <a href="#for-participants" className="block text-muted-foreground hover:text-foreground transition-colors">
                  {t("header.for_participants")}
                </a>
                <a href="#for-communities" className="block text-muted-foreground hover:text-foreground transition-colors">
                  {t("header.for_communities")}
                </a>
                {showPricing && (
                  <a href="#pricing" className="block text-muted-foreground hover:text-foreground transition-colors">
                    {t("header.pricing")}
                  </a>
                )}
              </div>
              <h4 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">{t("footer.contacts_title")}</h4>
              <div className="space-y-2 text-sm">
                <a href={`mailto:${CONFIG.SUPPORT_EMAIL}`} className="block text-muted-foreground hover:text-foreground transition-colors">
                  {CONFIG.SUPPORT_EMAIL}
                </a>
                <a href={managerTelegramLink} target="_blank" rel="noreferrer" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Telegram: {CONFIG.TELEGRAM_MANAGER}
                </a>
              </div>
            </div>

            {/* Правый блок: Соцсети + Документы */}
            <div>
              <h4 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">{t("footer.socials_title")}</h4>
              <div className="space-y-2 text-sm text-muted-foreground mb-5 sm:mb-6">
                <span className="block">{t("header.soon")}</span>
              </div>
              <h4 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">{t("footer.docs_title")}</h4>
              <div className="space-y-2 text-sm">
                <a
                  href={CONFIG.LEGAL.PRIVACY_POLICY}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.privacy_policy")}
                </a>
                <a
                  href={CONFIG.LEGAL.TERMS_OF_SERVICE}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.terms")}
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 sm:pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Naura Meets
          </div>
        </div>
      </footer>
    </div>
  );
};
