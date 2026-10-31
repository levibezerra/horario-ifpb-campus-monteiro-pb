import { useMemo, useState } from "react"
import {
  classCatalog,
  scheduleData,
  type DayName,
  type ScheduleLesson,
} from "./scheduleData"

type Mode = "class" | "teacher" | "room"
type IconName = "search" | "users" | "teacher" | "room" | "clock" | "book" | "pin" | "menu" | "x" | "chevron" | "info" | "mail" | "external"
type Group = { group: string caption: string items: string[] }
type TeacherProfile = { email?: string lattes?: string }

function Icon({ name, size = 20 }: { name: IconName size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5" />
      </>
    ),
    teacher: (
      <>
        <circle cx="8" cy="8" r="3" />
        <path d="M2 20a6 6 0 0 1 12 0M15 4h7v12h-5M18 8h2M18 11h2" />
      </>
    ),
    room: (
      <>
        <path d="M4 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17M2 21h20" />
        <path d="M8 7h2M8 11h2M8 15h2M14 7h1M14 11h1M14 15h1" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    book: (
      <>
        <path d="M4 19a2 2 0 0 1 2-2h14V4H6a2 2 0 0 0-2 2Z" />
        <path d="M4 6v13a2 2 0 0 0 2 2h14" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    x: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6M12 7h.01" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    external: (
      <>
        <path d="M14 4h6v6M20 4l-9 9" />
        <path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

const days: DayName[] = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]
const allPeriods = [
  { code: "M1", start: "07:00", end: "07:50" },
  { code: "M2", start: "07:50", end: "08:40" },
  { code: "INTERVALO", start: "08:40", end: "09:00", break: true },
  { code: "M3", start: "09:00", end: "09:50" },
  { code: "M4", start: "09:50", end: "10:40" },
  { code: "M5", start: "10:40", end: "11:30" },
  { code: "M6", start: "11:30", end: "12:20" },
  { code: "ALMOÇO", start: "12:20", end: "13:00", break: true },
  { code: "T1", start: "13:00", end: "13:50" },
  { code: "T2", start: "13:50", end: "14:40" },
  { code: "T3", start: "14:40", end: "15:30" },
  { code: "T4", start: "15:40", end: "16:30" },
  { code: "T5", start: "16:30", end: "17:20" },
  { code: "T6", start: "17:20", end: "18:10" },
  { code: "N1", start: "18:30", end: "19:20" },
  { code: "N2", start: "19:20", end: "20:10" },
  { code: "JANTAR", start: "20:10", end: "20:30", break: true },
  { code: "N3", start: "20:30", end: "21:20" },
  { code: "N4", start: "21:20", end: "22:10" },
]

const classGroups: Group[] = [
  {
    group: "Técnico em Edificações",
    caption: "Integrado",
    items: classCatalog.slice(0, 4) as string[],
  },
  {
    group: "Técnico em Informática",
    caption: "Integrado",
    items: classCatalog.slice(4, 10) as string[],
  },
  {
    group: "Instrumento Musical",
    caption: "Integrado",
    items: classCatalog.slice(10, 15) as string[],
  },
  {
    group: "TCE",
    caption: "Curso superior",
    items: classCatalog.slice(15, 17) as string[],
  },
  {
    group: "Análise e Desenvolvimento de Sistemas",
    caption: "Curso superior",
    items: classCatalog.slice(17, 23) as string[],
  },
  {
    group: "Engenharia Civil",
    caption: "Curso superior",
    items: classCatalog.slice(23) as string[],
  },
]

const teachers = [
  ...new Set(scheduleData.map((lesson) => lesson.teacher)),
].sort((a, b) => a.localeCompare(b, "pt-BR"))
const teacherGroups: Group[] = [
  {
    group: "A–F",
    caption: "Docentes da fonte",
    items: teachers.filter((name) => /^[A-FÁÀÂÃÉÊ]/i.test(name)),
  },
  {
    group: "G–M",
    caption: "Docentes da fonte",
    items: teachers.filter((name) => /^[G-MÍ]/i.test(name)),
  },
  {
    group: "N–Z",
    caption: "Docentes da fonte",
    items: teachers.filter((name) => /^[N-ZÓÔÕÚ]/i.test(name)),
  },
]

const teacherProfiles: Record<string, TeacherProfile> = {
  "João Igor": {
    email: "joao.rocha@ifpb.edu.br",
  },

  GILDO: {
    email: "gildo.dantas@ifpb.edu.br",
  },

  PAULO: {
    email: "paulo.pereira@ifpb.edu.br",
  },
}

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

function overlaps(lesson: ScheduleLesson, start: string, end: string) {
  return (
    toMinutes(lesson.start) < toMinutes(end) &&
    toMinutes(lesson.end) > toMinutes(start)
  )
}

function toneFor(subject: string) {
  const tones = [
    "mint",
    "peach",
    "lime",
    "lilac",
    "rose",
    "blue",
    "yellow",
    "sky",
  ]
  const hash = [...subject].reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  )
  return tones[hash % tones.length]
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
}

function getBreakTitle(start: string) {
  switch (start) {
    case "08:40":
      return "Intervalo para o lanche"
    case "12:20":
      return "Pausa para o almoco"
    case "20:10":
      return "Pausa para o jantar"
    default:
      return "Intervalo"
  }
}

function Logo() {
  return (
    <div className="logo">
      <div className="logo-grid" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, index) => (
          <i key={index} />
        ))}
      </div>
      <div>
        <strong>
          IFPB <span>·</span> Campus Monteiro
        </strong>
        <small>Horário acadêmico 2026.2</small>
      </div>
    </div>
  )
}

function ModeButton({
  value,
  mode,
  icon,
  label,
  onClick,
}: {
  value: Mode
  mode: Mode
  icon: IconName
  label: string
  onClick: () => void
}) {
  return (
    <button
      className={value === mode ? "mode active" : "mode"}
      onClick={onClick}
    >
      <Icon name={icon} size={18} />
      <span>{label}</span>
    </button>
  )
}

export default function App() {
  const [mode, setMode] = useState<Mode>("class")
  const [selected, setSelected] = useState("1º Ano Informática A")
  const [query, setQuery] = useState("")
  const [panelOpen, setPanelOpen] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<ScheduleLesson | null>(
    null,
  )

  const groups =
    mode === "class" ? classGroups : mode === "teacher" ? teacherGroups : []
  const filteredGroups = useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) =>
            item
              .toLocaleLowerCase("pt-BR")
              .includes(query.toLocaleLowerCase("pt-BR")),
          ),
        }))
        .filter((group) => group.items.length),
    [groups, query],
  )

  const visibleLessons = useMemo(() => {
    if (mode === "class")
      return scheduleData.filter((lesson) => lesson.className === selected)
    if (mode === "teacher")
      return scheduleData.filter((lesson) => lesson.teacher === selected)
    return []
  }, [mode, selected])

  const periods = useMemo(() => {
    // Verifica se a grade possui horários ativos no turno da manhã ou tarde
    const hasDaytimeClasses = visibleLessons.some(
      (lesson) => toMinutes(lesson.start) < toMinutes("18:30"),
    )
    // Verifica se a grade possui horários ativos no turno da noite
    const hasNightClasses = visibleLessons.some(
      (lesson) => toMinutes(lesson.start) >= toMinutes("18:30"),
    )

    return allPeriods.filter((period) => {
      if (period.break) {
        // Intervalo da manhã (08:40) e almoço (12:20) só aparecem se houver aulas diurnas (manhã/tarde)
        if (period.start === "08:40" || period.start === "12:20") {
          return hasDaytimeClasses
        }
        // Intervalo da noite (20:10) só aparece se houver aulas à noite
        if (period.start === "20:10") {
          return hasNightClasses
        }
        return false
      }
      return visibleLessons.some((lesson) =>
        overlaps(lesson, period.start, period.end),
      )
    })
  }, [visibleLessons])

  const uniqueSubjects = new Set(visibleLessons.map((lesson) => lesson.subject))
    .size
  const uniqueClasses = new Set(
    visibleLessons.map((lesson) => lesson.className),
  ).size
  const teacherSubjects = [
    ...new Set(visibleLessons.map((lesson) => lesson.subject)),
  ].sort((a, b) => a.localeCompare(b, "pt-BR"))
  const teacherClasses = [
    ...new Set(visibleLessons.map((lesson) => lesson.className)),
  ].sort((a, b) => a.localeCompare(b, "pt-BR"))
  const teacherCourses = classGroups
    .filter((group) =>
      group.items.some((className) => teacherClasses.includes(className)),
    )
    .map((group) => group.group)
  const teacherProfile = teacherProfiles[selected] ?? {}
  const reviewCount = new Set(
    visibleLessons
      .filter((lesson) => lesson.needsReview)
      .map((lesson) => lesson.rawSubject),
  ).size
  const emptyDays = days.filter(
    (day) => !visibleLessons.some((lesson) => lesson.day === day),
  )
  const selectedCourse = groups.find((group) => group.items.includes(selected))
    ?.group

  function changeMode(next: Mode) {
    setMode(next)
    setSelected(
      next === "class"
        ? "1º Ano Informática A"
        : next === "teacher"
          ? teachers[0]
          : "Ambientes não informados",
    )
    setQuery("")
    setPanelOpen(false)
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <Logo />
        <div className="hero-copy">
          <span>CONSULTA ACADÊMICA</span>
          <strong>Encontre seu próximo horário.</strong>
        </div>
        <nav className="mode-switcher" aria-label="Modo de visualização">
          <ModeButton
            value="class"
            mode={mode}
            icon="users"
            label="Por turma"
            onClick={() => changeMode("class")}
          />
          <ModeButton
            value="teacher"
            mode={mode}
            icon="teacher"
            label="Por professor"
            onClick={() => changeMode("teacher")}
          />
          <ModeButton
            value="room"
            mode={mode}
            icon="room"
            label="Por ambiente"
            onClick={() => changeMode("room")}
          />
        </nav>
        <div className="header-status">
          <i />
          <span>Fonte atualizada</span>
          <small>grade de 21/10/2026</small>
        </div>
        <button
          className="mobile-filter"
          onClick={() => setPanelOpen(true)}
          aria-label="Abrir filtros"
        >
          <Icon name="menu" />
        </button>
      </header>

      <div className="workspace">
        {panelOpen && (
          <button
            className="overlay"
            onClick={() => setPanelOpen(false)}
            aria-label="Fechar filtros"
          />
        )}
        <aside className={panelOpen ? "filter-panel open" : "filter-panel"}>
          <div className="filter-heading">
            <div>
              <p>CONSULTAR POR</p>
              <h2>
                {mode === "class"
                  ? "Turmas"
                  : mode === "teacher"
                    ? "Professores"
                    : "Ambientes"}
              </h2>
            </div>
            <button onClick={() => setPanelOpen(false)} aria-label="Fechar">
              <Icon name="x" />
            </button>
          </div>
          {mode !== "room" ? (
            <>
              <label className="search-field">
                <Icon name="search" size={18} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={`Buscar ${
                    mode === "class" ? "turma" : "professor"
                  }...`}
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    aria-label="Limpar busca"
                  >
                    <Icon name="x" size={16} />
                  </button>
                )}
              </label>
              <div className="result-count">
                <span>
                  {filteredGroups.reduce(
                    (total, group) => total + group.items.length,
                    0,
                  )}{" "}
                  resultados
                </span>
                {query && (
                  <button onClick={() => setQuery("")}>Limpar filtro</button>
                )}
              </div>
              <div className="group-list">
                {filteredGroups.map((group) => (
                  <section key={group.group}>
                    <div className="group-title">
                      <div>
                        <strong>{group.group}</strong>
                        <small>{group.caption}</small>
                      </div>
                      <span>{group.items.length}</span>
                    </div>
                    {group.items.map((item) => (
                      <button
                        key={item}
                        className={
                          item === selected
                            ? "filter-item selected"
                            : "filter-item"
                        }
                        onClick={() => {
                          setSelected(item)
                          setPanelOpen(false)
                        }}
                      >
                        {mode === "teacher" ? (
                          <span className="avatar">{initials(item)}</span>
                        ) : (
                          <span className="radio">
                            <i />
                          </span>
                        )}
                        <span>
                          <strong>{item}</strong>
                          <small>
                            {mode === "class" ? group.caption : group.group}
                          </small>
                        </span>
                        {item === selected && <Icon name="chevron" size={17} />}
                      </button>
                    ))}
                  </section>
                ))}
                {!filteredGroups.length && (
                  <div className="no-results">
                    <Icon name="search" />
                    <strong>Nenhum resultado</strong>
                    <span>Tente outro termo de busca.</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="source-empty">
              <Icon name="room" size={26} />
              <strong>Ambientes não informados</strong>
              <span>
                O arquivo de origem não associa salas ou laboratórios às aulas.
                Nenhum ambiente foi criado para preencher essa ausência.
              </span>
            </div>
          )}
        </aside>

        <main className="schedule-area">
          <div className="mobile-selection">
            <span>
              {mode === "class"
                ? "Turma"
                : mode === "teacher"
                  ? "Professor"
                  : "Ambiente"}
            </span>
            <button onClick={() => setPanelOpen(true)}>
              {selected}
              <Icon name="chevron" size={17} />
            </button>
          </div>

          <div className="schedule-heading">
            <div>
              <p>
                {mode === "class"
                  ? "GRADE DA TURMA"
                  : mode === "teacher"
                    ? "GRADE DO PROFESSOR"
                    : "OCUPAÇÃO DO AMBIENTE"}
              </p>
              <h1>{selected}</h1>
              <span>
                {mode === "teacher"
                  ? "Horários e turmas da grade 2026.2"
                  : (selectedCourse ?? "Dados conforme arquivo fornecido")}{" "}
                {mode === "class" ? "· 2026.2" : ""}
              </span>
            </div>
            {mode !== "room" && (
              <div className="schedule-summary">
                <div>
                  <Icon name="clock" />
                  <span>
                    <strong>{visibleLessons.length}</strong>
                    <small>blocos na semana</small>
                  </span>
                </div>
                <div>
                  <Icon name="book" />
                  <span>
                    <strong>
                      {mode === "teacher" ? uniqueClasses : uniqueSubjects}
                    </strong>
                    <small>
                      {mode === "teacher" ? "turmas" : "disciplinas"}
                    </small>
                  </span>
                </div>
              </div>
            )}
          </div>

          {mode === "teacher" && (
            <section className="context-card teacher-profile">
              <div className="teacher-profile-header">
                <div className="teacher-profile-identity">
                  <p>PROFESSOR SELECIONADO</p>
                  <h2>{selected}</h2>
                  <span>Atuação registrada na grade acadêmica 2026.2</span>
                </div>
                <span
                  className="profile-avatar"
                  aria-label={`Iniciais de ${selected}`}
                >
                  {initials(selected)}
                </span>
              </div>
              <div className="teacher-profile-stats">
                <span>
                  <Icon name="users" size={18} />
                  <span>
                    <strong>{uniqueClasses}</strong>
                    <small>{uniqueClasses === 1 ? "turma" : "turmas"}</small>
                  </span>
                </span>
                <span>
                  <Icon name="book" size={18} />
                  <span>
                    <strong>{uniqueSubjects}</strong>
                    <small>
                      {uniqueSubjects === 1 ? "disciplina" : "disciplinas"}
                    </small>
                  </span>
                </span>
                <span>
                  <Icon name="clock" size={18} />
                  <span>
                    <strong>{visibleLessons.length}</strong>
                    <small>blocos semanais</small>
                  </span>
                </span>
              </div>
              <div className="teacher-profile-details">
                <div>
                  <small>DISCIPLINAS RELACIONADAS</small>
                  <div className="profile-tags">
                    {teacherSubjects.map((subject) => (
                      <span key={subject}>{subject}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <small>CURSOS COM AULAS NA GRADE</small>
                  <div className="profile-tags course-tags">
                    {teacherCourses.map((course) => (
                      <span key={course}>{course}</span>
                    ))}
                  </div>
                </div>
                <div className="teacher-classes">
                  <small>TURMAS</small>
                  <span>{teacherClasses.join(" · ")}</span>
                </div>
                <div className="teacher-contact-grid">
                  <div className="teacher-contact-item">
                    <span className="teacher-contact-icon">
                      <Icon name="mail" size={18} />
                    </span>
                    <span className="teacher-contact-copy">
                      <small>E-MAIL ACADÊMICO</small>
                      {teacherProfile.email ? (
                        <a href={`mailto:${teacherProfile.email}`}>
                          {teacherProfile.email}
                        </a>
                      ) : (
                        <span>E-mail não informado</span>
                      )}
                    </span>
                  </div>
                  <div className="teacher-contact-item">
                    <span className="teacher-contact-icon">
                      <Icon name="external" size={18} />
                    </span>
                    <span className="teacher-contact-copy">
                      <small>CURRÍCULO LATTES</small>
                      {teacherProfile.lattes ? (
                        <a
                          href={teacherProfile.lattes}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Acessar Currículo Lattes
                        </a>
                      ) : (
                        <span>Currículo Lattes não informado</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {mode === "room" ? (
            <section className="context-card room-profile unavailable">
              <span className="room-icon">
                <Icon name="room" size={25} />
              </span>
              <div>
                <p>DADO NÃO DISPONÍVEL</p>
                <h2>Ambientes não constam no arquivo</h2>
                <span>
                  A consulta foi preservada, mas a grade não inventa salas ou
                  laboratórios ausentes na fonte.
                </span>
              </div>
            </section>
          ) : (
            <>
              {reviewCount > 0 && (
                <div className="review-notice">
                  <Icon name="info" size={17} />
                  <span>
                    <strong>
                      {reviewCount}{" "}
                      {reviewCount === 1 ? "sigla precisa" : "siglas precisam"}{" "}
                      de revisão.
                    </strong>{" "}
                    O texto original foi mantido para evitar uma expansão
                    incorreta.
                  </span>
                </div>
              )}
              {emptyDays.length > 0 && (
                <div className="empty-days-notice">
                  <Icon name="info" size={16} />
                  <span>
                    Sem aula cadastrada em:{" "}
                    <strong>{emptyDays.join(", ")}</strong>.
                  </span>
                </div>
              )}
              <div className="grid-help">
                <Icon name="info" size={16} />
                <span>Selecione uma aula para ver seus detalhes.</span>
                <span className="legend">
                  <i className="occupied" />
                  Aula <i className="break-legend" />
                  Intervalo <i className="free" />
                  Sem aula
                </span>
              </div>

              <div className="schedule-scroll">
                <div
                  className="schedule-grid"
                  role="table"
                  aria-label={`Grade semanal de ${selected}`}
                >
                  <div className="grid-header time-header" role="columnheader">
                    <Icon name="clock" size={17} />
                    <span>Horário</span>
                  </div>
                  {days.map((day) => (
                    <div className="grid-header" role="columnheader" key={day}>
                      {day}
                    </div>
                  ))}
                  {periods.map((period) => (
                    <div className="schedule-row" role="row" key={period.code}>
                      <div
                        className={
                          period.break ? "time-cell break-time" : "time-cell"
                        }
                        role="rowheader"
                      >
                        <strong>{period.code}</strong>
                        <span>
                          {period.start}–{period.end}
                        </span>
                      </div>
                      {days.map((day) => {
                        if (period.break)
                          return (
                            <div
                              className="grid-cell break-cell"
                              role="cell"
                              key={`${period.code}-${day}`}
                            >
                              <div className="break-block">
                                <Icon name="clock" size={15} />
                                <strong>{getBreakTitle(period.start)}</strong>
                                <span>
                                  {period.start}–{period.end}
                                </span>
                              </div>
                            </div>
                          )
                        const lessons = visibleLessons.filter(
                          (lesson) =>
                            lesson.day === day &&
                            overlaps(lesson, period.start, period.end),
                        )
                        return (
                          <div
                            className="grid-cell"
                            role="cell"
                            key={`${period.code}-${day}`}
                          >
                            {lessons.length ? (
                              lessons.map((lesson) => (
                                <button
                                  className={`lesson-block ${toneFor(lesson.subject)}`}
                                  onClick={() => setSelectedLesson(lesson)}
                                  key={`${lesson.className}-${lesson.day}-${lesson.start}-${lesson.subject}`}
                                >
                                  <strong>{lesson.subject}</strong>
                                  <span>{lesson.teacher}</span>
                                  <small>
                                    <Icon
                                      name={
                                        mode === "teacher" ? "users" : "clock"
                                      }
                                      size={13}
                                    />
                                    {mode === "teacher"
                                      ? lesson.className
                                      : `${period.start}–${period.end}`}
                                  </small>
                                  {lesson.needsReview && (
                                    <em>Sigla em revisão</em>
                                  )}
                                </button>
                              ))
                            ) : (
                              <div className="free-slot">
                                <span>Sem aula cadastrada</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {selectedLesson && (
        <div
          className="modal-layer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lesson-title"
        >
          <button
            className="modal-overlay"
            onClick={() => setSelectedLesson(null)}
            aria-label="Fechar detalhes"
          />
          <section className="lesson-modal">
            <div className="modal-top">
              <span>
                <Icon name="book" />
              </span>
              <button
                onClick={() => setSelectedLesson(null)}
                aria-label="Fechar"
              >
                <Icon name="x" />
              </button>
            </div>
            <p>DETALHES DA AULA</p>
            <h2 id="lesson-title">{selectedLesson.subject}</h2>
            {selectedLesson.needsReview && (
              <div className="modal-review">
                Nome original “{selectedLesson.rawSubject}” mantido para
                revisão.
              </div>
            )}
            <div className="details">
              <div>
                <Icon name="teacher" />
                <span>
                  <small>Professor</small>
                  <strong>{selectedLesson.teacher}</strong>
                </span>
              </div>
              <div>
                <Icon name="users" />
                <span>
                  <small>Turma</small>
                  <strong>{selectedLesson.className}</strong>
                </span>
              </div>
              <div>
                <Icon name="book" />
                <span>
                  <small>Dia</small>
                  <strong>{selectedLesson.day}</strong>
                </span>
              </div>
              <div>
                <Icon name="clock" />
                <span>
                  <small>Horário</small>
                  <strong>
                    {selectedLesson.start}–{selectedLesson.end}
                  </strong>
                </span>
              </div>
            </div>
            <button
              className="modal-action"
              onClick={() => {
                setMode("teacher")
                setSelected(selectedLesson.teacher)
                setSelectedLesson(null)
              }}
            >
              Ver grade do professor <Icon name="chevron" size={17} />
            </button>
          </section>
        </div>
      )}
    </div>
  )
}
