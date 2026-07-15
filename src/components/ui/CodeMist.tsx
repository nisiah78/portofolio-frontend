// Generic, made-up syntax fragments scattered as a blurred backdrop (light theme).
const SNIPPETS: { text: string; top: string; left: string; rot: number; size: number }[] = [
  { text: "const developer = { available: true }", top: "6%", left: "3%", rot: -5, size: 16 },
  { text: "async function deploy() { await ship() }", top: "14%", left: "58%", rot: 4, size: 15 },
  { text: "export default function App() {}", top: "24%", left: "12%", rot: -3, size: 17 },
  { text: "type Props = { title: string }", top: "30%", left: "68%", rot: 6, size: 14 },
  { text: "const [state, setState] = useState(0)", top: "40%", left: "5%", rot: 3, size: 16 },
  { text: "items.map((x) => x.id)", top: "46%", left: "48%", rot: -6, size: 18 },
  { text: "if (ready) return render()", top: "54%", left: "74%", rot: -2, size: 15 },
  { text: "import { Server } from '@/core'", top: "60%", left: "8%", rot: 5, size: 16 },
  { text: "useEffect(() => {}, [])", top: "66%", left: "40%", rot: -4, size: 17 },
  { text: "for (const task of queue) {}", top: "72%", left: "66%", rot: 3, size: 15 },
  { text: "SELECT * FROM users WHERE id = ?", top: "80%", left: "10%", rot: -3, size: 14 },
  { text: "docker compose up -d", top: "86%", left: "56%", rot: 4, size: 16 },
  { text: "git commit -m 'ship it'", top: "90%", left: "30%", rot: -5, size: 15 },
  { text: "return new Response(json, { status: 200 })", top: "18%", left: "33%", rot: 2, size: 14 },
  { text: "await Promise.all(tasks)", top: "50%", left: "24%", rot: -4, size: 17 },
];

/** Blurred code-syntax mist behind the page. Visibility is gated to light theme in CSS. */
export function CodeMist() {
  return (
    <div aria-hidden className="nn-codemist pointer-events-none fixed inset-0 -z-30 overflow-hidden">
      {SNIPPETS.map((s, i) => (
        <span
          key={i}
          style={{
            top: s.top,
            left: s.left,
            fontSize: `${s.size}px`,
            transform: `rotate(${s.rot}deg)`,
          }}
        >
          {s.text}
        </span>
      ))}
    </div>
  );
}
