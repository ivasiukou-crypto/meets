import { useMemo, useState } from "react";

import { CONFIG, buildTelegramLink, buildMailtoLink } from "@/config";
import { Badge } from "@/components/ui/badge";
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
        question: "Что если мне не подойдёт собеседник?",
        answer:
          "Если не связались до среды — подберём новую пару. После встречи — оставишь фидбек, учтём в следующий раз.",
      },
      {
        id: "p-2",
        question: "Можно выбрать, с кем встречаться?",
        answer:
          "Нет, магия Meets в случайности! При этом мы учитываем контекст анкеты (сфера, интересы, цели), чтобы подбирать самых интересных собеседников.",
      },
      {
        id: "p-3",
        question: "Как часто нужно участвовать?",
        answer:
          "Каждую неделю получаешь приглашение — решаешь сам. Пропускаешь раунд — ничего не происходит, вернёшься когда удобно.",
      },
    ],
    []
  );

  const faqOwners: FaqItem[] = useMemo(
    () => [
      {
        id: "b-1",
        question: "Сколько времени занимает запуск?",
        answer: "Настройка — 10 минут. Дальше всё работает автоматически.",
      },
      {
        id: "b-2",
        question: "Можно ограничить участников?",
        answer: "Да, настраиваешь доступ по группам, формат встреч, частоту раундов.",
      },
      {
        id: "b-3",
        question: "Что если участники не будут встречаться?",
        answer:
          "Мы следим за этим: чек-ин в середине недели, возможность замены пары, фидбек после раунда. Ты видишь статистику.",
      },
    ],
    []
  );

  const toggleFaq = (id: string) => setOpenFaqId((prev) => (prev === id ? null : id));

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const body = [
      "Заявка от владельца сообщества (Naura Meets)",
      "",
      `Имя: ${leadForm.name || "-"}`,
      `Сообщество: ${leadForm.community || "-"}`,
      `Контакт: ${leadForm.contact || "-"}`,
      `Комментарий: ${leadForm.comment || "-"}`,
    ].join("\n");

    const mailto = buildMailtoLink({
      to: CONFIG.SUPPORT_EMAIL,
      subject: "Naura Meets — заявка от сообщества",
      body,
    });

    const opened = window.open(mailto, "_blank");
    if (!opened) window.location.href = mailto;
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
                Для участников
              </a>
              <a href="#for-communities" className="text-muted-foreground hover:text-foreground transition-colors">
                Для сообществ
              </a>
              {showPricing ? (
                <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Тарифы
                </a>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-muted-foreground/50 cursor-not-allowed select-none">Тарифы</span>
                  </TooltipTrigger>
                  <TooltipContent>Скоро</TooltipContent>
                </Tooltip>
              )}
            </nav>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <a href={appHomeHref}>Войти</a>
              </Button>
              <Button size="sm" className="px-5" asChild>
                <a href={startMeetingsHref} target={isExternalStart ? "_blank" : undefined} rel={isExternalStart ? "noreferrer" : undefined}>
                  Начать
                </a>
              </Button>
            </div>
          </div>

          {/* Mobile кнопки */}
          <div className="md:hidden flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-9 px-3 text-sm" asChild>
              <a href={appHomeHref}>Войти</a>
            </Button>
            <Button size="sm" className="h-9 px-4 text-sm" asChild>
              <a href={startMeetingsHref} target={isExternalStart ? "_blank" : undefined} rel={isExternalStart ? "noreferrer" : undefined}>
                Начать
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
            <div className="space-y-5 sm:space-y-6">
              {/* Заголовок */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.15] tracking-tight">
                Случайные встречи с{" "}
                <span className="text-primary">неслучайными людьми</span>
              </h1>

              {/* Подзаголовок */}
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                <strong className="text-foreground font-semibold">Naura Meets</strong> — сервис для встреч внутри сообществ и по интересам.
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
                Расширяй круг общения, находи своих, получай новые идеи через регулярные встречи с интересными людьми.
              </p>

              {/* CTA-блок */}
              <div className="flex flex-col gap-4 pt-2">
                <Button size="lg" className="text-base px-8 h-12 sm:h-14 w-full sm:w-auto" asChild>
                  <a href={startMeetingsHref} target={isExternalStart ? "_blank" : undefined} rel={isExternalStart ? "noreferrer" : undefined}>
                    Начать встречи
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </Button>
                <a href="#for-communities" className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors text-center sm:text-left">
                  Подключить для сообщества →
                </a>
              </div>
            </div>

            {/* Визуал: Скриншот Mini App */}
            <div className="relative lg:pl-8 mt-4 lg:mt-0">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl opacity-60" />
              <Card className="relative border-2 bg-card/80 backdrop-blur overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] w-full bg-muted/30 flex items-center justify-center">
                    <img src="/placeholder.svg" alt="Naura Meets — Mini App" className="w-full h-full object-cover opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ========== БЛОК 1: Как устроены встречи ========== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-muted/30 scroll-mt-16 sm:scroll-mt-20" id="for-participants">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">Как устроены встречи</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Naura meets — формат регулярных встреч с новыми людьми.
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              Каждую неделю ты решаешь, участвовать или пропустить. Если участвуешь — мы подбираем пару и даём контекст, чтобы разговор не начинался с нуля.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <Card className="border-2 bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                  <FileText className="w-6 sm:w-7 h-6 sm:h-7 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Контекст до встречи</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                  Видишь анкету собеседника: чем занимается, что ищет, чем может помочь
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                  <Clock className="w-6 sm:w-7 h-6 sm:h-7 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Ритм без давления</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                  Участвуешь когда удобно — пропускаешь раунд, если не готов
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300 sm:col-span-2 md:col-span-1">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                  <ShieldCheck className="w-6 sm:w-7 h-6 sm:h-7 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Защита от пустых встреч</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                  Если не связались — подберём новую пару. После встречи — фидбек, который учитываем дальше
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ========== БЛОК 2: Зачем встречаться? ========== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">Зачем встречаться?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                title: "Выйти за пределы своего круга",
                desc: "Познакомься с людьми, с которыми обычно не пересекаешься",
              },
              {
                title: "Узнать, как другие решают похожие задачи",
                desc: "Обменяйся опытом с теми, кто проходит через то же самое",
              },
              {
                title: "Найти своих в новой среде",
                desc: "Встреть людей из смежных сфер или с похожими интересами",
              },
              {
                title: "Разговоры, которые что-то меняют",
                desc: "Получи свежий взгляд, идеи и контакты, которые останутся после встречи",
              },
            ].map((item) => (
              <Card key={item.title} className="border bg-card/50 hover:bg-card hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="text-base sm:text-lg leading-snug">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm leading-relaxed">{item.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========== БЛОК 3: Как проходит неделя ========== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">Как проходит неделя</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[
              {
                title: "Суббота: решаешь",
                desc: "Получаешь приглашение на раунд — участвуешь или пропускаешь",
                icon: CalendarDays,
              },
              {
                title: "Понедельник: знакомишься",
                desc: "Видишь анкету собеседника, пишешь в Telegram, договариваешься о встрече",
                icon: Users,
              },
              {
                title: "Среда: если нужно — меняем",
                desc: "Не получилось связаться? Подберём новую пару на эту неделю",
                icon: RefreshCcw,
              },
              {
                title: "Суббота: делишься опытом",
                desc: "Отмечаешь, состоялась ли встреча, оцениваешь — учитываем в следующих раундах",
                icon: MessageCircle,
              },
            ].map((step, idx) => (
              <Card key={step.title} className="border-2 bg-card">
                <CardHeader className="flex flex-row items-start gap-3 sm:gap-4">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold text-base sm:text-lg">
                    {idx + 1}
                  </div>
                  <div className="flex-1 pt-0.5 sm:pt-1">
                    <CardTitle className="text-base sm:text-lg mb-1.5 sm:mb-2">{step.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{step.desc}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="pt-10 sm:pt-12 text-center">
            <Button size="lg" className="text-base px-8 sm:px-10 h-12 sm:h-14 w-full sm:w-auto" asChild>
              <a href={startMeetingsHref} target={isExternalStart ? "_blank" : undefined} rel={isExternalStart ? "noreferrer" : undefined}>
                Попробовать
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ========== БЛОК 4: Для владельцев сообществ (B2B) ========== */}
      <section id="for-communities" className="py-16 sm:py-24 px-4 sm:px-6 bg-background scroll-mt-16 sm:scroll-mt-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">Naura meets для вашего сообщества</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Участники знакомятся, новички быстрее включаются, активность растёт вместе с ценностью комьюнити — без вашего участия.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-start">
            <div className="space-y-4 sm:space-y-6">
              {/* Проблема */}
              <Card className="border-2">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="text-lg sm:text-xl">Проблема</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Участники приходят на события, но не знают друг друга. Новички теряются. Между встречами — тишина. Всё это съедает вовлечённость, и сообщество остаётся формальным.
                  </p>
                </CardContent>
              </Card>

              {/* Решение */}
              <Card className="border-2 border-primary/30 bg-primary/5">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="text-lg sm:text-xl">Решение</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Naura Meets запускает регулярные встречи 1-на-1 внутри вашего сообщества.
                    <br />
                    Люди знакомятся сами, вы получаете инструмент, который работает на автопилоте.
                  </p>
                </CardContent>
              </Card>

              {/* 3 карточки: что получает владелец */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  {
                    title: "Вовлечение на автомате",
                    desc: "Мэтчинг, уведомления, контроль встреч — всё работает без вас",
                    icon: Sparkles,
                  },
                  {
                    title: "Понятная картина активности",
                    desc: "Видите, кто участвует, сколько встреч состоялось, какой фидбек",
                    icon: CheckCircle2,
                  },
                  {
                    title: "Настройка под сообщество",
                    desc: "Формат встреч (онлайн/офлайн), частота раундов, доступ по группам",
                    icon: Users,
                  },
                ].map((item) => (
                  <Card key={item.title} className="border bg-muted/30">
                    <CardHeader className="pb-1 sm:pb-2">
                      <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2 sm:mb-3">
                        <item.icon className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
                      </div>
                      <CardTitle className="text-sm sm:text-base font-semibold">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-xs sm:text-sm">{item.desc}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Форма заявки */}
            <Card className="border-2">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">Оставить заявку</CardTitle>
                <CardDescription className="text-sm">
                  Заполни форму — мы ответим и поможем подключить встречи для вашего сообщества.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleLeadSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lead-name" className="text-sm">Имя</Label>
                      <Input
                        id="lead-name"
                        value={leadForm.name}
                        onChange={(e) => setLeadForm((s) => ({ ...s, name: e.target.value }))}
                        placeholder="Как к вам обращаться"
                        autoComplete="name"
                        className="h-11 sm:h-10 text-base sm:text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lead-community" className="text-sm">Сообщество</Label>
                      <Input
                        id="lead-community"
                        value={leadForm.community}
                        onChange={(e) => setLeadForm((s) => ({ ...s, community: e.target.value }))}
                        placeholder="Название / ссылка"
                        className="h-11 sm:h-10 text-base sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lead-contact" className="text-sm">Контакт</Label>
                    <Input
                      id="lead-contact"
                      value={leadForm.contact}
                      onChange={(e) => setLeadForm((s) => ({ ...s, contact: e.target.value }))}
                      placeholder="Telegram / email / телефон"
                      className="h-11 sm:h-10 text-base sm:text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lead-comment" className="text-sm">Комментарий</Label>
                    <Textarea
                      id="lead-comment"
                      value={leadForm.comment}
                      onChange={(e) => setLeadForm((s) => ({ ...s, comment: e.target.value }))}
                      placeholder="Коротко расскажите про формат и аудиторию"
                      rows={3}
                      className="text-base sm:text-sm"
                    />
                  </div>

                  <div className="pt-2">
                    <Button type="submit" size="lg" className="w-full h-12 sm:h-11 text-base">
                      Оставить заявку
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
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">Тарифы</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Для участников</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground text-sm sm:text-base">
                    <li>Участие в общей базе Naura — бесплатно</li>
                    <li>Встречи внутри сообществ — зависит от настроек сообщества</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Для сообществ</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground text-sm sm:text-base">
                    <li>Стоимость зависит от размера</li>
                    <li>Первый раунд — бесплатно</li>
                  </ul>
                  <a href="#for-communities" className="text-primary hover:underline text-sm mt-4 inline-block">
                    Обсудить условия →
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">Частые вопросы</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Для участников */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-base sm:text-lg">Для участников</h3>
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
                        className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                          openFaqId === faq.id ? "rotate-180" : ""
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
              <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-base sm:text-lg">Для владельцев</h3>
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
                        className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                          openFaqId === faq.id ? "rotate-180" : ""
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
                Сервис регулярных встреч 1-на-1
              </p>
            </div>

            {/* Центральный блок: Ссылки + Контакты */}
            <div>
              <h4 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Навигация</h4>
              <div className="space-y-2 text-sm mb-5 sm:mb-6">
                <a href="#for-participants" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Для участников
                </a>
                <a href="#for-communities" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Для сообществ
                </a>
                {showPricing && (
                  <a href="#pricing" className="block text-muted-foreground hover:text-foreground transition-colors">
                    Тарифы
                  </a>
                )}
              </div>
              <h4 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Контакты</h4>
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
              <h4 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Соцсети</h4>
              <div className="space-y-2 text-sm text-muted-foreground mb-5 sm:mb-6">
                <span className="block">Скоро</span>
              </div>
              <h4 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Документы</h4>
              <div className="space-y-2 text-sm">
                <a
                  href={CONFIG.LEGAL.PRIVACY_POLICY}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Политика конфиденциальности
                </a>
                <a
                  href={CONFIG.LEGAL.TERMS_OF_SERVICE}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Оферта
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
