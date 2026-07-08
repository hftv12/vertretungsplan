import { MutableRef, useCallback, useEffect, useId, useRef, useState } from "preact/hooks";
import { createPortal } from "preact/compat";
import { useAutoAnimate } from '@formkit/auto-animate/preact';

import Placeholder from "./placeholder";
import { CheckButton, Select } from "./settingshelper";

//import serializeEvent from "../util/event_helper";

import { EyeIcon, EyeOffIcon, RefreshIcon, ImportantIcon, FilterIcon, PencilIcon, HelpIcon, ExternalLinkIcon } from "./icons";
// @ts-ignore
import plink from "../assets/placeholder.gif";
// import dsbIcon from "/favicons/dsb_simplistic192.png";

function SkeletonCard(props: { type: "list" | "card" | "exam" | "event" | "header" }) {
  if (props.type === "header") {
    return (
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div class="skeleton-shimmer" style={{ width: '140px', height: '42px', borderRadius: 'var(--rounding-sm)', border: '1px solid var(--brighter-color)' }} />
        <div class="skeleton-shimmer" style={{ width: '110px', height: '42px', borderRadius: 'var(--rounding-sm)', border: '1px solid var(--brighter-color)' }} />
      </div>
    );
  }

  if (props.type === "card") {
    return (
      <div class="new-s skeleton-shimmer" style={{ minHeight: "90px", border: "1px solid var(--brighter-color)", padding: "16px 20px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "10px" }}>
        <div style={{ width: "55%", height: "16px", backgroundColor: "var(--text-secondary)", borderRadius: "4px", opacity: 0.15 }} />
        <div style={{ width: "35%", height: "14px", backgroundColor: "var(--text-secondary)", borderRadius: "4px", opacity: 0.12 }} />
      </div>
    );
  }
  
  if (props.type === "exam") {
    return (
      <div class="exam skeleton-shimmer" style={{ padding: "16px", border: "1px solid var(--brighter-color)", minHeight: "100px", marginTop: "12px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
          <div style={{ width: "50%", height: "20px", backgroundColor: "var(--text-secondary)", borderRadius: "4px", opacity: 0.15 }} />
          <div style={{ width: "30%", height: "14px", backgroundColor: "var(--text-secondary)", borderRadius: "4px", opacity: 0.15 }} />
          <div style={{ width: "40%", height: "14px", backgroundColor: "var(--text-secondary)", borderRadius: "4px", opacity: 0.15 }} />
        </div>
      </div>
    );
  }

  if (props.type === "event") {
    return (
      <div class="event-card skeleton-shimmer" style={{ border: "1px solid var(--brighter-color)" }}>
        <div class="event-date" style={{ opacity: 0.5, borderRight: "1px solid var(--brighter-color)" }}>
          <div style={{ width: "30px", height: "24px", backgroundColor: "var(--text-secondary)", borderRadius: "4px", opacity: 0.2 }} />
          <div style={{ width: "40px", height: "14px", backgroundColor: "var(--text-secondary)", borderRadius: "4px", opacity: 0.15, marginTop: "4px" }} />
        </div>
        <div class="event-details" style={{ flex: 1 }}>
          <div style={{ width: "60%", height: "18px", backgroundColor: "var(--text-secondary)", borderRadius: "4px", opacity: 0.15 }} />
          <div style={{ width: "40%", height: "14px", backgroundColor: "var(--text-secondary)", borderRadius: "4px", opacity: 0.12, marginTop: "8px" }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: "12px", padding: "12px 16px", borderBottom: "1px solid var(--brighter-color)" }} class="skeleton-shimmer">
      <div style={{ width: "20%", height: "16px", backgroundColor: "var(--text-secondary)", borderRadius: "4px", opacity: 0.15 }} />
      <div style={{ width: "15%", height: "16px", backgroundColor: "var(--text-secondary)", borderRadius: "4px", opacity: 0.15 }} />
      <div style={{ width: "30%", height: "16px", backgroundColor: "var(--text-secondary)", borderRadius: "4px", opacity: 0.15 }} />
      <div style={{ width: "15%", height: "16px", backgroundColor: "var(--text-secondary)", borderRadius: "4px", opacity: 0.15 }} />
      <div style={{ width: "20%", height: "16px", backgroundColor: "var(--text-secondary)", borderRadius: "4px", opacity: 0.15 }} />
    </div>
  );
}

function AutoHeight(props: { children: preact.ComponentChildren }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">("auto");

  useEffect(() => {
    if (!contentRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(entry.contentRect.height);
      }
    });
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ height: height === "auto" ? "auto" : `${height}px`, transition: 'height 0.35s cubic-bezier(0.16, 1, 0.3, 1)', overflow: 'hidden' }}>
      <div ref={contentRef}>
        {props.children}
      </div>
    </div>
  );
}

export function HelpModal(props: { title: string, onClose: () => void, isClosing?: boolean, children: preact.ComponentChildren }) {
  const modalContent = (
    <div class={`modal-overlay ${props.isClosing ? 'closing' : ''}`} onClick={props.onClose}>
      <div class="modal-content" onClick={(e) => e.stopPropagation()}>
        <div class="modal-header">
          <h2>{props.title}</h2>
          <button class="modal-close" onClick={props.onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="modal-body">
          {props.children}
        </div>
      </div>
    </div>
  );
  
  if (typeof document !== "undefined") {
    return createPortal(modalContent, document.body);
  }
  return modalContent;
}

export function CornerHelpButton(props: { title: string, helpText: string | preact.ComponentChildren }) {
  const [showHelp, setShowHelp] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const closeHelp = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowHelp(false);
      setIsClosing(false);
    }, 240);
  };

  return (
    <>
      <button type="button" class="imgInput" style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10 }} onClick={() => setShowHelp(true)}>
        <HelpIcon width="20" height="20" />
      </button>
      {showHelp && (
        <HelpModal title={props.title + " - Info"} onClose={closeHelp} isClosing={isClosing}>
          {props.helpText}
        </HelpModal>
      )}
    </>
  );
}

//#region interfaces and enums
interface Substitution { // the thing to show in the table
  classes: string;
  hours: string;
  subject: string;
  usual_subject: string;
  room: string;
  replacement: string;
}

interface DayTimetable { // timetable data for a day
  date: string;
  day: string;
  messages: Array<string>;
  substitutions: Array<Substitution>;
}

interface Timetables { // the thing you get from the api
  last_modified: string;
  day_one: DayTimetable;
  day_two: DayTimetable;
}

interface CourseInfo { // uhhhh something important I think
  subject: string;
  subject_name: string;
  course: string;
  written?: boolean;
  color?: string;
  room?: string;
}

interface GradeInfo { // maybe this is important too? (I don't rember)
  gradeName: string;
  gradeLetter: string;
}

interface ExamDay {
    date: string,
    day: string,
    timeframe: string,
    exams: Array<Exam>,
}

interface Exam {
    course: string, // BI-GK3
    teacher: string, // Lug
    people: number, // 10
    max_people: number, // 18
    length: string, // 2-stündig
}

const week: String[] = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"] // don't question it

enum ParasitesHandler { // for settings
  NONE = "none",
  SHORTEN = "shorten",
  EXTERMINATE = "exterminate",
}
enum ExamVisibility {
  ALL = "all",
  SORTED = "sorted",
  NONE = "none",
}
enum SubstitutionType { // for new design
  MOVED,
  FREE,
  EXAM,
  SUBSTITUTION,
}

interface DSBSettings {
  [key: string]: any;
  easterEggs?: boolean,
  parasites?: ParasitesHandler,
  exams?: ExamVisibility,
  oldExams?: boolean,
  advancedCourses?: boolean,
  showCourses?: boolean,
  showCredits?: boolean,
  yellowPaint?: boolean,
  newDesign?: boolean,
  theme?: string,
  showOverview?: boolean,
}

enum FilterStage {
  ALL = "all",
  GRADE = "grade",
  COURSES = "courses",
}

function matchSubstitutionHour(hoursStr: string | undefined, hourNum: number): boolean {
  if (!hoursStr) return false;
  const hStr = hourNum.toString();
  const cleaned = hoursStr.replace(/\./g, '');
  const parts = cleaned.split(/[\s\-]+/).filter(Boolean);
  if (parts.includes(hStr)) return true;
  if (parts.length >= 2) {
    const start = parseInt(parts[0]);
    const end = parseInt(parts[parts.length - 1]);
    if (!isNaN(start) && !isNaN(end) && hourNum >= start && hourNum <= end) return true;
  }
  return false;
}

function isSubstitutionForCourse(s: Substitution, courseStr: string, courses: CourseInfo[], grade: GradeInfo): boolean {
  if (!s || !courseStr || !grade) return false;
  if (!s.classes.includes(grade.gradeName)) return false;
  if (grade.gradeLetter !== "" && !s.classes.includes(grade.gradeLetter)) return false;
  
  const courseInfo = courses ? courses.find(c => (c.subject + (c.course ? "-" + c.course : "")) === courseStr) : null;
  if (!courseInfo) {
    const subjName = courseStr.split("-")[0];
    let usual = s.usual_subject || "";
    if (usual[1] === " ") usual = usual[0] + usual.substring(2);
    let subj = s.subject || "";
    if (subj[1] === " ") subj = subj[0] + subj.substring(2);
    return usual.startsWith(subjName) || subj.startsWith(subjName);
  }

  const name = courseInfo.course !== "" ? courseInfo.subject + " " + courseInfo.course[0] + courseInfo.course[2] : courseInfo.subject;
  let usual_subject = s.usual_subject || "";
  if (usual_subject[1] === " ") usual_subject = usual_subject[0] + usual_subject.substring(2);
  let subject = s.subject || "";
  if (subject[1] === " ") subject = subject[0] + subject.substring(2);

  return usual_subject === name || subject === name || usual_subject === courseInfo.subject || subject === courseInfo.subject || usual_subject === courseInfo.subject_name;
}

function calcIsSchoolDayOver(weekType: string): boolean {
  const now = new Date();
  const hour = now.getHours();
  let isOver = hour > 16 || (hour === 16 && now.getMinutes() >= 15);
  try {
    const ttDataRaw = localStorage.getItem("PersonalTimetableData");
    if (ttDataRaw) {
      const ttData = JSON.parse(ttDataRaw);
      const days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
      const dayName = days[now.getDay()];
      const weekData = ttData[weekType || "A"];
      if (weekData) {
        const todayData = weekData[dayName];
        if (todayData) {
          let lastHour = 0;
          for (const hStr in todayData) {
            if (todayData[hStr]) {
              const hNum = parseInt(hStr);
              if (hNum > lastHour) lastHour = hNum;
            }
          }
          if (lastHour > 0) {
            const hourEndTimes: Record<number, string> = {
              1: "08:35", 2: "09:25", 3: "10:25", 4: "11:15",
              5: "12:15", 6: "13:05", 7: "13:55", 8: "14:45",
              9: "15:30", 10: "16:15"
            };
            const endStr = hourEndTimes[lastHour] || "16:15";
            const [endH, endM] = endStr.split(":").map(Number);
            isOver = (hour > endH) || (hour === endH && now.getMinutes() >= endM);
          }
        }
      }
    }
  } catch(e) {}
  return isOver;
}
//#endregion

//#region tl dumpsterfire
async function validateCredentials(): Promise<boolean> { // returns true if credentials are valid
  const user = localStorage.getItem("user");
  const key = localStorage.getItem("key"); // get credentials from localStorage
  if (user === undefined || key === undefined || user === null || key === null) { // credentials are not saved
    return false;
  }

  try {
    const data = await fetch(
      "https://kirillathome.uucode.com/api/v1/dsbdummy",
      { // request to the dummy api
        headers: {
          "user": user,
          "key": key,
        },
      },
    );
    if (data.status === 401 || data.status === 403) {
      console.log("forbidden or unauth")
      return false;
    }
    // if (!data.ok) { // not ok
    //   // console.log("failed at point 1")
    //   return false;
    // }
    return true; // ok
  } catch {
    // console.log("failed at point 2")
    console.log("this shit not work")
    return true; // not ok (but worse)
    // HEAR ME OUT: THE USER IS PROBABLY LOGGED IN, IF IT FAILED AT THIS POINT. NOT LIKE WE CARE ABOUT SECURITY AROUND HERE ANYWAY
  }
}

// function getRandomSubtitutions(): Array<Substitution> { // old debug code
//   const length = Math.floor((Math.random() * 4 + 1) * 3);
//   const array = [];

//   for (let i = 0; i < length; i++) {
//     const s = {} as Substitution;
//     const grades = ["6abc", "8d", "7a", "10b", "5c", "EF", "Q1", "Q2"];
//     s.classes = grades[Math.floor(Math.random() * grades.length)];
//     s.hours = (Math.floor(Math.random() * 5 + 1)).toString();
//     const subjects = ["E G4", "IF L1", "CH G1", "GE G1", "D G2", "SP G3"];
//     const subject = subjects[Math.floor(Math.random() * subjects.length)];
//     s.subject = subject;
//     s.usual_subject = subject;
//     s.room = Math.random() > 0.7 ? "PS1" : "H116";
//     s.replacement = "---";

//     array[i] = s;
//   }

//   return array;  
// }

// function getRandomMessages(): Array<string> {
//   const messages = ["Heute ist keine Schule?", "Warum nutzt du das Mock API?", "Tolle Sachen hier, ne?", "Funktionieren die Benachrichtigungen?", "Vergiss nicht dein Feedback direkt in den Schredder zu tun!", "Fun Fact: Für keine dieser Nachrichten habe ich ChatGPT verwendet!", "updater={(v: boolean) => updateSetting(\"notifications\", v)}", "Experimentell. Wird unvermeindlich kaputt gehen."];

//   return [messages[Math.floor(Math.random() * messages.length)]];
// }
//#endregion

//#region scuffed react gaming
function DSBLogin(props: { // login panel
  setLoggedIn: Function,
}) {
  const userInputRef = useRef(null);
  const keyInputRef = useRef(null); // the refs
  const [showError, setShowError] = useState(false); // show error
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = useCallback( // when the form is submitted
    (event: SubmitEvent) => {
      event.preventDefault(); // prevent default

      const user = userInputRef.current.value; // get values
      const key = keyInputRef.current.value;

      localStorage.setItem("user", user); // store values
      localStorage.setItem("key", key);

      validateCredentials().then((valid) => {
        setShowError(!valid); // error
        if (valid) { // no error
          props.setLoggedIn(true);
          window.dispatchEvent(new Event("dsb-login"));
        }
      });
    },
    [],
  );
  const toggleShowPassword = useCallback(() => {
    setShowPassword(!showPassword);
    return false;
  }, [showPassword]);

  return (
    <div class="default-div form-div"> 
      {showError && ( // I never did fix the error div clipping. oh well
        <div class="error-div"> 
          <b>
            <p>Fehler!</p>
            <p>Überprüfe bitte deine Daten!</p>
          </b>
        </div>
      )}
      <div>

        <h1>
          Login
        </h1>
        <form id="login-form" onSubmit={handleSubmit}>
          <div>
            <label for="user">DSB Nutzername:</label>
            <input
              type="text"
              name="user"
              id="user"
              ref={userInputRef}
              required
            />
          </div>
          <div id="password-wrapper">
            <label for="key" ref={keyInputRef}>DSB Passwort:</label>
            <div class="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="key"
                id="key"
                ref={keyInputRef}
                required
              />
              <button type="button" onClick={toggleShowPassword} class="imgInput" aria-label="Passwort anzeigen">
                {showPassword ? <EyeIcon width="20" height="20" /> : <EyeOffIcon width="20" height="20" />}
              </button>
            </div>
          </div>
          <div>
            <input type="submit" value="Einloggen" />
          </div>
        </form>
      </div>
    </div>
  );
}

function DSBRefreshButton(props: { // refresh button used for reloading substitutions (& exams sometimes)
  getData: Function,
  success: boolean | null,
  setSuccess: Function,
  className?: string,
  style?: any,
  iconSize?: string,
}) {
  const [iconStatus, setIconStatus] = useState<boolean | null>(props.success);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIconStatus(props.success);
    if (props.success !== null) {
      const timer = setTimeout(() => {
        setIconStatus(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [props.success]);

  const handleClick = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    props.setSuccess(null);
    const status = await props.getData();
    props.setSuccess(status);
    setIsLoading(false);
  }, [props, isLoading]);

  return (
    <button type="button" onClick={handleClick} class={props.className !== undefined ? props.className : "imgInput"} style={props.style} aria-label="Aktualisieren">
      <RefreshIcon status={iconStatus} loading={isLoading} width={props.iconSize || "20"} height={props.iconSize || "20"} />
    </button>
  );
}

function DSBTableToolbar(props: { // toolbar for switching day & filtering options
  setFilterStage: Function,
  changeCurrentDay: Function,
  getData: Function,
  timetable: Timetables,
  currentDay: DayTimetable,
  success: boolean,
  setSuccess: Function,
}) {
  const filterStageRef = useRef(null);
  const [showHelp, setShowHelp] = useState(false);
  const [isClosingHelp, setIsClosingHelp] = useState(false);

  const closeHelp = () => {
    setIsClosingHelp(true);
    setTimeout(() => {
      setShowHelp(false);
      setIsClosingHelp(false);
    }, 240);
  };

  const handleFilterChange = useCallback(() => {
    const filterStage = (filterStageRef.current as HTMLSelectElement).value;
    localStorage.setItem("filterStage", filterStage);
    props.setFilterStage(filterStage);
  }, [props]);

  const setDayOne = useCallback(() => {
    props.changeCurrentDay("day_one");
  }, [props]);
  const setDayTwo = useCallback(() => {
    props.changeCurrentDay("day_two");
  }, [props]);

  useEffect(() => {
    const filterStage = localStorage.getItem("filterStage");
    if (filterStage !== null && filterStage !== undefined) {
      (filterStageRef.current as HTMLSelectElement).value = filterStage;
      props.setFilterStage(filterStage);
    } else {
      if (filterStageRef.current) {
        (filterStageRef.current as HTMLSelectElement).value = FilterStage.GRADE;
      }
      props.setFilterStage(FilterStage.GRADE);
    }
  }, []);

  return (
    <div id="toolbar">
      <div style={{ display: 'flex', gap: '8px' }}>
        <DSBRefreshButton getData={props.getData} success={props.success} setSuccess={props.setSuccess} />
        <div style={{ position: 'relative' }}>
          <button type="button" class="imgInput" aria-label="Filtern" style={{ zIndex: 1 }}>
            <FilterIcon width="20" height="20" />
          </button>
          <select ref={filterStageRef} onChange={handleFilterChange} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 }}>
            <option value={FilterStage.ALL}>Alle anzeigen</option>
            <option value={FilterStage.GRADE}>Nur deine Stufe/Klasse</option>
            <option value={FilterStage.COURSES}>Nur deine Kurse/Fächer</option>
          </select>
        </div>
        <button type="button" class="imgInput" onClick={() => setShowHelp(true)}>
          <HelpIcon width="20" height="20" />
        </button>
        {showHelp && (
          <HelpModal title="Vertretungsplan - Info" onClose={closeHelp} isClosing={isClosingHelp}>
            Hier siehst du den Vertretungsplan. Mit dem Filter-Icon (Trichter) direkt daneben kannst du einstellen, ob du alle Vertretungen der Schule, nur die deiner Stufe oder nur die deiner individuell gewählten Kurse (siehe Kurswahl) sehen möchtest.
          </HelpModal>
        )}
      </div>
      <div>
        {props.timetable !== null && (
          <div class={props.currentDay.day === props.timetable.day_two.day ? "switched" : ""}>
            <input
              type="button"
              onClick={setDayOne}
              value={props.timetable.day_one.day.substring(0, 2)}
              class={props.currentDay.day === props.timetable.day_one.day
                ? "selected"
                : ""}
            />
            <input
              type="button"
              onClick={setDayTwo}
              value={props.timetable.day_two.day.substring(0, 2)}
              class={props.currentDay.day === props.timetable.day_two.day
                ? "selected"
                : ""}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function DSBSubstitution(props: Substitution & { idx?: number }) { // old design substitution
  return (
    <tr style={props.idx !== undefined ? { animation: `tileReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${Math.min(0.2, props.idx * 0.03)}s both` } : {}}>
      <th>{props.classes}</th>
      <th>{props.hours}</th>
      {/* <th>{props.usual_subject !== "&nbsp;" ? props.usual_subject : "\u21B3"}</th> */}
      <th>{props.usual_subject !== "&nbsp;" ? props.usual_subject : "---"}</th>
      <th>
        {props.room === "PS1" || props.room === "---"
          ? <i>entfällt</i> // colors?
          : props.subject}
      </th>
      <th>
        {props.room === "PS1" || props.room === "---" ? <i>---</i> : props.room}
      </th>
    </tr>
  );
}

function DSBNewSubstitution(props: Substitution & { idx?: number }) { // new design substitution
  const getType = useCallback((): SubstitutionType => {
    if (props.room === "PS1" || props.room === "---") {
      return SubstitutionType.FREE;
    }
    if (props.usual_subject === "&nbsp;") {
      return SubstitutionType.EXAM;
    }
    if (props.usual_subject === props.subject) {
      return SubstitutionType.MOVED;
    }
    return SubstitutionType.SUBSTITUTION;
  }, [props]);

  return (
    // <div class="new-s" style={`rotate: ${(Math.random() - 0.5) * 15}deg`}> // for that one screenshot
    <div class="new-s" style={props.idx !== undefined ? { animation: `tileReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${Math.min(0.2, props.idx * 0.03)}s both` } : {}}>
      {getType() === SubstitutionType.FREE ? // Ausfall
        <div>
          <div class="s-free">
            <p><b>Ausfall</b></p>
          </div>
          <div class="s-title-row">
            <h2>{props.classes} - {props.usual_subject}</h2>
            <div class="s-hours-badge">{props.hours} Std.</div>
          </div>
        </div> : getType() === SubstitutionType.EXAM ? // Klausur
        <div>
          <div class="s-exam">
            <p><b>Klausur</b></p>
            <p><i><b>{props.room}</b></i></p>
          </div>
          <div class="s-title-row">
            <h2>{props.classes} - {props.subject !== "&nbsp;" ? props.subject : "????"}</h2>
            <div class="s-hours-badge">{props.hours} Std.</div>
          </div>
        </div> : getType() === SubstitutionType.MOVED ? // Raumverschiebung
        <div>
          <div class="s-moved">
            <p><b>Raumwechsel</b></p>
            <p><i><b>{props.room}</b></i></p>
          </div>
          <div class="s-title-row">
            <h2>{props.classes} - {props.usual_subject}</h2>
            <div class="s-hours-badge">{props.hours} Std.</div>
          </div>
        </div> :  // Vertretung
        <div>
          <div class="s-subst">
            <p><b>Vertretung</b></p>
            <p><i><b>{props.room}</b></i></p>
          </div>
          <div class="s-title-row">
            <h2>{props.classes} - <del>{props.usual_subject}</del></h2>
            <div class="s-hours-badge">{props.hours} Std.</div>
          </div>
          <div class="s-grid">
            <label><i>Fach:</i></label>
            <label><b>{props.subject}</b></label>
          </div> 
          <div class="s-darker s-grid">
            {props.replacement !== "---" && (
              <label><i>Statt:</i></label>
            )}
            {props.replacement !== "---" && (
              <label><b>{props.replacement}</b></label>
            )}
          </div>
        </div>}
      </div>
  );
}

function DSBTable(props: { // the main feature of this website
  grade: GradeInfo,
  courses: Array<CourseInfo>,
  settings: DSBSettings,
}) {
  const [timetable, setTimetable] = useState(null as Timetables);
  const [currentDay, setCurrentDay] = useState(null as DayTimetable);
  const [filterStage, setFilterStage] = useState(FilterStage.GRADE);
  const [success, setSuccess] = useState(null);
  const [easterEggActive, setEasterEggActive] = useState(false);
  const [slideDir, setSlideDir] = useState<"left" | "right" | null>(null);
  const [slidePhase, setSlidePhase] = useState<"idle" | "exiting" | "entering">("idle");
  const [pendingDay, setPendingDay] = useState<string | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const handleEasterEgg = () => {
      setEasterEggActive(true);
      setTimeout(() => {
        setEasterEggActive(false);
      }, 10000);
    };
    window.addEventListener('easter-egg-start', handleEasterEgg);
    return () => window.removeEventListener('easter-egg-start', handleEasterEgg);
  }, []);

  const getData = useCallback(async (): Promise<boolean> => {
    // if (!!props.settings.mockAPI) { // old debug code
    //   console.log("Using the mock API!");
    //   const data = {} as Timetables;

    //   data.day_one = {} as DayTimetable;
    //   data.day_two = {} as DayTimetable;

    //   data.last_modified = "13.04.2027 02:54";
    //   data.day_one.date = "13.4.2027";
    //   data.day_one.day = "Samstag";
    //   data.day_one.messages = getRandomMessages();
    //   data.day_one.substitutions = getRandomSubtitutions();

    //   data.day_two.date = "14.4.2027";
    //   data.day_two.day = "Sonntag";
    //   data.day_two.messages = getRandomMessages();
    //   data.day_two.substitutions = getRandomSubtitutions();

    //   if (!!currentDay) {
    //     if (currentDay.day === data.day_two.day) {
    //       setCurrentDay(data.day_two);
    //     } else {
    //       setCurrentDay(data.day_one);
    //     }
    //   } else {
    //     setCurrentDay(data.day_one);
    //   }
    //   setTimetable(data);

    //   notifyTimetablesToSW();

    //   return true;
    // }


    const user = localStorage.getItem("user");
    const key = localStorage.getItem("key"); // get credentials from localStorage

    try {
      const data = await fetch("https://kirillathome.uucode.com/api/v1/dsb", { // request to the real api
        headers: {
          "user": user,
          "key": key,
        },
      });
      if (!data.ok) { // not ok
        return false;
      }

      const json = await data.json(); // yippie we got the data without errors!
      if (!!currentDay) {
        if (currentDay.day === json.day_two.day) {
          setCurrentDay(json.day_two);
        } else {
          setCurrentDay(json.day_one);
        }
      } else {
        const now = new Date();
        const todayDate = now.getDate();
        const todayMonth = now.getMonth() + 1;
        const todayYear = now.getFullYear();
        const isToday = (dString: string) => {
          const parts = dString.split('.');
          if (parts.length >= 3) {
            return parseInt(parts[0]) === todayDate && parseInt(parts[1]) === todayMonth && parseInt(parts[2]) === todayYear;
          }
          return false;
        };

        const isPastDay = (dString: string) => {
          const parts = dString.split('.');
          if (parts.length >= 3) {
            const dYear = parseInt(parts[2]);
            const dMonth = parseInt(parts[1]);
            const dDate = parseInt(parts[0]);
            if (dYear < todayYear) return true;
            if (dYear === todayYear && dMonth < todayMonth) return true;
            if (dYear === todayYear && dMonth === todayMonth && dDate < todayDate) return true;
          }
          return false;
        };

        const weekType = json.day_one && json.day_one.day && json.day_one.day.includes("B") ? "B" : "A";
        const isSchoolDayOver = calcIsSchoolDayOver(weekType);
        if (isToday(json.day_two.date)) {
          setCurrentDay(json.day_two);
        } else if (isToday(json.day_one.date) && isSchoolDayOver) {
          setCurrentDay(json.day_two);
        } else if (!isToday(json.day_one.date) && isPastDay(json.day_one.date)) {
          setCurrentDay(json.day_two);
        } else {
          setCurrentDay(json.day_one);
        }
      }
      setTimetable(json);
      return true; // ok
    } catch {

      return false; // not ok (but worse)
      // actually you don't have internet just but ok
    }
  }, [setTimetable, currentDay, props.settings]);

  const changeCurrentDay = useCallback((day: string) => {
    window.dispatchEvent(new Event('dsb-day-switch'));
    if (!timetable || !currentDay || slidePhase !== "idle") return;

    const targetDay = day === "day_one" ? timetable.day_one : timetable.day_two;
    if (targetDay.date === currentDay.date) return;

    setSlideDir(day === "day_two" ? "left" : "right");
    setSlidePhase("exiting");
    setPendingDay(day);
  }, [timetable, currentDay, slidePhase]);

  useEffect(() => {
    if (slidePhase === "exiting" && pendingDay && timetable) {
      const timer = setTimeout(() => {
        setCurrentDay(pendingDay === "day_one" ? timetable.day_one : timetable.day_two);
        setSlidePhase("entering");
        setPendingDay(null);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [slidePhase, pendingDay, timetable]);

  const getFilteredSubstitutions = useCallback((): Array<Substitution> => {
    if (easterEggActive) {
      if (props.courses && props.courses.length > 0) {
        return props.courses.map((c) => ({
          classes: props.grade.gradeName + (props.grade.gradeLetter || ""),
          hours: "1-10",
          subject: c.subject,
          usual_subject: c.subject_name || c.subject,
          room: "---",
          replacement: "---",
        }));
      } else {
        return [{
          classes: props.grade.gradeName + (props.grade.gradeLetter || ""),
          hours: "1-10",
          subject: "Alle",
          usual_subject: "Alle",
          room: "---",
          replacement: "---",
        }];
      }
    }
    if (currentDay === null) {
      return [];
    }
    return currentDay.substitutions.filter((s) => {
      switch (filterStage) {
        case FilterStage.ALL:
          return true;
        case FilterStage.GRADE:
          if (!s.classes.includes(props.grade.gradeName)) {
            return false;
          }
          if (props.grade.gradeLetter !== "") {
            if (!s.classes.includes(props.grade.gradeLetter)) { // sloppy code, should be improved
              return false;
            }
          }
          return true;
        case FilterStage.COURSES:
          if (!s.classes.includes(props.grade.gradeName)) {
            return false;
          }
          // console.log(`usual subject: ${s.usual_subject}`)
          for (const c of props.courses) {
            const name = c.course !== "" ? c.subject + " " + c.course[0] + c.course[2] : c.subject;
            let usual_subject = s.usual_subject;
            if (usual_subject[1] === " ") {
              usual_subject = usual_subject[0] + usual_subject.substring(2);
            }

            let subject = s.subject;
            if (subject[1] === " ") {
              subject = subject[0] + subject.substring(2);
            }
            // console.log(`subject_name: ${c.subject_name}, real_name: ${name}, edited name: ${usual_subject}`);
            if (usual_subject === name || subject === name) {
              // console.log("RETURNING TRUE");
              return true;
            }
          }
          return false;
      }
    });
  }, [currentDay, filterStage, props.grade, props.courses, easterEggActive]);

  const refreshData = useCallback(async (): Promise<boolean> => {
    setShowSkeleton(true);
    const status = await getData();
    await new Promise(r => setTimeout(r, 700));
    setShowSkeleton(false);
    return status;
  }, [getData]);

  const getDataAndUpdate = useCallback(async () => {
    const status = await refreshData();
    if (!!!status) {
      setSuccess(false);
    }
  }, [setSuccess, refreshData]);

  useEffect(() => { // load timetables on page load
    getDataAndUpdate();
  }, []);

  useEffect(() => {
    if (currentDay && currentDay.day) {
      window.dispatchEvent(new CustomEvent('dsb-week-switch', { detail: { week: currentDay.day } }));
    }
  }, [currentDay]);

  return (
    <div class="default-div" id="vertretungsplan">
      <AutoHeight>
      <DSBTableToolbar
        getData={refreshData}
        setFilterStage={setFilterStage}
        timetable={timetable}
        currentDay={currentDay}
        changeCurrentDay={changeCurrentDay}
        success={success}
        setSuccess={setSuccess}
      />
      {(currentDay === null || showSkeleton) && success !== false && (
        <div style={{ animation: 'tileReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
          <SkeletonCard type="header" />
          <h2 style={{ marginBottom: '12px' }}>Vertretungen</h2>
          {props.settings.newDesign === true ? (
            <div id="new-slist">
              <SkeletonCard type="card" />
              <SkeletonCard type="card" />
              <SkeletonCard type="card" />
            </div>
          ) : (
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
              <table style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>Klasse/Stufe</th>
                    <th>Stunde(n)</th>
                    <th>Kurs</th>
                    <th>Ersatz</th>
                    <th>Raum</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td colspan={5} style={{ padding: 0 }}><SkeletonCard type="list" /></td></tr>
                  <tr><td colspan={5} style={{ padding: 0 }}><SkeletonCard type="list" /></td></tr>
                  <tr><td colspan={5} style={{ padding: 0 }}><SkeletonCard type="list" /></td></tr>
                </tbody>
              </table>
            </div>
          )}
          <div style={{ marginTop: '20px' }}>
            <h2 style={{ marginBottom: '12px' }}>Nachrichten</h2>
            <SkeletonCard type="card" />
          </div>
        </div>
      )}
      {currentDay === null && success === false && (
        <div>
          <p><i>aktuell nicht verfügbar.</i></p>
        </div>
      )}
      {currentDay !== null && !showSkeleton && (
        <div 
          class={
            slidePhase === "exiting" && slideDir ? `slide-out-${slideDir}` :
            slidePhase === "entering" ? 'slide-in-up' : ''
          }
          onAnimationEnd={(e: any) => {
            if (e.target !== e.currentTarget) return;
            if (slidePhase === "entering") {
              setSlidePhase("idle");
              setSlideDir(null);
            }
          }}
        >
          <div key={"header-" + currentDay.date} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', animation: 'slideUpFade 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s both' }}>
            <div style={{ backgroundColor: 'var(--input-bg)', padding: '8px 16px', borderRadius: 'var(--rounding-sm)', border: '1px solid var(--brighter-color)' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem' }}>
                {currentDay.day.substring(0, 2)}, {currentDay.date}
              </h2>
            </div>
            {currentDay.day.includes("Woche") && (
              <div style={{ backgroundColor: 'var(--accent-light)', padding: '8px 16px', borderRadius: 'var(--rounding-sm)', border: '1px solid rgba(37, 99, 235, 0.15)' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--accent-color)' }}>
                  {currentDay.day.substring(currentDay.day.indexOf("Woche")).split(',')[0].trim()}
                </h2>
              </div>
            )}
          </div>

          {getFilteredSubstitutions().length == 0 && (
            <div key={"nichts-" + currentDay.date} style={{ animation: 'tileReveal 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.25s both', marginTop: '20px' }}>
              <h2 style={{ marginBottom: '12px' }}>Vertretungen</h2>
              <div class="new-s" style={{ minHeight: '90px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px 20px', textAlign: 'center' }}>
                <b style={{ fontSize: '1.05rem', color: 'var(--text-color)' }}>Keine Vertretungen vorhanden für den ausgewählten Filter</b>
              </div>
              {Math.random() > 0.975 && props.settings.easterEggs && ( // yeah this is the line for the easter egg if you want to add your own
                <div>

                  <Placeholder height="17.6px" />
                  {/* <div class="center"> */}
                    {/* <p>herzlichen glückwunsch, du hast das 1 in 40 easter egg bekommen.</p> */}
                    {/* <p><span class="pixelify">wenn man lange genug in das </span><i>nichts...</i><span class="pixelify"> starrt, starrt das </span><i>nichts...</i><span class="pixelify"> irgendwann zurück.</span></p> */}
                    {/* <Placeholder height="16px" /> */}
                    <div class="center">
                      <img src={plink.src} alt="plinK" width="280px" />
                    </div>
                  {/* </div> */}
                </div>
              )}
            </div>
          )}

          {getFilteredSubstitutions().length > 0 && props.settings.newDesign === false && (
            <div>
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Klasse/Stufe</th>
                      <th>Stunde(n)</th>
                      <th>Kurs</th>
                      <th>Ersatz</th>
                      <th>Raum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredSubstitutions().map((s, idx) => {
                      if (s.usual_subject.includes("AG")) {
                        switch (props.settings.parasites) {
                          case ParasitesHandler.NONE:
                            break;
                          case ParasitesHandler.SHORTEN:
                            return (
                              <DSBSubstitution
                                classes="*"
                                hours={s.hours}
                                subject={s.subject}
                                room={s.room}
                                usual_subject={s.usual_subject}
                                replacement={s.replacement}
                                idx={idx}
                              />
                            );
                          case ParasitesHandler.EXTERMINATE:
                            return null; // what parasite?
                        }
                      }
                      return (
                        <DSBSubstitution
                          classes={s.classes}
                          hours={s.hours}
                          subject={s.subject}
                          room={s.room}
                          usual_subject={s.usual_subject}
                          replacement={s.replacement}
                          idx={idx}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Placeholder height="50px" />
            </div>

          )}

          {getFilteredSubstitutions().length > 0 && props.settings.newDesign === true && (
            <div key={"subst-" + currentDay.date} style={{ animation: 'tileReveal 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.25s both', marginTop: '20px' }}>
              <h2 style={{ marginBottom: '12px' }}>Vertretungen</h2>
              <div id="new-slist">
                {/* <h1>NEUES DESIGN</h1> */}
                {getFilteredSubstitutions().map((s, idx) => {
                    if (s.usual_subject.includes("AG")) {
                      switch (props.settings.parasites) {
                        case ParasitesHandler.NONE:
                          break;
                        case ParasitesHandler.SHORTEN:
                          return (
                            <DSBNewSubstitution
                              classes="*"
                              hours={s.hours}
                              subject={s.subject}
                              room={s.room}
                              usual_subject={s.usual_subject}
                              replacement={s.replacement}
                              idx={idx}
                            />
                          );
                        case ParasitesHandler.EXTERMINATE:
                          return null; // what parasite?
                      }
                    }
                    return (
                      <DSBNewSubstitution
                        classes={s.classes}
                        hours={s.hours}
                        subject={s.subject}
                        room={s.room}
                        usual_subject={s.usual_subject}
                        replacement={s.replacement}
                        idx={idx}
                      />
                    );
                  })}
              </div>
              <Placeholder height="20px" />
            </div>
          )}

          <div key={"messages-" + currentDay.date} style={{ animation: 'tileReveal 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s both', marginTop: '20px' }}>
            <h2 style={{ marginBottom: '12px' }}>Nachrichten</h2>
            {(currentDay.messages[0] === "" || currentDay.messages.length < 1) ? (
              <div class="new-s" style={{ minHeight: '90px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px 20px', textAlign: 'center' }}>
                <b style={{ fontSize: '1.05rem', color: 'var(--text-color)' }}>Keine Nachrichten vorhanden</b>
              </div>
            ) : (
              <div class="new-s messages-tile" style={{ minHeight: 'auto', padding: '20px' }}>
                {currentDay.messages.map((m, idx) => {
                  if (m === "") return null;
                  return (
                    <div key={idx} class="message-item" style={idx < currentDay.messages.length - 1 ? { borderBottom: '1px solid var(--brighter-color)', paddingBottom: '12px', marginBottom: '12px' } : {}}>
                      <p style={{ color: 'var(--text-color)', margin: 0, fontSize: '0.95rem' }}>{m}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div key={"stand-" + currentDay.date} style={{ textAlign: 'center', marginTop: '24px', marginBottom: '16px', animation: 'tileReveal 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.15s both' }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}><i>Stand: {timetable.last_modified}</i></p>
          </div>
        </div>
      )}
      </AutoHeight>
    </div>
  );
}

function Course(props: { // the courses that you can add
  subject: string,
  subject_name: string,
  course: string,
  index: number,
  written?: boolean,
  color?: string,
  room?: string,

  advanced: boolean,

  courses: CourseInfo[],
  setCourses: Function,
}) {
  const subjectSelectID = useId();
  const courseSelectID = useId();
  const roomSelectID = useId();
  const writtenSelectID = useId();
  const colorSelectID = useId();

  const writtenRef = useRef();
  const colorRef = useRef();
  const roomRef = useRef();

  const handleButtonClick = useCallback(() => {
    const courses = props.courses.filter((_c, i) => { // inefficient implementation but fuck javascript ig
      return i !== props.index;
    });

    localStorage.setItem('courses', JSON.stringify(courses));
    props.setCourses(courses);
  }, [props]);

  const handleWrittenClick = useCallback(() => {
    if (!!writtenRef) {
      const courses = props.courses.filter(() => {return true;});
      // console.log(`updating from ${courses[props.index].written}`);
      courses[props.index].written = (writtenRef.current as HTMLInputElement).checked;
      // console.log(`to ${courses[props.index].written}`);

      localStorage.setItem('courses', JSON.stringify(courses));
      props.setCourses(courses);
    }

    
  }, [props, writtenRef])
  const handleColorChange = useCallback(() => {
    if (!!colorRef) {
      const courses = props.courses.filter(() => {return true;});
      courses[props.index].color = (colorRef.current as HTMLInputElement).value;

      localStorage.setItem('courses', JSON.stringify(courses));
      props.setCourses(courses);
    }
  }, [props, colorRef])

  const handleRoomChange = useCallback(() => {
    if (!!roomRef) {
      const courses = props.courses.filter(() => {return true;});
      courses[props.index].room = (roomRef.current as HTMLInputElement).value;

      localStorage.setItem('courses', JSON.stringify(courses));
      props.setCourses(courses);
    }
  }, [props, roomRef])

  return (
    <div class='course'>
      <div>
        {/* <Placeholder width="24px" /> */}
        <div></div>
        <h3>
          {!!props.subject ? props.subject + (!!props.course && props.course !== "" ? "-" + props.course : "") : "D:"}
        </h3>

        {!!props.written ? (<PencilIcon width="20" height="20" class="important-icon" title="Schriftliches Fach" />) : (<div></div>)}
      </div>
      <div>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
          <span id={subjectSelectID} style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', flex: 1, fontWeight: 600 }}>{!!props.subject_name ? props.subject_name : ":'("}</span>
          <span id={courseSelectID} style={{ flex: 1, fontWeight: 600 }}>{!!props.course ? props.course : "---"}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <label for={roomSelectID} style={{ margin: 0, width: '45px' }}>Raum:</label>
          <input id={roomSelectID} name={roomSelectID} type="text" placeholder="z.B. PS1" value={props.room || ""} ref={roomRef} onBlur={handleRoomChange} style={{ flex: 1, padding: '6px 10px' }} />
        </div>

        {props.advanced && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <label for={writtenSelectID} style={{ margin: 0, width: '80px' }}>Schriftlich:</label>
            <input id={writtenSelectID} name={writtenSelectID} type="checkbox" checked={!!props.written} ref={writtenRef} onClick={handleWrittenClick} />
          </div>
        )}

        {props.advanced && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <label for={colorSelectID} style={{ margin: 0, width: '45px' }}>Farbe:</label>
            <input id={colorSelectID} name={colorSelectID} list="course-color-list" type="color" value={!!props.color ? props.color : "#0958C6"} ref={colorRef} onChange={handleColorChange} style={{ margin: 0 }} />
          </div>
        )}

        <input type='button' value='Entfernen' onClick={handleButtonClick} style={{ marginTop: '8px' }} />
      </div>

    </div>
  );
}

function CourseAdder(props: { // thing for adding courses (yes it's seperate I'm not stupid)
  courses: CourseInfo[],
  setCourses: Function,
  subjectSelectRef: MutableRef<HTMLSelectElement>,
}) {
  
  const courseSelectRef = useRef(null);

  const handleSubmit = useCallback((event: SubmitEvent) => {
    event.preventDefault();
    
    const subject = (props.subjectSelectRef.current as HTMLSelectElement).value;
    let subject_name = subject;

    for (const opt of Array.from((props.subjectSelectRef.current as HTMLSelectElement).options)) { // I may have borked something but I won't check =)
      if (opt.value === subject) {

        subject_name = opt.text;
        break;
      }
    }
    const course = (courseSelectRef.current as HTMLSelectElement).value;

    const courses = props.courses.concat({
      subject: subject,
      subject_name: subject_name,
      course: course,
      written: true
    })
    
    localStorage.setItem('courses', JSON.stringify(courses));
    props.setCourses(courses);
  }, [props, props.subjectSelectRef, courseSelectRef]);

  return ( // yes I put all subjects in by hand
    <div class='course'>
        <h3>
          Neuer Kurs
        </h3>
      <form id='course-adder' onSubmit={handleSubmit}>
        <label for='subject-name'>Fach:</label>
        <select id='subject-name' ref={props.subjectSelectRef} required>
          <option value=''>Wähle ein Fach:</option>
          <hr />
          <optgroup label='MINT'>
            <option value='BI'>Biologie</option>
            <option value='CH'>Chemie</option>
            <option value='IF'>Informatik</option>
            <option value='M'>Mathe</option>
            <option value='PH'>Physik</option>
            <option value='PXM'>Pjk. Mathe</option>
          </optgroup>
          <optgroup label='Sprachen'>
            <option value='D'>Deutsch</option>
            <option value='E'>Englisch</option>
            <option value='L'>Latein</option>
            <option value='F'>Französisch</option>
            <option value='S0'>Spanisch (S0)</option>
            <option value='S9'>Spanisch (S9)</option>
          </optgroup>
          <optgroup label='Gesellschaftswissenschaften'>
            <option value='EK'>Erdkunde</option>
            <option value='GE'>Geschichte</option>
            <option value='PL'>Philosophie</option>
            <option value='ER'>Religion (Ev.)</option>
            <option value='KR'>Religion (Kath.)</option>
            <option value='SW'>Sozialwissenschaften</option>
          </optgroup>
          <optgroup label='der Rest'>
            <option value='IP'>IP</option>
            <option value='KU'>Kunst</option>
            <option value='LI'>Literatur</option>
            <option value='MU'>Musik</option>
            <option value='SP'>Sport</option>
          </optgroup>
        </select>

        <label for='course-id'>Kurs:</label>
        <select id='course-id' ref={courseSelectRef}>
          <option value='' selected>---</option>
          <option value='GK1'>GK1</option>
          <option value='GK2'>GK2</option>
          <option value='GK3'>GK3</option>
          <option value='GK4'>GK4</option>
          <option value='GK5'>GK5</option>
          <option value='LK1'>LK1</option>
          <option value='LK2'>LK2</option>
          <option value='LK3'>LK3</option>
          {/* <option value='LK4'>LK4</option> */}
          {/* <option value='PJK1'>PJK1</option> */}
        </select>

        <Placeholder height='26px' />
        <input type='submit' value='Hinzufügen' />
      </form>
      
    </div>
  );
}

function CourseList(props: { // thing for displaying your courses & the course adder
  grade: GradeInfo,
  setGrade: Function,
  courses: Array<CourseInfo>,
  setCourses: Function,
  subjectSelectRef: MutableRef<HTMLSelectElement>,
  settings: DSBSettings,
}) {
  const gradeNameRef = useRef(null);
  const gradeLetterRef = useRef(null);

  const [loadedData, setLoadedData] = useState(false);

  const updateGradeName = useCallback(() => {
    const gradeName = (gradeNameRef.current as HTMLInputElement).value;
    const newGrade: GradeInfo = {gradeName: gradeName, gradeLetter: props.grade.gradeLetter};
    localStorage.setItem('grade', JSON.stringify(newGrade));
    props.setGrade(newGrade);

  }, [props]);

  const updateGradeLetter = useCallback(() => {
    const gradeLetter = (gradeLetterRef.current as HTMLSelectElement).value;
    const newGrade: GradeInfo = {gradeName: props.grade.gradeName, gradeLetter: gradeLetter};
    localStorage.setItem('grade', JSON.stringify(newGrade));
    props.setGrade(newGrade);

  }, [props]);

  useEffect(() => {
    if (!loadedData) {
      const savedCourses: Array<any> = JSON.parse(localStorage.getItem('courses'));
      if (!!savedCourses && savedCourses.length > 0 && savedCourses[0].courseName !== undefined && savedCourses[0].courseSubject !== undefined && savedCourses[0].courseType !== undefined) {
        console.log("DOING LEGACY COURSE LOADING! (please be careful)"); // this is ancient and probably unnecessary but I am too scared to remove it
        props.setCourses(savedCourses.map((c: {courseName: string, courseSubject: string, courseType: string}): CourseInfo => {
          let sname = c.courseName;
          if (sname[sname.length - 2] === "K") {
            sname = sname.substring(0, sname.length - 4);
          }
          return {subject_name: sname, subject: c.courseSubject, course: c.courseType} as CourseInfo;
        }));
        }
      if (!!savedCourses && savedCourses.length > 0 && savedCourses[0].subject !== undefined && savedCourses[0].subject_name !== undefined && savedCourses[0].course !== undefined) {
        for (const c of savedCourses) {
          let sname = c.subject_name;
          if (sname[sname.length - 2] === "K") {
            sname = sname.substring(0, sname.length - 4); // don't remember what this does but probably also related to migrating old data
            c.subject_name = sname;
        }
      }

      if (!!savedCourses && savedCourses.length > 0 && (savedCourses[0].written === undefined || savedCourses[0].written === null)) {
        console.log("migrating to written courses system"); // yeah this is somewhat new but probably not really needed anymore

        for (const c of savedCourses) {
          if (c.written === undefined || c.written === null) {
            c.written = true;
          }
        }

        localStorage.setItem('courses', JSON.stringify(savedCourses));
      }
      props.setCourses(savedCourses);
      
      }

      const savedGrade: GradeInfo = JSON.parse(localStorage.getItem('grade'));
      if (!!savedGrade) {
        // (gradeNameRef.current as HTMLInputElement).value = savedGrade.gradeName;
        // (gradeLetterRef.current as HTMLSelectElement).value = savedGrade.gradeLetter;
        props.setGrade(savedGrade);
      }

      setLoadedData(true);
    }
  }, []);

  return props.settings.showCourses && (
    <div class="default-div" id="course-selection">
      <h2>Kurswahl</h2>
      <CornerHelpButton 
        title="Kurswahl" 
        helpText="Wähle hier deine Stufe/Klasse und anschließend die für dich relevanten Kurse oder Fächer aus. Diese Angaben werden verwendet, um den Vertretungs- und Klausurplan für dich zu filtern, sodass du nur das siehst, was dich auch wirklich betrifft."
      />
      {!!props.settings.yellowPaint && (
        <div>
          <p>
            Wähle deine Stufe/Klasse und die für dich relevanten Kurse/Fächer aus.
          </p>
          <p>
            {/* Die Ergebnisse werden dann oben gefiltert angezeigt. */}
            Diese werden dann im Vertretungs- & Klausurplan sortiert angezeigt.
          </p>
          <p><b>Tipp</b>: die Schriftlichkeit und die Farbe eines Kurses kannst du ändern, indem du <b class="code">Fortgeschrittene Kurse</b> anschaltest.</p>
          <Placeholder height="30px" />
        </div>
      )}
      <div id='course-list-wrapper'>
        <div id='grade-selector'>
          <h3>Stufe/Klasse</h3>
          {/* <Line width='45px' height='3px' /> */}
          <div id='grade-input'>
            <input value={props.grade.gradeName} type='text' list='grade-list' ref={gradeNameRef} onChange={updateGradeName} aria-controls={'grade-input'} aria-expanded />
            <datalist id='grade-list'>
              <option value='5'>5</option>
              <option value='6'>6</option>
              <option value='7'>7</option>
              <option value='8'>8</option>
              <option value='9'>9</option>
              <option value='10'>10</option>
              <option value='EF'>EF</option>
              <option value='Q1'>Q1</option>
              <option value='Q2'>Q2</option>
            </datalist>
            <select value={props.grade.gradeLetter} ref={gradeLetterRef} onChange={updateGradeLetter}>
              <option value=''>---</option>
              <option value='a'>a</option>
              <option value='b'>b</option>
              <option value='c'>c</option>
              <option value='d'>d</option>
              <option value='e'>e</option>
            </select>
            <datalist id='course-color-list'>
              <option value="#0958C6" />
              <option value="#842593" />
              {/* <option value="#ffff00" /> // if you know you know (pattern recognition)
              <option value="#ff00ff" /> */}
            </datalist>
          </div>
        </div>
        <div id='course-list'>
          {loadedData && props.courses.map((c, i) => {
            return ( // style guidelines hate this one simple trick: (hope you know how to scroll horizontally)
              <Course subject={c.subject} subject_name={c.subject_name} course={c.course} room={c.room} courses={props.courses} setCourses={props.setCourses} index={i} written={c.written} color={c.color} advanced={props.settings.advancedCourses} />
            );
          })}
          <CourseAdder courses={props.courses} setCourses={props.setCourses} subjectSelectRef={props.subjectSelectRef} />
        </div>
      </div>
    </div>
  );
}

function ExamDayDisplay(props: { // displays a single (sorted) day of exams
  examDays: Array<ExamDay>, // array because fuck you
  subjectSelectRef: MutableRef<HTMLSelectElement>,
  settings: DSBSettings,
  courses: Array<CourseInfo>,
  list: string,
}) {
  // const serialize = useCallback((d: ExamDay, e: Exam): string => {
  //   // console.log(JSON.stringify(d));
  //   // console.log(JSON.stringify(d))
  //   return ;
  // }, []);

  const prettifyCourse = useCallback((course: string): [string, string] => {
    let split = course.split("-");

    let n = "";
    for (const c of props.courses) { // getting name from json (may fail)
      if (c.subject === split[0]) {
        n = c.subject_name;
        if (c.course === "" || c.course === split[1]) {
          return [n, split[1]]
        }
      }
    }
    if (n !== "") {
      return [n, split[1]];
    }

    if (!!props.subjectSelectRef.current) { // fallback 1 (fails if courselist is hidden)
      for (let o of Array.from(props.subjectSelectRef.current.options)) {
        if (o.value === split[0]) {
          return [o.text, split[1]];
        }
      }
    }

    return [course, ""]; // fallback 2
  }, [props.subjectSelectRef.current, props.courses]);

  const shouldDisplay = useCallback((examDay: ExamDay, settings: DSBSettings, courses: Array<CourseInfo>): boolean => {
    if (settings.exams === ExamVisibility.ALL) {
      return true;
    }

    const l = examDay.exams.filter(e => { // yeah this is the funni I think
      return courses.filter(c => {
        return !!c.written && (c.course === "" ? c.subject === e.course.split("-")[0] : c.subject === e.course.split("-")[0] && c.course === e.course.split("-")[1]);
      }).length > 0;
    }).length;
    
    return l > 0;
  }, [])

  return (
    <div>
      <h2>{props.examDays[0].day}, der {props.examDays[0].date}</h2>

      {props.examDays.map((d) => {
        return shouldDisplay(d, props.settings, props.courses) && (
          <div>
            <h3>{d.timeframe}</h3>
            <div class="settings-div">
              {d.exams.map((e) => {
                const l = props.courses.filter(c => {
                  return !!c.written && (c.course === "" ? c.subject === e.course.split("-")[0] : c.subject === e.course.split("-")[0] && c.course === e.course.split("-")[1]);
                });

                return (l.length > 0 || props.settings.exams === ExamVisibility.ALL) && (<div class="exam">
                  <div>
                    <h3>{prettifyCourse(e.course)[0]} {prettifyCourse(e.course)[1]}</h3>
                    <p><i>Lehrer:</i> {e.teacher}</p>
                    <p><i>Es schreiben:</i> {e.people}/{e.max_people}</p>
                    <p><i>Dauer:</i> {e.length}</p>
                  </div>
                </div>);
              })}
            </div>
          </div>
        )
      })}
      {/* <h3>{props.examDays[0].timeframe}</h3>
      <ul>  
        {props.exams.map((e) => {
          return (<li>
            <p>{e.course}, {e.length}, {e.max_people}/{e.people}, {e.teacher}</p>
          </li>);
        })}
      </ul> */}
    </div>
  );
}

function ExamList(props: { // sorted list of all of your exams (probably the most complicated part of this website)
  subjectSelectRef: MutableRef<HTMLSelectElement>,
  settings: DSBSettings,
  courses: Array<CourseInfo>,
  grade: GradeInfo,
}) {
  const [examList, setExamList] = useState(undefined as Array<Array<ExamDay>>);
  const [availableLists, setAvailableLists] = useState(undefined as Array<{name: string, available: boolean}>);
  const [date, setDate] = useState(undefined as Date);
  const [list, setList] = useState(""); // RELEASE THE DSBSCRAPER LIST

  const [reloadSuccess, setReloadSuccess] = useState(undefined);
  const [animationKey, setAnimationKey] = useState(0);

  const examListSelectRef = useRef();

  useEffect(() => {
    const handler = () => setAnimationKey(prev => prev + 1);
    window.addEventListener('dsb-day-switch', handler);
    return () => window.removeEventListener('dsb-day-switch', handler);
  }, []);

  // fuck you geeksforgeeks

  const stringToDate = useCallback((str: string): Date => { // e.g. "02.10.2025" to something usable (AND NOT THE AMERICAN FU[NN]ING DATE FORMAT)
    const s = str.split(".");
    return new Date(`${s[2]}-${s[1]}-${s[0]}T16:00:00`);
  }, [])

  const getData = useCallback(async (): Promise<boolean> => {
    const user = localStorage.getItem("user");
    const key = localStorage.getItem("key"); // get credentials from localStorage

    try {
      const data = await fetch("https://kirillathome.uucode.com/api/v1/exams/index", { // request to the real api
        headers: {
          "user": user,
          "key": key,
        },
      });
      if (!data.ok) { // not ok
        setExamList(null);
        setAvailableLists(null);
        setReloadSuccess(false);
        return false;
      }

      // prettifyExamList(await data.json());
      // setExamList([]);
      setAvailableLists(await data.json());
      // ... why is there no return true;? I don't know either actually
    } catch {
        setExamList(null);
        setAvailableLists(null);
        setReloadSuccess(false);
        return false;
    }
  }, [setAvailableLists]);

  const initListData = useCallback(async (l: string): Promise<boolean> => {
    const user = localStorage.getItem("user");
    const key = localStorage.getItem("key"); // get credentials from localStorage

    if (l === "") {
      setExamList([]);
      return;
    }

    try {
      const data = await fetch("https://kirillathome.uucode.com/api/v1/exams/" + l, { // request to the real api
        headers: {
          "user": user,
          "key": key,
        },
      });
      if (!data.ok) { // not ok
        setExamList(null);
        return false;
      }

      // prettifyExamList(await data.json());
      prettifyExamList(await data.json());
      return true;
      // setAvailableLists(await data.json());
    } catch {
        setExamList(null);
        // setAvailableLists(null);
        return false;
    }
  }, [setExamList]);

  useEffect(() => {
    if ((import.meta as any).env && (import.meta as any).env.DEV) { // this code only runs in the debug env (so if you're reading this), you can override the current date for testing
      // setDate(stringToDate("13.04.1987"));
      setDate(new Date());


      //const test = { summary: "Test Klausur LK1", description: "Es schreiben: 0/0", start: "st1", end: "en2" } as EventData
      //console.log(serializeEvent(test));
    } else {
      setDate(new Date());
    }
    // setDate(stringToDate("10.10.2025"));
    getData();
    const l = localStorage.getItem("examList");
    if (!!l) {
      setList(l);
      // updateExamList();
    }
    // console.log(l);
    initListData(!!l ? l : "")
  }, []);

  const prettifyExamList = useCallback((list: Array<ExamDay>) => {
    let new_list: Array<Array<ExamDay>> = []; // mmmmh double arrays
    let temp: Array<ExamDay> = [];
    
    for (let l of list) {
      if (temp.length <= 0) {
        temp.push(l);
        continue;
      }
      if (l.date === temp[0].date) {
        temp.push(l);
        continue;
      }

      new_list.push(temp);
      temp = [];
      temp.push(l);
    }
    if (temp.length > 0) {
      new_list.push(temp);
      temp = [];
    }

    setExamList(new_list);
    // console.log(new_list)
  }, []);
  const shouldDisplayDay = useCallback((examDays: Array<ExamDay>, settings: DSBSettings, courses: Array<CourseInfo>, date: Date): boolean => {
    if (settings.exams === ExamVisibility.ALL) {
      return true;
    }

    const l = examDays.filter((ed => { // DO NOT touch the filtering logic, if it works it works (there is a reason it is this complicated I promise)
      return ed.exams.filter(e => {
        return courses.filter(c => {
          return !!c.written && (c.course === "" ? c.subject === e.course.split("-")[0] : c.subject === e.course.split("-")[0] && c.course === e.course.split("-")[1]);
        }).length > 0;
      }).length > 0 && (settings.oldExams ? true : date.valueOf() <= stringToDate(ed.date).valueOf());
    })).length;
    return l > 0;
  }, []);
  const canDisplay = useCallback((): boolean => {
    return examList.filter((e) => {return shouldDisplayDay(e, props.settings, props.courses, date)}).length > 0;
  }, [examList, props, date]);

  const updateExamList = useCallback(async (): Promise<boolean> => {
    const user = localStorage.getItem("user");
    const key = localStorage.getItem("key"); // get credentials from localStorage
    let nlist = "";
    if (!!examListSelectRef.current) {
      nlist = (examListSelectRef.current as HTMLSelectElement).value;
    } else {
      const l = localStorage.getItem("examList");
      if (!!l) {
        nlist = l;
      }
    }
    setList(nlist);
    localStorage.setItem("examList", nlist);

    if (nlist === "") {
      console.log("skipping...");
      setExamList([]);
      return true;
    }

    try {
      const data = await fetch("https://kirillathome.uucode.com/api/v1/exams/" + nlist, { // request to the real api
        headers: {
          "user": user,
          "key": key,
        },
      });
      if (!data.ok) { // not ok
        setExamList(null);
        return false;
      }

      prettifyExamList(await data.json());
      return true;
    } catch {
        setExamList(null);
        return false;
    }
  }, [setExamList, examListSelectRef, prettifyExamList]);

  const reloadExamList = useCallback(async (): Promise<boolean> => {
    const d = await getData();
    if (d === false) {
      if (reloadSuccess === true) {
        setReloadSuccess(undefined);
      }
      return false;
    }
    const u = await updateExamList();
    if (u === false && reloadSuccess === true) {
      setReloadSuccess(undefined);
    }
    return u;
  }, [getData, updateExamList]);

  // console.log(props.settings)

  const getUpcomingExams = useCallback(() => {
    if (!examList || examList.length === 0) return [];
    
    let upcoming = [];
    const today = new Date(date);
    today.setHours(0, 0, 0, 0);

    const prettify = (course: string): string => {
      let split = course.split("-");
      let n = "";
      for (const c of props.courses) {
        if (c.subject === split[0]) {
          n = c.subject_name;
          if (c.course === "" || c.course === split[1]) return `${n} ${split[1]}`;
        }
      }
      if (n !== "") return `${n} ${split[1]}`;
      if (!!props.subjectSelectRef.current) {
        for (let o of Array.from((props.subjectSelectRef.current as HTMLSelectElement).options)) {
          if (o.value === split[0]) return `${o.text} ${split[1]}`;
        }
      }
      return course;
    };

    examList.forEach(dayGroup => {
      const examDate = stringToDate(dayGroup[0].date);
      examDate.setHours(0, 0, 0, 0);
      
      const diffTime = examDate.valueOf() - today.valueOf();
      if (diffTime < 0) return; // past
      
      const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      dayGroup.forEach(ed => {
        ed.exams.forEach(e => {
          let isRelevant = false;
          let color = 'var(--accent-color)';
          if (props.settings.exams === ExamVisibility.ALL) {
            isRelevant = true;
          } else {
            const matches = props.courses.filter(c => {
              return !!c.written && (c.course === "" ? c.subject === e.course.split("-")[0] : c.subject === e.course.split("-")[0] && c.course === e.course.split("-")[1]);
            });
            if (matches.length > 0) {
              isRelevant = true;
              if (matches[0].color) color = matches[0].color;
            }
          }
          if (isRelevant) {
            upcoming.push({ name: prettify(e.course), daysUntil, color });
          }
        });
      });
    });
    
    return upcoming;
  }, [examList, props.courses, props.settings.exams, props.subjectSelectRef, date, stringToDate]);

  return props.settings.exams !== ExamVisibility.NONE && (
    <div class="default-div" id="klausuren">
      {(availableLists === undefined || examList === undefined) && (
        <div style={{ animation: 'tileReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
          <h2>Klausuren</h2>
          <div id="exam-list-wrapper" style={{ marginTop: '16px' }}>
            <div id="exam-selector" class="skeleton-shimmer" style={{ height: "60px", borderRadius: "12px", width: "100%" }}></div>
            <div id="exam-list" style={{ marginTop: "24px" }}>
              <SkeletonCard type="exam" />
              <SkeletonCard type="exam" />
            </div>
          </div>
        </div>
      )}
      {availableLists !== undefined && (
        <>
          <CornerHelpButton 
            title="Klausuren" 
            helpText="In diesem Bereich siehst du anstehende Klausuren. Wähle unten deinen Jahrgang aus. Optional kannst du unter 'Einstellungen > Klausurplan' auswählen, dass nur für dich relevante Klausuren (anhand deiner Kurswahl) angezeigt werden." 
          />
          <div key={animationKey} style={{ animation: 'tileReveal 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both' }}>
            <h2>Klausuren</h2>
            {(availableLists === null || examList === null) && ( 
            <div class="h-div">
              <DSBRefreshButton success={reloadSuccess} setSuccess={setReloadSuccess} getData={reloadExamList} /> {/* I bet you didn't know I put a refresh button here did you? */}
              <p><i>aktuell nicht verfügbar.</i></p>
            </div>
          )}
          {!!availableLists && !!examList && (
            <div>
              {/* <p>WIP, schaut bitte noch auf den offiziellen Klausurplan, wenn ihr nicht gamblen wollt.</p> */}
              {/* <p>WIP, schaut bitte noch auf den offiziellen Klausurplan, das Ding funktioniert aktuell nur so halb.</p> */}
              <p>Heute ist <b>{week[date.getDay()]}</b>, der <b>{date.getDate() < 10 ? 0 : null}{date.getDate()}.{date.getMonth() + 1 < 10 ? 0 : null}{date.getMonth() + 1}.{date.getFullYear()}</b>.</p>
              {getUpcomingExams().length > 0 && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '16px', marginBottom: '16px' }}>
                  {getUpcomingExams().map((e, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 12px',
                      backgroundColor: 'var(--input-bg)',
                      border: `1px solid ${e.color}`,
                      borderRadius: 'var(--rounding-sm)',
                      fontSize: '0.9rem',
                      animation: `tileReveal 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) ${0.1 + idx * 0.05}s both`
                    }}>
                      <b style={{ color: e.color }}>{e.name}</b>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {e.daysUntil === 0 ? 'heute' : `in ${e.daysUntil} ${e.daysUntil === 1 ? 'Tag' : 'Tagen'}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {/* {getWeek() & 1 ? (<p><b>Ungerade</b> Woche! <b>({getWeek()})</b></p>) : <p><b>Gerade</b> Woche! <b>({getWeek()})</b></p>} */}
              {props.settings.easterEggs && (date.getFullYear() === 1987 || date.getFullYear() === 1983) && (
                <div class="center">
                  <video width={!!window ? (window.innerWidth > 500 ? window.innerWidth / 1.8 : window.innerWidth / 1.4) : 400} controls>
                    <source src="/egg/biteof87.webm" type="video/webm" />
                  </video>
                </div>
              )}
              {props.settings.easterEggs && date.getFullYear() > 2599 && (
                <div class="center">
                  <video width={!!window ? (window.innerWidth > 500 ? window.innerWidth / 1.8 : window.innerWidth / 1.4) : 400} controls loop>
                    <source src="/egg/glorp.webm" type="video/webm" />
                  </video>
                </div>
              )}
              {props.settings.easterEggs && date.getDate() === 13 && date.getMonth() === 3 && ( // Kirill reference
                <div>
                  <p><span class="blue">Herzlichen Glückwunsch</span> zum Geburtstag, <b>Kirill</b>!</p>
                </div>
              )}

              {props.settings.yellowPaint && list === "" && (<p><b>Notiz</b>: wähle unten einen Klausurplan aus, um dessen Klausuren anzeigen zu lassen.</p>)}
              {props.settings.yellowPaint && list !== "" && props.settings.exams === ExamVisibility.SORTED && props.courses.length === 0 && (<p><b>Notiz</b>: füge (schriftliche) Kurse hinzu, um relevante Klausuren zu sehen.</p>)}
              <Placeholder height="15px" />
              {/* {examList.map((e) => {
                return <ExamDayDisplay date={e.date} day={e.day} timeframe={e.timeframe} exams={e.exams} />;
              })} */}
              <div id="exam-list-wrapper">
                <div id="exam-selector">
                  <h3>Klausurplan</h3>
                  <div id="exam-input">
                    <select value={list} ref={examListSelectRef} onChange={updateExamList}>
                      <option value="">---</option>
                      {availableLists.map((l) => {
                        if (l.name.includes(props.grade.gradeName)) {
                          return (<option value={l.name} disabled={!l.available}>{l.name}</option>)
                        }
                      })}
                      {/* <option value="Q1_1">Q1_1</option>
                      <option value="Q1_2">Q1_2</option>
                      <option value="Q1_3" disabled>Q1_3</option>
                      <option value="Q1_4" disabled>Q1_4</option> */}
                    </select>
                  </div>
                </div>
                <div id="exam-list">
                  {canDisplay() ? examList.map((e, idx) => {
                    return shouldDisplayDay(e, props.settings, props.courses, date) && (
                      <div key={list + "-" + e[0].date} style={{ animation: `tileReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${Math.min(0.2, idx * 0.03)}s both` }}>
                        <ExamDayDisplay examDays={e} subjectSelectRef={props.subjectSelectRef} settings={props.settings} courses={props.courses} list={list} />
                      </div>
                    )
                  }) : (<div style={{ animation: 'tileReveal 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both' }}>
                    <span class="blue">Herzlichen Glückwunsch</span><span>. Du hast keine Klausuren!</span>
                  </div>)}
                </div>
              </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const ThemeSelector = (props: { currentTheme: string, onSelect: (t: string) => void, settings?: any, updateSetting?: Function }) => {
  const [activePicker, setActivePicker] = useState<string | null>(null);

  // State for the large circle's draft colors
  const [editingColors, setEditingColors] = useState(() => {
    return props.settings?.customTheme || { bg: '#f8fafc', hl: '#e2e8f0', accent: '#2563eb' };
  });

  // Track if colors have been changed and not saved yet
  const [isModified, setIsModified] = useState(false);

  // Sync editingColors with props.settings?.customTheme when it changes
  useEffect(() => {
    if (props.settings?.customTheme) {
      setEditingColors(props.settings.customTheme);
    }
  }, [props.settings?.customTheme]);

  const handleCustomColorChange = (field: string, val: string) => {
    setEditingColors(prev => {
      const next = { ...prev, [field]: val };
      setIsModified(true);
      return next;
    });
  };

  const handleSliceClick = (field: string) => {
    setActivePicker(field);
  };

  const handleSaveTheme = () => {
    if (!props.updateSetting) return;
    const newThemeId = `custom-${Date.now()}`;
    const newTheme = {
      id: newThemeId,
      bg: editingColors.bg,
      hl: editingColors.hl,
      accent: editingColors.accent
    };
    const currentList = props.settings?.customThemesList || [];
    const newList = [...currentList, newTheme];
    
    props.updateSetting('customThemesList', newList);
    props.updateSetting('customTheme', editingColors);
    
    props.onSelect(newThemeId);
    setIsModified(false);
  };

  const handleSelectSavedTheme = (t: any) => {
    props.onSelect(t.id);
    setEditingColors({ bg: t.bg, hl: t.hl, accent: t.accent });
    setIsModified(false);
  };

  const handleDeleteTheme = (id: string) => {
    if (!props.updateSetting) return;
    const currentList = props.settings?.customThemesList || [];
    const newList = currentList.filter((t: any) => t.id !== id);
    props.updateSetting('customThemesList', newList);
    if (props.currentTheme === id) {
      props.onSelect('default');
    }
  };

  const themes = [
    { id: 'default', color: '#2563eb' },
    { id: 'emerald', color: '#10b981' },
    { id: 'rose', color: '#f43f5e' },
    { id: 'violet', color: '#8b5cf6' },
    { id: 'amber', color: '#f59e0b' },
    { id: 'cyan', color: '#06b6d4' },
    { id: 'slate', color: '#64748b' },
    { id: 'cherry', color: '#e11d48' },
    { id: 'mint', color: '#22c55e' },
    { id: 'sunset', color: '#f97316' },
    { id: 'indigo', color: '#4f46e5' },
    { id: 'teal', color: '#0d9488' },
    { id: 'fuchsia', color: '#c026d3' },
    { id: 'ocean', color: '#0284c7' },
    { id: 'crimson', color: '#dc2626' },
    { id: 'midnight', color: '#818cf8', bg: '#0f172a', hl: '#334155' },
    { id: 'forest', color: '#4ade80', bg: '#052e16', hl: '#166534' },
    { id: 'nord', color: '#88c0d0', bg: '#2e3440', hl: '#434c5e' },
    { id: 'latte', color: '#d97706', bg: '#fdf6e3', hl: '#fde047' },
    { id: 'blossom', color: '#db2777', bg: '#fdf2f8', hl: '#fbcfe8' },
    { id: 'dracula', color: '#ff79c6', bg: '#282a36', hl: '#6272a4' },
    { id: 'coffee', color: '#ffb300', bg: '#3e2723', hl: '#5d4037' },
    { id: 'abyss', color: '#0ea5e9', bg: '#020617', hl: '#1e293b' },
    { id: 'neon', color: '#f0abfc', bg: '#120024', hl: '#3c096c' },
    { id: 'monokai', color: '#a6e22e', bg: '#272822', hl: '#49483e' },
    { id: 'hacker', color: '#4ade80', bg: '#000000', hl: '#1a1a1a' },
    { id: 'galaxy', color: '#d946ef', bg: '#0b051a', hl: '#2d145e' },
    { id: 'cyberpunk', color: '#ec4899', bg: '#facc15', hl: '#ca8a04' },
    { id: 'vintage', color: '#b05c52', bg: '#f3e5d8', hl: '#d4c4b7' },
    { id: 'synthwave', color: '#06b6d4', bg: '#2b0c36', hl: '#551c6b' }
  ];

  const savedThemes = props.settings?.customThemesList || [];

  // Determine custom colors for active theme to render in style tag
  let activeCustomColors = null;
  if (props.currentTheme === 'custom') {
    activeCustomColors = props.settings?.customTheme || { bg: '#f8fafc', hl: '#e2e8f0', accent: '#2563eb' };
  } else if (props.currentTheme?.startsWith('custom-')) {
    const found = savedThemes.find((t: any) => t.id === props.currentTheme);
    if (found) {
      activeCustomColors = { bg: found.bg, hl: found.hl, accent: found.accent };
    }
  }

  const isCustomActive = props.currentTheme === 'custom' || props.currentTheme?.startsWith('custom-');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', padding: '16px', backgroundColor: 'var(--input-bg)', border: '1px solid var(--brighter-color)', borderRadius: 'var(--rounding-sm)' }}>
      <label style={{ fontSize: '0.9rem', color: 'var(--text-color)', fontWeight: 600 }}>Farb-Themes:</label>
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '4px', justifyContent: 'center' }}>
        {themes.map(t => {
          const isActive = (props.currentTheme || 'default') === t.id;
          const bgCol = t.bg || 'var(--standard-bg)';
          const hlCol = t.hl || 'var(--standard-hl)';
          return (
            <button
              key={t.id}
              onClick={() => props.onSelect(t.id)}
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                border: isActive ? '2px solid var(--text-color)' : '1px solid var(--brighter-color)',
                padding: 0, cursor: 'pointer', transition: 'var(--transition-fast)',
                background: `conic-gradient(${bgCol} 0deg 180deg, ${hlCol} 180deg 270deg, ${t.color} 270deg 360deg)`,
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                boxShadow: isActive ? '0 0 12px rgba(0,0,0,0.1)' : 'none'
              }}
              title={`Theme ${t.id}`}
              aria-label={`Theme ${t.id}`}
            />
          )
        })}
      </div>

      <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--brighter-color)', margin: '20px 0 16px 0' }} />

      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <h3 style={{ fontSize: '1.05rem', color: 'var(--text-color)', marginBottom: '4px', fontWeight: 600, borderBottom: 'none', paddingBottom: 0 }}>Erstelle dein eigenes Theme</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>Passe die Farbe der einzelnen Felder durch ein Klicken an</p>
        
        <div 
          style={{ 
            position: 'relative', width: '150px', height: '150px', margin: '0 auto', 
            borderRadius: '50%', overflow: 'hidden', boxShadow: 'var(--shadow-card)', 
            border: isCustomActive ? '3px solid var(--text-color)' : '1px solid var(--brighter-color)',
            transition: 'border 0.2s, transform 0.2s',
            transform: isCustomActive ? 'scale(1.05)' : 'scale(1)'
          }}
        >
          {/* Half circle for Background (Right Half) */}
          <div 
            style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: '50%', background: editingColors.bg, cursor: 'pointer' }} 
            title="Hintergrundfarbe"
            onClick={() => handleSliceClick('bg')}
          />
          
          {/* Quarter circle for Highlight (Bottom Left) */}
          <div 
            style={{ position: 'absolute', top: '50%', bottom: 0, left: 0, right: '50%', background: editingColors.hl, cursor: 'pointer' }} 
            title="Rahmen/Trennlinien"
            onClick={() => handleSliceClick('hl')}
          />

          {/* Quarter circle for Accent (Top Left) */}
          <div 
            style={{ position: 'absolute', top: 0, bottom: '50%', left: 0, right: '50%', background: editingColors.accent, cursor: 'pointer' }} 
            title="Akzentfarbe"
            onClick={() => handleSliceClick('accent')}
          />
        </div>

        <button
          onClick={isModified ? handleSaveTheme : undefined}
          disabled={!isModified}
          style={{
            marginTop: '20px',
            width: '100%',
            padding: '10px 16px',
            borderRadius: 'var(--rounding-sm, 8px)',
            border: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            transition: 'all 0.2s ease',
            backgroundColor: isModified ? 'var(--accent-color)' : 'var(--brighter-color)',
            color: isModified ? '#ffffff' : 'var(--text-secondary)',
            cursor: isModified ? 'pointer' : 'not-allowed',
            boxShadow: isModified ? '0 4px 12px var(--accent-glow)' : 'none',
          }}
        >
          Theme speichern
        </button>

        {savedThemes.length > 0 && (
          <>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '20px', marginBottom: '8px', fontWeight: 600, textAlign: 'center' }}>
              Eigene Themes:
            </div>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {savedThemes.map((t: any) => {
                const isActive = props.currentTheme === t.id;
                return (
                  <div key={t.id} style={{ position: 'relative' }}>
                    <button
                      onClick={() => handleSelectSavedTheme(t)}
                      style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        border: isActive ? '2px solid var(--text-color)' : '1px solid var(--brighter-color)',
                        padding: 0, cursor: 'pointer', transition: 'var(--transition-fast)',
                        background: `conic-gradient(${t.bg} 0deg 180deg, ${t.hl} 180deg 270deg, ${t.accent} 270deg 360deg)`,
                        transform: isActive ? 'scale(1.1)' : 'scale(1)',
                        boxShadow: isActive ? '0 0 12px rgba(0,0,0,0.1)' : 'none'
                      }}
                      title="Eigenes Theme anwenden"
                      aria-label="Eigenes Theme anwenden"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTheme(t.id);
                      }}
                      style={{
                        position: 'absolute', top: '-6px', right: '-6px',
                        width: '16px', height: '16px', borderRadius: '50%',
                        background: 'var(--accent-hover, #ef4444)', color: '#fff',
                        border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '10px', cursor: 'pointer', padding: 0, fontWeight: 'bold',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)', zIndex: 2
                      }}
                      title="Theme löschen"
                      aria-label="Theme löschen"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {activePicker && (() => {
          const currentColor = editingColors[activePicker] || '#2563eb';
          
          // Convert hex to HSV
          const hexToRgb = (hex: string) => {
            const r = parseInt(hex.slice(1,3), 16), g = parseInt(hex.slice(3,5), 16), b = parseInt(hex.slice(5,7), 16);
            return { r, g, b };
          };
          const rgbToHsv = (r: number, g: number, b: number) => {
            r /= 255; g /= 255; b /= 255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
            let h = 0;
            if (d !== 0) {
              if (max === r) h = ((g - b) / d + 6) % 6;
              else if (max === g) h = (b - r) / d + 2;
              else h = (r - g) / d + 4;
              h *= 60;
            }
            return { h, s: max === 0 ? 0 : d / max, v: max };
          };
          const hsvToHex = (h: number, s: number, v: number) => {
            const c = v * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = v - c;
            let r = 0, g = 0, b = 0;
            if (h < 60) { r = c; g = x; }
            else if (h < 120) { r = x; g = c; }
            else if (h < 180) { g = c; b = x; }
            else if (h < 240) { g = x; b = c; }
            else if (h < 300) { r = x; b = c; }
            else { r = c; b = x; }
            const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
            return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
          };
          
          const rgb = hexToRgb(currentColor);
          const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

          const pickerJsx = (
            <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Blurred background overlay */}
              <div 
                style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(6px)' }} 
                onClick={() => setActivePicker(null)} 
              />
              
              {/* Color picker modal */}
              <div style={{
                position: 'relative', zIndex: 100000, background: 'var(--foreground-color, #fff)',
                borderRadius: '12px', padding: '16px', boxShadow: '0 12px 48px rgba(0,0,0,0.4)',
                border: '1px solid var(--brighter-color)', width: '240px',
                animation: 'fadeInScale 0.2s ease-out'
              }}>
                {/* Saturation/Brightness canvas */}
                <div
                  style={{ position: 'relative', width: '100%', height: '150px', borderRadius: '4px', cursor: 'crosshair', marginBottom: '10px',
                    background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hsv.h}, 100%, 50%))` }}
                  onMouseDown={(e: MouseEvent) => {
                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                    const update = (ev: MouseEvent) => {
                      const s = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
                      const v = Math.max(0, Math.min(1, 1 - (ev.clientY - rect.top) / rect.height));
                      handleCustomColorChange(activePicker, hsvToHex(hsv.h, s, v));
                    };
                    update(e);
                    const onMove = (ev: MouseEvent) => update(ev);
                    const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
                    document.addEventListener('mousemove', onMove);
                    document.addEventListener('mouseup', onUp);
                  }}
                  onTouchStart={(e: TouchEvent) => {
                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                    const update = (touch: Touch) => {
                      const s = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
                      const v = Math.max(0, Math.min(1, 1 - (touch.clientY - rect.top) / rect.height));
                      handleCustomColorChange(activePicker, hsvToHex(hsv.h, s, v));
                    };
                    update(e.touches[0]);
                    const onMove = (ev: TouchEvent) => { ev.preventDefault(); update(ev.touches[0]); };
                    const onEnd = () => { document.removeEventListener('touchmove', onMove); document.removeEventListener('touchend', onEnd); };
                    document.addEventListener('touchmove', onMove, { passive: false });
                    document.addEventListener('touchend', onEnd);
                  }}
                >
                  {/* Picker indicator */}
                  <div style={{
                    position: 'absolute',
                    left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`,
                    width: '12px', height: '12px', borderRadius: '50%',
                    border: '2px solid white', boxShadow: '0 0 3px rgba(0,0,0,0.5)',
                    transform: 'translate(-50%, -50%)', pointerEvents: 'none'
                  }} />
                </div>

                {/* Hue slider */}
                <div
                  style={{ position: 'relative', width: '100%', height: '14px', borderRadius: '7px', cursor: 'pointer', marginBottom: '10px',
                    background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)' }}
                  onMouseDown={(e: MouseEvent) => {
                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                    const update = (ev: MouseEvent) => {
                      const h = Math.max(0, Math.min(360, ((ev.clientX - rect.left) / rect.width) * 360));
                      handleCustomColorChange(activePicker, hsvToHex(h, hsv.s, hsv.v));
                    };
                    update(e);
                    const onMove = (ev: MouseEvent) => update(ev);
                    const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
                    document.addEventListener('mousemove', onMove);
                    document.addEventListener('mouseup', onUp);
                  }}
                  onTouchStart={(e: TouchEvent) => {
                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                    const update = (touch: Touch) => {
                      const h = Math.max(0, Math.min(360, ((touch.clientX - rect.left) / rect.width) * 360));
                      handleCustomColorChange(activePicker, hsvToHex(h, hsv.s, hsv.v));
                    };
                    update(e.touches[0]);
                    const onMove = (ev: TouchEvent) => { ev.preventDefault(); update(ev.touches[0]); };
                    const onEnd = () => { document.removeEventListener('touchmove', onMove); document.removeEventListener('touchend', onEnd); };
                    document.addEventListener('touchmove', onMove, { passive: false });
                    document.addEventListener('touchend', onEnd);
                  }}
                >
                  <div style={{
                    position: 'absolute', left: `${(hsv.h / 360) * 100}%`, top: '50%',
                    width: '14px', height: '14px', borderRadius: '50%',
                    border: '2px solid white', boxShadow: '0 0 3px rgba(0,0,0,0.4)',
                    transform: 'translate(-50%, -50%)', pointerEvents: 'none',
                    background: `hsl(${hsv.h}, 100%, 50%)`
                  }} />
                </div>

                {/* Hex input */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: currentColor, border: '1px solid var(--brighter-color)', flexShrink: 0 }} />
                  <input
                    type="text"
                    value={currentColor}
                    onChange={(e) => {
                      const val = (e.target as HTMLInputElement).value;
                      if (/^#[0-9a-fA-F]{6}$/.test(val)) {
                        handleCustomColorChange(activePicker, val);
                      }
                    }}
                    style={{ flex: 1, padding: '4px 8px', fontSize: '0.85rem', borderRadius: '4px',
                      border: '1px solid var(--brighter-color)', background: 'var(--input-bg)', color: 'var(--text-color)',
                      fontFamily: 'monospace' }}
                    maxLength={7}
                  />
                </div>
              </div>
            </div>
          );

          if (typeof document !== 'undefined') {
            return createPortal(pickerJsx, document.body);
          }
          return pickerJsx;
        })()}
      </div>
      
      {/* Inline styles for custom theme */}
      {activeCustomColors && (
        <style>
          {`
            html:root[data-color-theme="${props.currentTheme}"] {
              --background-color: ${activeCustomColors.bg};
              --foreground-color: ${activeCustomColors.bg};
              --darker-color: ${activeCustomColors.bg};
              --header-bg: ${activeCustomColors.bg}dd;
              --input-bg: ${activeCustomColors.bg};
              
              --brighter-color: ${activeCustomColors.hl};
              
              --accent-color: ${activeCustomColors.accent};
              --accent-hover: ${activeCustomColors.accent};
              --accent-light: ${activeCustomColors.accent}1a;
              --accent-glow: ${activeCustomColors.accent}26;
            }
            
            @keyframes fadeInScale {
              0% { opacity: 0; transform: scale(0.9); }
              100% { opacity: 1; transform: scale(1); }
            }
          `}
        </style>
      )}
    </div>
  );
};

function WidgetReorderList(props: { settings: DSBSettings, updateSetting: Function }) {
  const defaultOrder = ['klausuren', 'kurswahl', 'stundenplan', 'termine', 'hausaufgaben'];
  const order = props.settings.widgetOrder || defaultOrder;
  
  const [items, setItems] = useState(order);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  
  // Refs for pointer-based drag (Safari/touch compatible)
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const containerRef = useRef<HTMLDivElement>(null);
  const dragCloneRef = useRef<HTMLDivElement | null>(null);
  const dragStartYRef = useRef(0);
  const dragOffsetYRef = useRef(0);
  const itemRectsRef = useRef<DOMRect[]>([]);
  const isDraggingRef = useRef(false);
  const draggedIdxRef = useRef<number | null>(null);
  const overIdxRef = useRef<number | null>(null);
  // Threshold in px before a pointer-hold becomes a drag
  const DRAG_THRESHOLD = 5;
  const pendingDragRef = useRef<{ idx: number, startY: number, startX: number, pointerId: number } | null>(null);

  useEffect(() => {
    if (props.settings.widgetOrder) {
      setItems(props.settings.widgetOrder);
    }
  }, [props.settings.widgetOrder]);

  // Snapshot item positions for hit-testing during drag
  const snapshotRects = () => {
    if (!containerRef.current) return;
    const children = containerRef.current.children;
    const rects: DOMRect[] = [];
    for (let i = 0; i < children.length; i++) {
      rects.push(children[i].getBoundingClientRect());
    }
    itemRectsRef.current = rects;
  };

  // Find which index the pointer is currently over
  const getOverIndex = (clientY: number): number | null => {
    const rects = itemRectsRef.current;
    for (let i = 0; i < rects.length; i++) {
      const mid = rects[i].top + rects[i].height / 2;
      if (clientY < mid) return i;
    }
    return rects.length - 1;
  };

  const handlePointerDown = (e: PointerEvent, idx: number) => {
    // Only start drag from the grip handle area or the item itself, not from buttons
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;

    // Store pending drag info – we'll confirm it's a drag once we exceed the threshold
    pendingDragRef.current = { idx, startY: e.clientY, startX: e.clientX, pointerId: e.pointerId };
    
    // Capture the pointer so we get move/up events even outside the element
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent) => {
    // If we have a pending drag, check threshold
    if (pendingDragRef.current && !isDraggingRef.current) {
      const dy = Math.abs(e.clientY - pendingDragRef.current.startY);
      const dx = Math.abs(e.clientX - pendingDragRef.current.startX);
      if (dy < DRAG_THRESHOLD && dx < DRAG_THRESHOLD) return;

      // Start the drag
      const { idx, startY } = pendingDragRef.current;
      isDraggingRef.current = true;
      draggedIdxRef.current = idx;
      overIdxRef.current = idx;
      setDraggedIdx(idx);
      setOverIdx(idx);

      snapshotRects();

      // Create floating clone
      if (containerRef.current) {
        const el = containerRef.current.children[idx] as HTMLElement;
        const rect = el.getBoundingClientRect();
        dragStartYRef.current = startY;
        dragOffsetYRef.current = startY - rect.top;

        const clone = el.cloneNode(true) as HTMLDivElement;
        clone.style.position = 'fixed';
        clone.style.left = `${rect.left}px`;
        clone.style.top = `${rect.top}px`;
        clone.style.width = `${rect.width}px`;
        clone.style.height = `${rect.height}px`;
        clone.style.zIndex = '9999';
        clone.style.pointerEvents = 'none';
        clone.style.boxShadow = '0 8px 24px rgba(0,0,0,0.18)';
        clone.style.opacity = '0.92';
        clone.style.borderRadius = 'var(--rounding-sm)';
        clone.style.transition = 'none';
        clone.style.transform = 'scale(1.03)';
        clone.style.willChange = 'top';
        document.body.appendChild(clone);
        dragCloneRef.current = clone;
      }
    }

    if (!isDraggingRef.current) return;

    e.preventDefault();

    // Move clone
    if (dragCloneRef.current) {
      const newTop = e.clientY - dragOffsetYRef.current;
      dragCloneRef.current.style.top = `${newTop}px`;
    }

    // Determine which slot we're over
    const newOverIdx = getOverIndex(e.clientY);
    if (newOverIdx !== null && newOverIdx !== overIdxRef.current) {
      overIdxRef.current = newOverIdx;
      setOverIdx(newOverIdx);
    }
  };

  const handlePointerUp = (e: PointerEvent) => {
    pendingDragRef.current = null;

    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    const dIdx = draggedIdxRef.current;
    const oIdx = overIdxRef.current;

    // Clean up clone
    if (dragCloneRef.current) {
      dragCloneRef.current.remove();
      dragCloneRef.current = null;
    }

    // Commit reorder
    if (dIdx !== null && oIdx !== null && dIdx !== oIdx) {
      const newItems = [...itemsRef.current];
      const draggedItem = newItems[dIdx];
      newItems.splice(dIdx, 1);
      newItems.splice(oIdx, 0, draggedItem);
      setItems(newItems);
      props.updateSetting('widgetOrder', newItems);
    }

    draggedIdxRef.current = null;
    overIdxRef.current = null;
    setDraggedIdx(null);
    setOverIdx(null);
  };

  // Also clean up if pointer is cancelled (e.g. system gesture)
  const handlePointerCancel = () => {
    pendingDragRef.current = null;
    isDraggingRef.current = false;
    draggedIdxRef.current = null;
    overIdxRef.current = null;
    if (dragCloneRef.current) {
      dragCloneRef.current.remove();
      dragCloneRef.current = null;
    }
    setDraggedIdx(null);
    setOverIdx(null);
  };

  const toggleVisibility = (id: string) => {
    if (id === 'klausuren') props.updateSetting('exams', props.settings.exams === 'none' ? 'sorted' : 'none');
    if (id === 'kurswahl') props.updateSetting('showCourses', props.settings.showCourses === false ? true : false);
    if (id === 'stundenplan') props.updateSetting('showStundenplan', props.settings.showStundenplan === false ? true : false);
    if (id === 'termine') props.updateSetting('showTermine', props.settings.showTermine === false ? true : false);
    if (id === 'hausaufgaben') props.updateSetting('showHomework', props.settings.showHomework === false ? true : false);
  };

  const getVisibility = (id: string) => {
    if (id === 'klausuren') return props.settings.exams !== 'none';
    if (id === 'kurswahl') return props.settings.showCourses !== false;
    if (id === 'stundenplan') return props.settings.showStundenplan !== false;
    if (id === 'termine') return props.settings.showTermine !== false;
    if (id === 'hausaufgaben') return props.settings.showHomework !== false;
    return true;
  };

  const getName = (id: string) => {
    if (id === 'klausuren') return 'Klausuren';
    if (id === 'kurswahl') return 'Kurswahl';
    if (id === 'stundenplan') return 'Stundenplan';
    if (id === 'termine') return 'Termine';
    if (id === 'hausaufgaben') return 'Hausaufgaben';
    return id;
  };

  const LockIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ opacity: 0.6 }}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );

  const StaticBox = ({ name }: { name: string }) => (
    <div style={{ padding: '12px', background: 'var(--input-bg)', borderRadius: 'var(--rounding-sm)', display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.8, border: '1px solid var(--brighter-color)' }}>
      <LockIcon />
      <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{name}</span>
    </div>
  );

  const ToggleableStaticBox = ({ id, name, isVisible, onToggle }: { id: string, name: string, isVisible: boolean, onToggle: (id: string) => void }) => (
    <div style={{ padding: '12px', background: 'var(--foreground-color)', borderRadius: 'var(--rounding-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--brighter-color)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <LockIcon />
        <span style={{ fontWeight: 600, opacity: isVisible ? 1 : 0.5, color: 'var(--text-secondary)' }}>{name}</span>
      </div>
      <button 
        type="button"
        class="imgInput" 
        onClick={() => onToggle(id)} 
        title={isVisible ? "Ausblenden" : "Einblenden"}
      >
        {isVisible ? <EyeIcon width="20" height="20" /> : <EyeOffIcon width="20" height="20" />}
      </button>
    </div>
  );

  // Compute smooth slide translations for items that aren't being dragged
  const getDropStyle = (idx: number): any => {
    if (draggedIdx === null || overIdx === null) return { transform: 'translateY(0px)', opacity: 1 };
    
    if (idx === draggedIdx) return { transform: 'scale(0.95)', opacity: 0.01 };
    
    const shift = 54; // Item height (46px) + gap (8px)

    if (draggedIdx < overIdx) {
      if (idx > draggedIdx && idx <= overIdx) return { transform: `translateY(-${shift}px)`, opacity: 1 };
    } else if (draggedIdx > overIdx) {
      if (idx >= overIdx && idx < draggedIdx) return { transform: `translateY(${shift}px)`, opacity: 1 };
    }
    
    return { transform: 'translateY(0px)', opacity: 1 };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>
        Du kannst die Reihenfolge der Boxen auf der Startseite per Drag and Drop ändern und diese hier zentral ein- und ausblenden.
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <ToggleableStaticBox 
           id="tagesuebersicht" 
           name="Tagesübersicht" 
           isVisible={props.settings.showOverview !== false} 
           onToggle={() => props.updateSetting('showOverview', props.settings.showOverview === false ? true : false)} 
        />
        <StaticBox name="Vertretungen" />
      </div>

      <div style={{ height: '1px', background: 'var(--brighter-color)', margin: '4px 0' }} />
      
      <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((item: string, idx: number) => {
          const isVisible = getVisibility(item);
          return (
            <div 
              key={item}
              onPointerDown={(e) => handlePointerDown(e, idx)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              style={{ 
                padding: '12px', 
                background: 'var(--foreground-color)', 
                border: '1px solid var(--brighter-color)', 
                borderRadius: 'var(--rounding-sm)', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'grab',
                transition: 'transform 0.25s cubic-bezier(0.2, 1, 0.2, 1), opacity 0.15s ease',
                boxShadow: 'var(--shadow-card)',
                touchAction: 'none',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                ...getDropStyle(idx)
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ cursor: 'grab', color: 'var(--text-secondary)' }}>☰</span>
                <span style={{ fontWeight: 600, opacity: isVisible ? 1 : 0.5 }}>{getName(item)}</span>
              </div>
              <button 
                type="button"
                class="imgInput" 
                onClick={() => toggleVisibility(item)} 
                title={isVisible ? "Ausblenden" : "Einblenden"}
              >
                {isVisible ? <EyeIcon width="20" height="20" /> : <EyeOffIcon width="20" height="20" />}
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ height: '1px', background: 'var(--brighter-color)', margin: '4px 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <StaticBox name="Einstellungen" />
        <StaticBox name="Informationen" />
      </div>
    </div>
  );
}

export function Settings(props: { // settings block
  settings: DSBSettings,
  setSettings: Function,
  grade: GradeInfo,
  courses: CourseInfo[],
  setCourses: Function,
}) {
  const [loadedData, setLoadedData] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [resetProgress, setResetProgress] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1000);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fileRef = useRef();

  const updateSetting = useCallback((setting: string, value: any) => {
    props.setSettings((prev: DSBSettings) => {
      const newSettings = { ...prev, [setting]: value };
      localStorage.setItem("DSBSettings", JSON.stringify(newSettings));
      window.dispatchEvent(new CustomEvent('dsb-settings-change', { detail: newSettings }));
      return newSettings;
    });
  }, [props.setSettings]);

  const uploadCourse = useCallback(async () => {
    if (!!fileRef) {
      if ((fileRef.current as HTMLInputElement).files.length < 1) {
        setUploadStatus(false);
        return;
      }
      const file = (fileRef.current as HTMLInputElement).files[0];
      try {
        const parsed = JSON.parse(await file.text());
        if (Array.isArray(parsed)) {
          const newCourses = parsed.filter((c) => {
            return c.subject !== undefined && c.subject_name !== undefined && c.course !== undefined;
          })

          if (newCourses.length > 0) {
            props.setCourses(newCourses);
            localStorage.setItem('courses', JSON.stringify(newCourses));
            console.log("Successfully imported courses:");
            console.log(newCourses);
            setUploadStatus(true);
            return;
          }
        }
        setUploadStatus(false);
        return;

      } catch (e) {
        setUploadStatus(false);
        console.error(e);
        return;
      }
    }
  }, [props.setCourses, fileRef])

  const exportAllData = useCallback(() => {
    const data: any = {};
    const keys = ["user", "key", "filterStage", "courses", "grade", "examList", "DSBSettings", "PersonalTimetableData", "DSBHomework", "dismissedWelcome"];
    for (const k of keys) {
      const val = localStorage.getItem(k);
      if (val !== null) data[k] = val;
    }
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dsb_backup.json";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const backupFileRef = useRef();
  const importAllData = useCallback(async () => {
    if (!!backupFileRef && backupFileRef.current) {
      const input = backupFileRef.current as HTMLInputElement;
      if (input.files.length < 1) return;
      try {
        const parsed = JSON.parse(await input.files[0].text());
        for (const key of Object.keys(parsed)) {
          localStorage.setItem(key, parsed[key]);
        }
        alert("Daten erfolgreich importiert. Die Seite wird nun neu geladen.");
        location.reload();
      } catch (e) {
        alert("Fehler beim Importieren der Daten.");
      }
    }
  }, [backupFileRef]);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("key");
    location.reload();
  }, []);

  const resetBegin = useCallback(() => {
    setResetProgress(1);
  }, [setResetProgress])

  const resetCancel = useCallback(() => {
    setResetProgress(0);
  }, [setResetProgress])

  const reset = useCallback(() => {
    localStorage.clear();
    location.reload();
  }, []);

  useEffect(() => {
    if (!loadedData) {
      const loadedSettings = localStorage.getItem("DSBSettings");

      if (!!loadedSettings) {
        // console.log("Settings valid, updating!")
        props.setSettings(JSON.parse(loadedSettings));
        // console.log(`The settings are now: ${loadedSettings}`)
      }

      // addEventListener("online", dummyNotification);

      setLoadedData(true);
    }

  }, []);

  return (
    <div class="default-div" id="einstellungen">
      <h2>Einstellungen</h2>
      {loadedData && (<div class="settings-div">
        <div class="settings-section">
          <h3>Webseite</h3>
          <div class="settings-section-content">
            <Select
              text="Erscheinungsbild (Dark Mode):"
              options={[{value: "light", text: "Hell"}, {value: "dark", text: "Dunkel"}]}
              updater={(v: string) => updateSetting("theme", v)}
              value={props.settings.theme !== undefined && props.settings.theme !== "system" ? props.settings.theme : "light"}
            />
            <ThemeSelector 
              currentTheme={props.settings.colorTheme || 'default'} 
              settings={props.settings}
              updateSetting={updateSetting}
              onSelect={(v: string) => {
                updateSetting("colorTheme", v);
                document.documentElement.setAttribute('data-color-theme', v);
              }} 
            />
            <CheckButton
              text="Easter eggs:"
              updater={(v: boolean) => updateSetting("easterEggs", v)}
              checked={props.settings.easterEggs !== undefined ? props.settings.easterEggs : true}
              information="Falls du nur für deine Vertretungen hier bist und nicht um Spaß zu haben, kannst du die verschiedenen Ereignisse ausschalten."
            />
            <CheckButton
              text="Tipps anzeigen:"
              updater={(v: boolean) => updateSetting("yellowPaint", v)}
              checked={props.settings.yellowPaint !== undefined ? props.settings.yellowPaint : true}
              information="Verschiedene Tipps, wie du den DSBScraper effektiver nutzen kannst. Falls du aber schon ein Experte bist, kannst du diese ausschalten."
            />
            <WidgetReorderList settings={props.settings} updateSetting={updateSetting} />
          </div>
        </div>

        <div class="settings-section">
          <h3>Vertretungsplan</h3>
          <div class="settings-section-content">
            <CheckButton
              text="Neues Design:"
              updater={(v: boolean) => updateSetting("newDesign", v)}
              checked={props.settings.newDesign !== undefined ? props.settings.newDesign : false}
              information="Das neue Design für den DSBScraper (nach Luis Koch)."
            />
            <Select
              text="Parasiten bekämpfen:"
              options={[{value: ParasitesHandler.NONE, text: "Anzeigen"}, {value: ParasitesHandler.SHORTEN, text: "Kürzen"}, {value: ParasitesHandler.EXTERMINATE, text: "Exterminieren"}]}
              information="AGs können von vielen verschiedenen Klassen belegt werden, sodass der Rest der Vertretungen vom Bildschirm geschoben wird. (lol)"
              updater={(v: string) => updateSetting("parasites", v)}
              value={props.settings.parasites !== undefined ? props.settings.parasites : ParasitesHandler.SHORTEN}
            />
          </div>
        </div>

        <div class="settings-section">
          <h3>Kurswahl</h3>
          <div class="settings-section-content">
            <CheckButton
              text="Fortgeschrittene Kurse:"
              updater={(v: boolean) => updateSetting("advancedCourses", v)}
              checked={props.settings.advancedCourses !== undefined ? props.settings.advancedCourses : false}
              // information="Einstellungen für Kurse, die die meisten nicht brauchen würden."
              information="Einstellungen für Kurse, die man weniger oft benötigt.">

                <a class="fakebutton" download="courses.json" href={"data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(props.courses))} >Kurse als JSON exportieren (herunterladen)</a>
                <input type="file" accept="text/json, .json" id="course-upload" name="course-upload" ref={fileRef} onChange={uploadCourse} />
                <label class="fakebutton red" for="course-upload">Kurse aus JSON importieren (VORSICHTIG! Überschreibt deine aktuellen Kurse!)</label>
                {!!uploadStatus && (<label>Kurse importiert.</label>)}
                {uploadStatus === false && (<label>Fehler beim importieren von Kursen.</label>)}

            </CheckButton>
          </div>
        </div>

        <div class="settings-section">
          <h3>Klausurplan</h3>
          <div class="settings-section-content">
            <CheckButton
              text="Alte Klausuren anzeigen:"
              updater={(v: boolean) => updateSetting("oldExams", v)}
              checked={props.settings.oldExams !== undefined ? props.settings.oldExams : false}
              disabled={props.settings === undefined || props.settings.exams !== ExamVisibility.SORTED}
            />
          </div>
        </div>

        <div class="settings-section">
          <h3>Navigation (Menü)</h3>
          <div class="settings-section-content">
            {(() => {
              const maxItems = windowWidth < 380 ? 4 : windowWidth < 600 ? 5 : Infinity;
              const selectedItemsCount = [
                props.settings.navVertretung !== false,
                props.settings.exams !== "none" && props.settings.navKlausuren !== false,
                props.settings.showCourses !== false && props.settings.navKurswahl !== false,
                props.settings.navStundenplan !== false,
                props.settings.showTermine !== false && props.settings.navTermine !== false,
                props.settings.showHomework !== false && props.settings.navHausaufgaben !== false,
                props.settings.navEinstellungen === true,
                props.settings.navInfo === true
              ].filter(Boolean).length;
              const isFull = selectedItemsCount >= maxItems;
              const textCol = isFull ? 'var(--s-free-border)' : 'var(--text-secondary)';

              return maxItems !== Infinity && (
                <div style={{ padding: '12px', background: 'var(--input-bg)', borderRadius: 'var(--rounding-sm)', marginBottom: '16px' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--text-color)', fontWeight: 500 }}>
                    Navigationsleisten-Kapazität
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ flex: 1, height: '8px', background: 'var(--brighter-color)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, (selectedItemsCount / maxItems) * 100)}%`, height: '100%', background: isFull ? 'var(--s-free-border)' : 'var(--accent-color)', transition: 'width 0.3s' }} />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: textCol }}>{selectedItemsCount} / {maxItems}</span>
                  </div>
                  {isFull && <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', color: 'var(--s-free-border)' }}>Leiste ist voll. Zusätzliche Buttons werden nicht angezeigt.</p>}
                </div>
              );
            })()}
            <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--brighter-color)' }}>
              <CheckButton
                text="Navigationsleiste anzeigen:"
                updater={(v: boolean) => updateSetting("showBottomNav", v)}
                checked={props.settings.showBottomNav !== false}
              />
            </div>
            <CheckButton
              text="Vertretungsplan-Button:"
              updater={(v: boolean) => updateSetting("navVertretung", v)}
              checked={props.settings.navVertretung !== false}
            />
            <CheckButton
              text="Klausuren-Button:"
              updater={(v: boolean) => updateSetting("navKlausuren", v)}
              checked={props.settings.navKlausuren !== false}
              disabled={props.settings.exams === 'none'}
            />
            <CheckButton
              text="Hausaufgaben-Button:"
              updater={(v: boolean) => updateSetting("navHausaufgaben", v)}
              checked={props.settings.navHausaufgaben !== false}
              disabled={props.settings.showHomework === false}
            />
            <CheckButton
              text="Termine-Button:"
              updater={(v: boolean) => updateSetting("navTermine", v)}
              checked={props.settings.navTermine !== false}
              disabled={props.settings.showTermine === false}
            />
            <CheckButton
              text="Kurswahl-Button:"
              updater={(v: boolean) => updateSetting("navKurswahl", v)}
              checked={props.settings.navKurswahl !== false}
              disabled={props.settings.showCourses === false}
            />
            <CheckButton
              text="Stundenplan-Button:"
              updater={(v: boolean) => updateSetting("navStundenplan", v)}
              checked={props.settings.navStundenplan !== false}
              disabled={props.settings.showStundenplan === false}
            />
            <CheckButton
              text="Info-Button:"
              updater={(v: boolean) => updateSetting("navInfo", v)}
              checked={props.settings.navInfo === true}
            />
            <CheckButton
              text="Einstellungen-Button:"
              updater={(v: boolean) => updateSetting("navEinstellungen", v)}
              checked={props.settings.navEinstellungen === true}
            />
            <div style={{ marginTop: '16px' }}>
              <input type="button" class="fakebutton" value="Willkommens-Box wieder anzeigen" onClick={() => {
                localStorage.removeItem("dismissedWelcome");
                window.location.reload();
              }} />
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h3>Verschiedenes</h3>
          <div class="settings-section-content" id="reset-div">
            <input class="fakebutton" type="button" value="Alle Daten exportieren" onClick={exportAllData} />
            <input type="file" accept=".json" id="backup-upload" style={{ display: 'none' }} ref={backupFileRef} onChange={importAllData} />
            <label class="fakebutton" for="backup-upload">Alle Daten importieren</label>
            <input class="fakebutton" type="button" value="Ausloggen" onClick={logout} />
            <input class="fakebutton red" type="button" value="ALLE Daten löschen" onClick={resetBegin} />
            {resetProgress > 0 && (<div>
              <p>Willst du wirklich alle Daten löschen? Du wirst <b>alle Kurse und Einstellungen</b> verlieren.</p>
              <p><b>Das kann nicht rückgängig gemacht werden!</b></p>
              <Placeholder height="18px" />
              <div>
                <input class="fakebutton red" type="button" value=" Ja! " onClick={reset} />
                <input class="fakebutton" type="button" value=" Nein! " onClick={resetCancel} />
              </div>
            </div>)}
          </div>
        </div>
      </div>)}
    </div>
  );
}
//#endregion

//#region Personal Timetable
function PersonalTimetable(props: {
  courses: CourseInfo[],
  settings: DSBSettings,
  grade: GradeInfo,
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentWeek, setCurrentWeek] = useState<"A" | "B">("A");
  const [timetableData, setTimetableData] = useState<any>({});
  const [currentDayIdx, setCurrentDayIdx] = useState(new Date().getDay() >= 1 && new Date().getDay() <= 5 ? new Date().getDay() - 1 : 0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dayWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [timetableHeight, setTimetableHeight] = useState<number | null>(null);
  const [dsbDataRaw, setDsbDataRaw] = useState<any>(null);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const days = [
    { full: "Montag", short: "Mo" },
    { full: "Dienstag", short: "Di" },
    { full: "Mittwoch", short: "Mi" },
    { full: "Donnerstag", short: "Do" },
    { full: "Freitag", short: "Fr" }
  ];
  const hours = [
    { num: 1, label: "1. Stunde", type: "hour", start: "07:50", end: "08:35" },
    { num: 2, label: "2. Stunde", type: "hour", start: "08:40", end: "09:25" },
    { num: -1, label: "1. große Pause", type: "pause", start: "09:25", end: "09:40" },
    { num: 3, label: "3. Stunde", type: "hour", start: "09:40", end: "10:25" },
    { num: 4, label: "4. Stunde", type: "hour", start: "10:30", end: "11:15" },
    { num: -2, label: "2. große Pause", type: "pause", start: "11:15", end: "11:30" },
    { num: 5, label: "5. Stunde", type: "hour", start: "11:30", end: "12:15" },
    { num: 6, label: "6. Stunde", type: "hour", start: "12:20", end: "13:05" },
    { num: 7, label: "7. Stunde", type: "hour", start: "13:10", end: "13:55" },
    { num: 8, label: "8. Stunde", type: "hour", start: "14:00", end: "14:45" },
    { num: 9, label: "9. Stunde", type: "hour", start: "14:45", end: "15:30" },
    { num: 10, label: "10. Stunde", type: "hour", start: "15:30", end: "16:15" },
  ];

  const isCurrentHour = (dayIdx: number, start?: string, end?: string) => {
    if (currentTime.getDay() !== dayIdx + 1) return false;
    if (!start || !end) return false;

    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const startParts = start.split(":");
    const endParts = end.split(":");
    
    const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
    const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);

    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  };

  useEffect(() => {
    const data = localStorage.getItem("PersonalTimetableData");
    if (data) {
      try { setTimetableData(JSON.parse(data)); } catch (e) { }
    }
    const handler = (e: any) => {
      if (e.detail?.week) {
        const weekStr = e.detail.week as string;
        setCurrentWeek(weekStr.includes("B") ? "B" : "A");
        
        // Auto-select day
        if (weekStr.includes("Montag")) scrollToDay(0);
        else if (weekStr.includes("Dienstag")) scrollToDay(1);
        else if (weekStr.includes("Mittwoch")) scrollToDay(2);
        else if (weekStr.includes("Donnerstag")) scrollToDay(3);
        else if (weekStr.includes("Freitag")) scrollToDay(4);
      }
    };
    window.addEventListener("dsb-week-switch", handler);
    
    const fetchDSB = async () => {
      const user = localStorage.getItem("user");
      const key = localStorage.getItem("key");
      if (user && key) {
        try {
          const res = await fetch("https://kirillathome.uucode.com/api/v1/dsb", { headers: { user, key } });
          if (res.ok) setDsbDataRaw(await res.json());
        } catch(e) {}
      }
    };
    fetchDSB();
    
    return () => window.removeEventListener("dsb-week-switch", handler);
  }, []);

  const saveTimetableData = (newData: any) => {
    setTimetableData(newData);
    localStorage.setItem("PersonalTimetableData", JSON.stringify(newData));
  };

  const copyWeek = () => {
    if (!confirm(`Sicher, dass du die ${currentWeek}-Woche in die ${currentWeek === "A" ? "B" : "A"}-Woche kopieren möchtest?`)) return;
    const newData = { ...timetableData };
    const targetWeek = currentWeek === "A" ? "B" : "A";
    newData[targetWeek] = JSON.parse(JSON.stringify(newData[currentWeek] || {}));
    saveTimetableData(newData);
  };

  const handleCourseChange = (day: string, hourNum: number, value: string) => {
    const newData = { ...timetableData };
    if (!newData[currentWeek]) newData[currentWeek] = {};
    if (!newData[currentWeek][day]) newData[currentWeek][day] = {};
    newData[currentWeek][day][hourNum] = value;
    saveTimetableData(newData);
  };

  const scrollToDay = (idx: number) => {
    setCurrentDayIdx(idx);
    if (containerRef.current) {
      const width = containerRef.current.clientWidth;
      containerRef.current.scrollTo({ left: idx * width, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const width = containerRef.current.clientWidth;
      const scrollLeft = containerRef.current.scrollLeft;
      const newIdx = Math.round(scrollLeft / width);
      if (newIdx !== currentDayIdx) setCurrentDayIdx(newIdx);
    }
  };

  const getCourseInfo = (courseStr: string) => {
    return props.courses.find(c => (c.subject + (c.course ? "-" + c.course : "")) === courseStr);
  };

  const getLastHourForDay = (dayName: string): number => {
    const dayData = timetableData[currentWeek]?.[dayName];
    if (!dayData) return 0;
    let lastHour = 0;
    for (const hourNum in dayData) {
      if (dayData[hourNum]) {
        const num = parseInt(hourNum);
        if (num > lastHour) lastHour = num;
      }
    }
    return lastHour;
  };

  const getVisibleHours = (dayName: string) => {
    if (isEditMode) return hours;
    const lastHour = getLastHourForDay(dayName);
    if (lastHour === 0) return hours.slice(0, 3); // show at least 1st+2nd hour + pause if empty
    // Include all hours up to and including lastHour, plus any pauses before it
    return hours.filter(h => {
      if (h.type === "pause") {
        // Include pause if the next hour after it is <= lastHour
        const pauseIdx = hours.indexOf(h);
        const nextHour = hours.find((hh, i) => i > pauseIdx && hh.type === "hour");
        return nextHour ? nextHour.num <= lastHour : false;
      }
      return h.num <= lastHour;
    });
  };

  // Measure active day wrapper height for smooth resizing
  useEffect(() => {
    const measure = () => {
      const activeWrapper = dayWrapperRefs.current[currentDayIdx];
      if (activeWrapper) {
        setTimetableHeight(activeWrapper.scrollHeight);
      }
    };
    measure();
    // Also re-measure after a short delay to catch any layout shifts
    const timeout = setTimeout(measure, 50);
    return () => clearTimeout(timeout);
  }, [currentDayIdx, currentWeek, isEditMode, timetableData]);

  const getSubstitutionStyle = (dayName: string, hourNum: number, courseStr: string) => {
    if (!dsbDataRaw || !courseStr || !props.grade) return {};
    let subs: Substitution[] = [];
    if (dsbDataRaw.day_one?.day?.includes(dayName)) subs = dsbDataRaw.day_one.substitutions || [];
    else if (dsbDataRaw.day_two?.day?.includes(dayName)) subs = dsbDataRaw.day_two.substitutions || [];
    
    if (subs.length === 0) return {};
    
    const s = subs.find((sub: Substitution) => {
      if (!matchSubstitutionHour(sub.hours, hourNum)) return false;
      return isSubstitutionForCourse(sub, courseStr, props.courses, props.grade);
    });
    
    if (s) {
      if (s.room === "PS1" || s.room === "---") return { backgroundColor: "rgba(239, 68, 68, 0.2)", borderColor: "#ef4444" }; // Red (Ausfall)
      if (s.usual_subject === s.subject) return { backgroundColor: "rgba(59, 130, 246, 0.2)", borderColor: "#3b82f6" }; // Blue (Raumänderung)
      if (s.usual_subject === "&nbsp;") return { backgroundColor: "rgba(59, 130, 246, 0.2)", borderColor: "#3b82f6" }; // Klausur
      return { backgroundColor: "rgba(249, 115, 22, 0.2)", borderColor: "#f97316" }; // Orange (Vertretung)
    }
    return {};
  };

  return (
    <div class="default-div" id="stundenplan">
      <CornerHelpButton 
        title="Stundenplan" 
        helpText="Dein persönlicher Stundenplan. Klicke auf 'Bearbeiten', um deine Fächer für die einzelnen Stunden einzutragen. Tipp: Wenn du vorher unter 'Kurswahl' deine Kurse ausgewählt hast, ist das Eintragen einfacher. (Vergiss nicht auf 'Speichern' zu klicken!). Du kannst mit dem Button 'A-/B-Woche kopieren' außerdem deine eingetragenen Kurse ganz einfach in die jeweils andere Wochenart kopieren."
      />
      <div class="timetable-header-row">
        <h2>Stundenplan</h2>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', paddingRight: '36px' }}>
          <div class="timetable-week-switch">
            <button class={currentWeek === "A" ? "active" : ""} onClick={() => setCurrentWeek("A")}>A-Woche</button>
            <button class={currentWeek === "B" ? "active" : ""} onClick={() => setCurrentWeek("B")}>B-Woche</button>
          </div>
          {isEditMode && (
            <input type="button" class="fakebutton" value={`${currentWeek}-Woche kopieren`} onClick={copyWeek} />
          )}
          <input type="button" class="fakebutton" value={isEditMode ? "Speichern" : "Bearbeiten"} onClick={() => setIsEditMode(!isEditMode)} />
        </div>
      </div>

      <div class="timetable-tabs">
        {days.map((day, idx) => (
          <div key={day.full} class={`timetable-tab ${idx === currentDayIdx ? "active" : ""}`} onClick={() => scrollToDay(idx)}>
            {day.short}
          </div>
        ))}
      </div>

      <div class="timetable-container" ref={containerRef} onScroll={handleScroll}
        style={timetableHeight ? { height: `${timetableHeight}px`, transition: 'height 0.35s cubic-bezier(0.16, 1, 0.3, 1)', overflowY: 'clip' } : undefined}
      >
        <div class="timetable-times-column">
          <h3 class="timetable-day-header" style={{ color: "transparent" }}>Zeit</h3>
          {hours.map((h) => (
            h.type === "pause" ? (
              <div key={`time-spacer-${h.num}`} class="timetable-spacer"></div>
            ) : (
              <div key={`time-${h.num}`} class="timetable-row">
                <div class="timetable-time">{h.label} <span style={{ fontSize: "0.68rem", color: "var(--text-secondary)", display: "block", whiteSpace: "nowrap" }}>{h.start} - {h.end}</span></div>
              </div>
            )
          ))}
        </div>
        {days.map((day, dayIdx) => {
          const visibleHours = getVisibleHours(day.full);
          return (
          <div key={day.full} ref={(el) => { dayWrapperRefs.current[dayIdx] = el; }} class={`timetable-day-wrapper ${dayIdx === currentDayIdx ? 'active' : ''}`}>
            <h3 class="timetable-day-header">{day.full}</h3>
            {visibleHours.map((h) => {
              const activeHighlight = isCurrentHour(dayIdx, h.start, h.end) ? "active-hour-highlight" : "";
              
              return h.type === "pause" ? (
                <div key={h.num} class={`timetable-spacer ${activeHighlight}`}></div>
              ) : (
              <div key={h.num} class={`timetable-row ${activeHighlight}`}>
                <div class="timetable-time">{h.label} <span style={{ fontSize: "0.68rem", color: "var(--text-secondary)", display: "block", whiteSpace: "nowrap" }}>{h.start} - {h.end}</span></div>
                {isEditMode ? (
                  <select class="timetable-edit-select" value={timetableData[currentWeek]?.[day.full]?.[h.num] || ""} onChange={(e) => handleCourseChange(day.full, h.num, (e.target as HTMLSelectElement).value)}>
                    <option value="">--- Frei ---</option>
                    {props.courses.map(c => {
                      const val = c.subject + (c.course ? "-" + c.course : "");
                      return <option value={val} key={val}>{c.subject_name} {c.course}</option>;
                    })}
                  </select>
                ) : (
                  <div class={`timetable-course ${!timetableData[currentWeek]?.[day.full]?.[h.num] ? "empty" : ""}`} style={{ borderColor: getCourseInfo(timetableData[currentWeek]?.[day.full]?.[h.num])?.color || "var(--brighter-color)", ...getSubstitutionStyle(day.full, h.num, timetableData[currentWeek]?.[day.full]?.[h.num]) }}>
                    {timetableData[currentWeek]?.[day.full]?.[h.num] ? (
                      <>
                        <span>{getCourseInfo(timetableData[currentWeek]?.[day.full]?.[h.num])?.subject_name || timetableData[currentWeek]?.[day.full]?.[h.num]}</span>
                        <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                          {getCourseInfo(timetableData[currentWeek]?.[day.full]?.[h.num])?.room || getCourseInfo(timetableData[currentWeek]?.[day.full]?.[h.num])?.course}
                        </span>
                      </>
                    ) : "Frei"}
                  </div>
                )}
              </div>
              )
            })}
          </div>
          );
        })}
      </div>
    </div>
  );
}
//#endregion

//#region Termine
export interface AppEvent {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  location: string;
  allDay: boolean;
}

const parseICal = (icsData: string): AppEvent[] => {
  const events: AppEvent[] = [];
  const lines = icsData.split(/\r?\n/);
  
  let currentEvent: Partial<AppEvent> | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    while (i + 1 < lines.length && (lines[i+1].startsWith(' ') || lines[i+1].startsWith('\t'))) {
      line += lines[++i].substring(1);
    }
    
    if (line.startsWith('BEGIN:VEVENT')) {
      currentEvent = { id: '', allDay: true, location: '' };
    } else if (line.startsWith('END:VEVENT')) {
      if (currentEvent && currentEvent.title && currentEvent.date) {
        currentEvent.id = (currentEvent.title + currentEvent.date.getTime()).replace(/[^a-zA-Z0-9]/g, '');
        events.push(currentEvent as AppEvent);
      }
      currentEvent = null;
    } else if (currentEvent) {
      if (line.startsWith('SUMMARY:')) {
        currentEvent.title = line.substring(8).replace(/\\,/g, ',').replace(/\\;/g, ';');
      } else if (line.startsWith('LOCATION:')) {
        currentEvent.location = line.substring(9).replace(/\\,/g, ',').replace(/\\;/g, ';');
      } else if (line.startsWith('DTSTART')) {
        const colonIdx = line.lastIndexOf(':');
        if (colonIdx !== -1) {
          const dateStr = line.substring(colonIdx + 1);
          const hasTZID = line.includes('TZID=');
          if (dateStr.length >= 8) {
            const y = parseInt(dateStr.substring(0,4));
            const m = parseInt(dateStr.substring(4,6))-1;
            const d = parseInt(dateStr.substring(6,8));
            if (dateStr.length >= 15) {
              const h = parseInt(dateStr.substring(9,11));
              const min = parseInt(dateStr.substring(11,13));
              currentEvent.date = hasTZID ? new Date(y, m, d, h, min) : new Date(Date.UTC(y, m, d, h, min));
              currentEvent.allDay = false;
            } else {
              currentEvent.date = new Date(y, m, d);
              currentEvent.allDay = true;
            }
          }
        }
      } else if (line.startsWith('DTEND')) {
        const colonIdx = line.lastIndexOf(':');
        if (colonIdx !== -1) {
          const dateStr = line.substring(colonIdx + 1);
          if (dateStr.length >= 8) {
            const y = parseInt(dateStr.substring(0,4));
            const m = parseInt(dateStr.substring(4,6))-1;
            const d = parseInt(dateStr.substring(6,8));
            if (dateStr.length >= 15) {
              const hasTZID = line.includes('TZID=');
              const h = parseInt(dateStr.substring(9,11));
              const min = parseInt(dateStr.substring(11,13));
              currentEvent.endDate = hasTZID ? new Date(y, m, d, h, min) : new Date(Date.UTC(y, m, d, h, min));
            } else {
              currentEvent.endDate = new Date(y, m, d);
            }
          }
        }
      }
    }
  }
  return events;
};

const fetchWithCorsProxy = async (targetUrl: string): Promise<string | null> => {
  const proxies = [
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  ];
  for (const makeProxy of proxies) {
    try {
      const res = await fetch(makeProxy(targetUrl));
      if (res.ok) return await res.text();
    } catch {}
  }
  return null;
};

function Events(props: {
  settings: DSBSettings,
}) {
  const [allEvents, setAllEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshSuccess, setRefreshSuccess] = useState<boolean | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(""); // "YYYY-MM"
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  
  const getMonthName = (month: number) => ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"][month];
  const getFullMonthName = (month: number) => ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"][month];

  const [showSkeleton, setShowSkeleton] = useState(true);

  const fetchAllEvents = useCallback(async (): Promise<boolean> => {
      if (loading) return false;
      setLoading(true);
      try {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth(); // 0-indexed
        
        // Build list of months to fetch: current month through end of year (or at least September)
        const monthsToFetch: {year: number, month: number}[] = [];
        const endMonth = Math.max(8, currentMonth); // at least until September (index 8)
        for (let m = currentMonth; m <= endMonth; m++) {
          monthsToFetch.push({ year: currentYear, month: m });
        }
        
        // Fetch all months in parallel
        const allParsed: AppEvent[] = [];
        const seenIds = new Set<string>();
        
        await Promise.all(monthsToFetch.map(async ({ year, month }) => {
          try {
            const monthStr = String(month + 1).padStart(2, '0');
            const targetUrl = `https://www.stiftisches.de/termine/monat/${year}-${monthStr}/?ical=1`;
            const text = await fetchWithCorsProxy(targetUrl);
            if (!text) return;
            const parsed = parseICal(text);
            for (const evt of parsed) {
              // Deduplicate by title + date combo (since cross-month events appear in multiple fetches)
              const evtKey = `${evt.title}_${evt.date.getTime()}_${evt.endDate?.getTime() || ''}`;
              if (!seenIds.has(evtKey)) {
                seenIds.add(evtKey);
                allParsed.push(evt);
              }
            }
          } catch (err) {
            console.error(`Failed to fetch month ${month + 1}`, err);
          }
        }));
        
        const today = new Date();
        today.setHours(0,0,0,0);
        
        const upcoming = allParsed.filter(e => {
          const checkDate = e.endDate ? e.endDate : e.date;
          return checkDate.getTime() >= today.getTime();
        }).sort((a,b) => a.date.getTime() - b.date.getTime());
        
        setAllEvents(upcoming);
        
        // Determine which months have events (including cross-month events)
        const monthSet = new Set<string>();
        for (const evt of upcoming) {
          // Add start month
          const startKey = `${evt.date.getFullYear()}-${String(evt.date.getMonth() + 1).padStart(2, '0')}`;
          monthSet.add(startKey);
          
          // For multi-day events, add all months they span
          if (evt.endDate) {
            let inclusiveEnd = new Date(evt.endDate.getTime());
            if (evt.allDay && inclusiveEnd.getTime() > evt.date.getTime()) {
              inclusiveEnd.setDate(inclusiveEnd.getDate() - 1);
            }
            const cursor = new Date(evt.date.getFullYear(), evt.date.getMonth(), 1);
            const endCursor = new Date(inclusiveEnd.getFullYear(), inclusiveEnd.getMonth(), 1);
            while (cursor <= endCursor) {
              const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`;
              monthSet.add(key);
              cursor.setMonth(cursor.getMonth() + 1);
            }
          }
        }
        
        const sortedMonths = Array.from(monthSet).sort();
        setAvailableMonths(sortedMonths);
        
        // Pre-select current month (or first available if current has no events)
        const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        if (sortedMonths.includes(currentKey)) {
          setSelectedMonth(currentKey);
        } else if (sortedMonths.length > 0) {
          setSelectedMonth(sortedMonths[0]);
        }
        
        return true;
      } catch (err) {
        console.error("Failed to fetch events", err);
        return false;
      } finally {
        setLoading(false);
      }
  }, [loading]);

  const refreshEvents = useCallback(async (): Promise<boolean> => {
    setShowSkeleton(true);
    const status = await fetchAllEvents();
    await new Promise(r => setTimeout(r, 1000));
    setShowSkeleton(false);
    return status;
  }, [fetchAllEvents]);

  useEffect(() => {
    refreshEvents();
  }, [refreshEvents]);

  if (props.settings.showTermine === false) return null;

  // Filter events for the selected month (including multi-day events that span into this month)
  const filteredEvents = selectedMonth ? allEvents.filter(evt => {
    const [yearStr, monthStr] = selectedMonth.split('-');
    const selYear = parseInt(yearStr);
    const selMonth = parseInt(monthStr) - 1; // 0-indexed
    
    const monthStart = new Date(selYear, selMonth, 1);
    const monthEnd = new Date(selYear, selMonth + 1, 0, 23, 59, 59, 999); // last moment of month
    
    let inclusiveEnd = evt.endDate ? new Date(evt.endDate.getTime()) : null;
    if (inclusiveEnd && evt.allDay && inclusiveEnd.getTime() > evt.date.getTime()) {
      inclusiveEnd.setDate(inclusiveEnd.getDate() - 1);
    }
    const eventEnd = inclusiveEnd || evt.date;
    
    // Event overlaps with selected month if it starts before month ends AND ends after month starts
    return evt.date.getTime() <= monthEnd.getTime() && eventEnd.getTime() >= monthStart.getTime();
  }) : allEvents;

  const handleMonthChange = useCallback((e: any) => {
    setSelectedMonth((e.target as HTMLSelectElement).value);
  }, []);

  return (
    <div class="default-div" id="termine">
      <AutoHeight>
      <CornerHelpButton 
        title="Termine" 
        helpText="Hier findest du alle anstehenden Schultermine und Veranstaltungen. Diese werden automatisch aktualisiert."
      />
      <DSBRefreshButton
        getData={refreshEvents}
        success={refreshSuccess}
        setSuccess={setRefreshSuccess}
        style={{ position: 'absolute', top: '16px', right: '48px', zIndex: 10 }}
      />
      <h2>Termine</h2>
      {!loading && availableMonths.length > 0 && (
        <select 
          class="events-month-select"
          style={{ width: '100%', marginTop: '8px' }}
          value={selectedMonth} 
          onChange={handleMonthChange}
        >
          {availableMonths.map(monthKey => {
            const [y, m] = monthKey.split('-');
            return (
              <option key={monthKey} value={monthKey}>
                {getFullMonthName(parseInt(m) - 1)} {y}
              </option>
            );
          })}
        </select>
      )}
      <div class="events-today-badge">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        <span>Heute ist <b>{week[new Date().getDay()]}</b>, der <b>{new Date().getDate() < 10 ? 0 : null}{new Date().getDate()}.{new Date().getMonth() + 1 < 10 ? 0 : null}{new Date().getMonth() + 1}.{new Date().getFullYear()}</b></span>
      </div>
      {showSkeleton ? (
        <div class="events-list" style={{ marginTop: '12px' }}>
          <SkeletonCard type="event" />
          <SkeletonCard type="event" />
          <SkeletonCard type="event" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div class="new-s" style={{ minHeight: '90px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px 20px', textAlign: 'center', marginTop: '12px' }}>
          <b style={{ fontSize: '1.05rem', color: 'var(--text-color)' }}>Aktuell keine Termine</b>
        </div>
      ) : (
        <div class="events-list" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s', pointerEvents: loading ? 'none' : 'auto' }}>
          {filteredEvents.map((evt, idx) => {
            let inclusiveEnd = evt.endDate ? new Date(evt.endDate.getTime()) : null;
            if (inclusiveEnd && evt.allDay && inclusiveEnd.getTime() > evt.date.getTime()) {
              inclusiveEnd.setDate(inclusiveEnd.getDate() - 1);
            }
            const isMultiDay = inclusiveEnd && inclusiveEnd.getTime() !== evt.date.getTime() && inclusiveEnd.getTime() > evt.date.getTime();

            return (
              <div key={evt.id + "-" + selectedMonth} class="event-card" style={{ animation: `tileReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${Math.min(0.2, idx * 0.03)}s both` }}>
                <div class="event-date">
                  <span class="day">{evt.date.getDate()}</span>
                  <span class="month">{getMonthName(evt.date.getMonth())}</span>
                </div>
                <div class="event-details">
                  <p class="event-title">{evt.title}</p>
                  <div class="event-time-loc">
                    {isMultiDay ? (
                      <span>{evt.date.getDate()}. {getMonthName(evt.date.getMonth())} - {inclusiveEnd.getDate()}. {getMonthName(inclusiveEnd.getMonth())}</span>
                    ) : !evt.allDay ? (
                      <span>{String(evt.date.getHours()).padStart(2, '0')}:{String(evt.date.getMinutes()).padStart(2, '0')} Uhr</span>
                    ) : null}
                    {evt.location && (
                      <span>• {evt.location}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </AutoHeight>
    </div>
  );
}
//#endregion

//#region Hausaufgaben
export interface HomeworkItem {
  id: string;
  course: string;
  text: string;
  date: string; // YYYY-MM-DD
}

function Homework(props: {
  courses: CourseInfo[],
  settings: DSBSettings,
}) {
  const [homeworkList, setHomeworkList] = useState<HomeworkItem[]>([]);
  const [currentWeek, setCurrentWeek] = useState<"A" | "B">("A");
  const [timetableData, setTimetableData] = useState<any>({ A: {}, B: {} });

  const [selectedCourse, setSelectedCourse] = useState("");
  const [text, setText] = useState("");
  
  // Default date to tomorrow
  const getDefaultDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const localDate = new Date(tomorrow.getTime() - (tomorrow.getTimezoneOffset() * 60000));
    return localDate.toISOString().split("T")[0];
  };
  const [date, setDate] = useState(getDefaultDate());

  useEffect(() => {
    const data = localStorage.getItem("DSBHomework");
    if (data) {
      try { setHomeworkList(JSON.parse(data)); } catch (e) {}
    }
    const ttData = localStorage.getItem("PersonalTimetableData");
    if (ttData) {
      try { setTimetableData(JSON.parse(ttData)); } catch (e) {}
    }

    const handler = (e: any) => {
      if (e.detail?.week) {
        setCurrentWeek(e.detail.week.includes("A") ? "A" : "B");
      }
    };
    window.addEventListener("dsb-week-switch", handler);
    return () => window.removeEventListener("dsb-week-switch", handler);
  }, []);

  const saveHomework = (newList: HomeworkItem[]) => {
    setHomeworkList(newList);
    localStorage.setItem("DSBHomework", JSON.stringify(newList));
  };

  const calculateNextOccurrence = (courseId: string) => {
    if (!courseId || !timetableData) return "";
    
    const days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
    const today = new Date();
    today.setHours(0,0,0,0);

    for (let i = 1; i <= 14; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      const dayName = days[checkDate.getDay()];
      
      let startDay = today.getDay();
      startDay = startDay === 0 ? 7 : startDay;
      let weekOffset = Math.floor((startDay - 1 + i) / 7);
      let weekIsA = currentWeek === "A";
      if (weekOffset % 2 !== 0) {
        weekIsA = !weekIsA;
      }
      const checkWeek = weekIsA ? "A" : "B";

      const dayData = timetableData[checkWeek]?.[dayName];
      if (dayData) {
        for (const hour in dayData) {
          if (dayData[hour] === courseId) {
            const localDate = new Date(checkDate.getTime() - (checkDate.getTimezoneOffset() * 60000));
            return localDate.toISOString().split("T")[0];
          }
        }
      }
    }
    return ""; 
  };

  const selectCourse = (val: string) => {
    setSelectedCourse(val);
    const nextDate = calculateNextOccurrence(val);
    if (nextDate) {
      setDate(nextDate);
    } else {
      setDate(getDefaultDate());
    }
  };

  const handleCourseSelect = (e: any) => {
    selectCourse(e.target.value);
  };

  const handleAdd = (e: any) => {
    e.preventDefault();
    if (!text || !selectedCourse || !date) return;
    
    const newItem: HomeworkItem = {
      id: Date.now().toString(),
      course: selectedCourse,
      text,
      date
    };
    saveHomework([...homeworkList, newItem]);
    setText("");
  };

  const handleCheck = (id: string) => {
    saveHomework(homeworkList.filter(h => h.id !== id));
  };

  const getDaysUntil = (d: string) => {
    const hwDate = new Date(d);
    hwDate.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);
    const diff = Math.round((hwDate.valueOf() - today.valueOf()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return `vor ${Math.abs(diff)} Tag${Math.abs(diff) !== 1 ? 'en' : ''}`;
    if (diff === 0) return "heute";
    if (diff === 1) return "morgen";
    return `in ${diff} Tagen`;
  };

  const isOverdue = (d: string) => {
    const hwDate = new Date(d);
    hwDate.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);
    return hwDate.valueOf() <= today.valueOf();
  };
  
  const getCourseInfo = (courseStr: string) => {
    return props.courses.find(c => (c.subject + (c.course ? "-" + c.course : "")) === courseStr);
  };

  const getTodaysCourses = () => {
    const days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
    const today = new Date();
    const dayName = days[today.getDay()];
    
    const dayData = timetableData[currentWeek]?.[dayName];
    if (!dayData) return [];
    
    const courseIds = Object.values(dayData).filter(Boolean) as string[];
    const uniqueCourseIds = [...new Set(courseIds)];
    
    return uniqueCourseIds.map(id => {
      const course = props.courses.find(c => (c.subject + (c.course ? "-" + c.course : "")) === id);
      return course ? { id, subject: course.subject } : null;
    }).filter(Boolean);
  };

  const [listRef] = useAutoAnimate();

  if (props.settings.showHomework === false) return null;

  const todaysCourses = getTodaysCourses();

  return (
    <div class="default-div" id="hausaufgaben">
      <AutoHeight>
      <h2>Hausaufgaben</h2>
      <CornerHelpButton 
        title="Hausaufgaben" 
        helpText="Hier kannst du deine Hausaufgaben notieren. Damit diese nach Fächern sortiert und im Stundenplan angezeigt werden können, solltest du vorher deinen Stundenplan ausfüllen."
      />
      <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {todaysCourses.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {todaysCourses.map(c => (
                <button 
                  type="button" 
                  key={c.id}
                  onClick={() => selectCourse(c.id)}
                  style={{ 
                    padding: '6px 14px', 
                    borderRadius: 'var(--rounding-sm)', 
                    backgroundColor: selectedCourse === c.id ? 'var(--accent-color)' : 'var(--input-bg)', 
                    color: selectedCourse === c.id ? '#fff' : 'var(--text-color)', 
                    border: `1px solid ${selectedCourse === c.id ? 'var(--accent-color)' : 'var(--brighter-color)'}`,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  {c.subject}
                </button>
              ))}
            </div>
          )}
          <select value={selectedCourse} onChange={handleCourseSelect} required>
            <option value="" disabled>Kurs wählen...</option>
            {props.courses.map(c => {
              const val = c.subject + (c.course ? "-" + c.course : "");
              return <option value={val} key={val}>{c.subject_name} {c.course}</option>;
            })}
          </select>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Abgabe bis:</label>
            <input type="date" value={date} onChange={(e) => setDate((e.target as HTMLInputElement).value)} style={{ flex: 1, padding: '10px 8px' }} required />
          </div>
        </div>
        <input type="text" placeholder="Aufgabe (z.B. S. 42 Nr. 3)" value={text} onChange={(e) => setText((e.target as HTMLInputElement).value)} style={{ width: '100%', boxSizing: 'border-box' }} required />
        <input type="submit" class="fakebutton" value="Hinzufügen" style={{ margin: 0, width: '100%', height: '42px', padding: '0 16px', boxSizing: 'border-box' }} />
      </form>

      <div ref={listRef} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
        {homeworkList.sort((a,b) => new Date(a.date).valueOf() - new Date(b.date).valueOf()).map(hw => {
          const course = getCourseInfo(hw.course);
          const overdue = isOverdue(hw.date);
          
          return (
            <div key={hw.id} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
              backgroundColor: overdue ? 'var(--s-free-bg)' : 'var(--input-bg)',
              border: `1px solid ${overdue ? 'var(--s-free-border)' : (course?.color || 'var(--brighter-color)')}`,
              borderRadius: 'var(--rounding)'
            }}>
              <button
                onClick={() => handleCheck(hw.id)}
                style={{
                  width: '28px', height: '28px', flexShrink: 0,
                  borderRadius: '50%', border: `2px solid ${overdue ? 'var(--s-free-border)' : (course?.color || 'var(--accent-color)')}`,
                  background: 'transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'var(--transition-fast)', color: 'transparent',
                  padding: 0
                }}
                aria-label="Erledigt"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <b style={{ color: course?.color || 'var(--text-color)', fontSize: '0.85rem' }}>{course?.subject_name} {course?.course}</b>
                  <span style={{ fontSize: '0.8rem', color: overdue ? 'var(--s-free-text)' : 'var(--text-secondary)', fontWeight: overdue ? 600 : 400 }}>
                    {overdue
                      ? 'Überfällig!'
                      : `${new Date(hw.date).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' })} (${getDaysUntil(hw.date)})`
                    }
                  </span>
                </div>
                <span style={{ fontSize: '0.95rem', wordWrap: 'break-word' }}>{hw.text}</span>
              </div>
            </div>
          )
        })}
        {homeworkList.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 16px', backgroundColor: 'var(--input-bg)', borderRadius: 'var(--rounding)', border: '1px solid var(--brighter-color)', animation: 'tileReveal 0.4s ease-out backwards' }}>
            <b style={{ display: 'block', fontSize: '1.05rem' }}>Keine offenen Hausaufgaben</b>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>Trage oben eine neue Hausaufgabe ein, um sie hier zu sehen.</p>
          </div>
        )}
      </div>
      </AutoHeight>
    </div>
  );
}
//#endregion

//#region WelcomeBox
function WelcomeBox(props: {
  onDismiss: () => void,
  grade: GradeInfo,
  setGrade: Function
}) {
  const handleGradeChange = (e: any) => {
    const val = (e.target as HTMLSelectElement).value;
    // For grades 5-10, split into name + letter (e.g. "7a" -> gradeName "7", gradeLetter "a")
    // For EF/Q1/Q2, just set gradeName
    let gradeName = val;
    let gradeLetter = "";
    const match = val.match(/^(\d+)([a-e])$/);
    if (match) {
      gradeName = match[1];
      gradeLetter = match[2];
    }
    const newGrade: GradeInfo = { gradeName, gradeLetter };
    localStorage.setItem('grade', JSON.stringify(newGrade));
    props.setGrade(newGrade);
  };

  const currentValue = props.grade.gradeLetter 
    ? props.grade.gradeName + props.grade.gradeLetter 
    : props.grade.gradeName;

  return (
    <div class="default-div" style={{ borderColor: 'var(--accent-color)', backgroundColor: 'var(--accent-light)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <h2 style={{ color: 'var(--accent-color)', margin: 0 }}>Willkommen zu DSB Mobile 2.0!</h2>
        <button 
          onClick={props.onDismiss}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px' }}
          aria-label="Schließen"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <label style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-color)' }}>Deine Stufe/Klasse:</label>
        <select 
          value={currentValue} 
          onChange={handleGradeChange}
          style={{ flex: '0 0 auto', width: 'auto', minWidth: '80px' }}
        >
          <option value="" disabled>Wählen...</option>
          <option value="5a">5a</option>
          <option value="5b">5b</option>
          <option value="5c">5c</option>
          <option value="5d">5d</option>
          <option value="5e">5e</option>
          <option value="6a">6a</option>
          <option value="6b">6b</option>
          <option value="6c">6c</option>
          <option value="6d">6d</option>
          <option value="6e">6e</option>
          <option value="7a">7a</option>
          <option value="7b">7b</option>
          <option value="7c">7c</option>
          <option value="7d">7d</option>
          <option value="7e">7e</option>
          <option value="8a">8a</option>
          <option value="8b">8b</option>
          <option value="8c">8c</option>
          <option value="8d">8d</option>
          <option value="8e">8e</option>
          <option value="9a">9a</option>
          <option value="9b">9b</option>
          <option value="9c">9c</option>
          <option value="9d">9d</option>
          <option value="9e">9e</option>
          <option value="10a">10a</option>
          <option value="10b">10b</option>
          <option value="10c">10c</option>
          <option value="10d">10d</option>
          <option value="10e">10e</option>
          <option value="EF">EF</option>
          <option value="Q1">Q1</option>
          <option value="Q2">Q2</option>
        </select>
      </div>
      <p style={{ color: 'var(--text-color)' }}>
        Hier ein paar Tipps für den Einstieg:
      </p>
      <ul style={{ color: 'var(--text-color)', fontSize: '0.95rem' }}>
        <li>Unter <b>Kurswahl</b> kannst du deine genauen Fächer eintragen. Dann werden dir im Vertretungsplan nur noch Stunden angezeigt, die dich wirklich betreffen (dafür musst du den Filter bei den Vertretungen auf "Nur deine Kurse/Fächer" ändern).</li>
        <li>Deine Kurswahl macht es dir außerdem viel leichter, deinen eigenen <b>Stundenplan</b> und deine <b>Hausaufgaben</b> mit deinen Fächern auszufüllen.</li>
        <li>In den <b>Einstellungen</b> kannst du die Navigationsleiste komplett personalisieren und das Erscheinungsbild der Seite mit Themes anpassen.</li>
      </ul>
    </div>
  );
}
//#endregion




const createClickableHighlight = (children: preact.ComponentChildren, targetId: string) => {
  return (
    <b class="overview-highlight clickable" onClick={(e) => {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) {
        const headerOffset = 100;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
      <span style={{ whiteSpace: 'normal' }}>{children}</span>
      <ExternalLinkIcon data-fade-icon={true} width="16" height="16" style={{ display: 'inline-block', verticalAlign: 'baseline', transform: 'translateY(2px)', marginLeft: '4px', color: 'var(--accent-color)' }} />
    </b>
  );
};

//#region OverviewBox
function OverviewBox(props: { grade: GradeInfo, courses: CourseInfo[], settings: DSBSettings }) {
  const [textParts, setTextParts] = useState<preact.ComponentChildren[] | null>(null);
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const [refreshSuccess, setRefreshSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setExpandedHeight(entry.target.scrollHeight);
      }
    });
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [textParts]);


  const fetchData = useCallback(async () => {
      setTextParts(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const parts: preact.ComponentChildren[] = [];
        const now = new Date();
        const hour = now.getHours();
        
        // Helper formatting list
        const formatList = (arr: string[]) => {
          if (arr.length === 0) return "";
          if (arr.length === 1) return arr[0];
          return arr.slice(0, -1).join(", ") + " und " + arr[arr.length - 1];
        };

        const getCourseInfo = (courseStr: string) => {
          return props.courses.find(c => (c.subject + (c.course ? "-" + c.course : "")) === courseStr);
        };
        const getSubjectName = (courseStr: string) => {
          const info = getCourseInfo(courseStr);
          return info ? info.subject_name : courseStr;
        };

        const formatDateToDayMonth = (dateObj: Date) => {
           return dateObj.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }).replace(/\.+$/, '') + ".";
        };

        const addPart = (content: preact.ComponentChildren) => {
           parts.push(<span style={{ display: 'block', marginBottom: '8px' }}>{content}</span>);
        };

        // 1. Greeting & Time
        let greeting = "Guten Tag";
        if (hour < 10) greeting = "Guten Morgen";
        else if (hour > 17) greeting = "Guten Abend";

        const days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
        const dayName = days[now.getDay()];
        const timeStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
        
        addPart(<>{greeting}! Heute ist <b>{dayName}</b>, der {now.toLocaleDateString('de-DE').replace(/\.+$/, '')}. Es ist aktuell <b>{timeStr} Uhr</b>.</>);
        
        // --- 2. Fetch DSB Data ---
        let nextSchoolDayName = "";
        const user = localStorage.getItem("user");
        const key = localStorage.getItem("key");
        
        let dsbDataRaw: any = null;
        if (user && key) {
          try {
            const dsbRes = await fetch("https://kirillathome.uucode.com/api/v1/dsb", { headers: { user, key } });
            if (dsbRes.ok) {
              dsbDataRaw = await dsbRes.json();
            }
          } catch(e) {}
        }
        
        const weekType = dsbDataRaw && dsbDataRaw.day_one && dsbDataRaw.day_one.day && dsbDataRaw.day_one.day.includes("B") ? "B" : "A";
        let isSchoolDayOver = calcIsSchoolDayOver(weekType);

        let isTomorrow = isSchoolDayOver;
        let targetDay: any = null;

        if (dsbDataRaw) {
          const isToday = (dString: string) => {
            const dateParts = dString.split('.');
            if (dateParts.length >= 3) {
              return parseInt(dateParts[0]) === now.getDate() && parseInt(dateParts[1]) === now.getMonth() + 1 && parseInt(dateParts[2]) === now.getFullYear();
            }
            return false;
          };

          targetDay = dsbDataRaw.day_one;
          
          if (isToday(dsbDataRaw.day_two.date)) {
            targetDay = dsbDataRaw.day_two;
          } else if (isToday(dsbDataRaw.day_one.date) && isSchoolDayOver) {
            targetDay = dsbDataRaw.day_two;
            isTomorrow = true;
          } else if (!isToday(dsbDataRaw.day_one.date) && !isToday(dsbDataRaw.day_two.date)) {
            isTomorrow = true;
            
            const isPastDay = (dString: string) => {
              const parts = dString.split('.');
              if (parts.length >= 3) {
                const dYear = parseInt(parts[2]);
                const dMonth = parseInt(parts[1]);
                const dDate = parseInt(parts[0]);
                if (dYear < now.getFullYear()) return true;
                if (dYear === now.getFullYear() && dMonth < now.getMonth() + 1) return true;
                if (dYear === now.getFullYear() && dMonth === now.getMonth() + 1 && dDate < now.getDate()) return true;
              }
              return false;
            };
            
            if (isPastDay(dsbDataRaw.day_one.date)) {
               targetDay = dsbDataRaw.day_two;
            }
          }
          
          // Determine next school day name from API
          if (isTomorrow && targetDay) {
            const dParts = targetDay.date.split('.');
            if (dParts.length >= 3) {
               const dObj = new Date(parseInt(dParts[2]), parseInt(dParts[1]) - 1, parseInt(dParts[0]));
               nextSchoolDayName = days[dObj.getDay()];
            } else {
               nextSchoolDayName = targetDay.day;
            }
          }
        }

        // --- 3. Timetable ---
        let ttSubjects: string[] = [];
        try {
          const ttDataRaw = localStorage.getItem("PersonalTimetableData");
          if (ttDataRaw) {
            const ttData = JSON.parse(ttDataRaw);
            let currentWeek = "A";
            if (targetDay && targetDay.day) {
              currentWeek = targetDay.day.includes("B") ? "B" : "A";
            }
            const weekData = ttData[currentWeek];
            if (weekData) {
              if (isTomorrow) {
                // Next school day fallback logic
                let checkDay = nextSchoolDayName;
                if (!checkDay) {
                  let offset = 1;
                  if (now.getDay() === 5) offset = 3; // Friday -> Monday
                  else if (now.getDay() === 6) offset = 2; // Saturday -> Monday
                  checkDay = days[(now.getDay() + offset) % 7];
                }
                const dayData = weekData[checkDay];
                if (dayData) {
                  ttSubjects = Object.keys(dayData).filter(k => {
                    if (!dayData[k]) return false;
                    if (targetDay && targetDay.substitutions) {
                      const subs = targetDay.substitutions;
                      const isCancelled = subs.some((s: Substitution) => {
                        if (!matchSubstitutionHour(s.hours, parseInt(k))) return false;
                        if (s.room !== "PS1" && s.room !== "---") return false;
                        return isSubstitutionForCourse(s, dayData[k], props.courses, props.grade);
                      });
                      if (isCancelled) return false;
                    }
                    return true;
                  }).map(k => getSubjectName(dayData[k] as string));
                }
              } else {
                // Today remaining hours
                const todayData = weekData[dayName];
                if (todayData) {
                  const hourEndTimes: Record<number, string> = {
                    1: "08:35", 2: "09:25", 3: "10:25", 4: "11:15",
                    5: "12:15", 6: "13:05", 7: "13:55", 8: "14:45",
                    9: "15:30", 10: "16:15"
                  };
                  const currentMinutes = now.getHours() * 60 + now.getMinutes();
                  ttSubjects = Object.keys(todayData)
                    .filter(k => {
                      const hourNum = parseInt(k);
                      if (!todayData[k]) return false;
                      const endStr = hourEndTimes[hourNum];
                      if (!endStr) return false;
                      const [endH, endM] = endStr.split(":").map(Number);
                      
                      if (targetDay && targetDay.substitutions) {
                        const subs = targetDay.substitutions;
                        const isCancelled = subs.some((s: Substitution) => {
                          if (!matchSubstitutionHour(s.hours, hourNum)) return false;
                          if (s.room !== "PS1" && s.room !== "---") return false;
                          return isSubstitutionForCourse(s, todayData[k], props.courses, props.grade);
                        });
                        if (isCancelled) return false;
                      }
                      
                      return currentMinutes < endH * 60 + endM;
                    })
                    .map(k => getSubjectName(todayData[k]));
                }
              }
            }
          }
        } catch(e) {}
        
        // Remove duplicates from ttSubjects
        ttSubjects = [...new Set(ttSubjects)];

        if (ttSubjects.length > 0) {
          const subjectStr = formatList(ttSubjects);
          if (isTomorrow) {
            const dayStr = nextSchoolDayName || "Morgen";
            addPart(<>Am {dayStr} stehen {createClickableHighlight(subjectStr, "stundenplan")} auf deinem Plan.</>);
          } else {
            addPart(<>Du hast heute noch Unterricht in {createClickableHighlight(subjectStr, "stundenplan")}.</>);
          }
        }

        // --- 4. Substitutions ---
        if (dsbDataRaw && targetDay) {
            const subs = targetDay.substitutions || [];
            const filterStage = localStorage.getItem("filterStage") || FilterStage.GRADE;
            
            const filtered = subs.filter((s: Substitution) => {
              if (filterStage === FilterStage.ALL) return true;
              if (!s.classes.includes(props.grade.gradeName)) return false;
              if (props.grade.gradeLetter !== "" && !s.classes.includes(props.grade.gradeLetter)) return false;
              
              if (filterStage === FilterStage.COURSES) {
                for (const c of props.courses) {
                  const name = c.course !== "" ? c.subject + " " + c.course[0] + c.course[2] : c.subject;
                  let usual = s.usual_subject;
                  if (usual[1] === " ") usual = usual[0] + usual.substring(2);
                  let subj = s.subject;
                  if (subj[1] === " ") subj = subj[0] + subj.substring(2);
                  if (usual === name || subj === name) return true;
                }
                return false;
              }
              return true;
            });
            
            const relevantSubstitutions = filtered.length;
            const timeText = isTomorrow ? "Für den nächsten Schultag" : "Für heute";
            
            if (relevantSubstitutions > 0) {
              if (filterStage === FilterStage.COURSES) {
                 const substSubjects = [...new Set(filtered.map(s => {
                    // Try to match usual_subject to our courses for readable name
                    let usual = s.usual_subject;
                    if (usual[1] === " ") usual = usual[0] + usual.substring(2);
                    const courseInfo = props.courses.find(c => {
                       const name = c.course !== "" ? c.subject + " " + c.course[0] + c.course[2] : c.subject;
                       return name === usual;
                    });
                    return courseInfo ? courseInfo.subject_name : s.usual_subject;
                 }))];
                 addPart(<>{timeText} liegen {createClickableHighlight(<>relevante Vertretungen in {formatList(substSubjects)}</>, "vertretungsplan")} für dich vor.</>);
              } else {
                 addPart(<>{timeText} liegen {createClickableHighlight(<>{relevantSubstitutions} relevante Vertretungen</>, "vertretungsplan")} für deine Stufe vor.</>);
              }
            } else {
              addPart(<>{timeText} hast du nach aktuellem Stand {createClickableHighlight("keine Vertretungen", "vertretungsplan")}.</>);
            }
        }

        // --- 5. Homework ---
        const hwRaw = localStorage.getItem("DSBHomework");
        if (hwRaw) {
          try {
            const hw = JSON.parse(hwRaw);
            if (hw.length > 0) {
              const hwSubjects: string[] = Array.from(new Set(hw.map((h: any) => getSubjectName(h.course) as string)));
              addPart(<>Du hast noch Hausaufgaben in {createClickableHighlight(formatList(hwSubjects), "hausaufgaben")} zu erledigen.</>);
            } else {
              addPart(<>Du hast momentan keine offenen Hausaufgaben.</>);
            }
          } catch(e) {}
        } else {
           addPart(<>Du hast momentan keine offenen Hausaufgaben.</>);
        }
        
        // --- 6. Exams ---
        try {
          const listName = localStorage.getItem("examList");
          if (listName && user && key) {
            const stringToDate = (str: string): Date => { 
              const s = str.split(".");
              return new Date(`${s[2]}-${s[1]}-${s[0]}T16:00:00`);
            };
            const examRes = await fetch("https://kirillathome.uucode.com/api/v1/exams/" + listName, { headers: { user, key } });
            if (examRes.ok) {
               const rawExamDays = await examRes.json() as ExamDay[];
               let examStrings: preact.ComponentChildren[] = [];
               
               for (const ed of rawExamDays) {
                 const examDate = stringToDate(ed.date);
                 const diffTime = examDate.getTime() - now.getTime();
                 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                 
                 // Show exams happening today or in the next 14 days
                 if (diffDays >= -1 && diffDays <= 14) { 
                   let dayExams: string[] = [];
                   for (const ex of ed.exams) {
                     const isRelevant = props.courses.filter(c => !!c.written && (c.course === "" ? c.subject === ex.course.split("-")[0] : c.subject === ex.course.split("-")[0] && c.course === ex.course.split("-")[1])).length > 0;
                     if (isRelevant) {
                       dayExams.push(getSubjectName(ex.course));
                     }
                   }
                   dayExams = [...new Set(dayExams)];
                   if (dayExams.length > 0) {
                     const isToday = examDate.getDate() === now.getDate() && examDate.getMonth() === now.getMonth();
                     const isTomorrowExam = examDate.getDate() === new Date(now.getTime() + 86400000).getDate() && examDate.getMonth() === new Date(now.getTime() + 86400000).getMonth();
                     
                     let dateText = `Am ${formatDateToDayMonth(examDate)}`;
                     if (isToday) dateText = "Heute";
                     else if (isTomorrowExam) dateText = "Morgen";
                     
                     examStrings.push(<>{dateText} schreibst du eine Klausur in {createClickableHighlight(formatList(dayExams), "klausuren")}.</>);
                   }
                 }
               }
               
               if (examStrings.length > 0) {
                 examStrings.forEach(s => addPart(s));
               }
            }
          }
        } catch(e) {}

        // --- 7. Events ---
        try {
          const year = now.getFullYear();
          const month = now.getMonth() + 1;
          const monthStr = month < 10 ? '0' + month : month.toString();
          // We might also want to fetch last month to be completely safe for overlapping events, but for simplicity we rely on the same endpoint (sometimes it includes overlaps).
          const eventsData = await fetchWithCorsProxy(`https://www.stiftisches.de/termine/monat/${year}-${monthStr}/?ical=1`);
          if (eventsData) {
            const lines = eventsData.split('\n');
            let inEvent = false;
            let eventStart = "";
            let eventEnd = "";
            let summary = "";
            let eventComponents: preact.ComponentChildren[] = [];
            
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i].trim();
              if (line === "BEGIN:VEVENT") {
                 inEvent = true;
                 eventStart = "";
                 eventEnd = "";
                 summary = "";
              }
              else if (line === "END:VEVENT") {
                if (eventStart && summary && !summary.toLowerCase().includes("ferien")) {
                  const parseDate = (dStr: string) => new Date(parseInt(dStr.substring(0, 4)), parseInt(dStr.substring(4, 6)) - 1, parseInt(dStr.substring(6, 8)));
                  
                  const dStart = parseDate(eventStart);
                  let dEnd = eventEnd ? parseDate(eventEnd) : dStart;
                  
                  // ICAL DTEND for all-day events is usually the day AFTER the event ends (exclusive).
                  // Subtract 1 day from DTEND if it differs from start
                  if (eventEnd && dEnd.getTime() > dStart.getTime()) {
                     dEnd = new Date(dEnd.getTime() - 86400000); 
                  }
                  
                  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                  
                  // Check if event is currently ongoing
                  const isOngoing = todayMidnight.getTime() >= dStart.getTime() && todayMidnight.getTime() <= dEnd.getTime();
                  // Check if event starts in the future within 7 days
                  const diffStart = Math.ceil((dStart.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24));
                  const isUpcoming = diffStart > 0 && diffStart <= 7;
                  
                  if (isOngoing || isUpcoming) {
                    if (isOngoing) {
                       if (dStart.getTime() === dEnd.getTime()) {
                         eventComponents.push(<>Heute ist {createClickableHighlight(summary, "termine")}.</>);
                       } else {
                         eventComponents.push(<>Aktuell findet {createClickableHighlight(summary, "termine")} statt (bis {formatDateToDayMonth(dEnd)}).</>);
                       }
                    } else if (isUpcoming) {
                       const isTomorrowEvent = diffStart === 1;
                       let dateText = `Am ${formatDateToDayMonth(dStart)}`;
                       if (isTomorrowEvent) dateText = "Morgen";
                       
                       if (dStart.getTime() === dEnd.getTime()) {
                         eventComponents.push(<>{dateText} ist {createClickableHighlight(summary, "termine")}.</>);
                       } else {
                         eventComponents.push(<>{dateText} beginnt {createClickableHighlight(summary, "termine")} (bis {formatDateToDayMonth(dEnd)}).</>);
                       }
                    }
                  }
                }
                inEvent = false;
              } else if (inEvent) {
                if (line.startsWith("DTSTART")) {
                  const p = line.split(":");
                  if (p.length > 1) eventStart = p[1].trim();
                } else if (line.startsWith("DTEND")) {
                  const p = line.split(":");
                  if (p.length > 1) eventEnd = p[1].trim();
                } else if (line.startsWith("SUMMARY:")) {
                  summary = line.substring(8).trim();
                }
              }
            }
            if (eventComponents.length > 0) {
               eventComponents.forEach(s => addPart(s));
            }
          }
        } catch(e) {}

        setTextParts(parts);
        return true;
      } catch (e) {
        console.error("OverviewBox error:", e);
        setTextParts([<>Willkommen beim Vertretungsplan!</>]);
        return false;
      }
  }, [props.grade, props.courses]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div class="default-div" style={{ border: '1px solid var(--accent-color)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)', position: 'relative' }}>
      <h2 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        Tagesübersicht
      </h2>
      <DSBRefreshButton
        getData={fetchData}
        success={refreshSuccess}
        setSuccess={setRefreshSuccess}
        className="overview-toggle-btn"
        style={{ right: '54px' }}
        iconSize="16"
      />
      <button
        type="button"
        class={`overview-toggle-btn ${expanded ? 'expanded' : ''}`}
        onClick={() => setExpanded(!expanded)}
        aria-label={expanded ? 'Einklappen' : 'Ausklappen'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {!textParts ? (
        <div style={{ height: '110px', display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
          <div style={{ width: '85%', height: '18px', borderRadius: '4px' }} class="skeleton-shimmer" />
          <div style={{ width: '60%', height: '18px', borderRadius: '4px' }} class="skeleton-shimmer" />
          <div style={{ width: '75%', height: '18px', borderRadius: '4px' }} class="skeleton-shimmer" />
        </div>
      ) : (
        <div 
          class="overview-text-wrapper" 
          style={{ 
            height: expanded ? (expandedHeight ? `${expandedHeight}px` : 'auto') : '110px'
          }}
        >
        <p class="overview-text" style={{ margin: 0 }} ref={contentRef}>
          
          {(() => {
            let wordIndex = 0;
            const processNode = (node: any): any => {
              if (typeof node === "string" || typeof node === "number") {
                const nodeStr = node.toString();
                return nodeStr.split(/(\s+)/).map((word: string, idx: number) => {
                  if (!word.trim()) return word;
                  const delay = 0.5 + (wordIndex++) * 0.04;
                  return <span class="fade-word" style={{ animationDelay: delay + 's' }} key={wordIndex}>{word}</span>;
                });
              }
              if (Array.isArray(node)) {
                return node.map(processNode);
              }
              if (node && typeof node === "object" && node.props) {
                if (node.props['data-fade-icon']) {
                  const delay = 0.5 + (wordIndex++) * 0.04;
                  return <span class="fade-word" style={{ animationDelay: delay + 's', display: 'inline-block' }} key={wordIndex}>{node}</span>;
                }
                return {
                  ...node,
                  props: {
                    ...node.props,
                    children: processNode(node.props.children)
                  }
                };
              }
              return node;
            };
            return textParts.map((part, i) => <span key={i}>{processNode(part)}</span>);
          })()}
          <span style={{ display: 'block', marginTop: '12px', fontSize: '0.8em', fontStyle: 'italic', opacity: 0.7 }}>
            Dieses Feature befindet sich in der Testphase, Informationen können Fehler enthalten.
          </span>

        </p>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4em',
          background: 'linear-gradient(to bottom, transparent, var(--foreground-color) 95%)',
          pointerEvents: 'none',
          opacity: expanded ? 0 : 1,
          transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }} />
      </div>
      )}
    </div>
  );
}
//#endregion


//#region the big one

export default function DSBWidgets(props: {
  version: string;
}) { // main component that nests everything
  const [loggedIn, setLoggedIn] = useState(undefined); // hack to not show the login panel on page load
  const [showWelcome, setShowWelcome] = useState(false);
  const [grade, setGrade] = useState({gradeName: "Q1", gradeLetter: ""} as GradeInfo); // it has to be this way cause fuck me I guess
  const [courses, setCourses] = useState(Array<CourseInfo>(0));
  const [settings, setSettings] = useState(
    {
      easterEggs: true,
      showCourses: true,
      showCredits: true,
      oldExams: false,
      parasites: ParasitesHandler.SHORTEN,
      exams: ExamVisibility.SORTED,
      advancedCourses: false,
      yellowPaint: true, // tell me it didn't happen. tell me it didn't snow.
      newDesign: true, // it snew
      theme: "light",
    } as DSBSettings); // what

  const subjectSelectRef = useRef(null);
  const [showLoading, setShowLoading] = useState(false);
  const [welcomeWrapper] = useAutoAnimate();

  useEffect(() => {
    validateCredentials().then((valid) => {
      setLoggedIn(valid); // log in if the credentials are valid
    });
    
    if (localStorage.getItem("dismissedWelcome") !== "true") {
      setShowWelcome(true);
    }

    const loadingTimeout = setTimeout(() => setShowLoading(true), 2500);
    return () => clearTimeout(loadingTimeout);
  }, []);

  const dismissWelcome = () => {
    localStorage.setItem("dismissedWelcome", "true");
    setShowWelcome(false);
  };

  useEffect(() => {
    if (settings.theme && settings.theme !== "system") {
      document.documentElement.setAttribute('data-theme', settings.theme);
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [settings.theme]);

  return (
    <div>
      <div class="center">
        {loggedIn === undefined && showLoading && (
          <div class="default-div" style={{ animation: 'fadeInScale 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
            <h2>Lade, bitte warten...</h2>
          </div>
        )}
        {loggedIn === false && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
            <DSBLogin setLoggedIn={setLoggedIn} />
            <div class="default-div" style={{ borderColor: 'var(--accent-color)' }}>
              <h3 style={{ color: 'var(--accent-color)', marginTop: 0, marginBottom: '12px' }}>App installieren (PWA)</h3>
              <p style={{ color: 'var(--text-color)' }}>Du kannst diese Webseite als Web-App (PWA) auf deinem Handy installieren, um sie wie eine normale App zu nutzen:</p>
              <ul style={{ fontSize: '0.9rem', color: 'var(--text-color)' }}>
                <li><b>iOS (Safari):</b> Tippe auf das Teilen-Symbol (Viereck mit Pfeil nach oben) und wähle "Zum Home-Bildschirm".</li>
                <li><b>Android (Chrome):</b> Tippe auf das Menü (drei Punkte) und wähle "App installieren" oder "Zum Startbildschirm zufügen".</li>
              </ul>
            </div>
          </div>
        )}
        {loggedIn && (
          <div class="center-rows" ref={welcomeWrapper}>
            {showWelcome && <WelcomeBox onDismiss={dismissWelcome} grade={grade} setGrade={setGrade} />}
            {settings.showOverview !== false && <OverviewBox grade={grade} courses={courses} settings={settings} />}
            <DSBTable grade={grade} courses={courses} settings={settings} />
            
            {(settings.widgetOrder || ['klausuren', 'kurswahl', 'stundenplan', 'termine', 'hausaufgaben']).map((widgetId: string) => {
              if (widgetId === 'klausuren' && settings.exams !== 'none' && (grade.gradeName === "EF" || grade.gradeName === "Q1" || grade.gradeName === "Q2")) {
                return <ExamList key="klausuren" settings={settings} subjectSelectRef={subjectSelectRef} courses={courses} grade={grade} />;
              }
              if (widgetId === 'kurswahl' && settings.showCourses !== false) {
                return <CourseList key="kurswahl" grade={grade} setGrade={setGrade} courses={courses} setCourses={setCourses} subjectSelectRef={subjectSelectRef} settings={settings} />;
              }
              if (widgetId === 'stundenplan' && settings.showStundenplan !== false) {
                return <PersonalTimetable key="stundenplan" settings={settings} courses={courses} grade={grade} />;
              }
              if (widgetId === 'termine' && settings.showTermine !== false) {
                return <Events key="termine" settings={settings} />;
              }
              if (widgetId === 'hausaufgaben' && settings.showHomework !== false) {
                return <Homework key="hausaufgaben" settings={settings} courses={courses} />;
              }
              return null;
            })}

            <Settings settings={settings} setSettings={setSettings} grade={grade} courses={courses} setCourses={setCourses} />
            <div class="default-div" id="informationen">
              <h2>Informationen</h2>
  

              {/* <p>Der "zum Kalender hinzufügen"-Knopf macht nichts. Er ist nur sehr ästhetisch.</p>
              <p>Aktuell ist das Vertretungsplan-anzeige-ding sehr bloated und unschön. Ich schaue mal, ob ich evtl. <span class="red">farbige Markierungen</span> hinzufüge oder es komplett redesigne.</p>
              <p>Wahrscheinlich wird das aber das letzte sein, um was ich diese Webseite erweitere. <sup><i>(außer wenn jemand Lust hat, CSS-Themes dieser Seite beizutragen)</i></sup></p> */}
  
              <p>Diese Webseite basiert auf dem DSB-Scraper von Kirill (kirillathome)</p>
              <p><b>Hinweis:</b> Alle deine eingetragenen Daten (wie Kurse, Stundenplan und Einstellungen) werden ausschließlich lokal auf deinem Gerät gespeichert.</p>
              <p><b>Wichtig:</b> Die hier bereitgestellten Daten (wie der Vertretungsplan) können Fehler aufweisen. Bitte vergewissere dich bei Unklarheiten zusätzlich am schwarzen Brett der Schule.</p>

              <Placeholder height='10px' />
              <h3>Drittanbieter-Services</h3>
              <p>Diese Webseite nutzt folgende externe Dienste:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ padding: '10px 14px', backgroundColor: 'var(--input-bg)', border: '1px solid var(--brighter-color)', borderRadius: 'var(--rounding-sm)', fontSize: '0.9rem' }}>
                  <b style={{ display: 'block', marginBottom: '2px' }}>DSBMobile</b>
                  <span style={{ color: 'var(--text-secondary)' }}>Quelle für die Vertretungsplan-Daten</span>
                </div>
                <div style={{ padding: '10px 14px', backgroundColor: 'var(--input-bg)', border: '1px solid var(--brighter-color)', borderRadius: 'var(--rounding-sm)', fontSize: '0.9rem' }}>
                  <b style={{ display: 'block', marginBottom: '2px' }}>kirillathome.uucode.com</b>
                  <span style={{ color: 'var(--text-secondary)' }}>Backend-API für Vertretungs- und Klausurdaten</span>
                </div>
                <div style={{ padding: '10px 14px', backgroundColor: 'var(--input-bg)', border: '1px solid var(--brighter-color)', borderRadius: 'var(--rounding-sm)', fontSize: '0.9rem' }}>
                  <b style={{ display: 'block', marginBottom: '2px' }}>stiftisches.de</b>
                  <span style={{ color: 'var(--text-secondary)' }}>Schultermine (iCal-Kalender)</span>
                </div>
                <div style={{ padding: '10px 14px', backgroundColor: 'var(--input-bg)', border: '1px solid var(--brighter-color)', borderRadius: 'var(--rounding-sm)', fontSize: '0.9rem' }}>
                  <b style={{ display: 'block', marginBottom: '2px' }}>corsproxy.io / allorigins.win</b>
                  <span style={{ color: 'var(--text-secondary)' }}>CORS-Proxys für externen Datenabruf</span>
                </div>
                <div style={{ padding: '10px 14px', backgroundColor: 'var(--input-bg)', border: '1px solid var(--brighter-color)', borderRadius: 'var(--rounding-sm)', fontSize: '0.9rem' }}>
                  <b style={{ display: 'block', marginBottom: '2px' }}>Astro / Preact</b>
                  <span style={{ color: 'var(--text-secondary)' }}>Web-Framework der Seite</span>
                </div>
              </div>

              <Placeholder height='20px' />
  
              <p>Version der Website: <b><span class='code'>{props.version}</span></b></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
//#endregion