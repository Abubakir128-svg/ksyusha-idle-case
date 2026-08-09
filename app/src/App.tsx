"use client";

import { useState } from "react";
import Arcade from "./Arcade";

const answers = [
  {
    label: "Работаю вообще-то",
    reply: "Система обнаружила попытку выглядеть занятой. Очень убедительно. Почти.",
  },
  {
    label: "У меня перерыв",
    reply: "Перерыв № 47 за последние десять минут зарегистрирован.",
  },
  {
    label: "Не твоё дело, сучка",
    reply: "Режим Ксюши подтверждён. Уровень агрессии штатный. Продолжаем.",
  },
] as const;

export default function Home() {
  const [stage, setStage] = useState(0);
  const [escapeReply, setEscapeReply] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [idleScore, setIdleScore] = useState(17);
  const [corrected, setCorrected] = useState(false);
  const [appealed, setAppealed] = useState(false);

  return (
    <main className={`case-file stage-${stage}`}>
      <div className="paper-noise" aria-hidden="true" />

      <header className="masthead">
        <div className="ministry">
          <span className="seal">М</span>
          <span>Министерство<br />подозрительной занятости</span>
        </div>
        <div className="case-meta">
          <span>Дело № 404-К</span>
          <span className="live-dot">наблюдение активно</span>
        </div>
      </header>

      {stage === 0 && (
        <section className="intro screen" aria-live="polite">
          <div className="warning-strip">Внимание · особо занятая гражданка · внимание · особо занятая гражданка</div>
          <p className="kicker">Официальная повестка для одной бездельницы</p>
          <h1>КСЮША,</h1>
          <h2>ТЕБЯ ВЫЗЫВАЮТ<br />НА ПРОВЕРКУ.</h2>
          <div className="intro-grid">
            <p className="intro-copy">
              Причина проверки: ты слишком уверенно делаешь вид, что работаешь.
              Да, мы знаем, что ты правда работаешь. <strong>Это ничего не меняет.</strong>
            </p>
            <div className="evidence-card">
              <span>Улика № 1</span>
              <b>Ты открыла этот сайт вместо того, чтобы работать.</b>
              <small>Шах и мат, бездельница.</small>
            </div>
          </div>
          <div className="intro-actions">
            <button className="main-button" onClick={() => setStage(1)}>Чего тебе, бурмалда? →</button>
            <button className="escape-button" onClick={() => setEscapeReply(true)}>Нет, я пойду работать</button>
          </div>
          {escapeReply && (
            <p className="escape-reply">Поздно. Сайт уже засёк, что ты отвлеклась от работы.</p>
          )}
          <div className="red-stamp intro-stamp">ПОДОЗРЕВАЕТСЯ<br />В БЕЗДЕЛИИ</div>
        </section>
      )}

      {stage === 1 && (
        <section className="quiz screen" aria-live="polite">
          <div className="step-line"><span>Этап 01</span><b>Допрос подозреваемой</b><span>1 / 3</span></div>
          <div className="quiz-layout">
            <div>
              <p className="kicker">Отвечай честно. Хотя бы попробуй.</p>
              <h2 className="question-title">Что ты делаешь<br />прямо сейчас?</h2>
            </div>
            <div className="answers">
              {answers.map((item, index) => (
                <button
                  key={item.label}
                  className={answer === item.reply ? "chosen" : ""}
                  onClick={() => setAnswer(item.reply)}
                >
                  <span>0{index + 1}</span>
                  <b>{item.label}</b>
                  <i>↗</i>
                </button>
              ))}
            </div>
          </div>
          {answer && (
            <div className="system-reply">
              <span>Ответ системы:</span>
              <p>{answer}</p>
              <button onClick={() => setStage(2)}>Показывай свой тест, бурмалда →</button>
            </div>
          )}
        </section>
      )}

      {stage === 2 && (
        <section className="meter-screen screen" aria-live="polite">
          <div className="step-line"><span>Этап 02</span><b>Самодиагностика</b><span>2 / 3</span></div>
          <p className="kicker">Сейчас выясним, насколько всё запущено</p>
          <h2 className="meter-title">На сколько процентов<br />ты бездельница?</h2>

          <div className="meter-box">
            <div className="score-row">
              <span>Твоя версия</span>
              <strong>{idleScore}%</strong>
            </div>
            <input
              aria-label="Процент бездельничества"
              type="range"
              min="0"
              max="100"
              value={idleScore}
              onChange={(event) => {
                setIdleScore(Number(event.target.value));
                setCorrected(false);
              }}
            />
            <div className="range-labels"><span>«Я работаю»</span><span>Ксюша</span></div>
            {!corrected ? (
              <button className="main-button compact" onClick={() => setCorrected(true)}>Зафиксировать честный ответ</button>
            ) : (
              <div className="correction">
                <span>Ошибка пользователя исправлена</span>
                <strong>99%</strong>
                <p>Оставшийся 1% ушёл на спор с бурмалдой.</p>
                <button onClick={() => setStage(3)}>Огласить приговор →</button>
              </div>
            )}
          </div>
        </section>
      )}

      {stage === 3 && (
        <section className={`verdict screen ${appealed ? "appeal-denied" : ""}`} aria-live="polite">
          <div className="step-line"><span>Этап 03</span><b>Окончательный акт</b><span>3 / 3</span></div>
          <div className="verdict-card">
            <div className="document-head">
              <span>Форма БЗДЛ-404</span>
              <span>Экземпляр единственный</span>
            </div>
            <p className="kicker">Результат независимой и совершенно честной проверки</p>
            <h2>АКТ О БЕЗДЕЛЬНИЧЕСТВЕ</h2>
            <div className="report-grid">
              <div><span>Подозреваемая</span><b>Ксюша</b></div>
              <div><span>Текущий статус</span><b>«Работает» — по её словам</b></div>
              <div><span>Уровень занятости</span><b>1%</b></div>
              <div><span>Уровень вредности</span><b>99%</b></div>
              <div className="wide"><span>Способность обозвать нормального человека бурмалдой</span><b>Критическая</b></div>
            </div>
            <div className="diagnosis">
              <span>Официальный диагноз</span>
              <strong>БЕЗДЕЛЬНИЦА<br /><i>КВАЛИФИЦИРОВАННАЯ</i></strong>
            </div>
            <div className="signature">
              <span>Автор проверки:</span>
              <b>та самая бурмалда</b>
            </div>
            {!appealed && <button className="appeal-button" onClick={() => setAppealed(true)}>Обжаловать этот бред</button>}
          </div>

          {appealed && (
            <div className="denied-overlay">
              <div className="denied-stamp">ОТКАЗАНО</div>
              <h3>Жалоба отклонена.</h3>
              <p>Причина: её подала бездельница.</p>
              <small>Можешь возвращаться к своей «работе». Или продолжить бездельничать официально.</small>
              <button className="archive-button" onClick={() => setStage(4)}>Ладно, показывай архив →</button>
            </div>
          )}
        </section>
      )}

      {stage === 4 && <Arcade onBack={() => { setAppealed(false); setStage(3); }} />}

      <footer className="case-footer">
        <span>Материалы дела сфабрикованы качественно</span>
        <span>Не является официальным документом. К сожалению.</span>
      </footer>
    </main>
  );
}
