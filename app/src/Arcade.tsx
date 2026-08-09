"use client";

import { useState, type CSSProperties } from "react";

type GameId = "break" | "clicker" | "excuses" | "tic" | "bingo" | "memory";

const games: Array<{ id: GameId; number: string; title: string; description: string; available: boolean }> = [
  { id: "break", number: "01", title: "Лови перерыв", description: "Поймай двенадцать законных перерывов, пока они не сбежали.", available: true },
  { id: "clicker", number: "02", title: "Кликер безделья", description: "Сто нажатий, которые точно не приблизят тебя к работе.", available: true },
  { id: "excuses", number: "03", title: "Колесо отмазок", description: "Министерство подберёт объяснение на любой случай.", available: true },
  { id: "tic", number: "04", title: "Ксюша против бурмалды", description: "Крестики-нолики. Проигравший признаёт очевидное.", available: true },
  { id: "bingo", number: "05", title: "Безделье-бинго", description: "Собери линию из подозрительно знакомых поступков.", available: true },
  { id: "memory", number: "06", title: "Память бездельницы", description: "Найди двенадцать пар в секретной картотеке. Тут уже придётся немного подумать.", available: true },
];

const breakTaunts = [
  "Один перерыв уже твой.", "Работа начинает нервничать.", "Слишком быстро для бездельницы.",
  "Четыре? Это уже система.", "Чай тоже считается.", "Половина рабочего дня спасена.",
  "Бурмалда ведёт протокол.", "Начальство ничего не видело.", "Ещё немного наглости.",
  "Десятый перерыв — юбилейный.", "Почти официально.", "Все перерывы конфискованы!",
];

const excuses = [
  "Я мысленно уже всё сделала.",
  "Компьютер почувствовал моё выгорание.",
  "Ждала вдохновения. Оно тоже опоздало.",
  "Это не прокрастинация, а стратегическая пауза.",
  "Сначала жизненно необходимо было сделать чай.",
  "Бурмалда отвлекает своими сайтами.",
  "Задача не выглядела достаточно срочной.",
  "Я открыла файл. Это уже половина работы.",
  "Моя мотивация вышла на обед.",
  "Я экономила силы для более важного безделья.",
];

const bingoItems = [
  "Сделала чай вместо задачи",
  "Сказала: «Я занята»",
  "Залипла в телефон на пять минут (полчаса)",
  "Устала ещё до начала",
  "Обозвала бурмалду",
  "Открыла десять вкладок",
  "Ответила: «потом»",
  "Устроила микроперерыв",
  "Читает этот пункт вместо работы",
];

const memoryValues = [
  "ЧАЙ", "ПОТОМ", "ОЙ", "ОТДЫХ", "БУРМАЛДА", "РАБОТА?", "СОН", "КОТИК", "ПЕРЕРЫВ", "СКУКА", "ОТМАЗКА", "КСЮША",
  "РАБОТА?", "ОТДЫХ", "СКУКА", "ЧАЙ", "КСЮША", "ОЙ", "ПЕРЕРЫВ", "СОН", "БУРМАЛДА", "ОТМАЗКА", "КОТИК", "ПОТОМ",
];

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

type TicCell = "К" | "Б" | null;

function winner(board: TicCell[]) {
  for (const line of winningLines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

function findTicMove(board: TicCell[], mark: "К" | "Б") {
  for (let index = 0; index < board.length; index += 1) {
    if (board[index]) continue;
    const attempt = [...board];
    attempt[index] = mark;
    if (winner(attempt) === mark) return index;
  }
  return -1;
}

function burmaldaMove(board: TicCell[]) {
  const win = findTicMove(board, "Б");
  if (win >= 0) return win;
  const block = findTicMove(board, "К");
  if (block >= 0) return block;
  if (!board[4]) return 4;
  for (const index of [0, 8, 2, 6, 1, 3, 5, 7]) if (!board[index]) return index;
  return -1;
}

export default function Arcade({ onBack }: { onBack: () => void }) {
  const [active, setActive] = useState<GameId | null>(null);
  const [completed, setCompleted] = useState<GameId[]>([]);
  const [breakStarted, setBreakStarted] = useState(false);
  const [breakHits, setBreakHits] = useState(0);
  const [breakStartedAt, setBreakStartedAt] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [wheelSpins, setWheelSpins] = useState(0);
  const [excuseIndex, setExcuseIndex] = useState(0);
  const [wheelTurning, setWheelTurning] = useState(false);
  const [ticBoard, setTicBoard] = useState<TicCell[]>(Array(9).fill(null));
  const [ticResult, setTicResult] = useState("");
  const [bingoMarks, setBingoMarks] = useState<boolean[]>(Array(9).fill(false));
  const [bingoWon, setBingoWon] = useState(false);
  const [memoryOpen, setMemoryOpen] = useState<number[]>([]);
  const [memoryMatched, setMemoryMatched] = useState<number[]>([]);
  const [memoryBusy, setMemoryBusy] = useState(false);
  const [memoryMoves, setMemoryMoves] = useState(0);

  const complete = (id: GameId) => {
    setCompleted((items) => items.includes(id) ? items : [...items, id]);
  };

  const startBreak = () => {
    setBreakStarted(true);
    setBreakHits(0);
    setBreakTime(0);
    setBreakStartedAt(Date.now());
  };

  const hitBreak = () => {
    const next = breakHits + 1;
    setBreakHits(next);
    if (next === 12) {
      setBreakTime(Math.max(1, Math.round((Date.now() - breakStartedAt) / 1000)));
      complete("break");
    }
  };

  const clickWork = () => {
    const next = Math.min(100, clicks + 1);
    setClicks(next);
    if (next === 100) complete("clicker");
  };

  const clickerMessage = clicks < 10
    ? "Пока ещё можно сделать вид, что это случайность."
    : clicks < 25
      ? "Ты правда решила нажать сто раз?"
      : clicks < 50
        ? "Четверть пути. Работа окончательно забыта."
        : clicks < 80
          ? "Бурмалда не ожидала такой самоотдачи."
          : clicks < 100
            ? "Финиш близко. Достоинство — уже нет."
            : "Сто бесполезных нажатий. Идеальный результат.";

  const spinWheel = () => {
    if (wheelTurning) return;
    setWheelTurning(true);
    const nextSpins = wheelSpins + 1;
    window.setTimeout(() => {
      setExcuseIndex((excuseIndex + 3 + nextSpins) % excuses.length);
      setWheelSpins(nextSpins);
      setWheelTurning(false);
      if (nextSpins >= 5) complete("excuses");
    }, 700);
  };

  const playTic = (index: number) => {
    if (ticBoard[index] || ticResult) return;
    const next = [...ticBoard];
    next[index] = "К";
    if (winner(next) === "К") {
      setTicBoard(next);
      setTicResult("Ксюша победила бурмалду. Требует немедленного скриншота.");
      complete("tic");
      return;
    }
    if (next.every(Boolean)) {
      setTicBoard(next);
      setTicResult("Ничья. Никто не работает, все довольны.");
      complete("tic");
      return;
    }
    const move = burmaldaMove(next);
    if (move >= 0) next[move] = "Б";
    if (winner(next) === "Б") {
      setTicResult("Бурмалда победила. Министерство просит не ломать сайт от злости.");
      complete("tic");
    } else if (next.every(Boolean)) {
      setTicResult("Ничья. Никто не работает, все довольны.");
      complete("tic");
    }
    setTicBoard(next);
  };

  const resetTic = () => {
    setTicBoard(Array(9).fill(null));
    setTicResult("");
  };

  const toggleBingo = (index: number) => {
    const next = bingoMarks.map((marked, itemIndex) => itemIndex === index ? !marked : marked);
    setBingoMarks(next);
    const won = winningLines.some((line) => line.every((itemIndex) => next[itemIndex]));
    if (won) {
      setBingoWon(true);
      complete("bingo");
    }
  };

  const resetEverything = () => {
    setCompleted([]);
    setBreakStarted(false);
    setBreakHits(0);
    setBreakTime(0);
    setClicks(0);
    setWheelSpins(0);
    setExcuseIndex(0);
    setTicBoard(Array(9).fill(null));
    setTicResult("");
    setBingoMarks(Array(9).fill(false));
    setBingoWon(false);
    setMemoryOpen([]);
    setMemoryMatched([]);
    setMemoryBusy(false);
    setMemoryMoves(0);
  };

  const flipMemory = (index: number) => {
    if (memoryBusy || memoryOpen.includes(index) || memoryMatched.includes(index)) return;
    if (memoryOpen.length === 0) {
      setMemoryOpen([index]);
      return;
    }
    const first = memoryOpen[0];
    const pair = [first, index];
    setMemoryOpen(pair);
    setMemoryMoves((moves) => moves + 1);
    setMemoryBusy(true);
    window.setTimeout(() => {
      if (memoryValues[first] === memoryValues[index]) {
        const nextMatched = [...memoryMatched, first, index];
        setMemoryMatched(nextMatched);
        if (nextMatched.length === memoryValues.length) complete("memory");
      }
      setMemoryOpen([]);
      setMemoryBusy(false);
    }, 520);
  };

  const resetMemory = () => {
    setMemoryOpen([]);
    setMemoryMatched([]);
    setMemoryBusy(false);
    setMemoryMoves(0);
  };

  if (active === "break") {
    return (
      <section className="arcade game-screen" aria-live="polite">
        <GameTop number="01" title="Лови перерыв" onBack={() => setActive(null)} />
        <div className="game-copy">
          <p className="kicker">Испытание на профессиональное отвлечение</p>
          <h2>ПЕРЕРЫВЫ<br />РАЗБЕЖАЛИСЬ.</h2>
          <p>Поймай их все. Да, это теперь твоя главная рабочая задача.</p>
        </div>
        <div className={`break-field break-spot-${breakHits % 12}`}>
          {!breakStarted ? (
            <button className="game-start" onClick={startBreak}>Начать охоту за перерывами</button>
          ) : breakHits < 12 ? (
            <button className="break-target" onClick={hitBreak}>ПЕРЕРЫВ<br /><small>{breakHits + 1} / 12</small></button>
          ) : (
            <div className="game-result">
              <span>Протокол обновлён</span>
              <strong>12 / 12</strong>
              <p>Все перерывы пойманы за {breakTime} сек. Работы не выполнено: идеально.</p>
              <button onClick={() => setActive(null)}>Забрать печать →</button>
            </div>
          )}
          {breakStarted && breakHits < 12 && <p className="field-taunt">{breakHits ? breakTaunts[breakHits - 1] : "Он где-то здесь. Не зевай."}</p>}
        </div>
      </section>
    );
  }

  if (active === "clicker") {
    return (
      <section className="arcade game-screen" aria-live="polite">
        <GameTop number="02" title="Кликер безделья" onBack={() => setActive(null)} />
        <div className="clicker-layout">
          <div className="game-copy">
            <p className="kicker">Научно бесполезный эксперимент</p>
            <h2>НАЖМИ<br />100 РАЗ.</h2>
            <p>{clickerMessage}</p>
          </div>
          <div className="clicker-machine">
            <div className="click-progress"><i style={{ width: `${clicks}%` }} /></div>
            <button className={`mega-button ${clicks === 100 ? "finished" : ""}`} onClick={clickWork} disabled={clicks === 100}>
              <span>{clicks}</span>
              <small>{clicks === 100 ? "ГОТОВО" : "ЖМИ"}</small>
            </button>
            <p>Производительность: {100 - clicks}%</p>
            {clicks === 100 && <button className="collect-button" onClick={() => setActive(null)}>Забрать печать →</button>}
          </div>
        </div>
      </section>
    );
  }

  if (active === "excuses") {
    const wheelStyle = { "--wheel-turn": `${wheelSpins * 990 + excuseIndex * 36}deg` } as CSSProperties;
    return (
      <section className="arcade game-screen" aria-live="polite">
        <GameTop number="03" title="Колесо отмазок" onBack={() => setActive(null)} />
        <div className="wheel-layout">
          <div className="game-copy">
            <p className="kicker">Служба экстренных объяснений</p>
            <h2>КРУТИ.<br />НЕ КРАСНЕЙ.</h2>
            <p>Пять вращений — и у тебя будет официальная отмазка на любой случай.</p>
            <div className="excuse-paper">
              <span>Отмазка № {excuseIndex + 1}</span>
              <strong>{excuses[excuseIndex]}</strong>
            </div>
          </div>
          <div className="wheel-machine">
            <div className="wheel-pointer">▼</div>
            <div className={`excuse-wheel ${wheelTurning ? "turning" : ""}`} style={wheelStyle}>
              <b>НЕТ</b><b>ЧАЙ</b><b>ПОТОМ</b><b>ОЙ</b>
            </div>
            <button onClick={spinWheel} disabled={wheelTurning}>{wheelTurning ? "Министерство думает…" : "Крутить колесо"}</button>
            <p>Вращений: {wheelSpins} / 5</p>
            {wheelSpins >= 5 && <button className="collect-button" onClick={() => setActive(null)}>Забрать печать →</button>}
          </div>
        </div>
      </section>
    );
  }

  if (active === "tic") {
    return (
      <section className="arcade game-screen" aria-live="polite">
        <GameTop number="04" title="Ксюша против бурмалды" onBack={() => setActive(null)} />
        <div className="tic-layout">
          <div className="game-copy">
            <p className="kicker">Судебная дуэль без причины</p>
            <h2>КСЮША<br />ПРОТИВ Б.</h2>
            <p>Ты играешь за «К». Бурмалда — за «Б». Первый ход твой, потому что сайт якобы честный.</p>
            {ticResult && (
              <div className="tic-message">
                <strong>{ticResult}</strong>
                <div>
                  <button onClick={resetTic}>Реванш</button>
                  <button onClick={() => setActive(null)}>Забрать печать →</button>
                </div>
              </div>
            )}
          </div>
          <div className="tic-board" aria-label="Поле крестиков-ноликов">
            {ticBoard.map((cell, index) => (
              <button key={index} onClick={() => playTic(index)} disabled={Boolean(cell) || Boolean(ticResult)} aria-label={`Клетка ${index + 1}`}>
                {cell && <span className={cell === "К" ? "ksyusha-mark" : "burmalda-mark"}>{cell}</span>}
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (active === "bingo") {
    return (
      <section className="arcade game-screen" aria-live="polite">
        <GameTop number="05" title="Безделье-бинго" onBack={() => setActive(null)} />
        <div className="bingo-head">
          <div className="game-copy">
            <p className="kicker">Отмечай только то, что действительно было. Или всё подряд.</p>
            <h2>СОБЕРИ<br />ЛИНИЮ.</h2>
          </div>
          <p>Нажимай на знакомые ситуации. Горизонталь, вертикаль или диагональ выдаст последнюю печать.</p>
        </div>
        <div className={`bingo-grid ${bingoWon ? "has-bingo" : ""}`}>
          {bingoItems.map((item, index) => (
            <button key={item} className={bingoMarks[index] ? "marked" : ""} onClick={() => toggleBingo(index)}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <b>{item}</b>
            </button>
          ))}
        </div>
        {bingoWon && (
          <div className="bingo-result">
            <strong>БИНГО, БЕЗДЕЛЬНИЦА.</strong>
            <button onClick={() => setActive(null)}>Забрать последнюю печать →</button>
          </div>
        )}
      </section>
    );
  }

  if (active === "memory") {
    const memoryDone = memoryMatched.length === memoryValues.length;
    return (
      <section className="arcade game-screen" aria-live="polite">
        <GameTop number="06" title="Память бездельницы" onBack={() => setActive(null)} />
        <div className="memory-head">
          <div className="game-copy">
            <p className="kicker">Совершенно секретная картотека</p>
            <h2>НАЙДИ<br />12 ПАР.</h2>
          </div>
          <div className="memory-stats">
            <span>Найдено</span><strong>{memoryMatched.length / 2} / 12</strong>
            <span>Ходов</span><strong>{memoryMoves}</strong>
          </div>
        </div>
        <div className="memory-grid">
          {memoryValues.map((value, index) => {
            const visible = memoryOpen.includes(index) || memoryMatched.includes(index);
            return (
              <button key={`${value}-${index}`} className={`${visible ? "open" : ""} ${memoryMatched.includes(index) ? "matched" : ""}`} onClick={() => flipMemory(index)} disabled={memoryBusy && !visible}>
                <span>{visible ? value : "СЕКРЕТ"}</span>
                <small>{String(index + 1).padStart(2, "0")}</small>
              </button>
            );
          })}
        </div>
        {memoryDone && (
          <div className="memory-result">
            <div><span>Архив восстановлен</span><strong>ПАМЯТЬ ЕСТЬ. ЖЕЛАНИЯ РАБОТАТЬ НЕТ.</strong></div>
            <button onClick={() => setActive(null)}>Забрать печать →</button>
            <button onClick={resetMemory}>Перемешать воспоминания</button>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="arcade screen" aria-live="polite">
      <div className="arcade-head">
        <div>
          <p className="kicker">Секретное приложение к делу № 404-К</p>
          <h2>АРХИВ<br />БЕЗДЕЛЬНИЦЫ</h2>
        </div>
        <div className="archive-progress">
          <span>Печатей собрано</span>
          <strong>{completed.length} / 6</strong>
          <div><i style={{ width: `${completed.length * (100 / 6)}%` }} /></div>
        </div>
      </div>
      <p className="archive-lead">Раз уж жалобу не приняли, можешь бездельничать официально. Пройди шесть совершенно ненужных испытаний.</p>

      <div className="game-grid">
        {games.map((game) => {
          const done = completed.includes(game.id);
          return (
            <article key={game.id} className={`${done ? "done" : ""} ${!game.available ? "locked" : ""}`}>
              <div className="game-number">{game.number}</div>
              <h3>{game.title}</h3>
              <p>{game.description}</p>
              {done && <span className="mini-stamp">ПРОЙДЕНО</span>}
              <button disabled={!game.available} onClick={() => setActive(game.id)}>
                {game.available ? (done ? "Сыграть ещё раз →" : "Открыть дело →") : "Архивируется…"}
              </button>
            </article>
          );
        })}
      </div>
      {completed.length === 6 && (
        <div className="archive-award">
          <span>Все шесть печатей собраны</span>
          <div className="award-stamp">ОСОБАЯ<br />БЕЗДЕЛЬНИЦА</div>
          <h3>Ксюша прошла весь архив вместо того, чтобы работать.</h3>
          <p>Министерство снимает шляпу. Бурмалда делает вид, что не впечатлена.</p>
          <button onClick={resetEverything}>Начать круг безделья заново</button>
        </div>
      )}
      <button className="back-document" onClick={onBack}>← Вернуться к акту</button>
    </section>
  );
}

function GameTop({ number, title, onBack }: { number: string; title: string; onBack: () => void }) {
  return (
    <div className="game-top">
      <button onClick={onBack}>← В архив</button>
      <span>Игра {number} · {title}</span>
      <span>БЗДЛ-404</span>
    </div>
  );
}
